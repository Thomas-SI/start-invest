import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const toISO = (timestamp: number | null | undefined) => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const signature = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  const body = await req.text();

  const encoder = new TextEncoder();
  const parts = signature.split(",");
  const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1] ?? "";
  const expectedSig = parts.find(p => p.startsWith("v1="))?.split("=")[1] ?? "";

  const signedPayload = `${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const computedSig = Array.from(new Uint8Array(sigBytes)).map(b => b.toString(16).padStart(2, "0")).join("");

  if (computedSig !== expectedSig) {
    return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log("customerId:", customerId)
console.log("subscriptionId:", subscriptionId)

        const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
          headers: { "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}` }
        });
        const sub = await subRes.json();
        console.log("sub:", JSON.stringify(sub))
        const priceId = sub.items?.data[0]?.price?.id ?? null;
        const periodStart = sub.items?.data[0]?.current_period_start ?? null;
const periodEnd = sub.items?.data[0]?.current_period_end ?? null;

        const { error: updateError } = await supabaseAdmin.from("abonnements").update({
  stripe_subscription_id: subscriptionId,
  stripe_price_id: priceId,
  statut: "actif",
  plan: "annuel",
  annee_abonnement: 1,
  date_debut: toISO(periodStart),
  date_fin: toISO(periodEnd),
date_debut_abonnement: toISO(periodStart),
}).eq("stripe_customer_id", customerId);
console.log("update error:", updateError)
        break;
      }

      case "customer.subscription.updated": {
  const sub = event.data.object;
  const priceId = sub.items?.data[0]?.price?.id ?? null;

  let statut = sub.status
  if (sub.status === "active") statut = "actif"
  else if (sub.status === "trialing") statut = "actif"
  else if (sub.status === "canceled") statut = "annulé"
  else if (sub.status === "past_due") statut = "paiement_échoué"

  await supabaseAdmin.from("abonnements").update({
    stripe_price_id: priceId,
    statut,
    date_fin: toISO(sub.current_period_end),
  }).eq("stripe_customer_id", sub.customer);
  break;
}

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await supabaseAdmin.from("abonnements").update({
          statut: "annulé",
          date_fin: toISO(sub.current_period_end),
        }).eq("stripe_customer_id", sub.customer);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await supabaseAdmin.from("abonnements").update({
          statut: "paiement_échoué",
        }).eq("stripe_customer_id", invoice.customer);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 });
  }
});