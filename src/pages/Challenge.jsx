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

// Index 0 = le plus commun, index 5 = le plus rare
// Vue initiale : on voit seulement notre position + le palier suivant
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

function MaPosition({ totalInvesti, comptes }) {
  const t = useTheme()
  const [zoomLevel, setZoomLevel] = useState(0)
  // zoomLevel = 0 → vue initiale (notre cercle + 1 palier au-dessus)
  // zoomLevel < 0 → zoom IN (on voit les paliers en dessous dans notre cercle)
  // zoomLevel > 0 → dézoom (on voit les paliers au-dessus autour de nous)
  const [palierInfo, setPalierInfo] = useState(null)

  const soldeComptes = comptes.reduce((acc, c) => acc + parseFloat(c.solde_actuel || c.solde || 0), 0)
  const patrimoine = Math.round(totalInvesti + soldeComptes)

  // Palier juste au-dessus de l'user (le prochain à franchir)
  const indexSuivant = PALIERS.findIndex(p => patrimoine < p.montant)
  // -1 si au-dessus de tout, sinon index du prochain palier
  const indexProchain = indexSuivant === -1 ? PALIERS.length : indexSuivant
  // Paliers déjà franchis
  const paliersAtteints = PALIERS.filter(p => patrimoine >= p.montant)
  // Paliers pas encore atteints
  const paliersAVenir = PALIERS.filter(p => patrimoine < p.montant)

  const palierAtteint = paliersAtteints[paliersAtteints.length - 1] || null
  const palierSuivant = paliersAVenir[0] || null

  // Vue initiale (zoom=0): notre cercle user au centre, cercle du palier suivant autour
  // Zoom in (zoom<0): on voit les paliers franchis DANS notre cercle, de plus en plus petits vers le centre
  // Dézoom (zoom>0): on voit les paliers à venir AUTOUR de nous, de plus en plus grands

  // Rayons des cercles extérieurs (paliers à venir visibles)
  const RAYONS_EXT = [110, 160, 210, 260] // px
  // Rayons des cercles intérieurs (paliers franchis visibles dans notre cercle)
  const RAYONS_INT = [55, 38, 26, 16] // px

  // Combien de paliers extérieurs montrer selon dézoom
  const nbExt = Math.min(zoomLevel > 0 ? zoomLevel + 1 : 1, paliersAVenir.length, 4)
  // Combien de paliers intérieurs montrer selon zoom
  const nbInt = Math.min(zoomLevel < 0 ? Math.abs(zoomLevel) : 0, paliersAtteints.length, 4)

  // Vue initiale: 1 cercle extérieur (le prochain palier) + notre cercle
  const paliersExtVisibles = paliersAVenir.slice(0, nbExt)
  const paliersIntVisibles = [...paliersAtteints].reverse().slice(0, nbInt)

  const canZoomIn = zoomLevel > -(paliersAtteints.length)
  const canZoomOut = zoomLevel < paliersAVenir.length

  // Progression vers le palier suivant
  const progPct = palierSuivant
    ? Math.min(100, Math.round((patrimoine / palierSuivant.montant) * 100))
    : 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* CARTE PATRIMOINE */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Patrimoine financier estimé</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: t.text }}>{patrimoine.toLocaleString('fr-FR')} €</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, marginBottom: 10 }}>Investissements + soldes comptes · hors immobilier</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {palierAtteint ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: palierAtteint.couleur + '18', border: `0.5px solid ${palierAtteint.couleur}`, borderRadius: 20, padding: '4px 12px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: palierAtteint.couleur }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: palierAtteint.couleur }}>{palierAtteint.label} des épargnants</span>
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bgSecondary, borderRadius: 20, padding: '4px 12px' }}>
              <span style={{ fontSize: 11, color: t.textMuted }}>En dessous des paliers</span>
            </div>
          )}
          {palierSuivant && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bgSecondary, borderRadius: 20, padding: '4px 12px' }}>
              <span style={{ fontSize: 11, color: t.textMuted }}>Prochain :</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: palierSuivant.couleur }}>{palierSuivant.label}</span>
              <span style={{ fontSize: 11, color: t.textMuted }}>−{(palierSuivant.montant - patrimoine).toLocaleString('fr-FR')} €</span>
            </div>
          )}
        </div>
        {palierSuivant && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted, marginBottom: 5 }}>
              <span>Vers {palierSuivant.label}</span>
              <span>{progPct}%</span>
            </div>
            <div style={{ background: t.bgSecondary, borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: palierSuivant.couleur, width: `${progPct}%`, transition: 'width 0.5s' }} />
            </div>
          </div>
        )}
      </div>

      {/* VISUALISATION */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, overflow: 'hidden' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `0.5px solid ${t.border}` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Ta position</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>
              {zoomLevel === 0 && 'Vue normale — palier suivant'}
              {zoomLevel > 0 && `Dézoom · ${zoomLevel} palier${zoomLevel > 1 ? 's' : ''} au-dessus visible${zoomLevel > 1 ? 's' : ''}`}
              {zoomLevel < 0 && `Zoom · ${Math.abs(zoomLevel)} palier${Math.abs(zoomLevel) > 1 ? 's' : ''} franchi${Math.abs(zoomLevel) > 1 ? 's' : ''} visible${Math.abs(zoomLevel) > 1 ? 's' : ''}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => { setZoomLevel(z => z - 1); setPalierInfo(null) }}
              disabled={!canZoomIn}
              title="Zoom — voir les paliers franchis à l'intérieur"
              style={{ width: 34, height: 34, borderRadius: 9, border: `0.5px solid ${t.border}`, background: canZoomIn ? t.bgSecondary : t.bg, color: canZoomIn ? t.text : t.textMuted, fontSize: 18, cursor: canZoomIn ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              +
            </button>
            <button
              onClick={() => { setZoomLevel(z => z + 1); setPalierInfo(null) }}
              disabled={!canZoomOut}
              title="Dézoom — voir les paliers à venir autour"
              style={{ width: 34, height: 34, borderRadius: 9, border: `0.5px solid ${t.border}`, background: canZoomOut ? t.bgSecondary : t.bg, color: canZoomOut ? t.text : t.textMuted, fontSize: 18, cursor: canZoomOut ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              −
            </button>
          </div>
        </div>

        {/* CANVAS */}
        <div style={{ position: 'relative', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: t.dark ? '#0A0F0A' : '#F6FBF6' }}>

          {/* GRILLE FOND */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
            {[...Array(10)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="100%" y2={i * 40} stroke={t.dark ? '#fff' : '#000'} strokeWidth="1" />)}
            {[...Array(14)].map((_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke={t.dark ? '#fff' : '#000'} strokeWidth="1" />)}
          </svg>

          {/* CERCLES EXTÉRIEURS — paliers à venir, du plus proche au plus loin */}
          {paliersExtVisibles.map((palier, idx) => {
            const rayon = RAYONS_EXT[idx]
            const estActif = palierInfo?.label === palier.label
            return (
              <div
                key={palier.label}
                onClick={() => setPalierInfo(estActif ? null : palier)}
                style={{
                  position: 'absolute',
                  width: rayon * 2,
                  height: rayon * 2,
                  borderRadius: '50%',
                  border: `2px dashed ${palier.couleur}70`,
                  background: estActif ? palier.couleur + '08' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: estActif ? `0 0 0 2px ${palier.couleur}60` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  zIndex: 4 - idx,
                }}
              >
                <div style={{
                  marginTop: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  color: palier.couleur,
                  background: (t.dark ? '#0A0F0A' : '#F6FBF6') + 'ee',
                  padding: '2px 8px',
                  borderRadius: 10,
                  border: `0.5px solid ${palier.couleur}50`,
                  whiteSpace: 'nowrap',
                }}>
                  {palier.label} · {palier.montant.toLocaleString('fr-FR')} €
                </div>
              </div>
            )
          })}

          {/* CERCLE UTILISATEUR */}
          <div style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: palierAtteint
              ? `radial-gradient(circle, ${palierAtteint.couleur}20 0%, ${palierAtteint.couleur}08 100%)`
              : `radial-gradient(circle, #4CAF2E20 0%, #4CAF2E08 100%)`,
            border: `3px solid ${palierAtteint ? palierAtteint.couleur : '#4CAF2E'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: `0 0 0 6px ${palierAtteint ? palierAtteint.couleur + '15' : '#4CAF2E15'}, 0 8px 32px rgba(0,0,0,0.2)`,
            transition: 'all 0.4s',
            overflow: 'hidden',
          }}>

            {/* CERCLES INTÉRIEURS — paliers franchis, de plus en plus petits vers le centre */}
            {paliersIntVisibles.map((palier, idx) => {
              const rayon = RAYONS_INT[idx]
              const estActif = palierInfo?.label === palier.label
              return (
                <div
                  key={palier.label}
                  onClick={(e) => { e.stopPropagation(); setPalierInfo(estActif ? null : palier) }}
                  style={{
                    position: 'absolute',
                    width: rayon * 2,
                    height: rayon * 2,
                    borderRadius: '50%',
                    border: `1.5px solid ${palier.couleur}`,
                    background: palier.couleur + '25',
                    cursor: 'pointer',
                    transition: 'all 0.4s',
                    zIndex: 10 + idx,
                    boxShadow: estActif ? `0 0 0 2px ${palier.couleur}` : 'none',
                  }}
                />
              )
            })}

            {/* POINT CENTRAL */}
            <div style={{
              position: 'absolute',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: palierAtteint ? palierAtteint.couleur : '#4CAF2E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: `0 2px 8px ${palierAtteint ? palierAtteint.couleur + '60' : '#4CAF2E60'}`,
            }}>
              <span style={{ fontSize: 14 }}>👤</span>
            </div>
          </div>

          {/* PATRIMOINE SOUS LE CERCLE */}
          <div style={{
            position: 'absolute',
            top: 'calc(50% + 58px)',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            fontWeight: 700,
            color: palierAtteint ? palierAtteint.couleur : '#4CAF2E',
            background: (t.dark ? '#0A0F0A' : '#F6FBF6') + 'ee',
            padding: '3px 10px',
            borderRadius: 10,
            border: `0.5px solid ${palierAtteint ? palierAtteint.couleur + '60' : '#4CAF2E60'}`,
            whiteSpace: 'nowrap',
            zIndex: 15,
          }}>
            {patrimoine.toLocaleString('fr-FR')} €
            {palierAtteint && <span style={{ fontWeight: 400, marginLeft: 4 }}>· {palierAtteint.label}</span>}
          </div>

          {/* INDICATION ZOOM */}
          {zoomLevel === 0 && paliersAtteints.length > 0 && (
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: t.textMuted, whiteSpace: 'nowrap' }}>
              + pour voir tes paliers franchis à l'intérieur
            </div>
          )}
          {zoomLevel === 0 && paliersAVenir.length > 1 && (
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: t.textMuted, whiteSpace: 'nowrap' }}>
              − pour voir les paliers suivants autour
            </div>
          )}
        </div>

        {/* POPUP INFO */}
        {palierInfo && (
          <div style={{ margin: '0 16px 16px', background: palierInfo.couleur + '12', border: `0.5px solid ${palierInfo.couleur}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: palierInfo.couleur }}>{palierInfo.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>≥ {palierInfo.montant.toLocaleString('fr-FR')} €</span>
            </div>
            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{palierInfo.desc}</div>
            {patrimoine < palierInfo.montant && (
              <div style={{ marginTop: 8 }}>
                <div style={{ background: t.bgSecondary, borderRadius: 4, height: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: palierInfo.couleur, width: `${Math.min(100, Math.round((patrimoine / palierInfo.montant) * 100))}%` }} />
                </div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>
                  encore {(palierInfo.montant - patrimoine).toLocaleString('fr-FR')} € pour atteindre ce palier
                </div>
              </div>
            )}
            <button onClick={() => setPalierInfo(null)} style={{ marginTop: 8, background: 'none', border: 'none', color: t.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Fermer ✕</button>
          </div>
        )}

        {/* LÉGENDE */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '10px 16px', borderTop: `0.5px solid ${t.border}`, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 0, borderTop: '2px dashed #6B7280' }} />
            <span style={{ fontSize: 10, color: t.textMuted }}>Palier à atteindre</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4CAF2E30', border: '1.5px solid #4CAF2E' }} />
            <span style={{ fontSize: 10, color: t.textMuted }}>Palier franchi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>+ zoom · − dézoom</span>
          </div>
        </div>
      </div>

      {/* LISTE */}
      <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>Tous les paliers</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...PALIERS].reverse().map((palier) => {
            const atteint = patrimoine >= palier.montant
            const realIdx = PALIERS.findIndex(p => p.label === palier.label)
            const estSuivant = !atteint && (realIdx === 0 || patrimoine >= PALIERS[realIdx - 1]?.montant)
            return (
              <div key={palier.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: atteint ? palier.couleur + '10' : 'transparent', border: `0.5px solid ${atteint ? palier.couleur : t.border}`, opacity: atteint || estSuivant ? 1 : 0.4 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: atteint ? palier.couleur : 'transparent', border: `2px solid ${atteint ? palier.couleur : t.border}`, flexShrink: 0 }} />
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
                      <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>
                        encore {(palier.montant - patrimoine).toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  )}
                </div>
                {atteint && <span style={{ fontSize: 12, color: palier.couleur }}>✓</span>}
                {estSuivant && <span style={{ fontSize: 10, color: t.textMuted }}>→</span>}
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
          />
        )}

      </div>
    </div>
  )
}