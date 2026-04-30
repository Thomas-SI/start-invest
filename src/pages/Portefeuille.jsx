import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import { usePremium } from '../lib/usePremium'
import PremiumModal from '../components/PremiumModal'
import PageGuide from '../components/PageGuide'
import { usePageGuide } from '../lib/usePageGuide'
import { useNavigate } from 'react-router-dom'

const COMPTES_PREDEFINIS = [
  { nom: 'Livret A', type: 'sécurité', disponibilite: 'Immédiate' },
  { nom: 'LDDS', type: 'sécurité', disponibilite: 'Immédiate' },
  { nom: 'LEP', type: 'sécurité', disponibilite: 'Immédiate' },
  { nom: 'CEL', type: 'immobilier', disponibilite: 'Quelques jours' },
  { nom: 'PEA', type: 'investissement', disponibilite: 'Bloqué (5 ans)' },
  { nom: 'CTO', type: 'investissement', disponibilite: 'Quelques jours' },
  { nom: 'Assurance-vie', type: 'investissement', disponibilite: 'Quelques jours' },
  { nom: 'Autre', type: 'autre', disponibilite: 'Immédiate' },
]

const COMPTES_DEFAULT = [
  { nom: 'Livret A', type: 'sécurité', disponibilite: 'Immédiate', solde: 0, objectif: 0 },
  { nom: 'PEA', type: 'investissement', disponibilite: 'Bloqué (5 ans)', solde: 0, objectif: 0 },
  { nom: 'Assurance-vie', type: 'investissement', disponibilite: 'Quelques jours', solde: 0, objectif: 0 },
]

const VIREMENTS_DEFAULT = [
  { destination: 'Sécurité (Matelas)', compte: 'Livret A', pourcentage: 30, ordre: 0, checked: false, checked_date: null },
  { destination: 'Projets (voyages, vacances...)', compte: 'Livret A', pourcentage: 20, ordre: 1, checked: false, checked_date: null },
  { destination: 'Investissement', compte: 'PEA', pourcentage: 50, ordre: 2, checked: false, checked_date: null },
]

const TYPES_DISPONIBILITE = {
  'sécurité': { color: '#4CAF2E' },
  'investissement': { color: '#034065' },
  'immobilier': { color: '#BA7517' },
  'autre': { color: '#9CA3AF' },
}

const COULEURS = ['#034065', '#4CAF2E', '#BA7517', '#3B82F6', '#E24B4A', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899']

const fetchPortefeuilleData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')
  const [finRes, depRes, echRes, comptesRes, virementsRes, prefRes] = await Promise.all([
    supabase.from('finances').select('*').eq('user_id', user.id).single(),
    supabase.from('depenses').select('*').eq('user_id', user.id),
    supabase.from('echeances').select('*').eq('user_id', user.id),
    supabase.from('comptes').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('virements').select('*').eq('user_id', user.id).order('ordre', { ascending: true }),
    supabase.from('profils').select('nb_mois_matelas').eq('user_id', user.id).single(),
  ])
  const fin = finRes.data
  let depensesFixes = 0, investissable = 0
  if (fin) {
    const dep = depRes.data || []
    const totalDepFixes = dep.filter(d => d.type === 'fixes').reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
    const totalDep = dep.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
    const totalEch = (echRes.data || []).reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0)
    const totalRev = (fin.revenus || 0) + (fin.autre_revenu || 0)
    depensesFixes = Math.round(totalDepFixes)
    investissable = Math.round(totalRev - totalDep - totalEch)
  }
  return {
    user,
    comptes: comptesRes.data?.length > 0 ? comptesRes.data : COMPTES_DEFAULT,
    virements: virementsRes.data?.length > 0 ? virementsRes.data : VIREMENTS_DEFAULT,
    depensesFixes,
    investissable,
  }
}

export default function Portefeuille() {
  const t = useTheme()
  const navigate = useNavigate()
  const { showGuide, ouvrirGuide, fermerGuide } = usePageGuide()

const GUIDE_PORTEFEUILLE = [
  {
    titre: '🛡️ Définis ton matelas de sécurité',
    description: 'Choisis entre 3 et 12 mois de dépenses fixes selon ton goût du risque. C\'est ton filet de sécurité — il ne s\'investit jamais. Une fois défini, l\'app t\'indique si tu l\'as atteint ou non.',
  },
  {
    titre: '💳 Ajoute tes comptes',
    description: 'Livret A, PEA, CTO, assurance-vie... Ajoute tous tes comptes pour visualiser la répartition de ton patrimoine en un coup d\'œil.',
  },
  {
    titre: '📋 Définis ton plan de virement mensuel',
    description: 'Répartis ton montant investissable (calculé dans Mes Finances) en % sur chaque compte. L\'app calcule automatiquement les montants à virer chaque mois.',
  },
  {
    titre: '✅ Coche tes virements',
    description: 'Une fois un virement effectué, coche-le. La ligne se raye et tout se remet à jour automatiquement le 1er du mois. Simple, visuel, efficace.',
  },
]
  const { isPremium, loading: premiumLoading } = usePremium()
  const queryClient = useQueryClient()
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [editingIdx, setEditingIdx] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPredefini, setSelectedPredefini] = useState('Livret A')
  const [newNomCustom, setNewNomCustom] = useState('')
  const [newTypeCustom, setNewTypeCustom] = useState('sécurité')
  const [newDispoCustom, setNewDispoCustom] = useState('Immédiate')
  const [newSolde, setNewSolde] = useState('')
  const [newObjectif, setNewObjectif] = useState('')
  const [chartReady, setChartReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [nbMoisMatelas, setNbMoisMatelas] = useState(6)
  const [erreurAdd, setErreurAdd] = useState(null)
  const [erreurEdit, setErreurEdit] = useState(null)
  const [succesEdit, setSuccesEdit] = useState(false)
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [photoUrl, setPhotoUrl] = useState(null)

  // États pour le plan de virement
  const [editingVirIdx, setEditingVirIdx] = useState(null)
  const [editVirForm, setEditVirForm] = useState({})
  const [showAddVir, setShowAddVir] = useState(false)
  const [newVir, setNewVir] = useState({ destination: '', compte: '', pourcentage: '' })
  const [confirmDeleteVirIdx, setConfirmDeleteVirIdx] = useState(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['portefeuille'],
    queryFn: fetchPortefeuilleData,
  })

  useEffect(() => {
  const loadPhoto = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setPhotoUrl(user.user_metadata?.photo_url || null)
  }
  loadPhoto()
}, [])

  useEffect(() => {
  if (data?.nbMoisMatelas !== undefined) setNbMoisMatelas(data.nbMoisMatelas)
}, [data?.nbMoisMatelas])

  const initiale = data?.user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  const user = data?.user || null
  const comptes = data?.comptes || COMPTES_DEFAULT
  const virements = data?.virements || VIREMENTS_DEFAULT
  const depensesFixes = data?.depensesFixes || 0
  const investissable = data?.investissable || 0

  const total = comptes.reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)
  const totalSecurite = comptes.filter(c => c.type === 'sécurité').reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)
  const objectifMatelas = depensesFixes * nbMoisMatelas
  const remplissageMatelas = objectifMatelas > 0 ? Math.min(Math.round((totalSecurite / objectifMatelas) * 100), 100) : 0
  const bleu = t.dark ? '#3B82F6' : '#034065'
  const totalPourcentage = virements.reduce((acc, v) => acc + (parseFloat(v.pourcentage) || 0), 0)
  const predefiniSelectionne = COMPTES_PREDEFINIS.find(c => c.nom === selectedPredefini)

  const moisActuelStr = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` }
  const isCheckedCeMois = (v) => { if (!v.checked || !v.checked_date) return false; return v.checked_date.substring(0, 7) === moisActuelStr() }

  useEffect(() => {
    if (!window.Chart) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      script.onload = () => setChartReady(true)
      document.head.appendChild(script)
    } else setChartReady(true)
  }, [])

  useEffect(() => {
    if (!chartReady || !canvasRef.current || total === 0) return
    const comptesAvecSolde = comptes.filter(c => parseFloat(c.solde) > 0)
    if (comptesAvecSolde.length === 0) return
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: { labels: comptesAvecSolde.map(c => c.nom), datasets: [{ data: comptesAvecSolde.map(c => parseFloat(c.solde)), backgroundColor: COULEURS.slice(0, comptesAvecSolde.length), borderWidth: 0, hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label} : ${Math.round(ctx.raw).toLocaleString('fr-FR')} € (${Math.round(ctx.raw / total * 100)}%)` } } } }
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [chartReady, comptes, total])

  const saveComptes = async (newComptes) => {
    if (!user) return
    setSaving(true)
    try {
      await supabase.from('comptes').delete().eq('user_id', user.id)
      if (newComptes.length > 0) {
        const { error } = await supabase.from('comptes').insert(newComptes.map(c => ({ user_id: user.id, nom: c.nom, type: c.type, disponibilite: c.disponibilite, solde: parseFloat(c.solde) || 0, objectif: parseFloat(c.objectif) || 0 })))
        if (error) throw new Error('Erreur lors de la sauvegarde.')
      }
      queryClient.invalidateQueries({ queryKey: ['portefeuille'] })
    } catch (e) {
      setErreurEdit(e.message)
    } finally {
      setSaving(false)
    }
  }

  const saveVirements = async (newVirements) => {
    if (!user) return
    try {
      await supabase.from('virements').delete().eq('user_id', user.id)
      if (newVirements.length > 0) {
        await supabase.from('virements').insert(newVirements.map((v, i) => ({ user_id: user.id, destination: v.destination, compte: v.compte, pourcentage: parseFloat(v.pourcentage) || 0, ordre: i, checked: v.checked || false, checked_date: v.checked_date || null })))
      }
      queryClient.invalidateQueries({ queryKey: ['portefeuille'] })
    } catch (e) {
      console.error('Erreur sauvegarde virements:', e)
    }
  }

  const couleurType = (type) => TYPES_DISPONIBILITE[type]?.color || '#9CA3AF'

  const handleEditStart = (i) => { setEditingIdx(i); setEditForm({ solde: comptes[i].solde, objectif: comptes[i].objectif }); setErreurEdit(null) }

  const handleEditSave = async (i) => {
    if (saving) return
    if (parseFloat(editForm.solde) < 0) { setErreurEdit('Le solde ne peut pas être négatif.'); return }
    setErreurEdit(null)
    const updated = [...comptes]
    updated[i] = { ...updated[i], solde: parseFloat(editForm.solde) || 0, objectif: parseFloat(editForm.objectif) || 0 }
    setEditingIdx(null)
    setSuccesEdit(true)
    setTimeout(() => setSuccesEdit(false), 2000)
    await saveComptes(updated)
  }

  const handleDelete = async (i) => {
    if (saving) return
    if (confirmDeleteIdx === i) {
      const updated = comptes.filter((_, j) => j !== i)
      setConfirmDeleteIdx(null)
      await saveComptes(updated)
    } else {
      setConfirmDeleteIdx(i)
      setTimeout(() => setConfirmDeleteIdx(null), 3000)
    }
  }

  const handleAdd = async () => {
    if (saving) return
    setErreurAdd(null)
    const isAutre = selectedPredefini === 'Autre'
    const nom = isAutre ? newNomCustom.trim() : selectedPredefini
    if (!nom) { setErreurAdd('Veuillez saisir un nom pour le compte.'); return }
    if (comptes.find(c => c.nom.toLowerCase() === nom.toLowerCase())) { setErreurAdd(`Le compte "${nom}" existe déjà.`); return }
    if (parseFloat(newSolde) < 0) { setErreurAdd('Le solde ne peut pas être négatif.'); return }
    const type = isAutre ? newTypeCustom : predefiniSelectionne.type
    const disponibilite = isAutre ? newDispoCustom : predefiniSelectionne.disponibilite
    const updated = [...comptes, { nom, type, disponibilite, solde: parseFloat(newSolde) || 0, objectif: parseFloat(newObjectif) || 0 }]
    setSelectedPredefini('Livret A'); setNewNomCustom(''); setNewSolde(''); setNewObjectif(''); setShowAdd(false)
    await saveComptes(updated)
  }

  const handleCheck = async (i) => {
    const updated = [...virements]
    const nowChecked = !isCheckedCeMois(updated[i])
    updated[i] = { ...updated[i], checked: nowChecked, checked_date: nowChecked ? new Date().toISOString().split('T')[0] : null }
    await saveVirements(updated)
  }

  // Handlers plan de virement
  const handleEditVirStart = (i) => {
    setEditingVirIdx(i)
    setEditVirForm({ destination: virements[i].destination, compte: virements[i].compte, pourcentage: virements[i].pourcentage })
  }

  const handleEditVirSave = async (i) => {
    if (!editVirForm.destination?.trim()) return
    const updated = [...virements]
    updated[i] = { ...updated[i], destination: editVirForm.destination.trim(), compte: editVirForm.compte, pourcentage: parseFloat(editVirForm.pourcentage) || 0 }
    setEditingVirIdx(null)
    await saveVirements(updated)
  }

  const handleDeleteVir = async (i) => {
    if (confirmDeleteVirIdx === i) {
      const updated = virements.filter((_, j) => j !== i)
      setConfirmDeleteVirIdx(null)
      await saveVirements(updated)
    } else {
      setConfirmDeleteVirIdx(i)
      setTimeout(() => setConfirmDeleteVirIdx(null), 3000)
    }
  }

  const handleAddVir = async () => {
    if (!newVir.destination?.trim() || !newVir.compte) return
    const updated = [...virements, { destination: newVir.destination.trim(), compte: newVir.compte, pourcentage: parseFloat(newVir.pourcentage) || 0, ordre: virements.length, checked: false, checked_date: null }]
    setNewVir({ destination: '', compte: '', pourcentage: '' })
    setShowAddVir(false)
    await saveVirements(updated)
  }

  const inputStyle = { padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, width: '100%', boxSizing: 'border-box' }
  const tousCoches = virements.length > 0 && virements.every(v => isCheckedCeMois(v))

  if (isLoading) return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Portefeuille" initiale={initiale} photoUrl={photoUrl} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: 13 }}>Chargement...</div>
    </div>
  )
if (premiumLoading) return (
  <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar page="Portefeuille" initiale={initiale} photoUrl={photoUrl} />
  </div>
)

if (!isPremium) {
  return <PremiumModal onClose={() => navigate(-1)} />
}
  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Portefeuille" initiale={initiale} photoUrl={photoUrl} />
      <PageGuide
  pageId="portefeuille"
  titre="Portefeuille"
  etapes={GUIDE_PORTEFEUILLE}
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
      <div style={{ padding: isMobile ? '16px 12px' : '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {succesEdit && <div style={{ background: '#EAF6E4', border: '0.5px solid #4CAF2E', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#2E7D1E', fontWeight: 500 }}>✓ Compte mis à jour avec succès !</div>}

        {/* 1. MATELAS DE SÉCURITÉ */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 10 : 0, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Matelas de sécurité</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                Couvrir{' '}
                <select value={nbMoisMatelas} onChange={async e => {
  const val = parseInt(e.target.value)
  setNbMoisMatelas(val)
  await supabase.from('profils').update({ nb_mois_matelas: val }).eq('user_id', user.id)
}} style={{ padding: '2px 6px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  {[3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {' '}mois de dépenses fixes
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: remplissageMatelas >= 100 ? '#4CAF2E' : t.text }}>{totalSecurite.toLocaleString('fr-FR')} €</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>sur {objectifMatelas.toLocaleString('fr-FR')} € objectif</div>
            </div>
          </div>
          <div style={{ background: t.bgSecondary, borderRadius: 4, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 4, background: remplissageMatelas >= 100 ? '#4CAF2E' : bleu, width: `${remplissageMatelas}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <div style={{ fontSize: 11, color: t.textMuted }}>Dépenses fixes : <span style={{ fontWeight: 500, color: t.text }}>{depensesFixes.toLocaleString('fr-FR')} €/mois</span></div>
            <div style={{ fontSize: 13, fontWeight: 500, color: remplissageMatelas >= 100 ? '#4CAF2E' : '#E24B4A' }}>{remplissageMatelas}%{remplissageMatelas >= 100 && ' ✓'}</div>
          </div>
          {remplissageMatelas < 100 && objectifMatelas > 0 && <div style={{ marginTop: 8, fontSize: 11, color: bleu, background: bleu + '15', padding: '6px 10px', borderRadius: 7, border: `0.5px solid ${bleu}30` }}>Il vous manque <strong>{(objectifMatelas - totalSecurite).toLocaleString('fr-FR')} €</strong> pour atteindre votre objectif de {nbMoisMatelas} mois</div>}
          {remplissageMatelas >= 100 && <div style={{ marginTop: 8, fontSize: 11, color: '#2E7D1E', background: '#EAF6E4', padding: '6px 10px', borderRadius: 7 }}>🎉 Votre matelas de sécurité est complet !</div>}
        </div>

        {/* 2. MES COMPTES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Mes comptes</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Total : <span style={{ fontWeight: 500, color: t.text }}>{total.toLocaleString('fr-FR')} €</span></div>
            <button onClick={() => { setShowAdd(v => !v); setErreurAdd(null) }} style={{ marginTop: 8, background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showAdd ? '− Fermer' : '+ Ajouter un compte'}
            </button>
          </div>
        </div>

        {showAdd && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 12 }}>Nouveau compte</div>
            {erreurAdd && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreurAdd}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Compte / Support</div>
                <select value={selectedPredefini} onChange={e => setSelectedPredefini(e.target.value)} style={inputStyle}>
                  {COMPTES_PREDEFINIS.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                </select>
                {selectedPredefini === 'Autre' && <input placeholder="Nom du compte *" value={newNomCustom} onChange={e => setNewNomCustom(e.target.value)} style={{ ...inputStyle, marginTop: 6 }} />}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type</div>
                {selectedPredefini === 'Autre' ? (
                  <select value={newTypeCustom} onChange={e => setNewTypeCustom(e.target.value)} style={inputStyle}>{Object.keys(TYPES_DISPONIBILITE).map(ty => <option key={ty} value={ty}>{ty}</option>)}</select>
                ) : <div style={{ padding: '6px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, background: t.bgSecondary, color: t.textMuted }}>{predefiniSelectionne?.type}</div>}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Disponibilité</div>
                {selectedPredefini === 'Autre' ? (
                  <select value={newDispoCustom} onChange={e => setNewDispoCustom(e.target.value)} style={inputStyle}>{['Immédiate', 'Quelques jours', 'Bloqué (5 ans)'].map(d => <option key={d} value={d}>{d}</option>)}</select>
                ) : <div style={{ padding: '6px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, background: t.bgSecondary, color: t.textMuted }}>{predefiniSelectionne?.disponibilite}</div>}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Solde actuel (€)</div>
                <input type="number" min="0" placeholder="0" value={newSolde} onChange={e => setNewSolde(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Objectif (€)</div>
                <input type="number" min="0" placeholder="0" value={newObjectif} onChange={e => setNewObjectif(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={handleAdd} disabled={saving} style={{ background: saving ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: isMobile ? '10px 12px' : '7px 12px', borderRadius: 7, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {saving ? '...' : 'Ajouter'}
              </button>
            </div>
          </div>
        )}

        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {erreurEdit && <div style={{ padding: '8px 14px', background: '#FCEBEB', borderBottom: '0.5px solid #E24B4A', fontSize: 12, color: '#E24B4A' }}>⚠️ {erreurEdit}</div>}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 860 }}>
              <thead>
                <tr style={{ background: t.bgSecondary }}>
                  {['Compte / Support', 'Type', 'Disponibilité', 'Solde actuel', 'Objectif', 'Remplissage', 'Progression', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comptes.map((c, i) => {
                  const remplissage = c.objectif > 0 ? Math.min(Math.round((c.solde / c.objectif) * 100), 100) : 0
                  return (
                    <tr key={i} style={{ borderBottom: `0.5px solid ${t.border}`, background: editingIdx === i ? t.bgSecondary : 'transparent' }}>
                      {editingIdx === i ? (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{c.nom}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: couleurType(c.type) + '20', color: couleurType(c.type) }}>{c.type}</span></td>
                          <td style={{ padding: '10px 14px', color: t.textSecondary, fontSize: 11 }}>{c.disponibilite}</td>
                          <td style={{ padding: '6px 8px' }}><input type="number" min="0" value={editForm.solde} onChange={e => setEditForm({ ...editForm, solde: e.target.value })} style={{ ...inputStyle, width: 90 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" min="0" value={editForm.objectif} onChange={e => setEditForm({ ...editForm, objectif: e.target.value })} style={{ ...inputStyle, width: 90 }} /></td>
                          <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                          <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleEditSave(i)} disabled={saving} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                              <button onClick={() => { setEditingIdx(null); setErreurEdit(null) }} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{c.nom}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: couleurType(c.type) + '20', color: couleurType(c.type) }}>{c.type}</span></td>
                          <td style={{ padding: '10px 14px', color: t.textSecondary, fontSize: 11 }}>{c.disponibilite}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{(parseFloat(c.solde) || 0).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '10px 14px', color: t.textSecondary }}>{c.objectif > 0 ? (parseFloat(c.objectif) || 0).toLocaleString('fr-FR') + ' €' : '—'}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 500, color: remplissage >= 100 ? '#4CAF2E' : t.text }}>{c.objectif > 0 ? remplissage + '%' : '—'}</td>
                          <td style={{ padding: '10px 14px', minWidth: 100 }}>
                            {c.objectif > 0 ? <div style={{ background: t.bgSecondary, borderRadius: 3, height: 6, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 3, background: remplissage >= 100 ? '#4CAF2E' : bleu, width: `${remplissage}%`, transition: 'width 0.3s' }} /></div> : '—'}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleEditStart(i)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️</button>
                              <button onClick={() => handleDelete(i)} style={{ background: confirmDeleteIdx === i ? '#E24B4A' : '#FCEBEB', color: confirmDeleteIdx === i ? '#fff' : '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                                {confirmDeleteIdx === i ? 'Confirmer ?' : '×'}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
                <tr style={{ background: t.bgSecondary, borderTop: `0.5px solid ${t.border}` }}>
                  <td colSpan={3} style={{ padding: '10px 14px', fontWeight: 500, color: t.text, fontSize: 11 }}>TOTAL</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{total.toLocaleString('fr-FR')} €</td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. RÉPARTITION */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Répartition du portefeuille</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Total : {total.toLocaleString('fr-FR')} €</div>
          {total > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? 16 : 24, alignItems: 'center' }}>
              <div style={{ position: 'relative', height: 200, maxWidth: isMobile ? 200 : '100%', margin: isMobile ? '0 auto' : 0 }}>
                <canvas ref={canvasRef} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{total.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>total</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {comptes.filter(c => parseFloat(c.solde) > 0).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: COULEURS[i], flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, gap: 8 }}>
                        <span style={{ fontSize: 12, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</span>
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                          <span style={{ fontSize: 12, color: t.textMuted }}>{(parseFloat(c.solde) || 0).toLocaleString('fr-FR')} €</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: t.text, minWidth: 36, textAlign: 'right' }}>{Math.round((parseFloat(c.solde) / total) * 100)}%</span>
                        </div>
                      </div>
                      <div style={{ background: t.bgSecondary, borderRadius: 3, height: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: COULEURS[i], width: `${Math.round((parseFloat(c.solde) / total) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ textAlign: 'center', color: t.textMuted, fontSize: 12, padding: '40px 0' }}>Ajoutez des soldes pour voir la répartition</div>}
        </div>

        {/* 4. PLAN DE VIREMENT */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Plan de virement mensuel</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Basé sur votre investissable : <span style={{ fontWeight: 500, color: '#4CAF2E' }}>{investissable.toLocaleString('fr-FR')} €/mois</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {tousCoches && <div style={{ fontSize: 11, color: '#2E7D1E', background: '#EAF6E4', padding: '5px 10px', borderRadius: 7, fontWeight: 500 }}>✓ Tous les virements effectués ce mois !</div>}
              <button onClick={() => setShowAddVir(v => !v)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {showAddVir ? '− Fermer' : '+ Ajouter'}
              </button>
            </div>
          </div>

          {showAddVir && (
            <div style={{ padding: '12px 16px', background: t.bgSecondary, borderBottom: `0.5px solid ${t.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Destination *</div>
                  <input placeholder="ex: Voyages" value={newVir.destination} onChange={e => setNewVir({ ...newVir, destination: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Compte *</div>
                  <select value={newVir.compte} onChange={e => setNewVir({ ...newVir, compte: e.target.value })} style={inputStyle}>
                    <option value="">Sélectionner</option>
                    {comptes.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Répartition (%)</div>
                  <input type="number" min="0" max="100" placeholder="ex: 20" value={newVir.pourcentage} onChange={e => setNewVir({ ...newVir, pourcentage: e.target.value })} style={inputStyle} />
                </div>
                <button onClick={handleAddVir} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: isMobile ? '10px 12px' : '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Ajouter
                </button>
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 680 }}>
              <thead>
                <tr style={{ background: t.bgSecondary }}>
                {['', 'Destination', 'Compte bancaire', 'Répartition (%)', 'Montant à virer ce mois', ''].map((h, i) => (
  <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {virements.map((v, i) => {
                  const coche = isCheckedCeMois(v)
                  const isEditing = editingVirIdx === i
                  return (
                    <tr key={i} style={{ borderBottom: `0.5px solid ${t.border}`, background: isEditing ? t.bgSecondary : (coche ? (t.dark ? 'rgba(76,175,46,0.08)' : '#F6FFF3') : 'transparent') }}>
                      <td style={{ padding: '10px 14px' }}><input type="checkbox" checked={coche} onChange={() => handleCheck(i)} disabled={isEditing} style={{ accentColor: bleu, cursor: isEditing ? 'not-allowed' : 'pointer', width: 14, height: 14 }} /></td>
                      {isEditing ? (
                        <>
                          <td style={{ padding: '6px 8px' }}>
                            <input value={editVirForm.destination} onChange={e => setEditVirForm({ ...editVirForm, destination: e.target.value })} style={inputStyle} />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <select value={editVirForm.compte} onChange={e => setEditVirForm({ ...editVirForm, compte: e.target.value })} style={inputStyle}>
                              {comptes.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <input type="number" min="0" max="100" value={editVirForm.pourcentage} onChange={e => setEditVirForm({ ...editVirForm, pourcentage: e.target.value })} style={{ width: 60, padding: '5px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, textAlign: 'right' }} />
                              <span style={{ fontSize: 11, color: t.textMuted }}>%</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 14px', color: t.textMuted, fontSize: 11 }}>—</td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleEditVirSave(i)} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                              <button onClick={() => setEditingVirIdx(null)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '10px 14px', color: coche ? '#4CAF2E' : t.text, fontWeight: 500, textDecoration: coche ? 'line-through' : 'none' }}>{v.destination}</td>
                          <td style={{ padding: '10px 14px', color: t.textSecondary }}>{v.compte}</td>
                          <td style={{ padding: '10px 14px', color: t.text, fontWeight: 500 }}>{v.pourcentage}%</td>
                          <td style={{ padding: '10px 14px', fontWeight: 500, color: '#4CAF2E' }}>{Math.round(investissable * v.pourcentage / 100).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleEditVirStart(i)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️</button>
                              <button onClick={() => handleDeleteVir(i)} style={{ background: confirmDeleteVirIdx === i ? '#E24B4A' : '#FCEBEB', color: confirmDeleteVirIdx === i ? '#fff' : '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                                {confirmDeleteVirIdx === i ? 'Confirmer ?' : '×'}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
                <tr style={{ background: t.bgSecondary, borderTop: `0.5px solid ${t.border}` }}>
                  <td colSpan={3} style={{ padding: '10px 14px', fontWeight: 500, color: t.text, fontSize: 11 }}>TOTAL</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: totalPourcentage === 100 ? '#4CAF2E' : '#E24B4A' }}>{totalPourcentage}%</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{Math.round(investissable).toLocaleString('fr-FR')} €</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          {totalPourcentage !== 100 && (
            <div style={{ padding: '8px 16px', background: '#FCEBEB', borderTop: `0.5px solid ${t.border}` }}>
              <span style={{ fontSize: 11, color: '#E24B4A' }}>⚠️ Le total des pourcentages doit être égal à 100% (actuellement {totalPourcentage}%)</span>
            </div>
          )}
        </div>

      </div>
      <FooterApp />
    </div>
  )
}