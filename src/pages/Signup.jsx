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
      options: {
        data: { prenom, nom }
      }
    })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7FAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 16, padding: '40px 36px', width: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B', marginBottom: 4 }}>Créer un compte</div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>Commencez gratuitement</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
          {error && <div style={{ fontSize: 12, color: '#E24B4A' }}>{error}</div>}
          <button onClick={handleSignup} disabled={loading} style={{ padding: '11px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9CA3AF' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#4CAF2E', cursor: 'pointer', fontWeight: 500 }}>Se connecter</span>
        </div>
      </div>
    </div>
  )
}