import { supabase } from './supabase'

const GRADES_CAP = [
  { slug: 'cap-bronze', palier: 100, niveau: 'Bronze' },
  { slug: 'cap-argent', palier: 500, niveau: 'Argent' },
  { slug: 'cap-or', palier: 1000, niveau: 'Or' },
  { slug: 'cap-platine', palier: 2000, niveau: 'Platine' },
  { slug: 'cap-epique', palier: 5000, niveau: 'Épique' },
  { slug: 'cap-legendaire', palier: 10000, niveau: 'Légendaire' },
]

const GRADES_METRONOME = [
  { slug: 'metronome-bronze', mois: 3, niveau: 'Bronze' },
  { slug: 'metronome-argent', mois: 6, niveau: 'Argent' },
  { slug: 'metronome-or', mois: 12, niveau: 'Or' },
  { slug: 'metronome-platine', mois: 18, niveau: 'Platine' },
]

const BADGES_MENSUELS_2026 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({
  slug: `mois-2026-${String(m).padStart(2, '0')}`,
  annee: 2026,
  mois: m,
}))

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

export const checkAndGrant = async (user, investissements, transactions, accomplissements) => {
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
  if (!slugsObtenus.has('vroum-vroum')) {
  const { data: profil } = await supabase.from('profils').select('id').eq('user_id', user.id).maybeSingle()
  if (profil) {
    const { data: abo } = await supabase.from('abonnements').select('statut').eq('user_id', profil.id).maybeSingle()
    if (abo?.statut === 'actif' || abo?.statut === 'trialing') {
      toInsert.push({ user_id: user.id, slug: 'vroum-vroum' })
    }
  }
}
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
  for (const badge of BADGES_MENSUELS_2026) {
    if (slugsObtenus.has(badge.slug)) continue
    const moisStr = `${badge.annee}-${String(badge.mois).padStart(2, '0')}`
    const achatCeMois = achats.some(t => t.date.substring(0, 7) === moisStr)
    if (achatCeMois) toInsert.push({ user_id: user.id, slug: badge.slug })
  }

  if (toInsert.length > 0) await supabase.from('accomplissements').insert(toInsert)
  for (const u of toUpdate) await supabase.from('accomplissements').update({ niveau: u.niveau }).eq('id', u.id)

  // Mettre à jour badges_non_vus
  if (toInsert.length > 0) {
    const { data: profil } = await supabase
      .from('profils')
      .select('badges_non_vus')
      .eq('user_id', user.id)
      .maybeSingle()
    const badgesNonVus = profil?.badges_non_vus ?? []
    const newSlugs = toInsert.map(b => b.slug)
    await supabase
      .from('profils')
      .update({ badges_non_vus: [...badgesNonVus, ...newSlugs] })
      .eq('user_id', user.id)
  }

  return toInsert.length + toUpdate.length
}