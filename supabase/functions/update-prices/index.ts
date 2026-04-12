import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const { data: invs } = await supabase
    .from('investissements')
    .select('ticker, ticker_av')

  if (!invs || invs.length === 0) {
    return new Response('Aucun investissement', { status: 200 })
  }

  const tickersUniques = [...new Map(
    invs.filter(i => i.ticker_av).map(i => [i.ticker, i.ticker_av])
  ).entries()]

  const results: string[] = []

  for (const [ticker, ticker_av] of tickersUniques) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker_av}&apikey=${ALPHA_VANTAGE_KEY}`
      console.log(`Fetching: ${url}`)

      const res = await fetch(url)
      const data = await res.json()

      console.log(`RAW RESPONSE for ${ticker_av}:`, JSON.stringify(data))

      const price = parseFloat(data['Global Quote']?.['05. price'])

      if (!isNaN(price) && price > 0) {
        await supabase
          .from('investissements')
          .update({ prix_actuel: price })
          .eq('ticker', ticker)

        results.push(`✓ ${ticker} (${ticker_av}) → ${price} €`)
      } else {
        results.push(`✗ ${ticker} (${ticker_av}) → prix non trouvé`)
      }
    } catch (e) {
      console.log(`ERROR for ${ticker}:`, e)
      results.push(`✗ ${ticker} → erreur: ${e}`)
    }

    await new Promise(r => setTimeout(r, 12000))
  }

  return new Response(results.join('\n'), { status: 200 })
})