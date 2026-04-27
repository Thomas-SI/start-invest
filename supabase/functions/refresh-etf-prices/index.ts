import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EODHD_TOKEN = Deno.env.get('EODHD_API_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Lit le body — si un ticker est passé, on l'utilise, sinon on prend tout le portefeuille
  let tickersDemandes: string[] = []
  try {
    const body = await req.json()
    if (body?.tickers && Array.isArray(body.tickers)) {
      tickersDemandes = body.tickers.map((t: string) => t.toUpperCase())
    }
  } catch (_) {}

  let tickers: string[] = []

  if (tickersDemandes.length > 0) {
    // Mode à la demande : ticker(s) spécifique(s)
    tickers = tickersDemandes
  } else {
    // Mode cron : tous les tickers du portefeuille
    const { data: positions, error } = await supabase
      .from('investissements')
      .select('ticker')
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    tickers = [...new Set((positions || []).map((p: any) => p.ticker).filter(Boolean))]
  }

  if (tickers.length === 0) {
    return new Response(JSON.stringify({ ok: true, updated: 0 }), { status: 200 })
  }

  // Récupère les ticker_eodhd depuis etf_reference
  const { data: refs } = await supabase
    .from('etf_reference')
    .select('ticker, ticker_eodhd, nom')

  const refMap: Record<string, { eohdTicker: string; nom: string }> = {}
  for (const ref of refs || []) {
    refMap[ref.ticker] = {
      eohdTicker: ref.ticker_eodhd || ref.ticker,
      nom: ref.nom,
    }
  }

  // Construit la requête bulk EODHD
  const tickersEodhd = tickers.map(t =>
    refMap[t]?.eohdTicker || (t.includes('.') ? t : `${t}.XETRA`)
  )
  const [first, ...rest] = tickersEodhd
  const url = rest.length > 0
    ? `https://eodhd.com/api/real-time/${encodeURIComponent(first)}?s=${rest.map(encodeURIComponent).join(',')}&api_token=${EODHD_TOKEN}&fmt=json`
    : `https://eodhd.com/api/real-time/${encodeURIComponent(first)}?api_token=${EODHD_TOKEN}&fmt=json`

  const res = await fetch(url)
  if (!res.ok) return new Response(JSON.stringify({ error: 'EODHD error', status: res.status }), { status: 502 })

  const raw = await res.json()
  const quotes: any[] = Array.isArray(raw) ? raw : [raw]

  let updated = 0
  for (let i = 0; i < tickers.length; i++) {
    const quote = quotes[i]
    if (!quote || !quote.close || quote.close === 'NA') continue

    const prix = parseFloat(quote.close)
    const ticker = tickers[i]
    if (isNaN(prix) || prix <= 0) continue

    // Update investissements seulement en mode cron (pas à la demande)
    if (tickersDemandes.length === 0) {
      await supabase
        .from('investissements')
        .update({ prix_actuel: prix, updated_at: new Date().toISOString() })
        .eq('ticker', ticker)
    }

    // Upsert dans le cache dans tous les cas
    await supabase
      .from('etf_price_cache')
      .upsert({
        ticker,
        prix_actuel: prix,
        nom: refMap[ticker]?.nom || quote.name || ticker,
        currency: quote.currency || 'EUR',
        change_p: quote.change_p === 'NA' ? 0 : parseFloat(quote.change_p) || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'ticker' })

    updated++
  }

  return new Response(JSON.stringify({ ok: true, updated, tickers }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})