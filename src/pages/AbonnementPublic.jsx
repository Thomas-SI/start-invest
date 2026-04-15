import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

const plans = [
  {
    id: 'gratuit', nom: 'Gratuit',
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
    id: 'premium', nom: 'Premium', recommande: true,
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

export default function AbonnementPublic() {
  const navigate = useNavigate()
  const [annuel, setAnnuel] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === 'Abonnement' ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === 'Abonnement' ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B2E4B'}
              onMouseLeave={e => e.currentTarget.style.color = label === 'Abonnement' ? '#1B2E4B' : '#6B7280'}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
          <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
        </div>
      </nav>

      <section style={{ padding: '60px 40px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Abonnement</div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.2, margin: '0 0 16px' }}>
          Simple, transparent,<br /><span style={{ color: '#4CAF2E' }}>sans surprise.</span>
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 440, margin: '0 auto 36px' }}>
          Commencez gratuitement. Passez à Premium quand vous êtes prêt.
        </p>

        {/* TOGGLE */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 30, padding: '4px', marginBottom: 48 }}>
          <button onClick={() => setAnnuel(false)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: !annuel ? '#1B2E4B' : 'transparent', color: !annuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>Mensuel</button>
          <button onClick={() => setAnnuel(true)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: annuel ? '#1B2E4B' : 'transparent', color: annuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
            Annuel
            <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
          </button>
        </div>

        {/* PLANS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 780, margin: '0 auto' }}>
          {plans.map(({ id, nom, recommande, features, pages, prixMensuel, prixAnnuel, periodeMensuel, periodeAnnuel }) => {
            const prix = annuel ? prixAnnuel : prixMensuel
            const periode = annuel ? periodeAnnuel : periodeMensuel
            return (
              <div key={id} style={{ background: recommande ? '#1B2E4B' : '#fff', border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#4CAF2E' : '#E0EAE3'}`, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative' }}>
                {recommande && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>⭐ Recommandé</div>}

                <div style={{ fontSize: 16, fontWeight: 600, color: recommande ? '#fff' : '#1B2E4B', marginBottom: 4 }}>{nom}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: recommande ? '#fff' : '#1B2E4B', marginBottom: 2 }}>{prix}</div>
                <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginBottom: 20 }}>{periode}</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: recommande ? 'rgba(255,255,255,0.5)' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Pages accessibles</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {pages.map(p => (
                      <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: recommande ? 'rgba(255,255,255,0.1)' : '#F4F7F5', color: recommande ? '#fff' : '#1B2E4B', border: `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : '#E0EAE3'}` }}>{p}</span>
                    ))}
                  </div>
                </div>

                <div style={{ height: 0.5, background: recommande ? 'rgba(255,255,255,0.1)' : '#E0EAE3', marginBottom: 16 }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {features.map(({ label, inclus }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : '#1B2E4B') : (recommande ? 'rgba(255,255,255,0.25)' : '#9CA3AF') }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(76,175,46,0.3)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : '#E0EAE3'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                      </div>
                      {label}
                    </div>
                  ))}
                </div>

                <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {recommande ? 'Commencer avec Premium →' : 'Commencer gratuitement'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 40px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1B2E4B', textAlign: 'center', marginBottom: 40 }}>Questions fréquentes</h2>
        {[
          { q: 'Puis-je annuler à tout moment ?', r: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace compte.' },
          { q: 'Le plan gratuit est-il vraiment gratuit ?', r: 'Oui, sans limite de temps et sans carte bancaire requise.' },
          { q: 'Mes données sont-elles sécurisées ?', r: 'Vos données sont chiffrées et hébergées sur des serveurs sécurisés Supabase.' },
          { q: 'Puis-je passer de gratuit à Premium ?', r: 'Oui, à tout moment depuis la page Abonnement dans votre espace personnel.' },
        ].map(({ q, r }) => (
          <div key={q} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: '18px 20px', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B', marginBottom: 6 }}>{q}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{r}</div>
          </div>
        ))}
      </section>

      <footer style={{ borderTop: '0.5px solid #E0EAE3', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>© 2026 StartInvest — Bâtir son mental, construire son avenir.</div>
      </footer>

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}