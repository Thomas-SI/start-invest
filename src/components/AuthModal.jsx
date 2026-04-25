import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose, defaultMode = 'login' }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Email ou mot de passe incorrect.'); return }
    const meta = data.user?.user_metadata
    onClose()
    if (!meta?.onboarding_done) navigate('/onboarding')
    else navigate('/dashboard')
  }

  const handleSignup = async () => {
    if (!prenom.trim()) { setError('Le prénom est requis.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    onClose()
    navigate('/onboarding')
  }

  const handleResetPassword = async () => {
    if (!email.trim()) { setError('Entrez votre email pour réinitialiser le mot de passe.'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); return }
    setResetSent(true)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 9,
    border: '1px solid #E0EAE3',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#ffffff',
    color: '#034065',
    WebkitTextFillColor: '#034065',
    opacity: 1
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: '#fff', borderRadius: 20, padding: '32px 24px', width: 'calc(100% - 32px)', maxWidth: 420, boxSizing: 'border-box', boxShadow: '0 20px 60px rgba(27,46,75,0.15)', fontFamily: 'inherit' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>x</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#034065', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>
            {mode === 'login' ? 'Hey ! Bon retour' : 'Creez votre compte gratuitement'}
          </div>
        </div>
        <div style={{ display: 'flex', background: '#F4F7F5', borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {[['login', 'Se connecter'], ['signup', 'S inscrire']].map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setError(''); setResetSent(false) }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: mode === key ? '#fff' : 'transparent', color: mode === key ? '#034065' : '#9CA3AF', fontSize: 13, fontWeight: mode === key ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', boxShadow: mode === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 6 }}>Prenom</label>
              <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prenom" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 6 }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())} style={inputStyle} />
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <span onClick={handleResetPassword} style={{ fontSize: 12, color: '#4CAF2E', cursor: 'pointer' }}>
                  Mot de passe oublié ?
                </span>
              </div>
            )}
          </div>
          {error && <div style={{ fontSize: 12, color: '#E24B4A', background: '#FFF0F0', borderRadius: 8, padding: '8px 12px' }}>{error}</div>}
          {resetSent && (
            <div style={{ fontSize: 12, color: '#2E7D1E', background: '#EAF6E4', borderRadius: 8, padding: '8px 12px' }}>
              ✓ Email de réinitialisation envoyé !
            </div>
          )}
          <button onClick={mode === 'login' ? handleLogin : handleSignup} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Creer mon compte'}
          </button>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
          {mode === 'login'
            ? <span>Pas encore de compte ? <span onClick={() => setMode('signup')} style={{ color: '#4CAF2E', cursor: 'pointer', fontWeight: 500 }}>S'inscrire</span></span>
            : <span>Déjà un compte ? <span onClick={() => setMode('login')} style={{ color: '#4CAF2E', cursor: 'pointer', fontWeight: 500 }}>Se connecter</span></span>
          }
        </div>
      </div>
    </>
  )
}