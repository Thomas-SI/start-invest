import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    const onboardingDone = data?.user?.user_metadata?.onboarding_done
    navigate(onboardingDone ? '/dashboard' : '/onboarding')
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (!email.trim()) { setError('Entrez votre email pour réinitialiser le mot de passe.'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); return }
    setResetSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: '#034065', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 48, fontWeight: 500, color: '#fff', fontStyle: 'italic', letterSpacing: '.04em' }}>START</span>
            <span style={{ fontSize: 48, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic', letterSpacing: '.02em' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '.01em' }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ maxWidth: 340, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>Prenez une longueur d'avance sur votre avenir financier</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Analysez vos finances, simulez votre croissance et investissez intelligemment avec la méthode DCA.</div>
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
            <div style={{ fontSize: 24, fontWeight: 500, color: '#034065', marginBottom: 6 }}>Prenez une longueur d'avance</div>
            <div style={{ fontSize: 14, color: '#9CA3AF' }}>Connectez-vous à votre compte</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Email</div>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#034065' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Mot de passe</div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#034065' }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <span onClick={handleResetPassword} style={{ fontSize: 12, color: '#4CAF2E', cursor: 'pointer' }}>
                Mot de passe oublié ?
              </span>
            </div>
            {error && <div style={{ fontSize: 12, color: '#E24B4A', background: '#FCEBEB', padding: '8px 12px', borderRadius: 7 }}>{error}</div>}
            {resetSent && (
              <div style={{ fontSize: 12, color: '#2E7D1E', background: '#EAF6E4', padding: '8px 12px', borderRadius: 7 }}>
                ✓ Email de réinitialisation envoyé !
              </div>
            )}
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9CA3AF' }}>
            Pas encore de compte ?{' '}
            <span onClick={() => navigate('/signup')} style={{ color: '#4CAF2E', cursor: 'pointer', fontWeight: 500 }}>Créer un compte</span>
          </div>
        </div>
      </div>
    </div>
  )
}