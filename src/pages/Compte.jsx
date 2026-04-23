import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import { usePremium } from '../lib/usePremium'

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
  const [showAPropos, setShowAPropos] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [showCGV, setShowCGV] = useState(false)
  const [showConfidentialite, setShowConfidentialite] = useState(false)
  const [showSupprimer, setShowSupprimer] = useState(false)
  const [confirmSupprimer, setConfirmSupprimer] = useState('')
  const [suppressionLoading, setSuppressionLoading] = useState(false)
  const [suppressionErreur, setSuppressionErreur] = useState(null)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const { isPremium } = usePremium()
const [abonnement, setAbonnement] = useState(null)
const [portalUrl, setPortalUrl] = useState(null)

useEffect(() => {
  const fetchAbonnement = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profil } = await supabase
      .from('profils')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profil) return

    const { data } = await supabase
      .from('abonnements')
      .select('statut, plan, date_fin')
      .eq('user_id', profil.id)
      .single()

    if (data) setAbonnement(data)
  }
  fetchAbonnement()
}, [])
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

        // Charger le pseudo depuis la table profils
        const { data: profil } = await supabase
          .from('profils')
          .select('pseudo')
          .eq('user_id', user.id)
          .single()
        if (profil?.pseudo) {
          setPseudo(profil.pseudo)
          setPseudoInitial(profil.pseudo)
        }
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

  // Vérification disponibilité pseudo en temps réel
  useEffect(() => {
    if (!pseudo.trim() || pseudo === pseudoInitial) { setPseudoDisponible(null); return }
    if (pseudo.length < 3) { setPseudoDisponible(false); return }

    const timer = setTimeout(async () => {
      setCheckingPseudo(true)
      const { data } = await supabase
        .from('profils')
        .select('pseudo')
        .eq('pseudo', pseudo.toLowerCase().trim())
        .single()
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

      // Sauvegarder le pseudo dans la table profils
      if (pseudo.trim()) {
        const pseudoFormate = pseudo.toLowerCase().trim()
        const { data: existing } = await supabase.from('profils').select('id').eq('user_id', user.id).single()
        if (existing) {
          await supabase.from('profils').update({ pseudo: pseudoFormate, updated_at: new Date().toISOString() }).eq('user_id', user.id)
        } else {
          await supabase.from('profils').insert({ user_id: user.id, pseudo: pseudoFormate })
        }
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
    if (confirmSupprimer !== email || suppressionLoading) return
    setSuppressionLoading(true)
    setSuppressionErreur(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session expirée. Reconnecte-toi.')
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (error) throw new Error(error.message || 'Erreur lors de la suppression du compte.')
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

  const SectionLegale = ({ titre, open, onToggle, children }) => (
    <div style={{ border: `0.5px solid ${t.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: t.bgSecondary }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{titre}</div>
        <div style={{ fontSize: 14, color: t.textMuted }}>{open ? '−' : '+'}</div>
      </div>
      {open && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {children}
        </div>
      )}
    </div>
  )

  const Article = ({ numero, titre, children }) => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.text, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>{numero}. {titre}</div>
      <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.7 }}>{children}</div>
    </div>
  )

  // Indicateur disponibilité pseudo
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
                {pseudoInitial && (
                  <div style={{ fontSize: 12, color: '#4CAF2E', fontWeight: 500 }}>@{pseudoInitial}</div>
                )}
                <div style={{ fontSize: 12, color: t.textMuted }}>{email}</div>
                
              </div>
            </div>
            <button onClick={() => navigate('/parametres')} style={{ background: t.bgSecondary, color: t.text, fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 9, border: `0.5px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
              ⚙️ Paramètres
            </button>
          </div>

          {erreurPhoto && (
            <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreurPhoto}</div>
          )}

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

            {/* PSEUDO */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: t.textMuted }}>Pseudo <span style={{ fontSize: 10, background: '#E8EEF6', color: '#1B2E4B', padding: '1px 7px', borderRadius: 20, marginLeft: 6, fontWeight: 500 }}>Amis</span></div>
                {renderPseudoStatus()}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: t.textMuted, pointerEvents: 'none' }}>@</span>
                <input
                  value={pseudo}
                  onChange={e => setPseudo(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                  placeholder="ton_pseudo"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  style={{ ...inputStyle, paddingLeft: 26, border: `0.5px solid ${pseudoDisponible === false && pseudo !== pseudoInitial ? '#E24B4A' : pseudoDisponible === true ? '#4CAF2E' : t.border}` }}
                />
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>
                Uniquement lettres, chiffres et _ · Utilisé pour rechercher et ajouter des amis
              </div>
            </div>

            {succes && <div style={{ fontSize: 12, color: '#2E7D1E', background: '#EAF6E4', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>✓ Informations sauvegardées !</div>}
            <button onClick={handleSave} disabled={loading} style={{ background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '⏳ Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

{/* ABONNEMENT */}
<div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 16 }}>Mon abonnement</div>

  {/* STATUT */}
  <div style={{ background: isPremium ? '#1B2E4B' : t.bgSecondary, borderRadius: 12, padding: '16px', marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPremium ? 12 : 0 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: isPremium ? '#fff' : t.text }}>
          {isPremium ? `Premium · ${abonnement?.plan === 'annuel' ? 'Annuel' : 'Mensuel'}` : 'Plan gratuit'}
        </div>
        <div style={{ fontSize: 11, color: isPremium ? 'rgba(255,255,255,0.6)' : t.textMuted, marginTop: 2 }}>
  {!isPremium && 'Finances de base, tes premiers challenges et le guide pour comprendre l\'investissement'}
</div>
      </div>
      <span style={{ fontSize: 10, background: isPremium ? '#4CAF2E' : '#EAF6E4', color: isPremium ? '#fff' : '#2E7D1E', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
        Actif
      </span>
    </div>

    {/* INFOS PREMIUM */}
    {isPremium && abonnement?.date_fin && (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Prochain renouvellement</div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>
            {new Date(abonnement.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Plan</div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>
            {abonnement?.plan === 'annuel' ? '67€ / an' : '7,99€ / mois'}
          </div>
        </div>
      </div>
    )}
  </div>

  {/* ACTIONS */}
  {isPremium ? (
   <button
  onClick={() => { if (portalUrl) window.location.href = portalUrl }}
  disabled={!portalUrl}
  style={{ background: 'transparent', color: t.text, fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: `0.5px solid ${t.border}`, cursor: portalUrl ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: portalUrl ? 1 : 0.6 }}
>
  {portalUrl ? 'Gérer mon abonnement (factures, résiliation)' : 'Chargement...'}
</button>
  ) : (
    <button onClick={() => navigate('/abonnement')} style={{ background: '#1B2E4B', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
      Essayer Premium 15 jours gratuits →
    </button>
  )}
</div>

          {/* À PROPOS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div onClick={() => setShowAPropos(v => !v)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>À propos & Mentions légales</div>
              <div style={{ fontSize: 16, color: t.textMuted }}>{showAPropos ? '−' : '+'}</div>
            </div>

            {showAPropos && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6, padding: '10px 14px', background: t.bgSecondary, borderRadius: 10 }}>
                  StartInvest est une application d'aide à la gestion de portefeuille d'ETF destinée aux particuliers souhaitant suivre et optimiser leurs investissements long terme.
                </div>

                <SectionLegale titre="Mentions légales" open={showMentions} onToggle={() => setShowMentions(v => !v)}>
                  <Article numero="1" titre="Éditeur du site">
                    Le site www.start-invest.fr est édité par :<br />
                    <strong style={{ color: t.text }}>Nom de la société :</strong> START_INVEST<br />
                    <strong style={{ color: t.text }}>Statut juridique :</strong> Entrepreneur Individuel<br />
                    <strong style={{ color: t.text }}>Siège social :</strong> 44 Rue Pasquier, 75008 PARIS, FRANCE<br />
                    <strong style={{ color: t.text }}>E-mail :</strong> contact@start-invest.fr<br />
                    <strong style={{ color: t.text }}>SIRET :</strong> 90915142500024<br />
                    <strong style={{ color: t.text }}>Directeur de la publication :</strong> Thomas BOUCHARD
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="2" titre="Hébergeur du site">
                    Le site est hébergé par la société <strong style={{ color: t.text }}>Vercel Inc.</strong><br />
                    Siège social : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
                    Site web : https://vercel.com<br /><br />
                    Les données applicatives sont stockées via la plateforme <strong style={{ color: t.text }}>Supabase Inc.</strong> sur des serveurs situés en Union Européenne (Région Frankfurt, Allemagne), garantissant ainsi la conformité avec le RGPD.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="3" titre="Propriété intellectuelle">
                    L'ensemble de ce site, ainsi que les produits numériques (guides, fichiers Excel, formations) vendus sous la marque Start Invest, relèvent de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="4" titre="Données personnelles">
                    Le stockage des données applicatives (calculs de budget et investissements) est assuré par la société Supabase Inc. dont les serveurs sont situés en Europe (Région AWS Frankfurt).
                  </Article>
                </SectionLegale>

                <SectionLegale titre="Conditions Générales de Vente (CGV)" open={showCGV} onToggle={() => setShowCGV(v => !v)}>
                  <Article numero="1" titre="Objet">
                    Les présentes CGV régissent de manière exclusive les relations contractuelles entre l'entreprise START_INVEST et toute personne physique ou morale procédant à l'achat de produits numériques ou à l'accès à l'application web de gestion financière sur le site www.start-invest.fr.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="2" titre="Prix et paiement">
                    Les prix sont indiqués en Euros (€). TVA non applicable en tant qu'Entrepreneur Individuel (article 293 B du CGI). Le paiement est exigible immédiatement à la commande via carte bancaire par les plateformes sécurisées Stripe ou PayPal.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="3" titre="Livraison des produits numériques">
                    Le contenu est livré par voie électronique immédiatement après la validation du paiement. Le Client reçoit ses accès par e-mail à l'adresse renseignée lors de la commande.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="4" titre="Accès et maintenance">
                    L'Éditeur s'efforce d'assurer un accès à l'application 24h/24 et 7j/7. L'accès peut être temporairement suspendu pour des raisons de maintenance.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="5" titre="Droit de rétractation">
                    Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contenus numériques dont l'exécution a commencé après accord préalable exprès du consommateur.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="6" titre="Responsabilité et avertissement légal">
                    Start Invest fournit des informations à titre purement éducatif et pédagogique. L'Éditeur n'est pas Conseiller en Investissement Financier (CIF). Les informations présentées ne constituent en aucun cas un conseil en investissement.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="7" titre="Propriété intellectuelle">
                    Tous les éléments du site et de l'application sont et restent la propriété intellectuelle exclusive de START_INVEST.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="8" titre="Droit applicable">
                    Les présentes CGV sont soumises à la loi française. En cas de litige, et après tentative de résolution amiable, compétence est donnée aux tribunaux français compétents.
                  </Article>
                </SectionLegale>

                <SectionLegale titre="Politique de confidentialité" open={showConfidentialite} onToggle={() => setShowConfidentialite(v => !v)}>
                  <Article numero="1" titre="Collecte des données">
                    Les chiffres que vous saisissez dans vos outils de gestion sont strictement personnels et ne sont jamais partagés avec des tiers.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="2" titre="Utilisation des données">
                    Nous n'utilisons aucun traceur publicitaire tiers et ne revendons jamais vos informations à des partenaires commerciaux.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="3" titre="Données de contact">
                    Vos informations d'identification sont conservées tant que vous restez inscrit. Pour supprimer définitivement votre compte, rendez-vous dans Paramètres.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="4" titre="Données applicatives">
                    Vos données de calcul sont conservées pendant toute la durée de vie de votre compte Start Invest.
                  </Article>
                  <div style={{ height: 0.5, background: t.border }} />
                  <Article numero="5" titre="Sécurité et stockage">
                    Vos données sont stockées de manière sécurisée via Supabase Inc. (infrastructure AWS, région Frankfurt) et Vercel Inc.
                  </Article>
                </SectionLegale>

                <div style={{ height: 0.5, background: t.border }} />
                <div style={{ fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
                  StartInvest · v1.0 · © {new Date().getFullYear()} Tous droits réservés
                </div>
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
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E24B4A', marginBottom: 8 }}>⚠️ Suppression definitive du compte</div>
                <div style={{ fontSize: 12, color: '#E24B4A', marginBottom: 10, lineHeight: 1.5 }}>
                  Cette action est <strong>irreversible</strong>. Toutes tes donnees seront supprimees definitivement. Tape ton email ci-dessous pour confirmer.
                </div>
                <input
                  value={confirmSupprimer}
                  onChange={e => setConfirmSupprimer(e.target.value)}
                  placeholder={email}
                  disabled={suppressionLoading}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid #E24B4A`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#E24B4A', marginBottom: 10, boxSizing: 'border-box' }}
                />
                {suppressionErreur && (
                  <div style={{ background: '#fff', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 10 }}>
                    ⚠️ {suppressionErreur}
                  </div>
                )}
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmSupprimer !== email || suppressionLoading}
                  style={{ background: (confirmSupprimer === email && !suppressionLoading) ? '#E24B4A' : '#ccc', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, border: 'none', cursor: (confirmSupprimer === email && !suppressionLoading) ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                >
                  {suppressionLoading ? '⏳ Suppression en cours...' : 'Confirmer la suppression definitive'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
      <FooterApp />
    </div>
  )
}
