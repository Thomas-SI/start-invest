import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

export default function Compte() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setPrenom(user.user_metadata?.prenom || '')
        setNom(user.user_metadata?.nom || '')
        setEmail(user.email || '')
      }
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    await supabase.auth.updateUser({ data: { prenom, nom } })
    setSucces(true)
    setTimeout(() => setSucces(false), 3000)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar page="Compte" initiale={initiale} />

      <div style={{ padding: '24px 20px', flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{prenom} {nom}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{email}</div>
              <div style={{ fontSize: 11, background: '#EAF6E4', color: '#2E7D1E', padding: '2px 10px', borderRadius: 20, display: 'inline-block', marginTop: 4 }}>Plan gratuit</div>
            </div>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Informations personnelles</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Prénom</div>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Nom</div>
                <input value={nom} onChange={e => setNom(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Email</div>
              <input value={email} disabled style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.textMuted }} />
            </div>
            {succes && <div style={{ fontSize: 12, color: '#4CAF2E', marginBottom: 12 }}>✓ Informations sauvegardées !</div>}
            <button onClick={handleSave} disabled={loading} style={{ background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Apparence</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.bgSecondary, borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Mode {t.dark ? 'sombre' : 'clair'}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{t.dark ? 'Interface sombre activée' : 'Interface claire activée'}</div>
              </div>
              <div onClick={t.toggle} style={{ width: 44, height: 24, borderRadius: 12, background: t.dark ? '#4CAF2E' : '#E0EAE3', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 2, left: t.dark ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Mon abonnement</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.bgSecondary, borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Plan gratuit</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>3 ETF · Finances de base</div>
              </div>
              <span style={{ fontSize: 10, background: '#EAF6E4', color: '#2E7D1E', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>Actif</span>
            </div>
            <button onClick={() => navigate('/abonnement')} style={{ background: '#1B2E4B', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Passer à Premium →
            </button>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Danger zone</div>
            <button onClick={handleLogout} style={{ background: '#FCEBEB', color: '#E24B4A', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Se déconnecter
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}