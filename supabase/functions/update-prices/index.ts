import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Récupérer les tickers actifs en base (positions existantes)
  const { data: invs } = await supabase
    .from('investissements')
    .select('ticker')

  if (!invs || invs.length === 0) {
    return new Response('Aucun investissement', { status: 200 })
  }

  // Tickers distincts présents dans le portefeuille
  const tickersActifs = [...new Set(invs.map(i => i.ticker))]

  // Récupérer les ticker_av depuis etf_reference
  const { data: refs } = await supabase
    .from('etf_reference')
    .select('ticker, ticker_av')
    .in('ticker', tickersActifs)

  if (!refs || refs.length === 0) {
    return new Response('Aucun ticker_av trouvé dans etf_reference', { status: 200 })
  }

  const results: string[] = []

  for (const ref of refs) {
    if (!ref.ticker_av) continue
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ref.ticker_av}&apikey=${ALPHA_VANTAGE_KEY}`
      console.log(`Fetching: ${url}`)

      const res = await fetch(url)
      const data = await res.json()

      console.log(`RAW RESPONSE for ${ref.ticker_av}:`, JSON.stringify(data))

      const price = parseFloat(data['Global Quote']?.['05. price'])

      if (!isNaN(price) && price > 0) {
        await supabase
          .from('investissements')
          .update({ prix_actuel: price })
          .eq('ticker', ref.ticker)

        results.push(`✓ ${ref.ticker} (${ref.ticker_av}) → ${price} €`)
      } else {
        results.push(`✗ ${ref.ticker} (${ref.ticker_av}) → prix non trouvé`)
      }
    } catch (e) {
      console.log(`ERROR for ${ref.ticker}:`, e)
      results.push(`✗ ${ref.ticker} → erreur: ${e}`)
    }

    await new Promise(r => setTimeout(r, 12000))
  }

  return new Response(results.join('\n'), { status: 200 })
})