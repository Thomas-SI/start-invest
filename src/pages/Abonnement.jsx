import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'

const plans = [
  {
    id: 'gratuit', nom: 'Gratuit', actuel: true,
    prixMensuel: '0€', prixAnnuel: '0€',
    periodeMensuel: 'pour toujours', periodeAnnuel: 'pour toujours',
    pages: ['Mes Finances', 'Concentration', 'Abonnement', 'Compte'],
    features: [
      { label: 'Suivi finances de base', inclus: true },
      { label: 'Simulateur DCA basique', inclus: true },
      { label: 'Données ETF actualisées 1x/jour', inclus: true },
      { label: 'Portefeuille & Investissement', inclus: false },
      { label: 'Données ETF en temps réel', inclus: false },
      { label: 'Recommandations IA', inclus: false },
      { label: 'Rapports journaliers', inclus: false },
      { label: 'Support prioritaire', inclus: false },
    ]
  },
  {
    id: 'premium', nom: 'Premium', actuel: false, recommande: true,
    prixMensuel: '7.99€', prixAnnuel: '67€',
    periodeMensuel: 'par mois', periodeAnnuel: 'par an · économisez 29%',
    pages: ['Mes Finances', 'Portefeuille', 'Investissement', 'Croissance', 'Concentration', 'Abonnement', 'Guide', 'Compte'],
    features: [
      { label: 'Suivi finances complet', inclus: true },
      { label: 'Simulateur DCA avancé', inclus: true },
      { label: 'Données ETF en temps réel', inclus: true },
      { label: 'Recommandations IA', inclus: true },
      { label: 'Rapports journaliers', inclus: true },
      { label: 'IA agent personnalisée', inclus: true },
      { label: 'Analyse fiscale avancée', inclus: true },
      { label: 'Accès API personnelle', inclus: true },
      { label: 'Support prioritaire', inclus: true },
      { label: 'Webinaires exclusifs', inclus: true },
      { label: 'Gestionnaire du patrimoine IA', inclus: true },
      { label: 'Accès communauté', inclus: true },
    ]
  },
]

export default function Abonnement() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [annuel, setAnnuel] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Abonnement" initiale={initiale} />

      <div style={{ padding: '24px 20px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: t.text, marginBottom: 4 }}>Choisissez votre plan</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Passez à la vitesse supérieure dans votre parcours d'investisseur</div>

          {/* TOGGLE MENSUEL / ANNUEL */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 30, padding: '6px 8px' }}>
            <button
              onClick={() => setAnnuel(false)}
              style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: !annuel ? '#1B2E4B' : 'transparent', color: !annuel ? '#fff' : t.textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnuel(true)}
              style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: annuel ? '#1B2E4B' : 'transparent', color: annuel ? '#fff' : t.textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Annuel
              <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 20, maxWidth: 780, margin: '0 auto' }}>
          {plans.map(({ id, nom, actuel, recommande, features, pages, prixMensuel, prixAnnuel, periodeMensuel, periodeAnnuel }) => {
            const prix = annuel ? prixAnnuel : prixMensuel
            const periode = annuel ? periodeAnnuel : periodeMensuel
            return (
              <div key={id} style={{ background: recommande ? '#1B2E4B' : t.bgCard, border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#4CAF2E' : t.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>

                {/* BADGE */}
                <div style={{ marginBottom: 16 }}>
                  {recommande && <div style={{ background: '#4CAF2E', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>⭐ Recommandé</div>}
                  {actuel && <div style={{ background: t.bgSecondary, color: t.textMuted, fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>Plan actuel</div>}
                </div>

                {/* NOM + PRIX */}
                <div style={{ fontSize: 18, fontWeight: 600, color: recommande ? '#fff' : t.text, marginBottom: 4 }}>{nom}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: recommande ? '#fff' : t.text, marginBottom: 2 }}>{prix}</div>
                <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.5)' : t.textMuted, marginBottom: 20 }}>{periode}</div>

                {/* PAGES ACCESSIBLES */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: recommande ? 'rgba(255,255,255,0.5)' : t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Pages accessibles</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {pages.map(p => (
                      <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: recommande ? 'rgba(255,255,255,0.1)' : t.bgSecondary, color: recommande ? '#fff' : t.text, border: `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : t.border}` }}>{p}</span>
                    ))}
                  </div>
                </div>

                {/* SÉPARATEUR */}
                <div style={{ height: 0.5, background: recommande ? 'rgba(255,255,255,0.1)' : t.border, marginBottom: 16 }} />

                {/* FONCTIONNALITÉS */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {features.map(({ label, inclus }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : t.text) : (recommande ? 'rgba(255,255,255,0.25)' : t.textMuted) }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(76,175,46,0.3)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                      </div>
                      {label}
                    </div>
                  ))}
                </div>

                {/* BOUTON */}
                <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: actuel ? `0.5px solid ${t.border}` : 'none', background: actuel ? 'transparent' : '#4CAF2E', color: actuel ? t.textMuted : '#fff', fontSize: 13, fontWeight: 500, cursor: actuel ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                  {actuel ? 'Plan actuel' : `Passer à ${nom} →`}
                </button>

              </div>
            )
          })}
        </div>
      </div>
      <FooterApp />
    </div>
  )
}