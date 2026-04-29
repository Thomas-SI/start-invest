import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import { usePremium } from '../lib/usePremium'

const Toggle = ({ active, onToggle, disabled }) => (
  <div onClick={disabled ? undefined : onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? '#4CAF2E' : '#E0EAE3', cursor: disabled ? 'default' : 'pointer', position: 'relative', transition: 'background 0.2s', opacity: disabled ? 0.4 : 1, flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, left: active ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
  </div>
)

export default function Compte() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [metier, setMetier] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [pseudoInitial, setPseudoInitial] = useState('')
  const [pseudoDisponible, setPseudoDisponible] = useState(null)
  const [checkingPseudo, setCheckingPseudo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [showSupprimer, setShowSupprimer] = useState(false)
  const [confirmSupprimer, setConfirmSupprimer] = useState('')
  const [suppressionLoading, setSuppressionLoading] = useState(false)
  const [suppressionErreur, setSuppressionErreur] = useState(null)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [erreurPhoto, setErreurPhoto] = useState(null)
  const [newsletter, setNewsletter] = useState(false)
  const [profilId, setProfilId] = useState(null)
  const { isPremium } = usePremium()
  const [abonnement, setAbonnement] = useState(null)
  const [portalUrl, setPortalUrl] = useState(null)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      setPrenom(user.user_metadata?.prenom || '')
      setNom(user.user_metadata?.nom || '')
      setEmail(user.email || '')
      setMetier(user.user_metadata?.metier || '')
      setPhotoUrl(user.user_metadata?.photo_url || null)

      const { data: profil } = await supabase
        .from('profils')
        .select('id, pseudo, newsletter')
        .eq('user_id', user.id)
        .single()

      if (profil) {
        setProfilId(profil.id)
        if (profil.pseudo) { setPseudo(profil.pseudo); setPseudoInitial(profil.pseudo) }
        setNewsletter(profil.newsletter || false)

        const { data: abo } = await supabase
          .from('abonnements')
          .select('statut, plan, date_fin')
          .eq('user_id', profil.id)
          .maybeSingle()
        if (abo) setAbonnement(abo)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!isPremium) return
    const preloadPortal = async () => {
      const { data } = await supabase.functions.invoke('create-portal-session', {})
      if (data?.url) setPortalUrl(data.url)
    }
    preloadPortal()
  }, [isPremium])

  useEffect(() => {
    if (!pseudo.trim() || pseudo === pseudoInitial) { setPseudoDisponible(null); return }
    if (pseudo.length < 3) { setPseudoDisponible(false); return }
    const timer = setTimeout(async () => {
      setCheckingPseudo(true)
      const { data } = await supabase.from('profils').select('pseudo').eq('pseudo', pseudo.toLowerCase().trim()).maybeSingle()
      setPseudoDisponible(!data)
      setCheckingPseudo(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [pseudo, pseudoInitial])

  const handleSave = async () => {
    if (loading) return
    if (!prenom.trim() && !nom.trim()) { setErreur('Veuillez saisir au moins un prénom ou un nom.'); return }
    if (pseudo.trim() && pseudo.length < 3) { setErreur('Le pseudo doit contenir au moins 3 caractères.'); return }
    if (pseudo.trim() && pseudo !== pseudoInitial && pseudoDisponible === false) { setErreur('Ce pseudo est déjà pris.'); return }
    setLoading(true); setErreur(null)
    try {
      const { error } = await supabase.auth.updateUser({ data: { prenom, nom, metier } })
      if (error) throw new Error('Erreur lors de la sauvegarde.')
      if (pseudo.trim()) {
        const pseudoFormate = pseudo.toLowerCase().trim()
        await supabase.from('profils').update({ pseudo: pseudoFormate, updated_at: new Date().toISOString() }).eq('user_id', user.id)
        setPseudoInitial(pseudoFormate)
        setPseudo(pseudoFormate)
      }
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
    if (file.size > 2 * 1024 * 1024) { setErreurPhoto('La photo ne doit pas dépasser 2 Mo.'); return }
    setUploadingPhoto(true); setErreurPhoto(null)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (error) throw new Error('Erreur lors de l\'upload.')
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setPhotoUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { photo_url: data.publicUrl } })
      await supabase.from('profils').update({ photo_url: data.publicUrl }).eq('user_id', user.id)
    } catch (e) {
      setErreurPhoto(e.message || 'Erreur lors de l\'upload.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleToggleNewsletter = async () => {
    const newVal = !newsletter
    setNewsletter(newVal)
    await supabase.from('profils').update({ newsletter: newVal }).eq('user_id', user.id)
  }

  const handleDeleteAccount = async () => {
    if (confirmSupprimer !== email || suppressionLoading) return
    setSuppressionLoading(true); setSuppressionErreur(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session expirée.')
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.details || data.error)
      await supabase.auth.signOut()
      navigate('/')
    } catch (e) {
      setSuppressionErreur(e.message || 'Une erreur est survenue.')
      setSuppressionLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }

  const renderPseudoStatus = () => {
    if (!pseudo.trim() || pseudo === pseudoInitial) return null
    if (pseudo.length < 3) return <span style={{ fontSize: 11, color: '#E24B4A' }}>Au moins 3 caractères</span>
    if (checkingPseudo) return <span style={{ fontSize: 11, color: t.textMuted }}>Vérification...</span>
    if (pseudoDisponible === true) return <span style={{ fontSize: 11, color: '#4CAF2E' }}>✓ Disponible</span>
    if (pseudoDisponible === false) return <span style={{ fontSize: 11, color: '#E24B4A' }}>✕ Déjà pris</span>
    return null
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Compte" initiale={initiale} photoUrl={photoUrl} />

      <div style={{ padding: '24px 20px', flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* HEADER PROFIL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <label style={{ cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: '#2E7D1E', overflow: 'hidden' }}>
                {photoUrl ? <img src={photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initiale}
              </div>
              {uploadingPhoto && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>...</div>}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{prenom} {nom}</div>
              {pseudoInitial && <div style={{ fontSize: 12, color: '#4CAF2E', fontWeight: 500 }}>@{pseudoInitial}</div>}
              <div style={{ fontSize: 12, color: t.textMuted }}>{email}</div>
            </div>
          </div>

          {erreurPhoto && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreurPhoto}</div>}

          {/* INFORMATIONS PERSONNELLES */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Informations personnelles</div>
            {erreur && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreur}</div>}
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
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Description / Métier</div>
              <input value={metier} onChange={e => setMetier(e.target.value)} placeholder="ex: Ingénieur, Étudiant, Entrepreneur..." style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: t.textMuted }}>Pseudo <span style={{ fontSize: 10, background: '#E8EEF6', color: '#034065', padding: '1px 7px', borderRadius: 20, marginLeft: 6, fontWeight: 500 }}>Amis</span></div>
                {renderPseudoStatus()}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: t.textMuted, pointerEvents: 'none' }}>@</span>
                <input value={pseudo} onChange={e => setPseudo(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())} placeholder="ton_pseudo" autoCapitalize="none" autoCorrect="off" autoComplete="off" style={{ ...inputStyle, paddingLeft: 26, border: `0.5px solid ${pseudoDisponible === false && pseudo !== pseudoInitial ? '#E24B4A' : pseudoDisponible === true ? '#4CAF2E' : t.border}` }} />
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>Uniquement lettres, chiffres et _ · Utilisé pour rechercher et ajouter des amis</div>
            </div>
            {succes && <div style={{ fontSize: 12, color: '#2E7D1E', background: '#EAF6E4', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>✓ Informations sauvegardées !</div>}
            <button onClick={handleSave} disabled={loading} style={{ background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          {/* ABONNEMENT */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Mon abonnement</div>
            <div style={{ background: isPremium ? '#034065' : t.bgSecondary, borderRadius: 12, padding: '16px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPremium ? 12 : 0 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isPremium ? '#fff' : t.text }}>
                    {isPremium ? `Premium · ${abonnement?.plan === 'annuel' ? 'Annuel' : 'Mensuel'}` : 'Plan gratuit'}
                  </div>
                  <div style={{ fontSize: 11, color: isPremium ? 'rgba(255,255,255,0.6)' : t.textMuted, marginTop: 2 }}>
                    {!isPremium && 'Finances de base, tes premiers challenges et le guide pour comprendre l\'investissement'}
                  </div>
                </div>
                <span style={{ fontSize: 10, background: isPremium ? '#4CAF2E' : '#EAF6E4', color: isPremium ? '#fff' : '#2E7D1E', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Actif</span>
              </div>
              {isPremium && abonnement?.date_fin && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Prochain renouvellement</div>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{new Date(abonnement.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Plan actuel</div>
<div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>
  {abonnement?.plan === 'annuel'
    ? `${[67,59,52,45,37,30,22,15,7.5][Math.min((abonnement?.annee_abonnement || 1) - 1, 8)]}€ / an`
    : '7,99€ / mois'}
</div>
{abonnement?.plan === 'annuel' && (abonnement?.annee_abonnement || 1) < 10 && (
  <div style={{ fontSize: 10, color: '#4CAF2E', marginTop: 4 }}>
    ↓ Prochain renouvellement : {[67,59,52,45,37,30,22,15,7.5][Math.min((abonnement?.annee_abonnement || 1), 8)]}€ / an
  </div>
)}
                  </div>
                </div>
              )}
            </div>
            {isPremium ? (
              <button onClick={() => { if (portalUrl) window.location.href = portalUrl }} disabled={!portalUrl} style={{ background: 'transparent', color: t.text, fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: `0.5px solid ${t.border}`, cursor: portalUrl ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: portalUrl ? 1 : 0.6 }}>
                {portalUrl ? 'Gérer mon abonnement (factures, résiliation)' : 'Chargement...'}
              </button>
            ) : (
              <button onClick={() => navigate('/abonnement')} style={{ background: '#034065', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Essayer Premium 15 jours gratuits →
              </button>
            )}
          </div>

          {/* APPARENCE */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Apparence</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.bgSecondary, borderRadius: 10, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Mode {t.dark ? 'sombre' : 'clair'}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{t.dark ? 'Interface sombre activée' : 'Interface claire activée'}</div>
              </div>
              <Toggle active={t.dark} onToggle={t.toggle} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.bgSecondary, borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Mode Night Shift</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Réduit la lumière bleue de l'écran</div>
              </div>
              <Toggle active={t.nightShift} onToggle={t.toggleNightShift} />
            </div>
          </div>

          {/* NEWSLETTER */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Newsletter</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.bgSecondary, borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Recevoir les nouveautés</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Mises à jour, nouvelles fonctionnalités et conseils investissement</div>
              </div>
              <Toggle active={newsletter} onToggle={handleToggleNewsletter} />
            </div>
          </div>

          {/* LÉGALITÉ */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Légalité & Informations</div>
            <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6, padding: '10px 14px', background: t.bgSecondary, borderRadius: 10, marginBottom: 12 }}>
              Start Invest est une application éducative de gestion financière. Nous ne sommes pas Conseillers en Investissement Financier. Les informations fournies ne constituent pas un conseil en investissement.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Mentions légales', '/mentions-legales'],
                ['Conditions Générales de Vente', '/cgv'],
                ['Conditions Générales d\'Utilisation', '/cgu'],
                ['Politique de confidentialité', '/confidentialite'],
                ['Politique de réclamation', '/reclamation'],
                ['Gestion des cookies', '/cookies'],
              ].map(([label, path]) => (
                <div key={label} onClick={() => navigate(path)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: t.bgSecondary, borderRadius: 8, cursor: 'pointer' }}>
                  <span style={{ fontSize: 13, color: t.text }}>{label}</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>→</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, textAlign: 'center', marginTop: 16 }}>
              Start Invest · v1.0 · © {new Date().getFullYear()} Tous droits réservés
            </div>
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
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E24B4A', marginBottom: 8 }}>⚠️ Suppression définitive du compte</div>
                <div style={{ fontSize: 12, color: '#E24B4A', marginBottom: 10, lineHeight: 1.5 }}>
                  Cette action est <strong>irréversible</strong>. Toutes tes données seront supprimées définitivement. Tape ton email ci-dessous pour confirmer.
                </div>
                <input value={confirmSupprimer} onChange={e => setConfirmSupprimer(e.target.value)} placeholder={email} disabled={suppressionLoading} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid #E24B4A`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#E24B4A', marginBottom: 10, boxSizing: 'border-box' }} />
                {suppressionErreur && <div style={{ background: '#fff', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 10 }}>⚠️ {suppressionErreur}</div>}
                <button onClick={handleDeleteAccount} disabled={confirmSupprimer !== email || suppressionLoading} style={{ background: (confirmSupprimer === email && !suppressionLoading) ? '#E24B4A' : '#ccc', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: (confirmSupprimer === email && !suppressionLoading) ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                  {suppressionLoading ? '⏳ Suppression en cours...' : 'Confirmer la suppression définitive'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <button
  onClick={() => setShowInstallGuide(true)}
  style={{
    position: 'fixed', bottom: 80, right: 16, zIndex: 100,
    width: 36, height: 36, borderRadius: '50%',
    background: '#034065', color: '#fff',
    border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}
>
  ?
</button>

{showInstallGuide && (
  <>
    <div onClick={() => setShowInstallGuide(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: t.bgCard, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>📱 Ajouter l'App sur ton écran d'accueil</div>
        <button onClick={() => setShowInstallGuide(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted }}>✕</button>
      </div>
      <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#E8EEF6', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#034065', marginBottom: 12 }}>🍎 Sur iPhone (Safari)</div>
          {[
            { num: '1', texte: 'Ouvre start-invest.fr dans Safari' },
            { num: '2', texte: 'Appuie sur le bouton partager (carré avec flèche ↑)' },
            { num: '3', texte: "Sélectionne \"Sur l'écran d'accueil\"" },
            { num: '4', texte: 'Appuie sur "Ajouter"' },
          ].map(({ num, texte }) => (
            <div key={num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#034065', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
              <div style={{ fontSize: 12, color: '#034065', lineHeight: 1.6, paddingTop: 2 }}>{texte}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#EAF6E4', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2E7D1E', marginBottom: 12 }}>🤖 Sur Android (Chrome)</div>
          {[
            { num: '1', texte: 'Ouvre start-invest.fr dans Chrome' },
            { num: '2', texte: 'Appuie sur les 3 points en haut à droite' },
            { num: '3', texte: "Sélectionne \"Ajouter à l'écran d'accueil\"" },
            { num: '4', texte: 'Appuie sur "Ajouter"' },
          ].map(({ num, texte }) => (
            <div key={num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
              <div style={{ fontSize: 12, color: '#2E7D1E', lineHeight: 1.6, paddingTop: 2 }}>{texte}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}
<FooterApp />
     
    </div>
  )
}