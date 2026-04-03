import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

const enveloppes = [
  { nom: 'Livret A', objectif: 'Sécurité', plafond: '22 950 €', rendement: '1.7%', fiscalite: 'Exonéré', dispo: 'Immédiate', couleur: '#EAF6E4', texte: '#2E7D1E' },
  { nom: 'LDDS', objectif: 'Sécurité', plafond: '12 000 €', rendement: '1.7%', fiscalite: 'Exonéré', dispo: 'Immédiate', couleur: '#EAF6E4', texte: '#2E7D1E' },
  { nom: 'LEP', objectif: 'Sécurité', plafond: '10 000 €', rendement: '2.5%', fiscalite: 'Exonéré', dispo: 'Immédiate', couleur: '#EAF6E4', texte: '#2E7D1E' },
  { nom: 'PEA', objectif: 'Investissement', plafond: '150 000 €', rendement: '~7% (ETF)', fiscalite: '17.2% après 5 ans', dispo: 'Bloqué 5 ans', couleur: '#E3F0FF', texte: '#1565C0' },
  { nom: 'CTO', objectif: 'Investissement', plafond: 'Illimité', rendement: 'Variable', fiscalite: 'Flat Tax 30%', dispo: 'Flexible', couleur: '#EBE9FC', texte: '#3C3489' },
  { nom: 'Assurance-vie', objectif: 'Investissement', plafond: 'Illimité', rendement: '2% / Variable', fiscalite: 'Avantageux après 8 ans', dispo: 'Flexible', couleur: '#FFF8E6', texte: '#BA7517' },
]

export default function Concentration() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [onglet, setOnglet] = useState('conseils')
  const [ouvert, setOuvert] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 20px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 8, color: '#1B2E4B', opacity: .5 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[['Finances', '/dashboard'], ['Explorer', '/explorer'], ['Portefeuille', '/portefeuille'], ['Communauté', '/communaute'], ['Concentration', '/concentration'], ['Abonnement', '/abonnement'], ['Compte', '/compte']].map(([l, path]) => (
            <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === 'Concentration' ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Concentration' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
          <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B' }}>Concentration & Résilience</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Développez votre mindset d'investisseur long terme</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['conseils', 'Conseils mindset'], ['enveloppes', 'Guide des enveloppes']].map(([id, label]) => (
            <div key={id} onClick={() => setOnglet(id)} style={{ fontSize: 13, padding: '6px 16px', borderRadius: 20, background: onglet === id ? '#1B2E4B' : '#fff', color: onglet === id ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3', cursor: 'pointer', fontWeight: onglet === id ? 500 : 400 }}>{label}</div>
          ))}
        </div>

        {onglet === 'conseils' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conseils.map(({ id, titre, categorie, couleur, texte, contenu, conseil }) => (
              <div key={id} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 16, cursor: 'pointer' }} onClick={() => setOuvert(ouvert === id ? null : id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: couleur === '#EAF6E4' ? '#4CAF2E' : couleur === '#E3F0FF' ? '#1565C0' : '#534AB7', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>{titre}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: couleur, color: texte }}>{categorie}</span>
                  </div>
                  <span style={{ fontSize: 16, color: '#9CA3AF' }}>{ouvert === id ? '−' : '+'}</span>
                </div>
                {ouvert === id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #F3F4F6' }}>
                    <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, marginBottom: 12 }}>{contenu}</p>
                    <div style={{ background: '#F4F7F5', borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #4CAF2E' }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', marginBottom: 4 }}>Conseil pratique</div>
                      <div style={{ fontSize: 12, color: '#1B2E4B', lineHeight: 1.6 }}>{conseil}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {onglet === 'enveloppes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
            {enveloppes.map(({ nom, objectif, plafond, rendement, fiscalite, dispo, couleur, texte }) => (
              <div key={nom} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: texte }}>{nom[0]}</div>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: couleur, color: texte }}>{objectif}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B', marginBottom: 10 }}>{nom}</div>
                {[['Plafond', plafond], ['Rendement', rendement], ['Fiscalité', fiscalite], ['Disponibilité', dispo]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                    <span style={{ color: '#9CA3AF' }}>{k}</span>
                    <span style={{ fontWeight: 500, color: '#1B2E4B', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}