import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

export default function AbonnementPublic() {
  const navigate = useNavigate()
  const [annuel, setAnnuel] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  const GRATUIT = ['Mes Finances', 'Portefeuille', 'Journal ETF', 'Accomplissements de base', 'Accès communauté']
  const PREMIUM = ['Tout le plan Gratuit', 'Simulateur DCA avancé', 'Concentration & Mindset', 'Accomplissement Vroum Vroum ⚡', 'Mises à jour prix quotidiennes', 'Support prioritaire']

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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: 13, color: !annuel ? '#1B2E4B' : '#9CA3AF', fontWeight: !annuel ? 500 : 400 }}>Mensuel</span>
          <div onClick={() => setAnnuel(a => !a)} style={{ width: 44, height: 24, borderRadius: 12, background: annuel ? '#4CAF2E' : '#E0EAE3', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: 2, left: annuel ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </div>
          <span style={{ fontSize: 13, color: annuel ? '#1B2E4B' : '#9CA3AF', fontWeight: annuel ? 500 : 400 }}>Annuel</span>
          {annuel && <span style={{ fontSize: 11, background: '#EAF6E4', color: '#2E7D1E', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>-29%</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 20, padding: '32px 28px', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>Gratuit</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1B2E4B', marginBottom: 6 }}>0 €</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>Pour toujours</div>
            <div style={{ borderTop: '0.5px solid #E0EAE3', paddingTop: 20, marginBottom: 24 }}>
              {GRATUIT.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: '#6B7280' }}>
                  <span style={{ color: '#4CAF2E', fontSize: 14 }}>✓</span>{f}
                </div>
              ))}
            </div>
            <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', color: '#1B2E4B', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Commencer gratuitement</button>
          </div>

          <div style={{ background: '#1B2E4B', border: '2px solid #4CAF2E', borderRadius: 20, padding: '32px 28px', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>⭐ LE PLUS POPULAIRE</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Premium</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{annuel ? '67 €' : '7.99 €'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>{annuel ? 'facturé en une fois par an' : 'par mois'}</div>
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 20, marginBottom: 24 }}>
              {PREMIUM.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#4CAF2E', fontSize: 14 }}>✓</span>{f}
                </div>
              ))}
            </div>
            <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Commencer avec Premium</button>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 40px', maxWidth: 700, margin: '0 auto' }}>
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