import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const [profilRes, financesRes, depensesRes, investRes, revenusRes, echeancesRes] = await Promise.all([
      supabase.from('profils').select('situation_pro, objectif_principal, pseudo').eq('user_id', user_id).single(),
      supabase.from('finances').select('*').eq('user_id', user_id).single(),
      supabase.from('depenses').select('*').eq('user_id', user_id),
      supabase.from('investissements').select('*').eq('user_id', user_id),
      supabase.from('revenus').select('*').eq('user_id', user_id),
      supabase.from('echeances').select('*').eq('user_id', user_id),
    ])

    const profil = profilRes.data
    const finances = financesRes.data
    const depenses = depensesRes.data || []
    const investissements = investRes.data || []

    if (!finances) throw new Error('Pas de données financières')

    const totalDepFixes = depenses.filter(d => d.type === 'fixes').reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
    const totalDepVars = depenses.filter(d => d.type === 'variables').reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
    const revenusData = revenusRes.data || []
    const totalRevenus = revenusData.length > 0
      ? revenusData.reduce((acc, r) => acc + (parseFloat(r.montant) || 0), 0)
      : (finances.revenus || 0) + (finances.autre_revenu || 0)
    const echeances = echeancesRes.data || []
    const totalEcheances = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0)
    const investissable = totalRevenus - totalDepFixes - totalDepVars
    const investissableReel = investissable - totalEcheances
    const pctEpargne = totalRevenus > 0 ? Math.round((investissableReel / totalRevenus) * 100) : 0
    const pctFixes = totalRevenus > 0 ? Math.round((totalDepFixes / totalRevenus) * 100) : 0
    const pctVars = totalRevenus > 0 ? Math.round((totalDepVars / totalRevenus) * 100) : 0
    const valeurPortefeuille = investissements.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.prix_actuel || i.pru || 0), 0)

    const prompt = `Tu es un coach financier bienveillant et expert. Analyse le profil financier suivant et génère une analyse personnalisée en français, en tutoyant l'utilisateur.

PROFIL :
- Situation : ${profil?.situation_pro || 'Non renseigné'}
- Objectif principal : ${profil?.objectif_principal || 'Non renseigné'}
- Revenus mensuels : ${totalRevenus}€
- Dépenses fixes : ${Math.round(totalDepFixes)}€/mois (${pctFixes}% des revenus)
- Dépenses variables : ${Math.round(totalDepVars)}€/mois (${pctVars}% des revenus)
- Échéances annuelles provisionnées : ${Math.round(totalEcheances)}€/mois
- Capacité d'investissement réelle : ${Math.round(investissableReel)}€/mois (${pctEpargne}% des revenus)
- Valeur portefeuille : ${Math.round(valeurPortefeuille)}€

RÈGLE 50/30/20 :
- Besoins (50%) : objectif ${Math.round(totalRevenus * 0.5)}€, réel ${Math.round(totalDepFixes)}€
- Envies (30%) : objectif ${Math.round(totalRevenus * 0.3)}€, réel ${Math.round(totalDepVars)}€
- Épargne (20%) : objectif ${Math.round(totalRevenus * 0.2)}€, réel ${Math.round(investissableReel)}€

Génère une réponse JSON avec exactement cette structure :
{
  "bilan": "2-3 phrases de bilan personnalisé et encourageant",
  "recommandations": ["recommandation 1", "recommandation 2", "recommandation 3"],
  "prochaine_etape": "1 phrase courte qui invite à compléter une prochaine action dans l'app"
}

Sois concis, bienveillant, direct et motivant. Pas de jargon. Adapte le ton à l'objectif de l'utilisateur.`

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      throw new Error(`Erreur API Claude: ${errText}`)
    }

    const claudeData = await claudeRes.json()
    const text = claudeData.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const analyse = JSON.parse(clean)

    await supabase.from('profils').update({
      analyse_ia: JSON.stringify(analyse),
      analyse_ia_updated_at: new Date().toISOString(),
    }).eq('user_id', user_id)

    return new Response(JSON.stringify({ ok: true, analyse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
