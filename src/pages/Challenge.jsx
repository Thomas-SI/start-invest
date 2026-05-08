import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import PageGuide from '../components/PageGuide'
import { usePageGuide } from '../lib/usePageGuide'
import { checkAndGrant } from '../lib/checkAndGrant'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Metronome.png'

const GRADES_CAP = [
  { slug: 'cap-bronze', palier: 100, niveau: 'Bronze', niveauColor: '#854F0B', niveauBg: '#FFF0DC' },
  { slug: 'cap-argent', palier: 500, niveau: 'Argent', niveauColor: '#444441', niveauBg: '#F0F0F0' },
  { slug: 'cap-or', palier: 1000, niveau: 'Or', niveauColor: '#633806', niveauBg: '#FFF8DC' },
  { slug: 'cap-platine', palier: 2000, niveau: 'Platine', niveauColor: '#185FA5', niveauBg: '#E6F1FB' },
  { slug: 'cap-epique', palier: 5000, niveau: 'Épique', niveauColor: '#534AB7', niveauBg: '#EEEDFE' },
  { slug: 'cap-legendaire', palier: 10000, niveau: 'Légendaire', niveauColor: '#993556', niveauBg: '#FBEAF0' },
]

const GRADES_METRONOME = [
  { slug: 'metronome-bronze', mois: 3, niveau: 'Bronze', niveauColor: '#854F0B', niveauBg: '#FFF0DC' },
  { slug: 'metronome-argent', mois: 6, niveau: 'Argent', niveauColor: '#444441', niveauBg: '#F0F0F0' },
  { slug: 'metronome-or', mois: 12, niveau: 'Or', niveauColor: '#633806', niveauBg: '#FFF8DC' },
  { slug: 'metronome-platine', mois: 18, niveau: 'Platine', niveauColor: '#185FA5', niveauBg: '#E6F1FB' },
]

const PALIERS = [
  { label: 'Top 30%', montant: 45000, couleur: '#3B82F6', desc: '30% des Français les mieux dotés en épargne financière hors immobilier. Source : INSEE 2024' },
  { label: 'Top 20%', montant: 80000, couleur: '#854F0B', desc: 'Top 20% des épargnants. Seuls 9,8% des Français détiennent un PEA. Source : INSEE 2024' },
  { label: 'Top 15%', montant: 110000, couleur: '#BA7517', desc: 'Top 15% des épargnants français en patrimoine financier. Source : INSEE 2024' },
  { label: 'Top 10%', montant: 175000, couleur: '#4CAF2E', desc: 'Top 10% des épargnants français. Patrimoine financier moyen > 175 000 €. Source : INSEE 2024' },
  { label: 'Top 5%', montant: 350000, couleur: '#534AB7', desc: 'Top 5% des épargnants. Patrimoine financier exceptionnel. Source : INSEE 2024' },
  { label: 'Top 1%', montant: 900000, couleur: '#993556', desc: 'Top 1% des épargnants français. Au-delà de 900 000 € de patrimoine financier. Source : INSEE & Banque de France 2024' },
]

const MOIS_NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const IMAGES_MENSUELS = {
  4: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/avril-vignettes-challenge%202.jpg',
  5: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/mai-vignettes-challenge.jpg',
  6: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/juin-vignettes-challenge.jpg',
  7: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/juillet-vignettes-challenge.jpg',
  8: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/aout-vignettes-challenge.jpg',
  9: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/sept-vignettes-challenge.jpg',
  10: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/oct-vignettes-challenge.jpg',
  11: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/nov-vignettes-challenge.jpg',
  12: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/dec-vignettes-challenge.png',
}

const BADGES_MENSUELS_2026 = [4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({
  slug: `mois-2026-${String(m).padStart(2, '0')}`,
  nom: `${MOIS_NOMS[m - 1]} 2026`,
  annee: 2026,
  mois: m,
  imageUrl: IMAGES_MENSUELS[m] || null,
  quete: `Acheter un ETF en ${MOIS_NOMS[m - 1]} 2026`,
  categorie: 'mensuel',
}))

const BADGES_GUIDE = [
  { slug: 'guide-ch01', nom: "Comprendre l'environnement", chapitre: '01', couleur: '#3B82F6', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/1-vignettes-challenge.jpg', quete: 'Terminer la Partie 01 du Guide', categorie: 'guide' },
  { slug: 'guide-ch02', nom: "Stratégies d'investissement", chapitre: '02', couleur: '#4CAF2E', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/2-vignettes-challenge.jpg', quete: 'Terminer la Partie 02 du Guide', categorie: 'guide' },
  { slug: 'guide-ch03', nom: 'Choisir sa banque', chapitre: '03', couleur: '#F59E0B', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/3-vignettes-challenge.jpg', quete: 'Terminer la Partie 03 du Guide', categorie: 'guide' },
  { slug: 'guide-ch04', nom: 'Les bases essentielles', chapitre: '04', couleur: '#8B5CF6', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/4-vignettes-challenge.jpg', quete: 'Terminer la Partie 04 du Guide', categorie: 'guide' },
  { slug: 'guide-ch05', nom: "Passer à l'action", chapitre: '05', couleur: '#EC4899', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/5-vignettes-challenge.jpg', quete: 'Terminer la Partie 05 du Guide', categorie: 'guide' },
]

const ACCOMPLISSEMENTS = [
  { slug: 'premier-pas', nom: 'Premier Pas', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Premier%20Pas.png', message: 'Bienvenue chez Start Invest, profite d\'un code parrain en cliquant ici', quete: "S'inscrire sur StartInvest", categorie: 'principal' },
  { slug: 'grand-saut', nom: 'Le Grand Saut', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Le%20grand%20saut.png', message: "Tu n'es plus spectateur, tu es le pilote de ton futur.", quete: 'Acheter votre premier ETF', categorie: 'principal' },
  { slug: 'metronome', nom: 'Le Métronome', svgIcon: true, imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Metronome.png', message: 'La magie des intérêts composés adore ta régularité. Continue !', quete: 'Investir régulièrement chaque mois', evolutif: true, grades: GRADES_METRONOME, categorie: 'principal' },
  { slug: 'main-de-fer', nom: 'Main de Fer', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Main%20de%20fer.png', message: 'Le calme est une compétence.', quete: '6 mois sans aucune vente', categorie: 'principal' },
  { slug: 'architecte', nom: "L'Architecte", imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Larchitecte.png', message: 'Ton patrimoine est maintenant solide et diversifié. Beau travail !', quete: 'Posséder 3 ETF différents', categorie: 'principal' },
  { slug: 'cap', nom: 'Ascension', imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Ascension.png', message: 'Le premier palier est le plus dur. La machine est lancée.', quete: "Atteindre un palier d'investissement", evolutif: true, grades: GRADES_CAP, categorie: 'principal' },
  { slug: 'vroum-vroum', nom: "L'ambitieux", imageUrl: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Lambitieux.png', message: "Je vois déjà l'avenir. Profite d\'un code parrain en cliquant ici", quete: "S'abonner à StartInvest Premium", categorie: 'principal' },
]

const TOUS_BADGES = [...ACCOMPLISSEMENTS, ...BADGES_GUIDE, ...BADGES_MENSUELS_2026]

// ─── Fetch data ───────────────────────────────────────────────────────────────
const fetchChallengeData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')
  const [accRes, invRes, txRes, comptesRes, profilRes] = await Promise.all([
    supabase.from('accomplissements').select('*').eq('user_id', user.id),
    supabase.from('investissements').select('*').eq('user_id', user.id),
    supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: true }),
    supabase.from('comptes').select('*').eq('user_id', user.id),
    supabase.from('profils').select('pseudo').eq('user_id', user.id).single(),
  ])
  return {
    user,
    accomplissements: accRes.data || [],
    investissements: invRes.data || [],
    transactions: txRes.data || [],
    comptes: comptesRes.data || [],
    pseudo: profilRes.data?.pseudo || null,
  }
}

// ─── Calculs ──────────────────────────────────────────────────────────────────
const calcStreak = (transactions) => {
  const achats = transactions.filter(t => t.type === 'Achat')
  const moisAvecAchat = [...new Set(achats.map(t => t.date.substring(0, 7)))].sort()
  if (moisAvecAchat.length === 0) return 0
  let streak = 1
  for (let i = moisAvecAchat.length - 1; i > 0; i--) {
    const curr = new Date(moisAvecAchat[i] + '-01')
    const prev = new Date(moisAvecAchat[i - 1] + '-01')
    const diff = (curr.getFullYear() - prev.getFullYear()) * 12 + (curr.getMonth() - prev.getMonth())
    if (diff === 1) streak++
    else break
  }
  return streak
}

const calcStreakMensuel = (slugsObtenus) => {
  const now = new Date()
  let streak = 0
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const slug = `mois-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (slugsObtenus.has(slug)) streak++
    else break
  }
  return streak
}

// ─── Popup profil ami ─────────────────────────────────────────────────────────
function PopupAmi({ ami, onClose }) {
  const t = useTheme()
  const streakAmi = ami.badges.filter(s => s.startsWith('mois-2026-')).length
  const badgesPrincipal = ami.badges.filter(s => ACCOMPLISSEMENTS.some(a => a.slug === s))
  const badgesGuide = ami.badges.filter(s => BADGES_GUIDE.some(b => b.slug === s))
  const badgesMensuels = ami.badges.filter(s => s.startsWith('mois-2026-')).sort()

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.bgCard, borderRadius: 16, border: `0.5px solid ${t.border}`, width: '100%', maxWidth: 420, maxHeight: '88vh', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#E8EEF6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: '#034065', flexShrink: 0 }}>
  {ami.profil?.photo_url ? <img src={ami.profil.photo_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ami.profil?.pseudo?.[0]?.toUpperCase() || '?'}
</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>@{ami.profil?.pseudo || 'Inconnu'}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{ami.badges.length} badge{ami.badges.length > 1 ? 's' : ''} débloqué{ami.badges.length > 1 ? 's' : ''}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: t.bgSecondary, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 16, cursor: 'pointer', color: t.textSecondary, fontFamily: 'inherit' }}>×</button>
        </div>

        {/* Streak */}
        <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, lineHeight: 1 }}>
            {streakAmi > 0 ? '🔥'.repeat(Math.min(streakAmi, 6)) : '—'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
              {streakAmi > 0 ? `${streakAmi} mois de suite investis` : 'Aucune série en cours'}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Collection mensuelle 2026</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {ami.badges.length === 0 && (
            <div style={{ textAlign: 'center', color: t.textMuted, fontSize: 12, padding: '20px 0' }}>
              Aucun badge pour l'instant
            </div>
          )}

          {/* Accomplissements */}
          {badgesPrincipal.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>Accomplissements</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {badgesPrincipal.map(s => {
                  const badge = ACCOMPLISSEMENTS.find(a => a.slug === s)
                  return (
                    <div key={s} style={{ padding: '5px 12px', borderRadius: 20, background: '#EAF6E4', border: '0.5px solid rgba(76,175,46,0.25)', fontSize: 11, color: '#2E7D1E', fontWeight: 500 }}>
                      {badge?.nom}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Guide */}
          {badgesGuide.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>Guide validé</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {badgesGuide.map(s => {
                  const badge = BADGES_GUIDE.find(b => b.slug === s)
                  return (
                    <div key={s} style={{ padding: '5px 12px', borderRadius: 20, background: badge?.couleur + '15', border: `0.5px solid ${badge?.couleur}40`, fontSize: 11, color: badge?.couleur, fontWeight: 500 }}>
                      {badge?.nom}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Collection mensuelle */}
          {badgesMensuels.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>Collection 2026</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {badgesMensuels.map(s => {
                  const mois = parseInt(s.split('-')[2])
                  return (
                    <div key={s} style={{ padding: '4px 10px', borderRadius: 20, background: '#E6F1FB', border: '0.5px solid rgba(59,130,246,0.25)', fontSize: 11, color: '#185FA5', fontWeight: 500 }}>
                      {MOIS_NOMS[mois - 1]}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Onglet Amis ──────────────────────────────────────────────────────────────
function OngletAmis({ userId, monPseudo, t, isMobile }) {
  const bleu = '#034065'
  const [recherche, setRecherche] = useState('')
  const [resultatsRecherche, setResultatsRecherche] = useState([])
  const [searching, setSearching] = useState(false)
  const [amis, setAmis] = useState([])
  const [demandesRecues, setDemandesRecues] = useState([])
  const [demandesEnvoyees, setDemandesEnvoyees] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [amiOuvert, setAmiOuvert] = useState(null)

  const [maPhoto, setMaPhoto] = useState(null)

useEffect(() => {
  const loadPhoto = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setMaPhoto(user.user_metadata?.photo_url || null)
  }
  loadPhoto()
}, [])

  const chargerAmis = async () => {
    setLoading(true)
    try {
      const { data: relations } = await supabase
        .from('amis')
        .select('*')
        .or(`user_id.eq.${userId},ami_id.eq.${userId}`)

      if (!relations) { setLoading(false); return }

      const amisAcceptes = relations.filter(r => r.statut === 'accepte')
      const recues = relations.filter(r => r.ami_id === userId && r.statut === 'en_attente')
      const envoyees = relations.filter(r => r.user_id === userId && r.statut === 'en_attente')

      const amisIds = amisAcceptes.map(r => r.user_id === userId ? r.ami_id : r.user_id)
      const recuesIds = recues.map(r => r.user_id)
      const tousLesIds = [...new Set([...amisIds, ...recuesIds])]

      const [profils, accs] = await Promise.all([
        tousLesIds.length > 0 ? supabase.from('profils').select('user_id, pseudo, photo_url').in('user_id', tousLesIds) : { data: [] },
        amisIds.length > 0 ? supabase.from('accomplissements').select('user_id, slug').in('user_id', amisIds) : { data: [] },
      ])

      const profilsMap = {}
      profils.data?.forEach(p => { profilsMap[p.user_id] = p })

      const accsMap = {}
      accs.data?.forEach(a => {
        if (!accsMap[a.user_id]) accsMap[a.user_id] = []
        accsMap[a.user_id].push(a.slug)
      })

      setAmis(amisAcceptes.map(r => {
        const amiId = r.user_id === userId ? r.ami_id : r.user_id
        return { ...r, amiId, profil: profilsMap[amiId], badges: accsMap[amiId] || [] }
      }))
      setDemandesRecues(recues.map(r => ({ ...r, profil: profilsMap[r.user_id] })))
      setDemandesEnvoyees(envoyees)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { chargerAmis() }, [userId])

  const rechercherPseudo = async (val) => {
  const terme = (val ?? recherche).trim()
  if (!terme || terme === monPseudo) { setResultatsRecherche([]); return }
  setSearching(true)
  const { data } = await supabase
    .from('profils')
    .select('user_id, pseudo')
    .eq('pseudo', terme)
    .neq('user_id', userId)
    .limit(1)
  setResultatsRecherche(data || [])
  setSearching(false)
}

  const envoyerDemande = async (amiId) => {
    setActionLoading(amiId)
    try {
      await supabase.from('amis').insert({ user_id: userId, ami_id: amiId, statut: 'en_attente' })
      setDemandesEnvoyees(prev => [...prev, { user_id: userId, ami_id: amiId, statut: 'en_attente' }])
      setResultatsRecherche([])
      setRecherche('')
    } catch (e) { console.error(e) }
    setActionLoading(null)
  }

  const accepterDemande = async (relationId) => {
    setActionLoading(relationId)
    await supabase.from('amis').update({ statut: 'accepte' }).eq('id', relationId)
    await chargerAmis()
    setActionLoading(null)
  }

  const refuserDemande = async (relationId) => {
    setActionLoading(relationId)
    await supabase.from('amis').delete().eq('id', relationId)
    await chargerAmis()
    setActionLoading(null)
  }

  const supprimerAmi = async (relationId, e) => {
    e.stopPropagation()
    setActionLoading(relationId)
    await supabase.from('amis').delete().eq('id', relationId)
    await chargerAmis()
    setActionLoading(null)
  }

  const dejaAmi = (amiId) => amis.some(a => a.amiId === amiId)
  const demandeEnvoyee = (amiId) => demandesEnvoyees.some(d => d.ami_id === amiId)

  if (!monPseudo) return (
    <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '32px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>👤</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 8 }}>Crée ton pseudo d'abord</div>
      <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 16px' }}>
        Pour ajouter des amis, tu dois d'abord choisir un pseudo dans la page Compte.
      </div>
      <a href="/compte" style={{ display: 'inline-block', background: bleu, color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 20px', borderRadius: 9, textDecoration: 'none' }}>
        Aller dans mon compte →
      </a>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Popup profil ami */}
      {amiOuvert && <PopupAmi ami={amiOuvert} onClose={() => setAmiOuvert(null)} />}

      {/* Mon pseudo */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8EEF6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: bleu, flexShrink: 0 }}>
  {maPhoto ? <img src={maPhoto} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : monPseudo[0].toUpperCase()}
</div>
        <div>
          <div style={{ fontSize: 11, color: t.textMuted }}>Mon pseudo</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>@{monPseudo}</div>
        </div>
      </div>

      {/* Recherche */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 10 }}>Rechercher un ami</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Recherche par pseudo..."
            value={recherche}
            onChange={e => {
              setRecherche(e.target.value)
              clearTimeout(window._pseudoTimer)
              window._pseudoTimer = setTimeout(() => rechercherPseudo(e.target.value), 400)
            }}
            onKeyDown={e => e.key === 'Enter' && rechercherPseudo()}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
          />
          <button
            onClick={() => rechercherPseudo()}
            disabled={searching}
            style={{ background: bleu, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {searching ? '...' : 'Chercher'}
          </button>
        </div>

        {resultatsRecherche.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resultatsRecherche.map(profil => (
              <div key={profil.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: t.bgSecondary, borderRadius: 8, border: `0.5px solid ${t.border}` }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E8EEF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: bleu, flexShrink: 0 }}>
                  {profil.pseudo[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>@{profil.pseudo}</div>
                </div>
                {dejaAmi(profil.user_id) ? (
                  <span style={{ fontSize: 11, color: '#4CAF2E', fontWeight: 500 }}>Déjà ami</span>
                ) : demandeEnvoyee(profil.user_id) ? (
                  <span style={{ fontSize: 11, color: t.textMuted }}>Demande envoyée</span>
                ) : (
                  <button
                    onClick={() => envoyerDemande(profil.user_id)}
                    disabled={actionLoading === profil.user_id}
                    style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {actionLoading === profil.user_id ? '...' : '+ Ajouter'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {resultatsRecherche.length === 0 && recherche.length >= 2 && !searching && (
          <div style={{ marginTop: 10, fontSize: 12, color: t.textMuted }}>Aucun résultat pour "@{recherche}"</div>
        )}
      </div>

      {/* Demandes reçues */}
      {demandesRecues.length > 0 && (
        <div style={{ background: t.bgCard, border: `0.5px solid #4CAF2E`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 10 }}>
            Demandes reçues
            <span style={{ marginLeft: 8, fontSize: 11, background: '#EAF6E4', color: '#2E7D1E', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{demandesRecues.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {demandesRecues.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: t.bgSecondary, borderRadius: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EAF6E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#2E7D1E', flexShrink: 0 }}>
                  {d.profil?.pseudo?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>@{d.profil?.pseudo || 'Inconnu'}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>souhaite t'ajouter</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => accepterDemande(d.id)} disabled={actionLoading === d.id} style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {actionLoading === d.id ? '...' : 'Accepter'}
                  </button>
                  <button onClick={() => refuserDemande(d.id)} disabled={actionLoading === d.id} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 7, padding: '6px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des amis */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Mes amis ({amis.length})</div>
        </div>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Chargement...</div>
        ) : amis.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>👥</div>
            Aucun ami pour l'instant — recherche un pseudo pour commencer !
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {amis.map((ami, idx) => {
              const nbBadges = ami.badges.length
              const streakAmi = ami.badges.filter(s => s.startsWith('mois-2026-')).length
              return (
                <div
                  key={ami.id}
                  onClick={() => setAmiOuvert(ami)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: idx < amis.length - 1 ? `0.5px solid ${t.border}` : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.bgSecondary}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#E8EEF6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: bleu, flexShrink: 0 }}>
  {ami.profil?.photo_url ? <img src={ami.profil.photo_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ami.profil?.pseudo?.[0]?.toUpperCase() || '?'}
</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>@{ami.profil?.pseudo || 'Inconnu'}</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: t.textMuted }}>🏆 {nbBadges} badge{nbBadges > 1 ? 's' : ''}</span>
                      {streakAmi > 0 && <span style={{ fontSize: 11, color: '#FF6B35' }}>🔥 {streakAmi} mois</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: t.textMuted }}>›</span>
                    <button
                      onClick={(e) => supprimerAmi(ami.id, e)}
                      disabled={actionLoading === ami.id}
                      style={{ background: 'transparent', color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 7, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                    >
                      {actionLoading === ami.id ? '...' : 'Retirer'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Demandes envoyées */}
      {demandesEnvoyees.length > 0 && (
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '12px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, marginBottom: 8 }}>Demandes envoyées ({demandesEnvoyees.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {demandesEnvoyees.map((d, i) => (
              <div key={d.id || i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textMuted }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#BA7517', flexShrink: 0 }} />
                En attente de réponse
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Popup niveaux badge évolutif ─────────────────────────────────────────────
function NiveauxModal({ acc, gradeActuel, valeurActuelle, onClose }) {
  const t = useTheme()
  const isMetronome = acc.slug === 'metronome'
  const getSeuil = (g) => isMetronome ? g.mois : g.palier
  const formatSeuil = (g) => isMetronome ? `${g.mois} mois` : `${g.palier.toLocaleString('fr-FR')} €`
  const getStatut = (g) => {
    if (gradeActuel?.niveau === g.niveau) return 'actuel'
    if (valeurActuelle >= getSeuil(g)) return 'atteint'
    return 'a-venir'
  }
  const prochain = acc.grades.find(g => getStatut(g) === 'a-venir')
  const valeurFormatee = isMetronome ? `${valeurActuelle} mois` : `${Math.round(valeurActuelle).toLocaleString('fr-FR')} €`

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: t.bgCard, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 420, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: gradeActuel ? gradeActuel.niveauBg : t.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: gradeActuel ? `2px solid ${gradeActuel.niveauColor}` : `1.5px solid ${t.border}`, overflow: 'hidden', flexShrink: 0 }}>
              {acc.svgIcon ? <img src={METRONOME_URL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
              : acc.slug === 'cap' ? <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Ascension.png" alt="Ascension" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 20, color: t.textMuted }}>?</span>}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{acc.nom}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{acc.quete}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted, padding: 0 }}>✕</button>
        </div>
        <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.05em' }}>{isMetronome ? 'Série actuelle' : 'Total investi'}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{valeurFormatee}</div>
            </div>
            {gradeActuel && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600, background: gradeActuel.niveauBg, color: gradeActuel.niveauColor, border: `1px solid ${gradeActuel.niveauColor}` }}>{gradeActuel.niveau}</span>}
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {acc.grades.map((g, i) => {
              const statut = getStatut(g)
              const progression = Math.min(100, Math.round((valeurActuelle / getSeuil(g)) * 100))
              return (
                <div key={g.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: statut === 'actuel' ? g.niveauBg : statut === 'atteint' ? g.niveauBg + '80' : 'transparent', border: `${statut === 'actuel' ? 2 : 1}px solid ${statut === 'a-venir' ? t.border : g.niveauColor}`, opacity: statut === 'a-venir' && g !== prochain ? 0.5 : 1 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: statut === 'a-venir' ? 'transparent' : g.niveauBg, border: `2px solid ${g.niveauColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: g.niveauColor }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: statut === 'a-venir' ? t.textMuted : g.niveauColor }}>{g.niveau}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: statut === 'a-venir' ? t.textMuted : g.niveauColor, whiteSpace: 'nowrap' }}>{formatSeuil(g)}</span>
                    </div>
                    {g === prochain && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: g.niveauColor, width: `${progression}%`, transition: 'width 0.5s' }} />
                        </div>
                        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>Encore {isMetronome ? `${getSeuil(g) - valeurActuelle} mois` : `${(getSeuil(g) - valeurActuelle).toLocaleString('fr-FR')} €`}</div>
                      </div>
                    )}
                  </div>
                  {statut === 'atteint' && <span style={{ fontSize: 14, color: g.niveauColor, fontWeight: 700, flexShrink: 0 }}>✓</span>}
                  {statut === 'actuel' && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: g.niveauColor, color: '#fff', fontWeight: 600, flexShrink: 0 }}>Actuel</span>}
                  {statut === 'a-venir' && g === prochain && <span style={{ fontSize: 14, color: t.textMuted, flexShrink: 0 }}>→</span>}
                </div>
              )
            })}
          </div>
          {!prochain && gradeActuel && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: '#FBEAF0', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>🏆</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#993556' }}>Niveau maximum atteint !</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Popup position INSEE ─────────────────────────────────────────────────────
function PositionModal({ totalInvesti, comptes, onClose }) {
  const t = useTheme()
  const canvasRef = useRef(null)
  const scaleRef = useRef(1)
  const isOverCanvas = useRef(false)
  const [scale, setScale] = useState(1)
  const [palierInfo, setPalierInfo] = useState(null)
  const [showPaliers, setShowPaliers] = useState(false)

  const soldeComptes = comptes.reduce((acc, c) => acc + parseFloat(c.solde_actuel || c.solde || 0), 0)
  const patrimoine = Math.round(totalInvesti + soldeComptes)
  const paliersAtteints = PALIERS.filter(p => patrimoine >= p.montant)
  const paliersAVenir = PALIERS.filter(p => patrimoine < p.montant)
  const palierAtteint = paliersAtteints[paliersAtteints.length - 1] || null
  const palierSuivant = paliersAVenir[0] || null

  const handleWheel = useCallback((e) => {
    if (!isOverCanvas.current) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    const next = Math.max(0.3, Math.min(3.5, scaleRef.current + delta))
    scaleRef.current = next
    setScale(next)
  }, [])

  useEffect(() => {
    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => document.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const W = 360, H = 320, cx = W / 2, cy = H / 2
  const BASE_USER = 70, BASE_STEP = 75
  const rUser = BASE_USER * scale
  const extRayons = paliersAVenir.map((_, i) => (BASE_USER + BASE_STEP * (i + 1)) * scale)
  const intRayons = [...paliersAtteints].reverse().map((_, i) => Math.max((BASE_USER - BASE_STEP * 0.5 * (i + 1)) * scale, 4))
  const couleurUser = palierAtteint ? palierAtteint.couleur : '#4CAF2E'

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - cx
    const y = e.clientY - rect.top - cy
    const dist = Math.sqrt(x * x + y * y)
    for (let i = 0; i < paliersAVenir.length; i++) {
      const r = extRayons[i]
      if (r < 10 || r > W * 1.2) continue
      const prev = i === 0 ? rUser : extRayons[i - 1]
      if (dist >= prev - 8 && dist <= r + 8) { setPalierInfo(palierInfo?.label === paliersAVenir[i].label ? null : paliersAVenir[i]); return }
    }
    const rev = [...paliersAtteints].reverse()
    for (let i = 0; i < rev.length; i++) {
      const r = intRayons[i]
      if (r < 6) continue
      const prev = i === 0 ? 0 : intRayons[i - 1]
      if (dist >= prev && dist <= r + 6) { setPalierInfo(palierInfo?.label === rev[i].label ? null : rev[i]); return }
    }
    setPalierInfo(null)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: t.bgCard, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 420, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Ma position</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Patrimoine financier hors immobilier · INSEE 2024</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted, padding: 0 }}>✕</button>
        </div>
        <div style={{ padding: '10px 20px 12px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{patrimoine.toLocaleString('fr-FR')} €</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Investissements + comptes</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {palierAtteint ? <div style={{ fontSize: 11, fontWeight: 600, color: palierAtteint.couleur, background: palierAtteint.couleur + '15', padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${palierAtteint.couleur}` }}>{palierAtteint.label}</div> : <div style={{ fontSize: 11, color: t.textMuted }}>Aucun palier atteint</div>}
            {palierSuivant && <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>Prochain : <span style={{ color: palierSuivant.couleur, fontWeight: 500 }}>{palierSuivant.label}</span> −{(palierSuivant.montant - patrimoine).toLocaleString('fr-FR')} €</div>}
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 20, flexShrink: 0 }} />
            <div ref={canvasRef} onClick={handleCanvasClick} onMouseEnter={() => { isOverCanvas.current = true }} onMouseLeave={() => { isOverCanvas.current = false }} style={{ flex: 1, cursor: 'crosshair', userSelect: 'none', background: t.dark ? '#0A0F0A' : '#F6FBF6', borderRadius: 12, margin: '12px 0', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
                <button onClick={(e) => { e.stopPropagation(); const n = Math.min(3.5, scaleRef.current + 0.2); scaleRef.current = n; setScale(n) }} style={{ width: 32, height: 32, borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 18, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>+</button>
                <button onClick={(e) => { e.stopPropagation(); const n = Math.max(0.3, scaleRef.current - 0.2); scaleRef.current = n; setScale(n) }} style={{ width: 32, height: 32, borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgCard, color: t.text, fontSize: 18, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>−</button>
              </div>
              <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
                {paliersAVenir.map((palier, i) => {
                  const r = extRayons[i]
                  if (r < 10 || r > W) return null
                  return (
                    <g key={palier.label}>
                      <circle cx={cx} cy={cy} r={r} fill={palierInfo?.label === palier.label ? palier.couleur + '08' : 'none'} stroke={palier.couleur} strokeWidth={palierInfo?.label === palier.label ? 2.5 : 1.5} strokeDasharray="6 4" opacity={0.75} />
                      {r > 40 && r < W - 10 && <text x={cx} y={cy - r + 14} textAnchor="middle" fontSize="9" fontWeight="600" fill={palier.couleur} opacity={0.9}>{palier.label} · {palier.montant.toLocaleString('fr-FR')} €</text>}
                    </g>
                  )
                })}
                <circle cx={cx} cy={cy} r={rUser} fill={couleurUser + '18'} stroke={couleurUser} strokeWidth="2.5" />
                {[...paliersAtteints].reverse().map((palier, i) => {
                  const r = intRayons[i]
                  if (r < 6 || r >= rUser - 2) return null
                  return (
                    <g key={palier.label}>
                      <circle cx={cx} cy={cy} r={r} fill={palier.couleur + '20'} stroke={palier.couleur} strokeWidth={palierInfo?.label === palier.label ? 2 : 1.5} opacity={0.85} />
                      {r > 20 && <text x={cx} y={cy - r + 12} textAnchor="middle" fontSize="8" fontWeight="600" fill={palier.couleur}>{palier.label}</text>}
                    </g>
                  )
                })}
                <line x1={cx - rUser * 0.42} y1={cy - rUser + 1} x2={cx + rUser * 0.42} y2={cy - rUser + 1} stroke={t.dark ? '#0A0F0A' : '#F6FBF6'} strokeWidth="13" />
                <text x={cx} y={cy - rUser + 5} textAnchor="middle" fontSize="10" fontWeight="700" fill={couleurUser}>Vous</text>
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={t.dark ? '#fff' : '#034065'}>{patrimoine.toLocaleString('fr-FR')} €</text>
                {palierAtteint && <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill={palierAtteint.couleur} fontWeight="500">{palierAtteint.label}</text>}
              </svg>
            </div>
            <div style={{ width: 20, flexShrink: 0 }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: t.textMuted, paddingBottom: 8 }}>Utilise les boutons − / + pour zoomer · Clique sur un cercle</div>
          {palierInfo && (
            <div style={{ margin: '0 20px 12px', background: palierInfo.couleur + '12', border: `0.5px solid ${palierInfo.couleur}`, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: palierInfo.couleur }}>{palierInfo.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>≥ {palierInfo.montant.toLocaleString('fr-FR')} €</span>
                  <button onClick={() => setPalierInfo(null)} style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: 13, cursor: 'pointer', padding: 0 }}>✕</button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{palierInfo.desc}</div>
              {patrimoine < palierInfo.montant && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted, marginBottom: 3 }}>
                    <span>Progression</span><span>{Math.min(100, Math.round((patrimoine / palierInfo.montant) * 100))}%</span>
                  </div>
                  <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: palierInfo.couleur, width: `${Math.min(100, Math.round((patrimoine / palierInfo.montant) * 100))}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>encore {(palierInfo.montant - patrimoine).toLocaleString('fr-FR')} €</div>
                </div>
              )}
              {patrimoine >= palierInfo.montant && <div style={{ marginTop: 6, fontSize: 11, color: palierInfo.couleur, fontWeight: 600 }}>✓ Palier atteint !</div>}
            </div>
          )}
          <div style={{ padding: '0 20px 20px' }}>
            <button onClick={() => setShowPaliers(p => !p)} style={{ width: '100%', padding: '9px', borderRadius: 9, border: `0.5px solid ${t.border}`, background: t.bgSecondary, color: t.text, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              {showPaliers ? '▲ Masquer les paliers' : '▼ Afficher tous les paliers'}
            </button>
            {showPaliers && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...PALIERS].reverse().map((palier) => {
                  const atteint = patrimoine >= palier.montant
                  const realIdx = PALIERS.findIndex(p => p.label === palier.label)
                  const estSuivant = !atteint && (realIdx === 0 || patrimoine >= PALIERS[realIdx - 1]?.montant)
                  return (
                    <div key={palier.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: atteint ? palier.couleur + '10' : 'transparent', border: `0.5px solid ${atteint ? palier.couleur : t.border}`, opacity: atteint || estSuivant ? 1 : 0.4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: atteint ? palier.couleur : 'transparent', border: `2px solid ${atteint ? palier.couleur : t.border}`, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 12, fontWeight: atteint ? 600 : 400, color: atteint ? palier.couleur : t.textMuted }}>{palier.label}</span>
                          <span style={{ fontSize: 12, color: atteint ? palier.couleur : t.textMuted }}>≥ {palier.montant.toLocaleString('fr-FR')} €</span>
                        </div>
                        {estSuivant && (
                          <div style={{ marginTop: 4 }}>
                            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 3, background: palier.couleur, width: `${Math.min(100, Math.round((patrimoine / palier.montant) * 100))}%` }} />
                            </div>
                            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>encore {(palier.montant - patrimoine).toLocaleString('fr-FR')} €</div>
                          </div>
                        )}
                      </div>
                      {atteint && <span style={{ fontSize: 11, color: palier.couleur }}>✓</span>}
                      {estSuivant && <span style={{ fontSize: 10, color: t.textMuted }}>→</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function BadgeCard({ badge, obtenu, onClickNiveaux, gradeActuel, progression }) {
  const t = useTheme()
  const [hovered, setHovered] = useState(false)
  const estEvolutif = badge.evolutif
  const estCliquable = (estEvolutif && obtenu) || (badge.slug === 'premier-pas' && obtenu) || (badge.slug === 'vroum-vroum' && obtenu)
  const couleurBadge = badge.categorie === 'guide' ? badge.couleur : badge.categorie === 'mensuel' ? '#3B82F6' : gradeActuel ? gradeActuel.niveauColor : '#4CAF2E'
  const bgBadge = badge.categorie === 'guide' ? badge.couleur + '15' : badge.categorie === 'mensuel' ? '#E6F1FB' : gradeActuel ? gradeActuel.niveauBg : '#EAF6E4'

  // ── Style Strava pour les badges principaux ──
  if (badge.categorie === 'principal') {
    return (
      <div
        onClick={estCliquable ? onClickNiveaux : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 8px', cursor: estCliquable ? 'pointer' : 'default', transition: 'transform 0.15s', transform: hovered && estCliquable ? 'translateY(-3px)' : 'none', opacity: obtenu ? 1 : 0.4 }}
      >
        {/* IMAGE RONDE */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', marginBottom: 10, background: obtenu ? bgBadge : t.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {obtenu ? (
            badge.svgIcon ? <img src={METRONOME_URL} alt={badge.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : badge.imageUrl ? <img src={badge.imageUrl} alt={badge.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 36 }}>
                {badge.slug === 'premier-pas' ? '🌱'
                : badge.slug === 'grand-saut' ? '🚀'
                : badge.slug === 'main-de-fer' ? '🗿'
                : badge.slug === 'architecte' ? '🏗️'
                : badge.slug === 'vroum-vroum' ? '⚡'
                : '🏆'}
              </span>
          ) : (
            <span style={{ fontSize: 28, filter: 'blur(2px)', color: t.textMuted }}>?</span>
          )}
        </div>

        {/* NOM */}
        <div style={{ fontSize: 12, fontWeight: 600, color: obtenu ? couleurBadge : t.textMuted, marginBottom: 4, lineHeight: 1.3 }}>
          {badge.nom}
        </div>
{obtenu && badge.message && (
  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4, fontStyle: 'italic', marginBottom: 4 }}>
    "{badge.message}"
  </div>
)}
{!obtenu && (
  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>
    {badge.quete}
  </div>
)}
        {/* GRADE ou MESSAGE */}
        {obtenu && gradeActuel && (
          <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: gradeActuel.niveauBg, color: gradeActuel.niveauColor, fontWeight: 600, border: `0.5px solid ${gradeActuel.niveauColor}`, marginBottom: 4 }}>
            {gradeActuel.niveau}
          </div>
        )}

        {/* PROGRESSION */}
        {progression && !obtenu && (
          <div style={{ width: '100%', marginTop: 6 }}>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: couleurBadge, width: `${Math.min(100, Math.round((progression.current / progression.total) * 100))}%` }} />
            </div>
            <div style={{ fontSize: 9, color: t.textMuted, marginTop: 3 }}>
              {progression.currency ? `${progression.current.toLocaleString('fr-FR')} / ${progression.total.toLocaleString('fr-FR')} €` : `${progression.current} / ${progression.total}`}
            </div>
          </div>
        )}

        {estCliquable && hovered && badge.slug !== 'premier-pas' && badge.slug !== 'vroum-vroum' && (
  <div style={{ fontSize: 9, color: couleurBadge, fontWeight: 500, marginTop: 4 }}>Voir les niveaux →</div>
)}
      </div>
    )
  }

  // ── Style original pour guide et mensuel ──
  return (
    <div
      onClick={estCliquable ? onClickNiveaux : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: obtenu ? t.bgCard : t.bgSecondary, border: `0.5px solid ${obtenu ? couleurBadge : t.border}`, borderRadius: 14, overflow: 'hidden', cursor: estCliquable ? 'pointer' : 'default', transition: 'transform 0.15s, box-shadow 0.15s', transform: hovered && estCliquable ? 'translateY(-2px)' : 'none', boxShadow: hovered && estCliquable ? '0 6px 20px rgba(0,0,0,0.1)' : 'none', opacity: obtenu ? 1 : 0.7 }}
    >
      <div style={{ height: 110, background: obtenu ? bgBadge : t.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: `0.5px solid ${obtenu ? couleurBadge + '30' : t.border}` }}>
        {obtenu ? (
          badge.svgIcon ? <img src={METRONOME_URL} alt={badge.nom} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', border: `2px solid ${couleurBadge}` }} />
          : badge.imageUrl ? <img src={badge.imageUrl} alt={badge.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: bgBadge, border: `2px solid ${couleurBadge}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {badge.categorie === 'mensuel' ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, color: couleurBadge }}>{MOIS_NOMS[badge.mois - 1]?.substring(0, 3).toUpperCase()}</div><div style={{ fontSize: 9, color: couleurBadge }}>{badge.annee}</div></div>
              : badge.categorie === 'guide' ? <div style={{ fontSize: 16, fontWeight: 700, color: couleurBadge }}>{badge.chapitre}</div>
              : <div style={{ fontSize: 10, color: couleurBadge, textAlign: 'center', padding: '0 6px', lineHeight: 1.3 }}>Image<br/>à venir</div>}
            </div>
          )
        ) : (
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: t.border + '40', border: `2px dashed ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 20, color: t.textMuted, filter: 'blur(1px)' }}>?</div>
          </div>
        )}
        {obtenu && gradeActuel && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, padding: '2px 7px', borderRadius: 20, background: gradeActuel.niveauBg, color: gradeActuel.niveauColor, fontWeight: 600, border: `0.5px solid ${gradeActuel.niveauColor}` }}>{gradeActuel.niveau}</div>}
        {obtenu && !gradeActuel && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, padding: '2px 7px', borderRadius: 20, background: bgBadge, color: couleurBadge, fontWeight: 600, border: `0.5px solid ${couleurBadge}` }}>✓</div>}
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: obtenu ? t.text : t.textMuted, lineHeight: 1.3 }}>{badge.nom}</div>
        {obtenu && badge.message && <div style={{ fontSize: 10, color: t.textSecondary, lineHeight: 1.4, fontStyle: 'italic' }}>"{badge.message}"</div>}
        {!obtenu && <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>{badge.quete}</div>}
        {progression && (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: couleurBadge, width: `${Math.min(100, Math.round((progression.current / progression.total) * 100))}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 9, color: t.textMuted, marginTop: 3 }}>
              {progression.currency ? `${progression.current.toLocaleString('fr-FR')} / ${progression.total.toLocaleString('fr-FR')} €` : `${progression.current} / ${progression.total}`}
            </div>
          </div>
        )}
        {estCliquable && hovered && badge.slug !== 'premier-pas' && badge.slug !== 'vroum-vroum' && <div style={{ fontSize: 9, color: couleurBadge, fontWeight: 500, marginTop: 2 }}>Voir les niveaux →</div>}
      </div>
    </div>
  )
}
function PopupPremierPas({ onClose }) {
  const t = useTheme()
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: t.bgCard, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>🎯 Premier Pas</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Bienvenue chez Start Invest !</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted }}>✕</button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Parrainage */}
          <div style={{ background: '#E8EEF6', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#034065', marginBottom: 6 }}>🎁 Cadeau de bienvenue</div>
            <div style={{ fontSize: 12, color: '#034065', lineHeight: 1.6, marginBottom: 14 }}>
              Ouvre ton compte (CTO, PEA ou lez deux) <strong>Bourse Direct</strong> via le code parrain et profite d'avantages exclusifs pour commencer à investir dans les meilleures conditions.
            </div>
<a            
         href="https://www.boursedirect.fr/fr/bourse/ouvrir-un-compte"
  target="_blank"
  rel="noopener noreferrer"
  style={{ display: 'block', textAlign: 'center', background: '#034065', color: '#fff', padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
>
  Ouvrir un compte Bourse Direct →
</a>
          </div>

          {/* Étapes */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 12 }}>Comment bénéficier du parrainage :</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { num: '1', texte: 'À la question "Comment nous avez-avous connu ?" → sélectionne Parrainage' },
                { num: '2', texte: `Juste en dessous rentre le code parrain : ` },
                { num: '3', texte: 'Passe ton premier ordre dans un délai de 3 mois pour bénéficer de 200€ de frais de courtage' },
              ].map(({ num, texte }) => (
                <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#034065', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6, paddingTop: 3 }}>
                    {texte}
                    {num === '2' && <span style={{ fontWeight: 700, color: '#034065', fontSize: 14 }}>2023847374</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
function PopupAmbitieux({ onClose }) {
  const t = useTheme()
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: t.bgCard, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>⚡ L'Ambitieux</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Tu es passé Premium !</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#E8EEF6', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#034065', marginBottom: 6 }}>🎁 Cadeau de bienvenue</div>
            <div style={{ fontSize: 12, color: '#034065', lineHeight: 1.6, marginBottom: 14 }}>
              J'investis avec <strong>DEGIRO</strong>, le premier courtier en ligne d'Europe. En ouvrant ton compte via le lien de parrainage, tu bénéficies d'un bon de transaction offert !
            </div>
            <a
              href="https://www.degiro.fr/parrainage/commencez-a-investir?id=40B07B83&utm_source=mgm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', background: '#034065', color: '#fff', padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            >
              Ouvrir un compte DEGIRO →
            </a>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 12 }}>Pourquoi DEGIRO ?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { num: '1', texte: "Frais de courtage parmi les plus bas d'Europe" },
                { num: '2', texte: 'Accès à plus de 50 bourses mondiales' },
                { num: '3', texte: 'Interface simple et intuitive, idéale pour débuter' },
              ].map(({ num, texte }) => (
                <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#034065', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6, paddingTop: 3 }}>{texte}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SkeletonBlock({ width = '100%', height = 12, mb = 0 }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: 4,
      background: 'rgba(0,0,0,0.06)',
      marginBottom: mb,
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Challenge() {
  const t = useTheme()
  const { showGuide, ouvrirGuide, fermerGuide } = usePageGuide()

const GUIDE_CHALLENGE = [
  {
    titre: '🔥 Collecte tes flammes',
    description: 'À chaque mois où tu investis, tu gagnes une flamme. Plus ta série est longue, plus tu es discipliné. Ne laisse pas ta flamme s\'éteindre. La régularité est la clé de la richesse sur le long terme.',
  },
  {
    titre: '🎖️ Débloque des badges',
    description: 'Chaque règle respectée, chaque cap franchi te rapporte un badge. Ils récompensent ta constance, pas la chance. Construis ta collection et prouve-toi que tu es capable.',
  },
  {
    titre: '📊 Situe-toi parmi les épargnants français',
    description: 'Vois où tu te places par rapport à la moyenne. Ce n\'est pas une compétition, c\'est une motivation pour toujours aller chercher plus haut. Fixe-toi de grands objectifs.',
  },
  {
    titre: '👥 Invite tes amis',
    description: 'Ajoute tes amis et voyez vos badges respectifs. La force du groupe est décuplée. Entourer de personnes disciplinées, motivées et qui investissent, c\'est le meilleur moyen de ne jamais flancher.',
  },
]
  const queryClient = useQueryClient()
  const [onglet, setOnglet] = useState('obtenus')
  const [checking, setChecking] = useState(true)
  const [positionOpen, setPositionOpen] = useState(false)
  const [niveauxOpen, setNiveauxOpen] = useState(null)
  const [premierPasOpen, setPremierPasOpen] = useState(false)
  const [ambitieuxOpen, setAmbitieuxOpen] = useState(false)
  const [badgesNouveaux, setBadgesNouveaux] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [photoUrl, setPhotoUrl] = useState(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data, isLoading } = useQuery({ queryKey: ['challenge'], queryFn: fetchChallengeData, refetchOnMount: true, staleTime: 0 })
  const initiale = data?.user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

 useEffect(() => {
  const loadPhoto = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      
      setPhotoUrl(user.user_metadata?.photo_url || null)
    }
  }
  loadPhoto()
}, [])

  useEffect(() => {
    if (!data) return
    const run = async () => {
      setChecking(true)
      const nb = await checkAndGrant(data.user, data.investissements, data.transactions, data.accomplissements)
      if (nb > 0) queryClient.invalidateQueries({ queryKey: ['challenge'] })
      setChecking(false)

    }
    run()
  }, [data?.user?.id])
  useEffect(() => {
  const fetchBadgesNonVus = async () => {
    if (!data) return
    const { data: profil } = await supabase
      .from('profils')
      .select('badges_non_vus')
      .eq('user_id', data.user.id)
      .maybeSingle()
    if (profil?.badges_non_vus?.length > 0) {
  setBadgesNouveaux(profil.badges_non_vus)
  setTimeout(async () => {
    await supabase
      .from('profils')
      .update({ badges_non_vus: [] })
      .eq('user_id', data.user.id)
  }, 6000)
}
  }
  fetchBadgesNonVus()
}, [data])

  const accomplissements = data?.accomplissements || []
  const investissements = data?.investissements || []
  const transactions = data?.transactions || []
  const comptes = data?.comptes || []
  const bleu = t.dark ? '#3B82F6' : '#034065'
  const streak = calcStreak(transactions)
  const totalInvesti = investissements.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0), 0)
  const slugsObtenus = new Set(accomplissements.map(a => a.slug))
  const streakMensuel = calcStreakMensuel(slugsObtenus)

  const getGradeActuel = (badge) => {
    if (!badge.evolutif) return null
    const dbAcc = accomplissements.find(a => a.slug === badge.slug)
    if (!dbAcc) return null
    if (badge.slug === 'metronome') return GRADES_METRONOME.find(g => g.niveau === dbAcc.niveau) || null
    if (badge.slug === 'cap') return GRADES_CAP.find(g => g.niveau === dbAcc.niveau) || null
    return null
  }

  const getProchainGrade = (badge) => {
    if (!badge.evolutif) return null
    const gradeActuel = getGradeActuel(badge)
    const grades = badge.grades
    if (!gradeActuel) return grades[0]
    const idx = grades.findIndex(g => g.niveau === gradeActuel.niveau)
    return idx < grades.length - 1 ? grades[idx + 1] : null
  }

  const getProgression = (badge) => {
    if (badge.slug === 'grand-saut') { const achats = transactions.filter(t => t.type === 'Achat'); return { current: achats.length > 0 ? 1 : 0, total: 1 } }
    if (badge.slug === 'architecte') { const nb = [...new Set(investissements.map(i => i.ticker))].length; return { current: Math.min(nb, 3), total: 3 } }
    if (badge.slug === 'main-de-fer') {
      const achats = transactions.filter(t => t.type === 'Achat')
      const ventes = transactions.filter(t => t.type === 'Vente')
      if (ventes.length > 0 || achats.length === 0) return { current: 0, total: 6 }
      const firstAchat = new Date(achats[0].date)
      const now = new Date()
      const mois = (now.getFullYear() - firstAchat.getFullYear()) * 12 + (now.getMonth() - firstAchat.getMonth())
      return { current: Math.min(mois, 6), total: 6 }
    }
    if (badge.slug === 'metronome') { const prochain = getProchainGrade(badge); if (!prochain) return null; return { current: Math.min(streak, prochain.mois), total: prochain.mois } }
    if (badge.slug === 'cap') { const prochain = getProchainGrade(badge); if (!prochain) return null; return { current: Math.round(totalInvesti), total: prochain.palier, currency: true } }
    return null
  }

  const badgesObtenus = TOUS_BADGES.filter(b => slugsObtenus.has(b.slug))
  const badgesADebloquer = TOUS_BADGES.filter(b => !slugsObtenus.has(b.slug))
  const badgesMensuelsObtenus = badgesObtenus.filter(b => b.categorie === 'mensuel')
  const anneesAvecBadges = [...new Set(badgesMensuelsObtenus.map(b => b.annee))].sort((a, b) => b - a)
  const badgeOuvert = niveauxOpen ? TOUS_BADGES.find(b => b.slug === niveauxOpen) : null
  const valeurActuelleAcc = badgeOuvert?.slug === 'metronome' ? streak : (badgeOuvert?.slug === 'cap' ? totalInvesti : 0)

  if (isLoading || checking) return (
  <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar page="Challenge" initiale={initiale} photoUrl={photoUrl} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, flex: 1 }}>

      {/* HEADER */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBlock width="30%" height={14} />
        <SkeletonBlock width="10%" height={32} />
      </div>

      {/* STREAK */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
        <SkeletonBlock width="20%" height={12} mb={12} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[1,2,3,4,5,6].map(i => (
            <SkeletonBlock key={i} width={36} height={36} />
          ))}
        </div>
      </div>

      {/* BADGES */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
        <SkeletonBlock width="25%" height={12} mb={16} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12 }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <SkeletonBlock width={64} height={64} />
              <SkeletonBlock width="80%" height={10} />
              <SkeletonBlock width="60%" height={8} />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Navbar page="Challenge" initiale={initiale} photoUrl={photoUrl} />
  {badgesNouveaux.length > 0 && (
  <div style={{ background: '#4CAF2E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
      🏆 Tu as débloqué {badgesNouveaux.length} nouveau{badgesNouveaux.length > 1 ? 'x' : ''} badge{badgesNouveaux.length > 1 ? 's' : ''} !
    </div>
    <button
      onClick={() => setBadgesNouveaux([])}
      style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
    >
      ✕ Fermer
    </button>
  </div>
)}    
      <PageGuide
  pageId="challenge"
  titre="Challenge"
  etapes={GUIDE_CHALLENGE}
  forceVisible={showGuide}
  onClose={fermerGuide}
/>
<button
  onClick={ouvrirGuide}
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
      <div style={{ padding: isMobile ? '16px 12px' : '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1000, margin: '0 auto', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

        {/* HEADER BLEU */}
        <div style={{ background: '#034065', borderRadius: 14, padding: isMobile ? '18px 16px' : '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Livret d'accomplissements</div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{badgesObtenus.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>badges</div>
            </div>
          </div>
        </div>

        {/* STREAK MENSUEL */}
<div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ fontSize: 32, lineHeight: 1 }}>{streakMensuel > 0 ? '🔥' : '—'}</span>
    {streakMensuel > 0 && <span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{streakMensuel}</span>}
  </div>
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
      {streakMensuel > 0 ? `${streakMensuel} mois de suite investis : ne perds plus la flamme que tu as allumée !` : 'Aucune série en cours'}
    </div>
    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
      {streakMensuel > 0 ? "Continue chaque mois pour maintenir ta série. N’oublie jamais ta discipline et tes objectifs ! GO GO " : 'Achète un ETF ce mois-ci pour démarrer ta série'}
    </div>
  </div>
</div>

        {/* BOUTON MA POSITION */}
        <button onClick={() => setPositionOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `0.5px solid ${t.border}`, background: t.bgCard, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#034065', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Voir Ma Position</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>Ta place parmi les épargnants français · INSEE 2024</div>
          </div>
          <span style={{ fontSize: 16, color: t.textMuted }}>›</span>
        </button>

        {/* ONGLETS */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['obtenus', `Mes badges (${badgesObtenus.length})`],
            ['aDebloquer', `À débloquer (${badgesADebloquer.length})`],
            ['amis', 'Amis'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setOnglet(key)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: `0.5px solid ${onglet === key ? bleu : t.border}`, background: onglet === key ? bleu : t.bgCard, color: onglet === key ? '#fff' : t.textMuted, fontSize: isMobile ? 11 : 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ONGLET MES BADGES */}
        {onglet === 'obtenus' && (
          badgesObtenus.length === 0 ? (
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
              Aucun badge obtenu pour l'instant. Commencez votre parcours !
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {badgesObtenus.filter(b => b.categorie === 'principal').length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Accomplissements</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                    {badgesObtenus.filter(b => b.categorie === 'principal').map(badge => (
                     <BadgeCard key={badge.slug} badge={badge} obtenu={true} onClickNiveaux={() => badge.slug === 'premier-pas' ? setPremierPasOpen(true) : badge.slug === 'vroum-vroum' ? setAmbitieuxOpen(true) : setNiveauxOpen(badge.slug)} gradeActuel={getGradeActuel(badge)} progression={getProgression(badge)} />
                    ))}

                  </div>
                </div>
              )}
              {badgesObtenus.filter(b => b.categorie === 'guide').length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Guide — Chapitres validés</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                    {badgesObtenus.filter(b => b.categorie === 'guide').map(badge => (
                      <BadgeCard key={badge.slug} badge={badge} obtenu={true} gradeActuel={null} progression={null} />
                    ))}
                  </div>
                </div>
              )}
              {anneesAvecBadges.map(annee => (
                <div key={annee}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>
                    Collection {annee}
                    {streakMensuel > 0 && <span style={{ fontSize: 12, color: '#FF6B35', marginLeft: 8 }}>{streakMensuel} mois de suite</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                    {badgesMensuelsObtenus.filter(b => b.annee === annee).map(badge => (
                      <BadgeCard key={badge.slug} badge={badge} obtenu={true} gradeActuel={null} progression={null} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ONGLET À DÉBLOQUER */}
        {onglet === 'aDebloquer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {badgesADebloquer.filter(b => b.categorie === 'principal').length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Accomplissements</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                  {badgesADebloquer.filter(b => b.categorie === 'principal').map(badge => (
                    <BadgeCard key={badge.slug} badge={badge} obtenu={false} gradeActuel={null} progression={getProgression(badge)} />
                  ))}
                </div>
              </div>
            )}
            {badgesADebloquer.filter(b => b.categorie === 'guide').length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Guide. Chapitres à valider</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                  {badgesADebloquer.filter(b => b.categorie === 'guide').map(badge => (
                    <BadgeCard key={badge.slug} badge={badge} obtenu={false} gradeActuel={null} progression={null} />
                  ))}
                </div>
              </div>
            )}
            {badgesADebloquer.filter(b => b.categorie === 'mensuel').length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Collection mensuelle 2026</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                  {badgesADebloquer.filter(b => b.categorie === 'mensuel').map(badge => (
                    <BadgeCard key={badge.slug} badge={badge} obtenu={false} gradeActuel={null} progression={null} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET AMIS */}
        {onglet === 'amis' && data && (
          <OngletAmis userId={data.user.id} monPseudo={data.pseudo} t={t} isMobile={isMobile} />
        )}

      </div>

      {positionOpen && <PositionModal totalInvesti={totalInvesti} comptes={comptes} onClose={() => setPositionOpen(false)} />}
      {badgeOuvert && <NiveauxModal acc={badgeOuvert} gradeActuel={getGradeActuel(badgeOuvert)} valeurActuelle={valeurActuelleAcc} onClose={() => setNiveauxOpen(null)} />}
      {premierPasOpen && <PopupPremierPas onClose={() => setPremierPasOpen(false)} />}
      {ambitieuxOpen && <PopupAmbitieux onClose={() => setAmbitieuxOpen(false)} />} 
<FooterApp />
    </div>
  )
}
