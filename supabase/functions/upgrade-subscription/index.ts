import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Récupère tous les abonnements actifs avec une date de début
  const { data: abonnements, error } = await supabase
    .from('abonnements')
    .select('*')
    .eq('statut', 'actif')
    .not('date_debut_abonnement', 'is', null)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  // Récupère les price tiers
  const { data: tiers } = await supabase
    .from('stripe_price_tiers')
    .select('*')
    .order('annee', { ascending: true })

  let upgraded = 0
  const now = new Date()
  const todayMonth = now.getMonth()
  const todayDay = now.getDate()

  for (const abo of abonnements || []) {
    const debut = new Date(abo.date_debut_abonnement)
    const debutMonth = debut.getMonth()
    const debutDay = debut.getDate()

    // Vérifie si aujourd'hui est la date anniversaire
    if (todayMonth !== debutMonth || todayDay !== debutDay) continue

    // Calcule l'année d'abonnement
    const anneesEcoulees = now.getFullYear() - debut.getFullYear()
    const anneeActuelle = Math.min(anneesEcoulees, 10)

    // Pas de changement si même année ou année 1
    if (anneeActuelle <= 1 || anneeActuelle === abo.annee_abonnement) continue

    // Année 10 → gratuit
    if (anneeActuelle >= 10) {
      await fetch(`https://api.stripe.com/v1/subscriptions/${abo.stripe_subscription_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
      })
      await supabase
        .from('abonnements')
        .update({ annee_abonnement: 10, statut: 'gratuit' })
        .eq('id', abo.id)
      upgraded++
      continue
    }

    // Trouve le nouveau price tier
    const tier = tiers?.find(t => t.annee === anneeActuelle)
    if (!tier?.price_id) continue

    // Récupère l'item ID de l'abonnement Stripe
    const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${abo.stripe_subscription_id}`, {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
    })
    const sub = await subRes.json()
    const itemId = sub.items?.data?.[0]?.id
    if (!itemId) continue

    // Change le prix Stripe
    await fetch(`https://api.stripe.com/v1/subscriptions/${abo.stripe_subscription_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'items[0][id]': itemId,
        'items[0][price]': tier.price_id,
        'proration_behavior': 'none',
      }),
    })

    // Met à jour Supabase
    await supabase
      .from('abonnements')
      .update({ annee_abonnement: anneeActuelle })
      .eq('id', abo.id)

    upgraded++
  }

  return new Response(JSON.stringify({ ok: true, upgraded }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})