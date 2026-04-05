import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const conseils = [
  {
    id: 1, titre: 'Pensez à 5 ans, pas à 5 mois', categorie: 'Mindset', couleur: '#EAF6E4', texte: '#2E7D1E',
    contenu: 'Le DCA fonctionne sur le long terme. Les marchés fluctuent à court terme, mais sur 10, 20 ou 30 ans, un ETF monde a toujours été positif. Investissez uniquement ce que vous pouvez immobiliser.',
    conseil: 'Définissez votre horizon avant d\'investir. Si vous avez besoin de l\'argent dans moins de 5 ans, ne l\'investissez pas en bourse.'
  },
  {
    id: 2, titre: 'Ne regardez pas votre portefeuille chaque jour', categorie: 'Mindset', couleur: '#EAF6E4', texte: '#2E7D1E',
    contenu: 'Surveiller son portefeuille quotidiennement génère du stress inutile et pousse aux mauvaises décisions. Les baisses temporaires font partie du jeu.',
    conseil: 'Regardez votre portefeuille une fois par mois maximum. Configurez des alertes uniquement pour les variations importantes (+/-20%).'
  },
  {
    id: 3, titre: 'Diversifiez vos enveloppes fiscales', categorie: 'Stratégie', couleur: '#E3F0FF', texte: '#0C447C',
    contenu: 'PEA, CTO, Assurance-vie — chacun a ses avantages. Le PEA est idéal pour l\'Europe avec une fiscalité avantageuse après 5 ans. Le CTO donne accès au monde entier.',
    conseil: 'Commencez par ouvrir un PEA dès maintenant, même avec peu. L\'ancienneté fiscale commence dès l\'ouverture, pas dès le premier versement.'
  },
  {
    id: 4, titre: 'Ne cherchez pas à timer le marché', categorie: 'Mindset', couleur: '#EAF6E4', texte: '#2E7D1E',
    contenu: 'Personne ne peut prédire les hauts et les bas du marché. Même les meilleurs investisseurs se trompent. Le DCA élimine ce risque en lissant les prix d\'achat.',
    conseil: 'Automatisez vos versements le même jour chaque mois. L\'automatisation retire l\'émotion de l\'équation.'
  },
  {
    id: 5, titre: 'Les frais, l\'ennemi silencieux', categorie: 'Technique', couleur: '#EBE9FC', texte: '#3C3489',
    contenu: 'Un TER de 0.2% vs 0.07% peut représenter des milliers d\'euros de différence sur 30 ans grâce aux intérêts composés. Choisissez des ETF à frais réduits.',
    conseil: 'Privilégiez les ETF avec un TER inférieur à 0.20%. Les ETF iShares et Vanguard sont souvent parmi les moins chers du marché.'
  },
  {
    id: 6, titre: 'Constituez d\'abord votre matelas de sécurité', categorie: 'Stratégie', couleur: '#E3F0FF', texte: '#0C447C',
    contenu: 'Avant d\'investir en bourse, vous devez avoir 3 à 6 mois de dépenses sur un Livret A ou LDDS. Ce matelas évite de vendre vos ETF en urgence lors d\'un imprévu.',
    conseil: 'Calculez vos dépenses mensuelles × 3 = votre objectif de matelas minimum. Ne touchez pas à la bourse tant que ce matelas n\'est pas constitué.'
  },
]

export default function Concentration() {
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [ouvert, setOuvert] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar page="Concentration" initiale={initiale} />

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>Concentration & Résilience</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Développez votre mindset d'investisseur long terme</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conseils.map(({ id, titre, categorie, couleur, texte, contenu, conseil }) => (
            <div key={id} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }} onClick={() => setOuvert(ouvert === id ? null : id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: couleur === '#EAF6E4' ? '#4CAF2E' : couleur === '#E3F0FF' ? '#1565C0' : '#534AB7', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{titre}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: couleur, color: texte }}>{categorie}</span>
                </div>
                <span style={{ fontSize: 16, color: t.textMuted }}>{ouvert === id ? '−' : '+'}</span>
              </div>
              {ouvert === id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${t.border}` }}>
                  <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.65, marginBottom: 12 }}>{contenu}</p>
                  <div style={{ background: t.bgSecondary, borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #4CAF2E' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', marginBottom: 4 }}>Conseil pratique</div>
                    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>{conseil}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}