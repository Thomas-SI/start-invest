import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

  const handleReset = async () => {
    if (!password) { setError('Entrez un nouveau mot de passe.'); return }
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    setTimeout(() => navigate('/'), 3000)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    border: '1px solid #E0EAE3', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', background: '#ffffff',
    color: '#034065',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'inherit' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', width: '100%', maxWidth: 420, boxSizing: 'border-box', boxShadow: '0 20px 60px rgba(27,46,75,0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={LOGO_URL} alt="StartInvest" style={{ height: 60, width: 'auto' }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: '#034065', marginTop: 16 }}>Nouveau mot de passe</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>Choisis un mot de passe sécurisé</div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#034065', marginBottom: 8 }}>Mot de passe modifié !</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Redirection en cours...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 6 }}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                <button onClick={() => setShowPassword(v => !v)} type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16, padding: 0 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 6 }}>Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleReset()} style={inputStyle} />
            </div>
            {error && <div style={{ fontSize: 12, color: '#E24B4A', background: '#FFF0F0', borderRadius: 8, padding: '8px 12px' }}>{error}</div>}
            <button onClick={handleReset} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? 'Modification...' : 'Modifier mon mot de passe'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}