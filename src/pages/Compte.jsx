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
  const [metier, setMetier] = useState('')
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [showAPropos, setShowAPropos] = useState(false)
  const [showSupprimer, setShowSupprimer] = useState(false)
  const [confirmSupprimer, setConfirmSupprimer] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [erreurPhoto, setErreurPhoto] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setPrenom(user.user_metadata?.prenom || '')
        setNom(user.user_metadata?.nom || '')
        setEmail(user.email || '')
        setMetier(user.user_metadata?.metier || '')
        setPhotoUrl(user.user_metadata?.photo_url || null)
      }
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    if (loading) return
    if (!prenom.trim() && !nom.trim()) {
      setErreur('Veuillez saisir au moins un prénom ou un nom.')
      return
    }
    setLoading(true)
    setErreur(null)
    try {
      const { error } = await supabase.auth.updateUser({ data: { prenom, nom, metier } })
      if (error) throw new Error('Erreur lors de la sauvegarde.')
      setSucces(true)
      setTimeout(() => setSucces(false), 3000)
    } catch (e) {
      setErreur(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !user) return
    if (file.size > 2 * 1024 * 1024) {
      setErreurPhoto('La photo ne doit pas dépasser 2 Mo.')
      return
    }
    setUploadingPhoto(true)
    setErreurPhoto(null)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (error) throw new Error('Erreur lors de l\'upload de la photo.')
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setPhotoUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { photo_url: data.publicUrl } })
    } catch (e) {
      setErreurPhoto(e.message || 'Erreur lors de l\'upload.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmSupprimer !== email) return
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Compte" initiale={initiale} />

      <div style={{ padding: '24px 20px', flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* HEADER PROFIL */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: '#2E7D1E', overflow: 'hidden' }}>
                  {photoUrl ? <img src={photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initiale}
                </div>
                {uploadingPhoto && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>...</div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{prenom} {nom}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{email}</div>
                <div style={{ fontSize: 11, background: '#EAF6E4', color: '#2E7D1E', padding: '2px 10px', borderRadius: 20, display: 'inline-block', marginTop: 4 }}>Plan gratuit</div>
              </div>
            </div>
            <button onClick={() => navigate('/parametres')} style={{ background: t.bgSecondary, color: t.text, fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 9, border: `0.5px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
              ⚙️ Paramètres
            </button>
          </div>

          {erreurPhoto && (
            <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>
              ⚠️ {erreurPhoto}
            </div>
          )}

          {/* INFORMATIONS PERSONNELLES */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Informations personnelles</div>

            {erreur && (
              <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>
                ⚠️ {erreur}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Prénom</div>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Nom</div>
                <input value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Email</div>
              <input value={email} disabled style={{ ...inputStyle, color: t.textMuted }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Description / Métier</div>
              <input value={metier} onChange={e => setMetier(e.target.value)} placeholder="ex: Ingénieur, Étudiant, Entrepreneur..." style={inputStyle} />
            </div>
            {succes && (
              <div style={{ fontSize: 12, color: '#2E7D1E', background: '#EAF6E4', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
                ✓ Informations sauvegardées !
              </div>
            )}
            <button onClick={handleSave} disabled={loading} style={{ background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          {/* ABONNEMENT */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Mon abonnement</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.bgSecondary, borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Plan gratuit</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>Finances de base · ETF actualisés 1x/jour</div>
              </div>
              <span style={{ fontSize: 10, background: '#EAF6E4', color: '#2E7D1E', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>Actif</span>
            </div>
            <button onClick={() => navigate('/abonnement')} style={{ background: '#1B2E4B', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Passer à Premium →
            </button>
          </div>

          {/* À PROPOS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div onClick={() => setShowAPropos(v => !v)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>À propos & Mentions légales</div>
              <div style={{ fontSize: 16, color: t.textMuted }}>{showAPropos ? '−' : '+'}</div>
            </div>
            {showAPropos && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: t.text, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>À propos de StartInvest</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>StartInvest est une application d'aide à la gestion de portefeuille d'ETF destinée aux particuliers souhaitant suivre et optimiser leurs investissements long terme.</div>
                </div>
                <div style={{ height: 0.5, background: t.border }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: t.text, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Avertissement financier</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>Les informations fournies ont un caractère purement informatif. Elles ne constituent pas un conseil en investissement. Investir comporte des risques de perte en capital.</div>
                </div>
                <div style={{ height: 0.5, background: t.border }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: t.text, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Contact</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>contact@startinvest.fr</div>
                </div>
                <div style={{ height: 0.5, background: t.border }} />
                <div style={{ fontSize: 11, color: t.textMuted, textAlign: 'center' }}>StartInvest · v1.0 · © {new Date().getFullYear()} Tous droits réservés</div>
              </div>
            )}
          </div>

          {/* DANGER ZONE */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Danger zone</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleLogout} style={{ background: '#FCEBEB', color: '#E24B4A', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Se déconnecter
              </button>
              <button onClick={() => setShowSupprimer(v => !v)} style={{ background: 'transparent', color: '#E24B4A', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: `0.5px solid #E24B4A`, cursor: 'pointer', fontFamily: 'inherit' }}>
                Supprimer le compte
              </button>
            </div>
            {showSupprimer && (
              <div style={{ marginTop: 16, padding: 16, background: '#FCEBEB', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: '#E24B4A', marginBottom: 10 }}>⚠️ Cette action est irréversible. Tapez votre email pour confirmer.</div>
                <input value={confirmSupprimer} onChange={e => setConfirmSupprimer(e.target.value)} placeholder={email} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid #E24B4A`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#E24B4A', marginBottom: 10, boxSizing: 'border-box' }} />
                <button onClick={handleDeleteAccount} disabled={confirmSupprimer !== email} style={{ background: confirmSupprimer === email ? '#E24B4A' : '#ccc', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: confirmSupprimer === email ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                  Confirmer la suppression
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}