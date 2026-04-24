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
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Vérifier l'utilisateur connecté
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Récupérer le profil
    const { data: profil } = await supabaseAdmin
      .from("profils")
      .select("id")
      .eq("user_id", user.id)
      .single();

    // Récupérer l'abonnement Stripe
    if (profil) {
      const { data: abonnement } = await supabaseAdmin
        .from("abonnements")
        .select("stripe_subscription_id, statut")
        .eq("user_id", profil.id)
        .single();

      // Annuler l'abonnement Stripe si actif
      if (abonnement?.stripe_subscription_id && abonnement.statut === "actif") {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
        await fetch(`https://api.stripe.com/v1/subscriptions/${abonnement.stripe_subscription_id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${stripeKey}` },
        });
        console.log("Abonnement Stripe annulé:", abonnement.stripe_subscription_id);
      }
    }

    // Supprimer l'utilisateur dans auth.users (cascade sur toutes les tables)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) throw new Error(deleteError.message);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erreur delete-account:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});