import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar({ page, initiale }) {
  const navigate = useNavigate()

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
    <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 20px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ fontSize: 8, color: '#1B2E4B', opacity: .5 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {liens.map(([l, path]) => (
          <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === page ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === page ? 500 : 400 }}>{l}</div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
        <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
      </div>
    </nav>
  )
}