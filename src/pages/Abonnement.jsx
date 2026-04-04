import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const plans = [
  {
    id: 'gratuit',
    nom: 'Gratuit',
    prix: '0€',
    periode: 'pour toujours',
    couleur: '#F4F7F5',
    bordure: '#E0EAE3',
    actuel: true,
    features: [
      { label: '3 ETF dans le catalogue', inclus: true },
      { label: 'Suivi finances de base', inclus: true },
      { label: 'Simulateur DCA basique', inclus: true },
      { label: 'Accès communauté (lecture)', inclus: true },
      { label: 'Données ETF en temps réel', inclus: false },
      { label: 'Recommandations IA', inclus: false },
      { label: 'ETF illimités', inclus: false },
      { label: 'Communauté premium', inclus: false },
      { label: 'Calendrier des échéances', inclus: false },
    ]
  },
  {
    id: 'premium',
    nom: 'Premium',
    prix: '9.99€',
    periode: 'par mois',
    couleur: '#1B2E4B',
    bordure: '#1B2E4B',
    actuel: false,
    recommande: true,
    features: [
      { label: 'ETF illimités', inclus: true },
      { label: 'Suivi finances complet', inclus: true },
      { label: 'Simulateur DCA avancé', inclus: true },
      { label: 'Accès communauté complet', inclus: true },
      { label: 'Données ETF en temps réel', inclus: true },
      { label: 'Recommandations IA', inclus: true },
      { label: 'Calendrier des échéances', inclus: true },
      { label: 'Alertes de marché', inclus: true },
      { label: 'Export PDF des rapports', inclus: false },
    ]
  },
  {
    id: 'pro',
    nom: 'Pro',
    prix: '19.99€',
    periode: 'par mois',
    couleur: '#fff',
    bordure: '#4CAF2E',
    actuel: false,
    features: [
      { label: 'Tout Premium inclus', inclus: true },
      { label: 'Export PDF des rapports', inclus: true },
      { label: 'Analyse fiscale avancée', inclus: true },
      { label: 'Accès API personnelle', inclus: true },
      { label: 'Support prioritaire', inclus: true },
      { label: 'Tableau de bord multi-comptes', inclus: true },
      { label: 'Historique illimité', inclus: true },
      { label: 'Webinaires exclusifs', inclus: true },
      { label: 'Gestionnaire de patrimoine IA', inclus: true },
    ]
  },
]

export default function Abonnement() {
  const navigate = useNavigate()
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
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar page="Abonnement" initiale={initiale} />

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B', marginBottom: 4 }}>Choisissez votre plan</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>Passez à la vitesse supérieure dans votre parcours d'investisseur</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {plans.map(({ id, nom, prix, periode, couleur, bordure, actuel, recommande, features }) => (
            <div key={id} style={{ background: couleur, border: `${recommande ? '2px' : '0.5px'} solid ${bordure}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' }}>
              {recommande && (
                <div style={{ background: '#4CAF2E', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 }}>Recommandé</div>
              )}
              {actuel && (
                <div style={{ background: '#E0EAE3', color: '#6B7280', fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 }}>Plan actuel</div>
              )}
              <div style={{ fontSize: 16, fontWeight: 500, color: recommande ? '#fff' : '#1B2E4B', marginBottom: 4 }}>{nom}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 500, color: recommande ? '#fff' : '#1B2E4B' }}>{prix}</span>
              </div>
              <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.6)' : '#9CA3AF', marginBottom: 16 }}>{periode}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {features.map(({ label, inclus }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : '#1B2E4B') : (recommande ? 'rgba(255,255,255,0.3)' : '#C4C9C7') }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(255,255,255,0.2)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${recommande ? 'rgba(255,255,255,0.2)' : '#E0EAE3'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke={recommande ? '#fff' : '#4CAF2E'} strokeWidth="1.2" strokeLinecap="round"/></svg>}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', padding: '10px', borderRadius: 9, border: actuel ? '0.5px solid #E0EAE3' : 'none', background: actuel ? 'transparent' : recommande ? '#4CAF2E' : '#1B2E4B', color: actuel ? '#9CA3AF' : '#fff', fontSize: 13, fontWeight: 500, cursor: actuel ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                {actuel ? 'Plan actuel' : `Passer à ${nom}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}