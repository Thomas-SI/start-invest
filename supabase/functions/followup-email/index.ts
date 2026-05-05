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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Récupérer les users inscrits il y a exactement 30 jours
    const il_y_a_30_jours = new Date()
    il_y_a_30_jours.setDate(il_y_a_30_jours.getDate() - 30)
    const dateDebut = new Date(il_y_a_30_jours)
    dateDebut.setHours(0, 0, 0, 0)
    const dateFin = new Date(il_y_a_30_jours)
    dateFin.setHours(23, 59, 59, 999)

    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    const usersJ30 = users.users.filter(u => {
      const createdAt = new Date(u.created_at)
      return createdAt >= dateDebut && createdAt <= dateFin
    })

    let envoyes = 0

    for (const user of usersJ30) {
      const prenom = user.user_metadata?.prenom || 'toi'
      const email = user.email
      if (!email) continue

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: inherit; background: #F4F7F5; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; border: 0.5px solid #E0EAE3;">
    
    <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg" alt="Start Invest" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto 24px;" />

    <p style="font-size: 16px; color: #034065; font-weight: 600;">Salut ${prenom},</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Ça fait déjà 30 jours que tu as rejoint Start Invest. Et je voulais juste m'arrêter un moment pour avoir de tes nouvelles, pas de façon automatique, mais vraiment.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Est-ce que tu as eu le temps d'explorer l'application ? Est-ce que tu as renseigné tes finances, posé tes revenus et tes dépenses ? Est-ce que tu as commencé à lire le Guide ?</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Parce que c'est là que tout commence. Pas dans l'investissement en lui-même, mais dans cette prise de conscience de là où part ton argent chaque mois. C'est souvent le moment où les choses changent vraiment.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"On ne change pas ce qu'on ne mesure pas."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">Et après ?</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Si tu as fait ce travail, si tu as posé tes bases, si tu te sens prêt(e) à aller plus loin, alors la prochaine étape c'est de passer à l'action.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">La formule Premium te permet de rentrer tes comptes d'investissement, de suivre tes achats d'ETF achat après achat, et de voir ta croissance s'accélérer sur le long terme grâce aux intérêts composés.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Ce n'est pas un abonnement de plus. C'est l'outil qui transforme une bonne intention en discipline réelle. Et à 67€ par an, soit moins de 20 centimes par jour, c'est probablement l'investissement le plus rentable que tu puisses faire avant même d'investir ton premier euro.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"Le lâche ne commence jamais, le faible ne termine jamais, et le gagnant n'abandonne jamais."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 15px; font-weight: 600; color: #034065;">Les Challenges</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Et si la motivation commence à s'essouffler, ce qui arrive à tout le monde, les Challenges sont là pour ça. Pour te rappeler pourquoi tu as commencé. Pour garder la flamme allumée. Pour avancer avec tes amis.</p>
    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Parce que personne ne construit son avenir financier seul.</p>
    <p style="font-size: 13px; color: #034065; font-style: italic; border-left: 3px solid #4CAF2E; padding-left: 12px; margin: 20px 0;">"Le secret de la réussite n'est pas la vitesse, mais la constance."</p>

    <hr style="border: none; border-top: 0.5px solid #E0EAE3; margin: 28px 0;" />

    <p style="font-size: 14px; color: #6B7280; line-height: 1.8;">Tu as toutes les cartes en main. La suite t'appartient.</p>

    <a href="https://start-invest.fr/dashboard" style="display: block; width: fit-content; margin: 24px auto; background: #4CAF2E; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Accéder à mon dashboard</a>

    <p style="font-size: 14px; color: #6B7280; line-height: 1.8; text-align: center;">Une question, une remarque, une idée ? Réponds directement à ce mail ou retrouve-moi en DM sur Instagram <strong>@startinvest.fr</strong>, je lis tout personnellement.</p>

    <p style="font-size: 13px; color: #6B7280; text-align: center; margin-top: 32px;">À très vite,<br/><strong style="color: #034065;">Thomas | Fondateur de Start Invest</strong></p>
    <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 16px;">Start Invest · start-invest.fr</p>
  </div>
</body>
</html>`

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        },
        body: JSON.stringify({
          from: 'Thomas de Start Invest <thomas@start-invest.fr>',
          to: email,
          subject: `${prenom}, 30 jours déjà, comment tu t'en sors ? 🚀`,
          html,
        }),
      })

      envoyes++
    }

    return new Response(JSON.stringify({ ok: true, envoyes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})