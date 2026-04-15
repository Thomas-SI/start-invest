import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'

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

const ACCOMPLISSEMENTS = [
  { slug: 'premier-pas', nom: 'Premier Pas', emoji: '🌱', message: 'Bienvenue chez Start Invest.', quete: 'S\'inscrire sur StartInvest' },
  { slug: 'grand-saut', nom: 'Le Grand Saut', emoji: '🚀', message: 'Tu n\'es plus spectateur, tu es le pilote de ton futur.', quete: 'Acheter votre premier ETF' },
  { slug: 'metronome', nom: 'Le Métronome', svgIcon: true, message: 'La magie des intérêts composés adore ta régularité. Continue !', quete: 'Investir régulièrement chaque mois', evolutif: true, grades: GRADES_METRONOME },
  { slug: 'main-de-fer', nom: 'Main de Fer', emoji: '🗿', message: 'Le calme est une compétence.', quete: '6 mois sans aucune vente' },
  { slug: 'architecte', nom: 'L\'Architecte', emoji: '🏗️', message: 'Ton patrimoine est maintenant solide et diversifié. Beau travail !', quete: 'Posséder 3 ETF différents' },
  { slug: 'cap', nom: 'Cap des X€', emoji: '💰', message: 'Le premier palier est le plus dur. La machine est lancée.', quete: 'Atteindre un palier d\'investissement', evolutif: true, grades: GRADES_CAP },
  { slug: 'vroum-vroum', nom: 'Vroum Vroum', emoji: '⚡', message: 'Je vois déjà l\'avenir.', quete: 'S\'abonner à StartInvest Premium' },
]

// Données INSEE 2024 — patrimoine financier hors immobilier
// (livrets, PEA, assurance-vie, valeurs mobilières, épargne retraite)
const PALIERS_FINANCIERS = [
  { label: 'Médiane', pct: 50, montant: 22000, couleur: '#6B7280', desc: 'La moitié des Français a moins de 22 000 € de patrimoine financier (hors immobilier). Source : INSEE 2024' },
  { label: 'Top 30%', pct: 30, montant: 45000, couleur: '#3B82F6', desc: 'Vous faites partie des 30% les mieux dotés en épargne financière en France. Source : INSEE 2024' },
  { label: 'Top 20%', pct: 20, montant: 80000, couleur: '#854F0B', desc: 'Vous faites partie des 20% les mieux dotés en épargne financière. Seuls 9,8% des Français ont un PEA. Source : INSEE 2024' },
  { label: 'Top 10%', pct: 10, montant: 175000, couleur: '#4CAF2E', desc: 'Top 10% des épargnants français. Le patrimoine financier moyen à ce niveau dépasse 175 000 €. Source : INSEE 2024' },
  { label: 'Top 5%', pct: 5, montant: 350000, couleur: '#534AB7', desc: 'Top 5% des épargnants français. Patrimoine financier exceptionnel, comparable aux hauts patrimoines. Source : INSEE 2024' },
  { label: 'Top 1%', pct: 1, montant: 900000, couleur: '#993556', desc: 'Top 1% des épargnants français. Patrimoine financier élite, au-delà de 900 000 €. Source : INSEE & Banque de France 2024' },
]

const fetchChallengeData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')
  const [accRes, invRes, txRes, comptesRes] = await Promise.all([
    supabase.from('accomplissements').select('*').eq('user_id', user.id),
    supabase.from('investissements').select('*').eq('user_id', user.id),
    supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: true }),
    supabase.from('comptes').select('*').eq('user_id', user.id),
  ])
  return { user, accomplissements: accRes.data || [], investissements: invRes.data || [], transactions: txRes.data || [], comptes: comptesRes.data || [] }
}

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

const checkAndGrant = async (user, investissements, transactions, accomplissements) => {
  const slugsObtenus = new Set(accomplissements.map(a => a.slug))
  const toInsert = []
  const toUpdate = []
  const totalInvesti = investissements.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0), 0)
  const nbEtfDifferents = [...new Set(investissements.map(i => i.ticker))].length
  const achats = transactions.filter(t => t.type === 'Achat')
  const ventes = transactions.filter(t => t.type === 'Vente')
  const streak = calcStreak(transactions)
  if (!slugsObtenus.has('premier-pas')) toInsert.push({ user_id: user.id, slug: 'premier-pas' })
  if (!slugsObtenus.has('grand-saut') && achats.length > 0) toInsert.push({ user_id: user.id, slug: 'grand-saut' })
  if (!slugsObtenus.has('architecte') && nbEtfDifferents >= 3) toInsert.push({ user_id: user.id, slug: 'architecte' })
  if (!slugsObtenus.has('main-de-fer') && ventes.length === 0 && achats.length > 0) {
    const firstAchat = new Date(achats[0].date)
    const now = new Date()
    const mois = (now.getFullYear() - firstAchat.getFullYear()) * 12 + (now.getMonth() - firstAchat.getMonth())
    if (mois >= 6) toInsert.push({ user_id: user.id, slug: 'main-de-fer' })
  }
  const gradeMetronome = [...GRADES_METRONOME].reverse().find(g => streak >= g.mois)
  if (gradeMetronome) {
    const existing = accomplissements.find(a => a.slug === 'metronome')
    if (!existing) toInsert.push({ user_id: user.id, slug: 'metronome', niveau: gradeMetronome.niveau })
    else if (existing.niveau !== gradeMetronome.niveau) toUpdate.push({ id: existing.id, niveau: gradeMetronome.niveau })
  }
  const gradeCap = [...GRADES_CAP].reverse().find(g => totalInvesti >= g.palier)
  if (gradeCap) {
    const existing = accomplissements.find(a => a.slug === 'cap')
    if (!existing) toInsert.push({ user_id: user.id, slug: 'cap', niveau: gradeCap.niveau })
    else if (existing.niveau !== gradeCap.niveau) toUpdate.push({ id: existing.id, niveau: gradeCap.niveau })
  }
  if (toInsert.length > 0) await supabase.from('accomplissements').insert(toInsert)
  for (const u of toUpdate) await supabase.from('accomplissements').update({ niveau: u.niveau }).eq('id', u.id)
  return toInsert.length + toUpdate.length
}

function MaPosition({ totalInvesti, comptes, accomplissements }) {
  const t = useTheme()
  const [palierActif, setPalierActif] = useState(null)

  // Patrimoine financier = total investi + soldes comptes (livret, PEA, CTO, ass-vie)
  const soldeComptes = comptes.reduce((acc, c) => acc + parseFloat(c.solde_actuel || c.solde || 0), 0)
  const patrimoineFinancier = Math.round(totalInvesti + soldeComptes)

  // Trouver le palier atteint
  const palierAtteint = [...PALIERS_FINANCIERS].reverse().find(p => patrimoineFinancier >= p.montant)
  const indexAtteint = palierAtteint ? PALIERS_FINANCIERS.findIndex(p => p.label === palierAtteint.label) : -1

  // Badges débloqués
  const slugsObtenus = new Set(accomplissements.map(a => a.slug))
  const badgesObtenus = ACCOMPLISSEMENTS.filter(a => slugsObtenus.has(a.slug))

  // Taille du cercle utilisateur selon patrimoine (min 60, max 120)
  const maxMontant = PALIERS_FINANCIERS[PALIERS_FINANCIERS.length - 1].montant
  const tailleUser = Math.max(60, Math.min(110, 60 + (patrimoineFinancier / maxMontant) * 50))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* CARTE PATRIMOINE */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Ton patrimoine financier estimé</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.text }}>{patrimoineFinancier.toLocaleString('fr-FR')} €</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Investissements + soldes comptes (hors immobilier)</div>
        {palierAtteint && (
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: palierAtteint.couleur + '18', border: `0.5px solid ${palierAtteint.couleur}`, borderRadius: 20, padding: '4px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: palierAtteint.couleur }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: palierAtteint.couleur }}>{palierAtteint.label} des épargnants français</span>
          </div>
        )}
      </div>

      {/* VISUALISATION BULLES */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '20px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Ta position parmi les épargnants français</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Patrimoine financier hors immobilier · Source : INSEE 2024</div>

        <div style={{ position: 'relative', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* CERCLES PALIERS — du plus grand au plus petit */}
          {[...PALIERS_FINANCIERS].reverse().map((palier, i) => {
            const idx = PALIERS_FINANCIERS.length - 1 - i
            const taille = 260 - idx * 36
            const atteint = patrimoineFinancier >= palier.montant
            const estActif = palierActif?.label === palier.label
            return (
              <div
                key={palier.label}
                onClick={() => setPalierActif(estActif ? null : palier)}
                style={{
                  position: 'absolute',
                  width: taille,
                  height: taille,
                  borderRadius: '50%',
                  border: `1.5px ${atteint ? 'solid' : 'dashed'} ${atteint ? palier.couleur : t.border}`,
                  background: atteint ? palier.couleur + '08' : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: estActif ? `0 0 0 2px ${palier.couleur}` : 'none',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  fontSize: 9,
                  fontWeight: 600,
                  color: atteint ? palier.couleur : t.textMuted,
                  background: t.bgCard,
                  padding: '2px 6px',
                  borderRadius: 10,
                  border: `0.5px solid ${atteint ? palier.couleur : t.border}`,
                  whiteSpace: 'nowrap',
                }}>
                  {palier.label}
                </div>
              </div>
            )
          })}

          {/* CERCLE UTILISATEUR AU CENTRE */}
          <div style={{
            position: 'absolute',
            width: tailleUser,
            height: tailleUser,
            borderRadius: '50%',
            background: palierAtteint ? palierAtteint.couleur + '20' : t.bgSecondary,
            border: `3px solid ${palierAtteint ? palierAtteint.couleur : '#4CAF2E'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            zIndex: 10,
            boxShadow: `0 4px 16px ${palierAtteint ? palierAtteint.couleur + '30' : 'rgba(76,175,46,0.2)'}`,
          }}>
            <div style={{ fontSize: tailleUser > 80 ? 22 : 16 }}>👤</div>
            {badgesObtenus.length > 0 && (
              <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', maxWidth: tailleUser - 16 }}>
                {badgesObtenus.slice(0, 3).map(b => (
                  <span key={b.slug} style={{ fontSize: tailleUser > 80 ? 12 : 9 }}>
                    {b.svgIcon ? '🎵' : b.emoji}
                  </span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 9, color: t.textMuted, fontWeight: 500 }}>
              {patrimoineFinancier.toLocaleString('fr-FR')} €
            </div>
          </div>
        </div>

        {/* POPUP INFO PALIER */}
        {palierActif && (
          <div style={{ background: palierActif.couleur + '12', border: `0.5px solid ${palierActif.couleur}`, borderRadius: 10, padding: '12px 14px', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: palierActif.couleur }}>{palierActif.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>≥ {palierActif.montant.toLocaleString('fr-FR')} €</span>
            </div>
            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{palierActif.desc}</div>
            <button onClick={() => setPalierActif(null)} style={{ marginTop: 8, background: 'none', border: 'none', color: t.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Fermer ✕</button>
          </div>
        )}
      </div>

      {/* LISTE PALIERS */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>Les paliers</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PALIERS_FINANCIERS.map((palier, idx) => {
            const atteint = patrimoineFinancier >= palier.montant
            const estSuivant = !atteint && (idx === 0 || patrimoineFinancier >= PALIERS_FINANCIERS[idx - 1].montant)
            return (
              <div key={palier.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: atteint ? palier.couleur + '10' : 'transparent', border: `0.5px solid ${atteint ? palier.couleur : estSuivant ? t.border : t.border}`, opacity: atteint || estSuivant ? 1 : 0.5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: atteint ? palier.couleur : 'transparent', border: `2px solid ${atteint ? palier.couleur : t.border}`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: atteint ? 600 : 400, color: atteint ? palier.couleur : t.textMuted }}>{palier.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: atteint ? palier.couleur : t.textMuted }}>{palier.montant.toLocaleString('fr-FR')} €</span>
                  </div>
                  {estSuivant && !atteint && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: palier.couleur, width: `${Math.min(Math.round((patrimoineFinancier / palier.montant) * 100), 100)}%`, transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>
                        {patrimoineFinancier.toLocaleString('fr-FR')} / {palier.montant.toLocaleString('fr-FR')} € · encore {(palier.montant - patrimoineFinancier).toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  )}
                </div>
                {atteint && <span style={{ fontSize: 14 }}>✓</span>}
                {estSuivant && !atteint && <span style={{ fontSize: 11, color: t.textMuted }}>→</span>}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default function Challenge() {
  const t = useTheme()
  const queryClient = useQueryClient()
  const [onglet, setOnglet] = useState('obtenus')
  const [checking, setChecking] = useState(true)
  const { data, isLoading } = useQuery({ queryKey: ['challenge'], queryFn: fetchChallengeData })

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

  const accomplissements = data?.accomplissements || []
  const investissements = data?.investissements || []
  const transactions = data?.transactions || []
  const comptes = data?.comptes || []
  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'
  const streak = calcStreak(transactions)
  const totalInvesti = investissements.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0), 0)
  const slugsObtenus = new Set(accomplissements.map(a => a.slug))

  const getGradeActuel = (acc) => {
    if (!acc.evolutif) return null
    const dbAcc = accomplissements.find(a => a.slug === acc.slug)
    if (!dbAcc) return null
    if (acc.slug === 'metronome') return GRADES_METRONOME.find(g => g.niveau === dbAcc.niveau) || null
    if (acc.slug === 'cap') return GRADES_CAP.find(g => g.niveau === dbAcc.niveau) || null
    return null
  }

  const getProchainGrade = (acc) => {
    if (!acc.evolutif) return null
    const gradeActuel = getGradeActuel(acc)
    const grades = acc.grades
    if (!gradeActuel) return grades[0]
    const idx = grades.findIndex(g => g.niveau === gradeActuel.niveau)
    return idx < grades.length - 1 ? grades[idx + 1] : null
  }

  const getProgression = (acc) => {
    if (acc.slug === 'grand-saut') {
      const achats = transactions.filter(t => t.type === 'Achat')
      return { current: achats.length > 0 ? 1 : 0, total: 1 }
    }
    if (acc.slug === 'architecte') {
      const nb = [...new Set(investissements.map(i => i.ticker))].length
      return { current: Math.min(nb, 3), total: 3 }
    }
    if (acc.slug === 'main-de-fer') {
      const achats = transactions.filter(t => t.type === 'Achat')
      const ventes = transactions.filter(t => t.type === 'Vente')
      if (ventes.length > 0 || achats.length === 0) return { current: 0, total: 6 }
      const firstAchat = new Date(achats[0].date)
      const now = new Date()
      const mois = (now.getFullYear() - firstAchat.getFullYear()) * 12 + (now.getMonth() - firstAchat.getMonth())
      return { current: Math.min(mois, 6), total: 6 }
    }
    if (acc.slug === 'metronome') {
      const prochain = getProchainGrade(acc)
      if (!prochain) return null
      return { current: Math.min(streak, prochain.mois), total: prochain.mois }
    }
    if (acc.slug === 'cap') {
      const prochain = getProchainGrade(acc)
      if (!prochain) return null
      return { current: Math.round(totalInvesti), total: prochain.palier, currency: true }
    }
    return null
  }

  const obtenus = ACCOMPLISSEMENTS.filter(a => slugsObtenus.has(a.slug))
  const aDebloquer = ACCOMPLISSEMENTS.filter(a => !slugsObtenus.has(a.slug))

  if (isLoading || checking) return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Challenge" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: 13 }}>Vérification des accomplissements...</div>
    </div>
  )

  const BadgeIcon = ({ acc, size = 60 }) => {
    if (acc.svgIcon) return (
      <img src={METRONOME_URL} alt="métronome" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    )
    return <span style={{ fontSize: size * 0.45 }}>{acc.emoji}</span>
  }

  const BadgeCard = ({ acc, obtenu }) => {
    const gradeActuel = obtenu ? getGradeActuel(acc) : null
    const prochain = getProchainGrade(acc)
    const prog = getProgression(acc)
    const pct = prog ? Math.min(Math.round((prog.current / prog.total) * 100), 100) : 0
    const estMaxLevel = obtenu && acc.evolutif && !prochain

    return (
      <div style={{ background: obtenu ? (t.dark ? '#0F1F0F' : '#F6FFF3') : t.bgCard, border: `0.5px solid ${obtenu ? '#4CAF2E' : t.border}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: obtenu ? (gradeActuel ? gradeActuel.niveauBg : '#EAF6E4') : t.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: obtenu ? `2px solid ${gradeActuel ? gradeActuel.niveauColor : '#4CAF2E'}` : `1.5px dashed ${t.border}`, overflow: 'hidden' }}>
          {obtenu ? <BadgeIcon acc={acc} size={60} /> : <span style={{ fontSize: 22, color: t.textMuted }}>?</span>}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: obtenu ? t.text : t.textMuted, lineHeight: 1.3 }}>{acc.nom}</div>
        {obtenu && gradeActuel && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: gradeActuel.niveauBg, color: gradeActuel.niveauColor }}>{gradeActuel.niveau}</span>}
        {obtenu && !gradeActuel && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: '#EAF6E4', color: '#27500A' }}>Obtenu</span>}
        {obtenu && <div style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.4 }}>{acc.message}</div>}
        {obtenu && acc.evolutif && prochain && prog && (
          <>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Prochain : <span style={{ fontWeight: 500, color: prochain.niveauColor }}>{prochain.niveau}</span></div>
            <div style={{ width: '100%', background: t.bgSecondary, borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: prochain.niveauColor, width: `${pct}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 10, color: t.textMuted }}>
              {prog.currency ? `${prog.current.toLocaleString('fr-FR')} / ${prog.total.toLocaleString('fr-FR')} €` : `${prog.current} / ${prog.total} mois`}
            </div>
          </>
        )}
        {obtenu && acc.evolutif && estMaxLevel && <div style={{ fontSize: 10, color: '#993556', background: '#FBEAF0', padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>Niveau max !</div>}
        {!obtenu && prog && (
          <>
            <div style={{ fontSize: 10, color: t.textMuted }}>{acc.quete}</div>
            <div style={{ width: '100%', background: t.bgSecondary, borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: '#4CAF2E', width: `${pct}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 10, color: t.textMuted }}>
              {prog.currency ? `${prog.current.toLocaleString('fr-FR')} / ${prog.total.toLocaleString('fr-FR')} €` : `${prog.current} / ${prog.total}`}
            </div>
          </>
        )}
        {!obtenu && !prog && <div style={{ fontSize: 10, color: t.textMuted }}>{acc.quete}</div>}
      </div>
    )
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Challenge" />
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ background: bleu, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 2 }}>Livret d'accomplissements</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{obtenus.length} / {ACCOMPLISSEMENTS.length} débloqués</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{obtenus.length}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>badges</div>
          </div>
        </div>

        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: t.textMuted }}>
            <span>Progression globale</span>
            <span style={{ fontWeight: 500, color: '#4CAF2E' }}>{Math.round((obtenus.length / ACCOMPLISSEMENTS.length) * 100)}%</span>
          </div>
          <div style={{ background: t.bgSecondary, borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: '#4CAF2E', width: `${Math.round((obtenus.length / ACCOMPLISSEMENTS.length) * 100)}%`, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* ONGLETS */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['obtenus', `Mes badges (${obtenus.length})`],
            ['avenirs', `À débloquer (${aDebloquer.length})`],
            ['position', 'Ma position'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setOnglet(key)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: `0.5px solid ${onglet === key ? bleu : t.border}`, background: onglet === key ? bleu : t.bgCard, color: onglet === key ? '#fff' : t.textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {onglet === 'obtenus' && (
          obtenus.length === 0 ? (
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
              Aucun badge obtenu pour l'instant. Commencez votre parcours !
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {obtenus.map(acc => <BadgeCard key={acc.slug} acc={acc} obtenu={true} />)}
            </div>
          )
        )}

        {onglet === 'avenirs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {aDebloquer.map(acc => <BadgeCard key={acc.slug} acc={acc} obtenu={false} />)}
          </div>
        )}

        {onglet === 'position' && (
          <MaPosition
            totalInvesti={totalInvesti}
            comptes={comptes}
            accomplissements={accomplissements}
          />
        )}

      </div>
    </div>
  )
}