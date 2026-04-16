import { useState, useEffect, useRef, useCallback } from 'react'
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

const PALIERS = [
  { label: 'Top 30%', montant: 45000, couleur: '#3B82F6', desc: '30% des Français les mieux dotés en épargne financière hors immobilier. Source : INSEE 2024' },
  { label: 'Top 20%', montant: 80000, couleur: '#854F0B', desc: 'Top 20% des épargnants. Seuls 9,8% des Français détiennent un PEA. Source : INSEE 2024' },
  { label: 'Top 15%', montant: 110000, couleur: '#BA7517', desc: 'Top 15% des épargnants français en patrimoine financier. Source : INSEE 2024' },
  { label: 'Top 10%', montant: 175000, couleur: '#4CAF2E', desc: 'Top 10% des épargnants français. Patrimoine financier moyen > 175 000 €. Source : INSEE 2024' },
  { label: 'Top 5%', montant: 350000, couleur: '#534AB7', desc: 'Top 5% des épargnants. Patrimoine financier exceptionnel. Source : INSEE 2024' },
  { label: 'Top 1%', montant: 900000, couleur: '#993556', desc: 'Top 1% des épargnants français. Au-delà de 900 000 € de patrimoine financier. Source : INSEE & Banque de France 2024' },
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

function PositionModal({ totalInvesti, comptes, onClose }) {
  const t = useTheme()
  const canvasRef = useRef(null)
  const scaleRef = useRef(1)
  const [scale, setScale] = useState(1)
  const [palierInfo, setPalierInfo] = useState(null)
  const [showPaliers, setShowPaliers] = useState(false)

  const soldeComptes = comptes.reduce((acc, c) => acc + parseFloat(c.solde_actuel || c.solde || 0), 0)
  const patrimoine = Math.round(totalInvesti + soldeComptes)

  const paliersAtteints = PALIERS.filter(p => patrimoine >= p.montant)
  const paliersAVenir = PALIERS.filter(p => patrimoine < p.montant)
  const palierAtteint = paliersAtteints[paliersAtteints.length - 1] || null
  const palierSuivant = paliersAVenir[0] || null

  // Zoom moins sensible : delta 0.08
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    const next = Math.max(0.3, Math.min(3.5, scaleRef.current + delta))
    scaleRef.current = next
    setScale(next)
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const BASE_USER = 60
  const BASE_STEP = 70
  const rUser = BASE_USER * scale
  const extRayons = paliersAVenir.map((_, i) => (BASE_USER + BASE_STEP * (i + 1)) * scale)
  const intRayons = [...paliersAtteints].reverse().map((_, i) => {
    const r = (BASE_USER - BASE_STEP * 0.5 * (i + 1)) * scale
    return Math.max(r, 4)
  })

  const W = 400
  const H = 360
  const cx = W / 2
  const cy = H / 2

  const couleurUser = palierAtteint ? palierAtteint.couleur : '#4CAF2E'

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - cx
    const y = e.clientY - rect.top - cy
    const dist = Math.sqrt(x * x + y * y)

    for (let i = 0; i < paliersAVenir.length; i++) {
      const r = extRayons[i]
      if (r < 10 || r > W) continue
      const prev = i === 0 ? rUser : extRayons[i - 1]
      if (dist >= prev - 8 && dist <= r + 8) {
        setPalierInfo(palierInfo?.label === paliersAVenir[i].label ? null : paliersAVenir[i])
        return
      }
    }

    const reversedAtteints = [...paliersAtteints].reverse()
    for (let i = 0; i < reversedAtteints.length; i++) {
      const r = intRayons[i]
      if (r < 6) continue
      const prev = i === 0 ? 0 : intRayons[i - 1]
      if (dist >= prev && dist <= r + 6) {
        setPalierInfo(palierInfo?.label === reversedAtteints[i].label ? null : reversedAtteints[i])
        return
      }
    }

    setPalierInfo(null)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 999, background: t.bgCard, borderRadius: 20,
        width: 440, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit', overflow: 'hidden'
      }}>

        {/* HEADER fixe */}
        <div style={{ padding: '18px 20px 14px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Ma position</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Patrimoine financier hors immobilier · INSEE 2024</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textMuted, lineHeight: 1, padding: 0 }}>✕</button>
        </div>

        {/* PATRIMOINE fixe */}
        <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{patrimoine.toLocaleString('fr-FR')} €</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Investissements + comptes</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {palierAtteint ? (
              <div style={{ fontSize: 11, fontWeight: 600, color: palierAtteint.couleur, background: palierAtteint.couleur + '15', padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${palierAtteint.couleur}` }}>{palierAtteint.label}</div>
            ) : (
              <div style={{ fontSize: 11, color: t.textMuted }}>Aucun palier atteint</div>
            )}
            {palierSuivant && (
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>
                Prochain : <span style={{ color: palierSuivant.couleur, fontWeight: 500 }}>{palierSuivant.label}</span> −{(palierSuivant.montant - patrimoine).toLocaleString('fr-FR')} €
              </div>
            )}
          </div>
        </div>

        {/* ZONE SCROLLABLE */}
        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* CANVAS */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ position: 'relative', width: W, height: H, margin: '0 auto', cursor: 'crosshair', userSelect: 'none' }}
          >
            <svg width={W} height={H} style={{ position: 'absolute', top: 0, left: 0 }}>
              {[...Array(9)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 45} x2={W} y2={i * 45} stroke={t.dark ? '#fff' : '#000'} strokeWidth="0.5" opacity="0.04" />
              ))}
              {[...Array(10)].map((_, i) => (
                <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2={H} stroke={t.dark ? '#fff' : '#000'} strokeWidth="0.5" opacity="0.04" />
              ))}

              {/* Cercles extérieurs */}
              {paliersAVenir.map((palier, i) => {
                const r = extRayons[i]
                if (r < 10 || r > W * 1.2) return null
                const estActif = palierInfo?.label === palier.label
                return (
                  <g key={palier.label}>
                    <circle cx={cx} cy={cy} r={r} fill={estActif ? palier.couleur + '08' : 'none'} stroke={palier.couleur} strokeWidth={estActif ? 2 : 1.5} strokeDasharray="6 4" opacity={0.7} />
                    {r > 30 && r < W * 0.9 && (
                      <text x={cx} y={cy - r + 14} textAnchor="middle" fontSize="9" fontWeight="600" fill={palier.couleur} opacity={0.9}>
                        {palier.label} · {palier.montant.toLocaleString('fr-FR')} €
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Cercle utilisateur */}
              <circle cx={cx} cy={cy} r={rUser} fill={couleurUser + '18'} stroke={couleurUser} strokeWidth="2.5" />

              {/* Cercles intérieurs */}
              {[...paliersAtteints].reverse().map((palier, i) => {
                const r = intRayons[i]
                if (r < 6 || r >= rUser - 2) return null
                const estActif = palierInfo?.label === palier.label
                return (
                  <g key={palier.label}>
                    <circle cx={cx} cy={cy} r={r} fill={palier.couleur + '20'} stroke={palier.couleur} strokeWidth={estActif ? 2 : 1.5} opacity={0.85} />
                    {r > 20 && (
                      <text x={cx} y={cy - r + 12} textAnchor="middle" fontSize="8" fontWeight="600" fill={palier.couleur}>
                        {palier.label}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Coupure haut du cercle user pour "Vous" */}
              <line x1={cx - rUser * 0.45} y1={cy - rUser + 1} x2={cx + rUser * 0.45} y2={cy - rUser + 1} stroke={t.bgCard} strokeWidth="14" />
              <text x={cx} y={cy - rUser + 5} textAnchor="middle" fontSize="10" fontWeight="700" fill={couleurUser}>Vous</text>

              {/* Patrimoine + palier au centre */}
              <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={t.dark ? '#fff' : '#1B2E4B'}>
                {patrimoine.toLocaleString('fr-FR')} €
              </text>
              {palierAtteint && (
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill={palierAtteint.couleur} fontWeight="500">
                  {palierAtteint.label}
                </text>
              )}
            </svg>
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: t.textMuted, padding: '2px 0 10px' }}>
            Scroll pour zoomer · Clique sur un cercle pour les détails
          </div>

          {/* POPUP PALIER */}
          {palierInfo && (
            <div style={{ margin: '0 16px 12px', background: palierInfo.couleur + '12', border: `0.5px solid ${palierInfo.couleur}`, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: palierInfo.couleur }}>{palierInfo.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>≥ {palierInfo.montant.toLocaleString('fr-FR')} €</span>
              </div>
              <div style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.5 }}>{palierInfo.desc}</div>
              {patrimoine < palierInfo.montant && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: palierInfo.couleur, width: `${Math.min(100, Math.round((patrimoine / palierInfo.montant) * 100))}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>encore {(palierInfo.montant - patrimoine).toLocaleString('fr-FR')} €</div>
                </div>
              )}
              <button onClick={() => setPalierInfo(null)} style={{ marginTop: 6, background: 'none', border: 'none', color: t.textMuted, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Fermer ✕</button>
            </div>
          )}

          {/* BOUTON AFFICHER/MASQUER + LISTE */}
          <div style={{ padding: '0 16px 20px' }}>
            <button
              onClick={() => setShowPaliers(p => !p)}
              style={{ width: '100%', padding: '9px', borderRadius: 9, border: `0.5px solid ${t.border}`, background: t.bgSecondary, color: t.text, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
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

export default function Challenge() {
  const t = useTheme()
  const queryClient = useQueryClient()
  const [onglet, setOnglet] = useState('obtenus')
  const [checking, setChecking] = useState(true)
  const [positionOpen, setPositionOpen] = useState(false)
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

        <button
          onClick={() => setPositionOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `0.5px solid ${t.border}`, background: t.bgCard, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1B2E4B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Voir Ma Position</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>Ta place parmi les épargnants français · INSEE 2024</div>
          </div>
          <span style={{ fontSize: 16, color: t.textMuted }}>›</span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['obtenus', `Mes badges (${obtenus.length})`],
            ['avenirs', `À débloquer (${aDebloquer.length})`],
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

      </div>

      {positionOpen && (
        <PositionModal
          totalInvesti={totalInvesti}
          comptes={comptes}
          onClose={() => setPositionOpen(false)}
        />
      )}
    </div>
  )
}