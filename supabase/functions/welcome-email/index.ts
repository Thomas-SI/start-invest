import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prenom, email } = await req.json()

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: inherit; background: #F4F7F5; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; border: 0.5px solid #E0EAE3;">
    
    <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg" alt="Start Invest" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto 24px;" />

    <p style="font-size: 16px; color: #034065; font-weight: 600;">Salut ${prenom},</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Tu es là. Et ça, c'est déjà tout.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Beaucoup parlent d'investir. Peu passent à l'action. Toi, tu viens de franchir ce cap et ce n'est pas un hasard. Start Invest est né pour les gens comme toi : ceux qui ont décidé de construire quelque chose, euro par euro, mois après mois, sans se laisser dépasser par le temps qui passe.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Pour bien démarrer, un court questionnaire t'attend dans l'application. En quelques réponses, il permet à l'IA d'analyser ton profil financier et de te donner un premier bilan personnalisé — tes forces, tes axes d'amélioration, et les premières actions concrètes adaptées à ta situation. Plus tu utilises l'application, plus l'analyse s'affine et devient précise. C'est ton coach financier personnel, qui apprend à te connaître.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">L'application ne va pas tout faire à ta place. Elle va t'aider à rester discipliné(e), à te challenger, à progresser et à ne jamais perdre de vue pourquoi tu as commencé.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"La seule personne à dépasser, c'est celle que tu étais hier."</p>
    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">1. Pose les bases | Mes Finances</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Avant tout, prends 1 heure pour toi. Assieds-toi, ouvre l'application, et rentre tes revenus et tes dépenses aussi précisément que possible. Start Invest a fait le choix de ne pas se connecter à ta banque, volontairement. Parce que taper ces chiffres manuellement, c'est prendre pleine conscience de là où part ton argent. Et cette prise de conscience, elle change tout.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"Le seul risque que l'on prend, c'est que ça puisse changer notre vie."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">2. Forme-toi | Le Guide</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Une fois tes finances posées, direction le Guide. 23 fiches rédigées sans jargon pour comprendre l'investissement, éviter les erreurs classiques et savoir exactement où et comment investir selon ton profil. L'investissement ne s'improvise pas, il se prépare.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"L'exercice du talent, c'est le travail."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">3. Passe à l'action | Premium</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Si tu te sens aligné(e) avec ta stratégie, la formule Premium va t'accompagner pas à pas. Rentre tes comptes d'investissement, suis tes achats ligne par ligne, et regarde ta croissance s'accélérer sur le long terme grâce aux intérêts composés. Chaque mois qui passe travaille pour toi.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"Le lâche ne commence jamais, le faible ne termine jamais, et le gagnant n'abandonne jamais."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">4. Reste dans la course | Challenges</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">La vraie bataille, ce n'est pas de bien démarrer. C'est de tenir. Les challenges sont là pour ça : garder ta discipline à toute épreuve, ne jamais douter de ta stratégie, et avancer avec tes amis. Parce que la motivation collective, ça change la donne.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"Le secret de la réussite n'est pas la vitesse, mais la constance."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Tu as tout ce qu'il te faut. La suite t'appartient.</p>

    <a href="https://start-invest.fr/dashboard" style="display: block; width: fit-content; margin: 24px auto; background: #4CAF2E; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Accéder à mon dashboard</a>

    <p style="font-size: 13px; color: #6B7280; text-align: center; margin-top: 32px;">À très vite,<br/><strong style="color: #034065;">Thomas | Fondateur de Start Invest</strong></p>
    <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 16px;">Start Invest · start-invest.fr<br/>Tu reçois cet email car tu viens de créer un compte.</p>
  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Thomas de Start Invest <thomas@start-invest.fr>',
        to: email,
        subject: `Bienvenue ${prenom}, ton aventure commence maintenant 🚀`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend error: ${err}`)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})