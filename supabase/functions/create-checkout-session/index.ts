import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non authentifié" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "priceId manquant" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const origin = req.headers.get("origin") ?? "https://ton-app.vercel.app";

    // Créer le customer Stripe via l'API REST
    const customerRes = await fetch("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: user.email ?? "",
        "metadata[supabase_user_id]": user.id,
      }),
    });
    const customer = await customerRes.json();

    // Récupérer l'id du profil
const { data: profil } = await supabaseClient
  .from("profils")
  .select("id")
  .eq("user_id", user.id)
  .single();

if (!profil) {
  return new Response(
    JSON.stringify({ error: "Profil introuvable" }),
    { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

console.log("user.id:", user.id)
console.log("profil:", profil)

    // Sauvegarder le customer dans abonnements
    const { error: upsertError } = await supabaseAdmin.from("abonnements").upsert({
  user_id: profil.id,
  stripe_customer_id: customer.id,
  statut: "inactif",
});
console.log("upsert error:", upsertError)

    // Créer la session Checkout via l'API REST
    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: customer.id,
        "payment_method_types[0]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        mode: "subscription",
        success_url: `${origin}/abonnement?success=true`,
        cancel_url: `${origin}/abonnement?canceled=true`,
        locale: "fr",
      }),
    });
    const session = await sessionRes.json();

    if (!session.url) {
      throw new Error(session.error?.message ?? "Impossible de créer la session Stripe");
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});