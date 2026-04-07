import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom, nom } }
    })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      <div style={{ background: '#1B2E4B', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 48, fontWeight: 500, color: '#fff', fontStyle: 'italic', letterSpacing: '.04em' }}>START</span>
            <span style={{ fontSize: 48, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic', letterSpacing: '.02em' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '.01em' }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ maxWidth: 340, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>Rejoignez des milliers d'investisseurs intelligents</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Prenez le contrôle de vos finances, simulez votre croissance et investissez avec méthode dès aujourd'hui.</div>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
          {[['200+', 'ETF référencés'], ['94%', 'Satisfaction'], ['7%', 'Rendement moyen']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#4CAF2E' }}>{v}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#F4F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 500, color: '#1B2E4B', marginBottom: 6 }}>Créer un compte</div>
            <div style={{ fontSize: 14, color: '#9CA3AF' }}>Commencez votre parcours d'investisseur</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Prénom</div>
                <input placeholder="Jean" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Nom</div>
                <input placeholder="Dupont" value={nom} onChange={e => setNom(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Email</div>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Mot de passe</div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }} />
            </div>
            {error && <div style={{ fontSize: 12, color: '#E24B4A', background: '#FCEBEB', padding: '8px 12px', borderRadius: 7 }}>{error}</div>}
            <button onClick={handleSignup} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9CA3AF' }}>
            Déjà un compte ?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#4CAF2E', cursor: 'pointer', fontWeight: 500 }}>Se connecter</span>
          </div>
        </div>
      </div>

    </div>
  )
}