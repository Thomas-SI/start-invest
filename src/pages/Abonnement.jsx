import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const plans = [
  {
    id: 'gratuit', nom: 'Gratuit', prix: '0€', periode: 'pour toujours', actuel: true,
    features: [
      { label: '3 ETF dans le catalogue', inclus: true },
      { label: 'Suivi finances de base', inclus: true },
      { label: 'Simulateur DCA basique', inclus: true },
      { label: 'Données ETF en temps réel', inclus: false },
      { label: 'Recommandations IA', inclus: false },
      { label: 'ETF illimités', inclus: false },
      { label: 'Communauté premium', inclus: false },
    ]
  },
  {
    id: 'premium', nom: 'Premium', prix: '9.99€', periode: 'par mois', actuel: false, recommande: true,
    features: [
      { label: 'ETF illimités', inclus: true },
      { label: 'Suivi finances complet', inclus: true },
      { label: 'Simulateur DCA avancé', inclus: true },
      { label: 'Données ETF en temps réel', inclus: true },
      { label: 'Recommandations IA', inclus: true },
      { label: 'Calendrier des échéances', inclus: true },
      { label: 'Export PDF des rapports', inclus: false },
    ]
  },
  {
    id: 'pro', nom: 'Pro', prix: '19.99€', periode: 'par mois', actuel: false,
    features: [
      { label: 'Tout Premium inclus', inclus: true },
      { label: 'Export PDF des rapports', inclus: true },
      { label: 'Analyse fiscale avancée', inclus: true },
      { label: 'Accès API personnelle', inclus: true },
      { label: 'Support prioritaire', inclus: true },
      { label: 'Webinaires exclusifs', inclus: true },
      { label: 'Gestionnaire de patrimoine IA', inclus: true },
    ]
  },
]

export default function Abonnement() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)

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
      <Navbar page="Abonnement" initiale={initiale} />

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: t.text, marginBottom: 4 }}>Choisissez votre plan</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>Passez à la vitesse supérieure dans votre parcours d'investisseur</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {plans.map(({ id, nom, prix, periode, actuel, recommande, features }) => (
            <div key={id} style={{ background: recommande ? '#1B2E4B' : t.bgCard, border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#1B2E4B' : t.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' }}>
              {recommande && <div style={{ background: '#4CAF2E', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 }}>Recommandé</div>}
              {actuel && <div style={{ background: t.bgSecondary, color: t.textMuted, fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 }}>Plan actuel</div>}
              <div style={{ fontSize: 16, fontWeight: 500, color: recommande ? '#fff' : t.text, marginBottom: 4 }}>{nom}</div>
              <div style={{ fontSize: 28, fontWeight: 500, color: recommande ? '#fff' : t.text, marginBottom: 4 }}>{prix}</div>
              <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.6)' : t.textMuted, marginBottom: 16 }}>{periode}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {features.map(({ label, inclus }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : t.text) : (recommande ? 'rgba(255,255,255,0.3)' : t.textMuted) }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(255,255,255,0.2)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke={recommande ? '#fff' : '#4CAF2E'} strokeWidth="1.2" strokeLinecap="round"/></svg>}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', padding: '10px', borderRadius: 9, border: actuel ? `0.5px solid ${t.border}` : 'none', background: actuel ? 'transparent' : recommande ? '#4CAF2E' : '#1B2E4B', color: actuel ? t.textMuted : '#fff', fontSize: 13, fontWeight: 500, cursor: actuel ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                {actuel ? 'Plan actuel' : `Passer à ${nom}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}