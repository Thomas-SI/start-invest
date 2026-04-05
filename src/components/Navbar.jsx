import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

export default function Navbar({ page, initiale }) {
  const navigate = useNavigate()
  const t = useTheme()

  const liens = [
    ['Mes Finances', '/dashboard'],
    ['Portefeuille', '/portefeuille'],
    ['Investissement', '/investissement'],
    ['Croissance', '/croissance'],
    ['Concentration', '/concentration'],
    ['Abonnement', '/abonnement'],
    ['Compte', '/compte'],
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={{ background: t.nav, borderBottom: `0.5px solid ${t.navBorder}`, padding: '0 20px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        {t.dark ? (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#E8E8E8', fontFamily: 'Arial Black, sans-serif', fontStyle: 'italic', WebkitTextStroke: '0.5px #E8E8E8' }}>START</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#4CAF2E', fontFamily: 'Arial Black, sans-serif', fontStyle: 'italic' }}>INVEST</span>
            </div>
            <div style={{ fontSize: 7, color: '#606060', letterSpacing: 0.3 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
          </div>
        ) : (
          <img src="/logo-clair.jpeg" alt="StartInvest" style={{ height: 48, width: 'auto' }} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {liens.map(([l, path]) => (
          <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === page ? '#4CAF2E' : t.textSecondary, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === page ? 500 : 400 }}>{l}</div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
        <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
      </div>
    </nav>
  )
}