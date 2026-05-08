import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import PageGuide from '../components/PageGuide'
import { usePageGuide } from '../lib/usePageGuide'
import QuestionnaireFinances from '../components/QuestionnaireFinances'

const moisListe = ['Mensuel', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const categoriesListe = ['Logement', 'Véhicules', 'Santé', 'Impôts', 'Assurances', 'Autres']

const placeholders = {
  'Logement': 'ex: Taxe foncière',
  'Véhicules': 'ex: Contrôle technique',
  'Santé': 'ex: Mutuelle',
  'Impôts': 'ex: Impôt sur le revenu',
  'Assurances': 'ex: Assurance auto',
  'Autres': 'ex: Cotisation club',
}

const DEPENSES_FIXES_DEFAULT = [
  { categorie: 'Loyer / Prêt', montant: 0, defaut: true },
  { categorie: 'Électricité / Eau', montant: 0, defaut: true },
  { categorie: 'Assurances', montant: 0, defaut: true },
  { categorie: 'Abonnements', montant: 0, defaut: true },
  { categorie: 'Frais bancaires', montant: 0, defaut: true },
  { categorie: 'Courses', montant: 0, defaut: true },
]

const DEPENSES_VARIABLES_DEFAULT = [
  { categorie: 'Essence / Transport', montant: 0, defaut: true },
  { categorie: 'Sorties', montant: 0, defaut: true },
  { categorie: 'Sport / Loisirs', montant: 0, defaut: true },
  { categorie: 'Shopping / Divers', montant: 0, defaut: true },
]

function simulerDCA(versement, capitalInitial, taux, annees) {
  const tauxMensuel = taux / 100 / 12
  let capital = capitalInitial
  const labels = [], investi = [], interets = []
  for (let an = 0; an <= annees; an++) {
    if (an > 0) for (let m = 0; m < 12; m++) capital = capital * (1 + tauxMensuel) + versement
    const totalInvesti = capitalInitial + versement * an * 12
    labels.push('An ' + an)
    investi.push(Math.round(totalInvesti))
    interets.push(Math.max(0, Math.round(capital - totalInvesti)))
  }
  return { labels, investi, interets, final: Math.round(capital) }
}

function PopupSimulateur({ versement, onClose, isMobile }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [duree, setDuree] = useState(10)
  const [ready, setReady] = useState(false)
  const taux = 7

  useEffect(() => {
    if (window.Chart) { setReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!ready || !canvasRef.current) return
    const { labels, investi, interets } = simulerDCA(versement, 0, taux, duree)
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Capital investi', data: investi, backgroundColor: '#E3F0FF', stack: 'a' }, { label: 'Intérêts', data: interets, backgroundColor: '#4CAF2E', stack: 'a' }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ' : ' + Math.round(ctx.raw).toLocaleString('fr-FR') + ' €' } } },
        scales: {
          x: { stacked: true, ticks: { font: { size: 10 }, color: '#9CA3AF' }, grid: { display: false } },
          y: { stacked: true, ticks: { font: { size: 10 }, color: '#9CA3AF', callback: v => Math.round(v / 1000) + 'k €' }, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [ready, versement, duree])

  const { final } = simulerDCA(versement, 0, taux, duree)
  const totalInvesti = versement * duree * 12
  const totalInterets = final - totalInvesti

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: isMobile ? 12 : 0 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? 16 : 24, width: '100%', maxWidth: 560, border: '0.5px solid #E0EAE3', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#034065' }}>Projection de croissance</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Basé sur {versement.toLocaleString('fr-FR')} €/mois · Avec un taux conservateur de 7%/an</div>
          </div>
          <button onClick={onClose} style={{ background: '#F4F7F5', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 14, cursor: 'pointer', color: '#6B7280' }}>×</button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[10, 20, 30].map(d => (
            <div key={d} onClick={() => setDuree(d)} style={{ fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', background: duree === d ? '#034065' : '#F4F7F5', color: duree === d ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3' }}>{d} ans</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
          {[['Total investi', `${totalInvesti.toLocaleString('fr-FR')} €`, '#034065'], ['Capital final', `${final.toLocaleString('fr-FR')} €`, '#4CAF2E'], ['Intérêts générés', `+${totalInterets.toLocaleString('fr-FR')} €`, '#4CAF2E']].map(([l, v, c]) => (
            <div key={l} style={{ background: '#F4F7F5', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        {ready ? <div style={{ position: 'relative', height: 220 }}><canvas ref={canvasRef} /></div> : <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 12 }}>Chargement...</div>}
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Intérêts composés</div>
        </div>
      </div>
    </div>
  )
}

function ModalDepenses({ t, onClose, onSave, depensesFixesInit, depensesVariablesInit, loading, erreur, isMobile }) {
  const [fixes, setFixes] = useState(depensesFixesInit)
  const [variables, setVariables] = useState(depensesVariablesInit)
  const [newFixe, setNewFixe] = useState('')
  const [newVariable, setNewVariable] = useState('')
  const totalFixes = fixes.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
  const totalVariables = variables.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: isMobile ? 12 : 0 }}>
      <div style={{ background: t.bgCard, borderRadius: 16, padding: isMobile ? '20px' : '28px', width: '100%', maxWidth: 520, border: `0.5px solid ${t.border}`, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Mes dépenses</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: t.textMuted }}>×</button>
        </div>
        {erreur && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreur}</div>}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 10 }}>Dépenses fixes — Besoins</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fixes.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, fontSize: 12, color: t.text, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.categorie}</div>
                <input type="number" min="0" placeholder="0" value={d.montant || ''} onChange={e => { const u = [...fixes]; u[i] = { ...u[i], montant: e.target.value }; setFixes(u) }} style={{ width: isMobile ? 70 : 90, padding: '6px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }} />
                <span style={{ fontSize: 12, color: t.textMuted }}>€</span>
                {!d.defaut ? <button onClick={() => setFixes(fixes.filter((_, j) => j !== i))} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '3px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>×</button> : <div style={{ width: 28 }} />}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input placeholder="Ajouter une catégorie..." value={newFixe} onChange={e => setNewFixe(e.target.value)} onKeyDown={e => e.key === 'Enter' && newFixe.trim() && (setFixes([...fixes, { categorie: newFixe, montant: 0, defaut: false }]), setNewFixe(''))} style={{ flex: 1, minWidth: 0, padding: '7px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
            <button onClick={() => newFixe.trim() && (setFixes([...fixes, { categorie: newFixe, montant: 0, defaut: false }]), setNewFixe(''))} style={{ background: t.bgSecondary, color: t.text, border: `0.5px solid ${t.border}`, borderRadius: 7, padding: '7px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>+ Ajouter</button>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#E24B4A', marginTop: 8, textAlign: 'right' }}>Total : {totalFixes.toLocaleString('fr-FR')} €</div>
        </div>
        <div style={{ borderTop: `0.5px solid ${t.border}`, paddingTop: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 10 }}>Dépenses variables — Envies</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {variables.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, fontSize: 12, color: t.text, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.categorie}</div>
                <input type="number" min="0" placeholder="0" value={d.montant || ''} onChange={e => { const u = [...variables]; u[i] = { ...u[i], montant: e.target.value }; setVariables(u) }} style={{ width: isMobile ? 70 : 90, padding: '6px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }} />
                <span style={{ fontSize: 12, color: t.textMuted }}>€</span>
                {!d.defaut ? <button onClick={() => setVariables(variables.filter((_, j) => j !== i))} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '3px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>×</button> : <div style={{ width: 28 }} />}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input placeholder="Ajouter une catégorie..." value={newVariable} onChange={e => setNewVariable(e.target.value)} onKeyDown={e => e.key === 'Enter' && newVariable.trim() && (setVariables([...variables, { categorie: newVariable, montant: 0, defaut: false }]), setNewVariable(''))} style={{ flex: 1, minWidth: 0, padding: '7px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
            <button onClick={() => newVariable.trim() && (setVariables([...variables, { categorie: newVariable, montant: 0, defaut: false }]), setNewVariable(''))} style={{ background: t.bgSecondary, color: t.text, border: `0.5px solid ${t.border}`, borderRadius: 7, padding: '7px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>+ Ajouter</button>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#BA7517', marginTop: 8, textAlign: 'right' }}>Total : {totalVariables.toLocaleString('fr-FR')} €</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
          <button onClick={() => onSave(fixes, variables)} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loading ? '⏳ Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}

const fetchDashboardData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')

  const [finRes, depRes, echRes, revRes, profilRes] = await Promise.all([
    supabase.from('finances').select('*').eq('user_id', user.id).single(),
    supabase.from('depenses').select('*').eq('user_id', user.id),
    supabase.from('echeances').select('*').eq('user_id', user.id),
    supabase.from('revenus').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('profils').select('questionnaire_done, analyse_ia').eq('user_id', user.id).single(),
  ])

  return {
  user,
  finances: finRes.data || { revenus: 0, autre_revenu: 0, depenses_fixes: 0, depenses_variables: 0 },
  depenses: depRes.data || [],
  echeances: echRes.data || [],
  revenus: revRes.data || [],
  questionnaireDone: profilRes.data?.questionnaire_done || false,
  analyseIAData: profilRes.data?.analyse_ia || null,
}
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

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useTheme()
  const { showGuide, ouvrirGuide, fermerGuide } = usePageGuide()
  const queryClient = useQueryClient()

  const GUIDE_FINANCES = [
  {
    titre: '🎯 Commence par te poser',
    description: 'Un questionnaire rapide va t\'accueillir pour rentrer tes informations de base. Plus tu es précis, plus l\'analyse sera pertinente. Prends 10 minutes pour bien démarrer.',
  },
  {
    titre: '⏱️ Affine tes finances',
    description: 'Rentre tes revenus et dépenses au plus juste. L\'application est volontairement sans connexion bancaire, pour que tu prennes vraiment conscience de là où part ton argent chaque mois.',
  },
  {
    titre: '📅 Ajoute tes échéances annuelles',
    description: 'Assurance, impôts, abonnements annuels... Indique le mois où ça tombe. L\'application te rappellera un mois avant pour que tu ne sois jamais surpris.',
  },
  {
    titre: '🧠 Ton analyse personnalisée',
    description: 'Une fois tes données renseignées, l\'IA génère un bilan personnalisé avec des recommandations concrètes adaptées à ton profil et ton objectif. Plus tu utilises l\'application, plus l\'analyse s\'affine.',
  },
]

  // 1. Tous les useState
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [showModalRevenu, setShowModalRevenu] = useState(false)
  const [showModalDepenses, setShowModalDepenses] = useState(false)
  const [formRevenu, setFormRevenu] = useState({ revenus: '', autre_revenu: '' })
  const [formEch, setFormEch] = useState({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  const [loading, setLoading] = useState(false)
  const [erreurRevenu, setErreurRevenu] = useState(null)
  const [erreurDepenses, setErreurDepenses] = useState(null)
  const [erreurEcheance, setErreurEcheance] = useState(null)
  const [succesRevenu, setSuccesRevenu] = useState(false)
  const [succesDepenses, setSuccesDepenses] = useState(false)
  const [showAddEch, setShowAddEch] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ libelle: '', mois: '', montant_annuel: '' })
  const [showSimulateur, setShowSimulateur] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [questionnaireDone, setQuestionnaireDone] = useState(null)
  const [formRevenus, setFormRevenus] = useState([])
  const [newRevenuLibelle, setNewRevenuLibelle] = useState('')
  const [newRevenuMontant, setNewRevenuMontant] = useState('')
  const [analyseIA, setAnalyseIA] = useState(null)
  const [analyseLoading, setAnalyseLoading] = useState(false)

  // 2. useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchOnMount: true,
    staleTime: 0,
  })

  // 3. Tous les useEffect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadPhoto = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setPhotoUrl(user.user_metadata?.photo_url || null)
    }
    loadPhoto()
  }, [])

  useEffect(() => {
  if (data === undefined) return
  console.log('useEffect data:', data?.questionnaireDone)
  setQuestionnaireDone(data.questionnaireDone ?? false)
  
  if (data.analyseIAData) {
    try {
      setAnalyseIA(JSON.parse(data.analyseIAData))
    } catch (e) {}
  } else if (data.questionnaireDone) {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) genererAnalyse(user.id)
    }
    loadUser()
  }
}, [data])

  // 4. Fonctions
  const genererAnalyse = async (userId) => {
    setAnalyseLoading(true)
    try {
      const res = await fetch('https://ylxxdhwakdtmidtqpacj.supabase.co/functions/v1/analyse-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      })
      const data = await res.json()
      if (data.analyse) setAnalyseIA(data.analyse)
    } catch (e) {
      console.error('Erreur analyse IA:', e)
    } finally {
      setAnalyseLoading(false)
    }
  }

  const user = data?.user || null
  const finances = data?.finances || { revenus: 0, autre_revenu: 0, depenses_fixes: 0, depenses_variables: 0 }
  const echeances = data?.echeances || []

  const ordreDefaut = DEPENSES_FIXES_DEFAULT.map(d => d.categorie)

const depensesFixesDetail = data?.depenses?.length > 0
  ? data.depenses
      .filter(d => d.type === 'fixes')
      .map(d => ({ categorie: d.categorie, montant: d.montant, defaut: DEPENSES_FIXES_DEFAULT.some(df => df.categorie === d.categorie) }))
      .sort((a, b) => {
        const ia = ordreDefaut.indexOf(a.categorie)
        const ib = ordreDefaut.indexOf(b.categorie)
        if (ia === -1 && ib === -1) return 0
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })
  : DEPENSES_FIXES_DEFAULT

  const depensesVariablesDetail = data?.depenses?.length > 0
    ? data.depenses.filter(d => d.type === 'variables').map(d => ({ categorie: d.categorie, montant: d.montant, defaut: DEPENSES_VARIABLES_DEFAULT.some(dv => dv.categorie === d.categorie) }))
    : DEPENSES_VARIABLES_DEFAULT
 
useEffect(() => {
  if (data) {
    setQuestionnaireDone(data.questionnaireDone)
    if (data.analyseIAData) {
      try {
        setAnalyseIA(JSON.parse(data.analyseIAData))
      } catch (e) {}
    }
  }
}, [data])

  const revenus = data?.revenus || []
  const questionnaireDoneFromData = data?.questionnaireDone || false
const analyseIAFromData = data?.analyseIAData || null
const totalRevenus = revenus.length > 0 
  ? revenus.reduce((acc, r) => acc + (parseFloat(r.montant) || 0), 0)
  : (parseFloat(finances.revenus) || 0) + (parseFloat(finances.autre_revenu) || 0)
  const totalDepensesFixes = depensesFixesDetail.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
  const totalDepensesVariables = depensesVariablesDetail.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
  const totalDepenses = totalDepensesFixes + totalDepensesVariables
  const totalEcheances = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0)
  const totalAnnuel = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0), 0)
  const investissable20 = Math.round(totalRevenus * 0.20)
  const reelInvestissable = Math.round(totalRevenus - totalDepenses - totalEcheances)
  const pourcentageReel = totalRevenus > 0 ? Math.round((reelInvestissable / totalRevenus) * 100) : 0

  const alertes = []
  const moisActuel = new Date().getMonth() + 1
  echeances.forEach(e => {
    const moisEch = moisListe.indexOf(e.mois)
    if (moisEch === 0) return
    if (moisEch === moisActuel) alertes.push({ ...e, type: 'ce mois' })
    if (moisEch === moisActuel + 1) alertes.push({ ...e, type: '1 mois' })
    if (moisActuel === 12 && moisEch === 1) alertes.push({ ...e, type: '1 mois' })
  })

  const bleu = t.dark ? '#3B82F6' : '#034065'
  const bleuBg = t.dark ? 'rgba(59,130,246,0.15)' : '#E8EEF6'
  const bleuAlerte = t.dark ? 'rgba(59,130,246,0.15)' : '#E8EEF6'
  const bleuAlerteText = t.dark ? '#3B82F6' : '#034065'
  const bleuAlerteBorder = t.dark ? 'rgba(59,130,246,0.3)' : '#B8CCE4'

  const regle5030 = totalRevenus > 0 ? {
    besoins: Math.round(totalDepensesFixes / totalRevenus * 100),
    envies: Math.round(totalDepensesVariables / totalRevenus * 100),
    invest: pourcentageReel,
  } : { besoins: 0, envies: 0, invest: 0 }

  const couleurBesoins = regle5030.besoins > 50 ? '#E24B4A' : bleu
  const couleurEnvies = regle5030.envies > 30 ? '#E24B4A' : bleu
  const couleurInvest = regle5030.invest < 20 ? '#E24B4A' : bleu

  const handleSaveRevenu = async () => {
  if (loading) return
  if (formRevenus.length === 0) { setErreurRevenu('Ajoutez au moins un revenu.'); return }
  setLoading(true); setErreurRevenu(null)
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    // Supprime les anciens revenus
    await supabase.from('revenus').delete().eq('user_id', currentUser.id)
    
    // Insère les nouveaux
    const toInsert = formRevenus
      .filter(r => r.libelle.trim())
      .map(r => ({ user_id: currentUser.id, libelle: r.libelle, montant: parseFloat(r.montant) || 0 }))
    
    if (toInsert.length > 0) {
      const { error } = await supabase.from('revenus').insert(toInsert)
      if (error) throw new Error('Erreur lors de la sauvegarde.')
    }

    // Met à jour finances pour compatibilité
    const total = toInsert.reduce((acc, r) => acc + r.montant, 0)
    const { data: existing } = await supabase.from('finances').select('*').eq('user_id', currentUser.id).single()
    const payload = { user_id: currentUser.id, revenus: total, autre_revenu: 0, depenses_fixes: totalDepensesFixes, depenses_variables: totalDepensesVariables }
    if (existing) await supabase.from('finances').update(payload).eq('user_id', currentUser.id)
    else await supabase.from('finances').insert(payload)

    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    setShowModalRevenu(false)
    setSuccesRevenu(true)
    setTimeout(() => setSuccesRevenu(false), 3000)
    if (questionnaireDone) genererAnalyse(currentUser.id)
  } catch (e) {
    setErreurRevenu(e.message || 'Une erreur est survenue.')
  } finally {
    setLoading(false)
  }
}

  const handleSaveDepenses = async (fixes, variables) => {
    if (loading) return
    setLoading(true); setErreurDepenses(null)
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      await supabase.from('depenses').delete().eq('user_id', currentUser.id)
      const toInsert = [
        ...fixes.map(d => ({ user_id: currentUser.id, type: 'fixes', categorie: d.categorie, montant: parseFloat(d.montant) || 0 })),
        ...variables.map(d => ({ user_id: currentUser.id, type: 'variables', categorie: d.categorie, montant: parseFloat(d.montant) || 0 })),
      ]
      if (toInsert.length > 0) { const { error } = await supabase.from('depenses').insert(toInsert); if (error) throw new Error('Erreur lors de la sauvegarde des dépenses.') }
      const newTotalFixes = fixes.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
      const newTotalVars = variables.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0)
      const payload = { user_id: currentUser.id, revenus: finances.revenus, autre_revenu: finances.autre_revenu, depenses_fixes: newTotalFixes, depenses_variables: newTotalVars }
      const { data: existing } = await supabase.from('finances').select('*').eq('user_id', currentUser.id).single()
      if (existing) await supabase.from('finances').update(payload).eq('user_id', currentUser.id)
      else await supabase.from('finances').insert(payload)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setShowModalDepenses(false)
      setSuccesDepenses(true)
      setTimeout(() => setSuccesDepenses(false), 3000)
      if (questionnaireDone) genererAnalyse(currentUser.id)
    } catch (e) {
      setErreurDepenses(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEcheance = async () => {
    if (loading) return
    if (!formEch.categorie || !formEch.libelle || !formEch.mois || !formEch.montant_annuel) { setErreurEcheance('Veuillez remplir tous les champs.'); return }
    if (parseFloat(formEch.montant_annuel) <= 0) { setErreurEcheance('Le montant doit être supérieur à 0.'); return }
    setLoading(true); setErreurEcheance(null)
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const { error } = await supabase.from('echeances').insert({ user_id: currentUser.id, categorie: formEch.categorie, libelle: formEch.libelle, mois: formEch.mois, montant_annuel: parseFloat(formEch.montant_annuel) })
      if (error) throw new Error('Erreur lors de l\'ajout.')
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
setFormEch({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
if (questionnaireDone) genererAnalyse(currentUser.id)
} catch (e) {
      setErreurEcheance(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEcheance = async (id) => {
  const { error } = await supabase.from('echeances').delete().eq('id', id)
  if (!error) {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (questionnaireDone) genererAnalyse(currentUser.id)
  }
}

  const handleEditStart = (e) => { setEditingId(e.id); setEditForm({ libelle: e.libelle, mois: e.mois, montant_annuel: e.montant_annuel }) }

  const handleEditSave = async (id) => {
    if (loading) return
    setLoading(true)
    try {
      const payload = { libelle: editForm.libelle, mois: editForm.mois, montant_annuel: parseFloat(editForm.montant_annuel) }
      const { error } = await supabase.from('echeances').update(payload).eq('id', id)
      if (error) throw new Error('Erreur lors de la modification.')
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
setEditingId(null)
const { data: { user: currentUser } } = await supabase.auth.getUser()
if (questionnaireDone) genererAnalyse(currentUser.id)
} catch (e) {
      setErreurEcheance(e.message)
    } finally {
      setLoading(false)
    }
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const echeancesParCategorie = categoriesListe.reduce((acc, cat) => {
    const items = echeances.filter(e => e.categorie?.toLowerCase() === cat.toLowerCase())
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  if (isLoading) return (
  <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar page="Mes Finances" initiale={initiale} photoUrl={photoUrl} />
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 12, padding: 12, flex: 1 }}>
      
      {/* COLONNE GAUCHE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14, height: 140 }}>
          <SkeletonBlock width="60%" height={12} mb={10} />
          <SkeletonBlock width="40%" height={24} mb={8} />
          <SkeletonBlock width="80%" height={8} mb={8} />
          <SkeletonBlock width="100%" height={6} />
        </div>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14, flex: 1 }}>
          <SkeletonBlock width="50%" height={12} mb={12} />
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `0.5px solid ${t.border}` }}>
              <SkeletonBlock width="40%" height={10} />
              <SkeletonBlock width="20%" height={10} />
            </div>
          ))}
        </div>
      </div>

      {/* COLONNE DROITE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16, height: 160 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <SkeletonBlock width="40%" height={12} />
            <SkeletonBlock width="15%" height={12} />
          </div>
          <SkeletonBlock width="100%" height={10} mb={8} />
          <SkeletonBlock width="100%" height={10} mb={8} />
          <SkeletonBlock width="100%" height={10} mb={8} />
          <SkeletonBlock width="60%" height={10} />
        </div>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16, height: 180 }}>
          <SkeletonBlock width="30%" height={12} mb={12} />
          {[1,2,3].map(i => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <SkeletonBlock width="40%" height={10} />
                <SkeletonBlock width="15%" height={10} />
              </div>
              <SkeletonBlock width="100%" height={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
<PageGuide
  pageId="dashboard"
  titre="Mes Finances"
  etapes={GUIDE_FINANCES}
  forceVisible={showGuide}
  onClose={() => {
    fermerGuide()
    if (!questionnaireDone) setShowQuestionnaire(true)
  }}
/>
      {showSimulateur && <PopupSimulateur versement={reelInvestissable} onClose={() => setShowSimulateur(false)} isMobile={isMobile} />}

      {showQuestionnaire && (
  <QuestionnaireFinances
    onComplete={async (data) => {
      setShowQuestionnaire(false)
      setQuestionnaireDone(true)
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        const { data: { user } } = await supabase.auth.getUser()
        if (user) genererAnalyse(user.id)
      }
    }}
  />
)}

      {showModalDepenses && (
        <ModalDepenses t={t} onClose={() => setShowModalDepenses(false)} onSave={handleSaveDepenses} depensesFixesInit={depensesFixesDetail} depensesVariablesInit={depensesVariablesDetail} loading={loading} erreur={erreurDepenses} isMobile={isMobile} />
      )}

      {showModalRevenu && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: isMobile ? 12 : 0 }}>
    <div style={{ background: t.bgCard, borderRadius: 16, padding: isMobile ? '24px 20px' : '32px 28px', width: '100%', maxWidth: 420, border: `0.5px solid ${t.border}`, maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Mes revenus</div>
        <button onClick={() => { setShowModalRevenu(false); setErreurRevenu(null) }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: t.textMuted }}>×</button>
      </div>
      {erreurRevenu && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>⚠️ {erreurRevenu}</div>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {formRevenus.map((r, i) => (
  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <input
      placeholder="ex: Salaire"
      value={r.libelle}
      onChange={e => { const u = [...formRevenus]; u[i] = { ...u[i], libelle: e.target.value }; setFormRevenus(u) }}
      style={{ flex: 1, minWidth: 0, padding: '8px 8px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
    />
    <input
      type="number"
      min="0"
      placeholder="0"
      value={r.montant || ''}
      onChange={e => { const u = [...formRevenus]; u[i] = { ...u[i], montant: e.target.value }; setFormRevenus(u) }}
      style={{ width: 70, padding: '8px 6px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }}
    />
    <span style={{ fontSize: 12, color: t.textMuted }}>€</span>
    <button onClick={() => setFormRevenus(formRevenus.filter((_, j) => j !== i))} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '4px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
  </div>
))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
  <input
    placeholder="Libellé..."
    value={newRevenuLibelle}
    onChange={e => setNewRevenuLibelle(e.target.value)}
    style={{ flex: 1, minWidth: 0, padding: '8px 8px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
  />
  <input
    type="number"
    min="0"
    placeholder="0"
    value={newRevenuMontant}
    onChange={e => setNewRevenuMontant(e.target.value)}
    style={{ width: 70, padding: '8px 6px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }}
  />
  <button
    onClick={() => newRevenuLibelle.trim() && (setFormRevenus([...formRevenus, { libelle: newRevenuLibelle, montant: newRevenuMontant }]), setNewRevenuLibelle(''), setNewRevenuMontant(''))}
    style={{ background: t.bgSecondary, color: t.text, border: `0.5px solid ${t.border}`, borderRadius: 7, padding: '8px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
  >
    + Ajouter
  </button>
</div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { setShowModalRevenu(false); setErreurRevenu(null) }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
        <button onClick={handleSaveRevenu} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {loading ? '⏳ Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  </div>
)}

      <Navbar page="Mes Finances" initiale={initiale} photoUrl={photoUrl} />
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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 12, padding: 12, flex: 1 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Investissable / mois</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: reelInvestissable >= investissable20 ? '#4CAF2E' : '#E24B4A', marginBottom: 6 }}>{reelInvestissable} € <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400 }}>/mois</span></div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>Objectif 20% : <span style={{ fontWeight: 500, color: t.text }}>{investissable20} €</span></div>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', borderRadius: 3, background: reelInvestissable >= investissable20 ? bleu : '#E24B4A', width: `${Math.min(Math.max(pourcentageReel, 0), 100)}%`, transition: 'width 0.3s' }} />
            </div>
            {pourcentageReel >= 20 ? (
              <div style={{ fontSize: 10, color: '#fff', background: bleu, padding: '5px 8px', borderRadius: 6, fontWeight: 500 }}>🎉 Bravo ! Vous investissez {pourcentageReel}% de vos revenus !</div>
            ) : pourcentageReel > 0 ? (
              <div style={{ fontSize: 10, color: '#E24B4A', background: '#FCEBEB', padding: '5px 8px', borderRadius: 6 }}>⚠️ Seulement {pourcentageReel}% investis — objectif : 20%</div>
            ) : totalRevenus > 0 ? (
  <div style={{ fontSize: 10, color: '#E24B4A', background: '#FCEBEB', padding: '5px 8px', borderRadius: 6 }}>⚠️ Vos dépenses dépassent vos revenus !</div>
) : null}
            {reelInvestissable > 0 && (
              <button onClick={() => setShowSimulateur(true)} style={{ width: '100%', marginTop: 10, background: '#EAF6E4', color: '#2E7D1E', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                📈 Voir ma projection de croissance
              </button>
            )}
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Mes finances</div>
            {succesRevenu && <div style={{ fontSize: 11, color: '#2E7D1E', background: '#EAF6E4', padding: '5px 8px', borderRadius: 6, marginBottom: 8 }}>✓ Revenus sauvegardés !</div>}
            {succesDepenses && <div style={{ fontSize: 11, color: '#2E7D1E', background: '#EAF6E4', padding: '5px 8px', borderRadius: 6, marginBottom: 8 }}>✓ Dépenses sauvegardées !</div>}
            {[
  ...(revenus.length > 0 
    ? revenus.map(r => [r.libelle, `${parseFloat(r.montant).toLocaleString('fr-FR')} €`, '#4CAF2E'])
    : [['Revenus', `${finances.revenus || 0} €`, '#4CAF2E']]),
  ['Dépenses fixes', `-${Math.round(totalDepensesFixes)} €`, '#E24B4A'],
  ['Dépenses variables', `-${Math.round(totalDepensesVariables)} €`, '#BA7517'],
  ['Échéances', `-${Math.round(totalEcheances)} €`, '#BA7517'],
  ["Capacité d'investissement", `${reelInvestissable} €`, reelInvestissable >= investissable20 ? '#4CAF2E' : '#E24B4A'],
].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `0.5px solid ${t.border}` }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
  <button onClick={() => { 
    setFormRevenus(revenus.length > 0 ? revenus.map(r => ({ libelle: r.libelle, montant: r.montant })) : [{ libelle: 'Salaire', montant: finances.revenus || '' }])
    setErreurRevenu(null)
    setShowModalRevenu(true) 
  }} style={{ width: '100%', background: bleu, color: '#fff', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
    + Modifier mes revenus
  </button>
  <button onClick={() => { setErreurDepenses(null); setShowModalDepenses(true) }} style={{ width: '100%', background: t.bgSecondary, color: t.text, fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: `0.5px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
    + Modifier mes dépenses
  </button>
</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>

{questionnaireDone === false && (
  <div style={{ background: '#034065', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ background: '#4CAF2E', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.05em' }}>Nouveau</span>
      <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Ton analyse financière personnalisée par l'IA est disponible !</span>
    </div>
    <button
      onClick={() => setShowQuestionnaire(true)}
      style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
    >
      Découvrir →
    </button>
  </div>
)}
          {alertes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alertes.map((a, i) => (
                <div key={i} style={{ background: bleuAlerte, border: `0.5px solid ${bleuAlerteBorder}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: bleuAlerteText }}>{a.type === 'ce mois' ? 'Échéance ce mois — ' : 'Échéance dans 1 mois — '}</span>
                  <span style={{ fontSize: 12, color: bleuAlerteText }}>{a.libelle} · {a.montant_annuel} €</span>
                </div>
              ))}
            </div>
          )}

          {/* BLOC ANALYSE IA */}
{questionnaireDone === true && (
  <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>🧠 Ton analyse personnalisée</div>
      <button
        onClick={async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) genererAnalyse(user.id)
        }}
        style={{ fontSize: 11, color: bleu, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        ↻ Actualiser
      </button>
    </div>

    {analyseLoading ? (
      <div style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', padding: '20px 0' }}>
        ⏳ Génération de ton analyse...
      </div>
    ) : analyseIA ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{analyseIA.bilan}</p>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.text, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Recommandations</div>
          {analyseIA.recommandations?.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
              <span style={{ color: '#4CAF2E', fontWeight: 700, flexShrink: 0 }}>•</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ background: bleu + '10', border: `0.5px solid ${bleu}30`, borderRadius: 8, padding: '10px 12px', fontSize: 12, color: bleu, lineHeight: 1.6 }}>
          ✨ {analyseIA.prochaine_etape}
        </div>
      </div>
    ) : (
      <div style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', padding: '20px 0' }}>
        Ton analyse sera générée automatiquement.
      </div>
    )}
  </div>
)}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Règle 50 / 30 / 20</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>50% besoins · 30% envies · 20% investissement</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Besoins (dépenses fixes)', regle5030.besoins, 50, couleurBesoins],
                ['Envies (dépenses variables)', regle5030.envies, 30, couleurEnvies],
                ["Capacité d'investissement", regle5030.invest, 20, couleurInvest],
              ].map(([label, val, objectif, couleur]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: t.textSecondary }}>{label}</span>
                    <span style={{ fontWeight: 500, color: couleur }}>{val}% <span style={{ color: t.textMuted, fontWeight: 400 }}>/ {objectif}%</span></span>
                  </div>
                  <div style={{ background: t.bgSecondary, borderRadius: 3, height: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: couleur, width: `${Math.min(Math.abs(val), 100)}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `0.5px solid ${t.border}`, gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Calendrier des échéances</div>
                {echeances.length > 0 && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Provision totale : <span style={{ color: '#4CAF2E', fontWeight: 500 }}>{Math.round(totalEcheances)} €/mois</span></div>}
              </div>
              <button onClick={() => { setShowAddEch(v => !v); setErreurEcheance(null) }} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {showAddEch ? '− Fermer' : '+ Ajouter'}
              </button>
            </div>

            {showAddEch && (
              <div style={{ padding: '12px 16px', background: t.bgSecondary, borderBottom: `0.5px solid ${t.border}` }}>
                {erreurEcheance && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#E24B4A', marginBottom: 8 }}>⚠️ {erreurEcheance}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Catégorie</div>
                    <select value={formEch.categorie} onChange={e => setFormEch({ ...formEch, categorie: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, boxSizing: 'border-box' }}>
                      <option value="">Sélectionner</option>
                      {categoriesListe.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Libellé</div>
                    <input placeholder={placeholders[formEch.categorie] || 'ex: Libellé'} value={formEch.libelle} onChange={e => setFormEch({ ...formEch, libelle: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Mois</div>
                    <select value={formEch.mois} onChange={e => setFormEch({ ...formEch, mois: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, boxSizing: 'border-box' }}>
                      <option value="">Sélectionner</option>
                      {moisListe.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Montant annuel (€)</div>
                    <input type="number" min="0" placeholder="ex: 600" value={formEch.montant_annuel} onChange={e => setFormEch({ ...formEch, montant_annuel: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={handleAddEcheance} disabled={loading} style={{ background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: isMobile ? '9px 12px' : '7px 12px', borderRadius: 7, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    {loading ? '...' : 'Ajouter'}
                  </button>
                </div>
              </div>
            )}

            {echeances.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Aucune échéance. Cliquez sur "+ Ajouter" pour commencer</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: t.bgSecondary }}>
                      {['Catégorie', 'Libellé de la dépense', 'Mois', 'Montant annuel', 'Provision / mois', ''].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(echeancesParCategorie).map(([cat, items]) => (
                      items.map((e, i) => (
                        <tr key={e.id} style={{ borderBottom: `0.5px solid ${t.border}`, background: editingId === e.id ? t.bgSecondary : 'transparent' }}>
                          {i === 0 && <td rowSpan={items.length} style={{ padding: '8px 14px', fontWeight: 500, color: t.text, verticalAlign: 'middle', borderRight: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 11 }}>{cat}</td>}
                          {editingId === e.id ? (
                            <>
                              <td style={{ padding: '6px 8px' }}><input value={editForm.libelle} onChange={ev => setEditForm({ ...editForm, libelle: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} /></td>
                              <td style={{ padding: '6px 8px' }}><select value={editForm.mois} onChange={ev => setEditForm({ ...editForm, mois: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }}>{moisListe.map(m => <option key={m} value={m}>{m}</option>)}</select></td>
                              <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.montant_annuel} onChange={ev => setEditForm({ ...editForm, montant_annuel: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} /></td>
                              <td style={{ padding: '6px 8px', color: '#4CAF2E', fontWeight: 500 }}>{Math.round(parseFloat(editForm.montant_annuel) / 12)} €</td>
                              <td style={{ padding: '6px 8px' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button onClick={() => handleEditSave(e.id)} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                                  <button onClick={() => setEditingId(null)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '7px 14px', color: t.text }}>{e.libelle}</td>
                              <td style={{ padding: '7px 14px', color: t.textSecondary }}>{e.mois}</td>
                              <td style={{ padding: '7px 14px', color: t.text, fontWeight: 500 }}>{parseFloat(e.montant_annuel).toLocaleString('fr-FR')} €</td>
                              <td style={{ padding: '7px 14px', color: '#4CAF2E', fontWeight: 500 }}>{Math.round(parseFloat(e.montant_annuel) / 12)} €</td>
                              <td style={{ padding: '7px 14px' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button onClick={() => handleEditStart(e)} style={{ background: bleuBg, color: bleu, border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️</button>
                                  <button onClick={() => handleDeleteEcheance(e.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ))}
                    <tr style={{ background: t.bgSecondary, borderTop: `0.5px solid ${t.border}` }}>
                      <td colSpan={3} style={{ padding: '8px 14px', fontWeight: 500, color: t.text, fontSize: 11 }}>TOTAL</td>
                      <td style={{ padding: '8px 14px', fontWeight: 500, color: t.text }}>{totalAnnuel.toLocaleString('fr-FR')} €</td>
                      <td style={{ padding: '8px 14px', fontWeight: 500, color: '#4CAF2E' }}>{Math.round(totalEcheances)} €</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterApp />
    </div>
  )
}