import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

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
  { destination: 'Sécurité (Matelas)', compte: 'Livret A', pourcentage: 30, ordre: 0 },
  { destination: 'Projets (voyages, vacances...)', compte: 'Livret A', pourcentage: 20, ordre: 1 },
  { destination: 'Investissement', compte: 'PEA', pourcentage: 50, ordre: 2 },
]

const TYPES_DISPONIBILITE = {
  'sécurité': { color: '#4CAF2E' },
  'investissement': { color: '#1B2E4B' },
  'immobilier': { color: '#BA7517' },
  'autre': { color: '#9CA3AF' },
}

const COULEURS = ['#1B2E4B', '#4CAF2E', '#BA7517', '#3B82F6', '#E24B4A', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899']

export default function Portefeuille() {
  const t = useTheme()
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [comptes, setComptes] = useState([])
  const [virements, setVirements] = useState([])
  const [editingIdx, setEditingIdx] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPredefini, setSelectedPredefini] = useState('Livret A')
  const [newNomCustom, setNewNomCustom] = useState('')
  const [newTypeCustom, setNewTypeCustom] = useState('sécurité')
  const [newDispoCustom, setNewDispoCustom] = useState('Immédiate')
  const [newSolde, setNewSolde] = useState('')
  const [newObjectif, setNewObjectif] = useState('')
  const [depensesFixes, setDepensesFixes] = useState(0)
  const [investissable, setInvestissable] = useState(0)
  const [chartReady, setChartReady] = useState(false)
  const [user, setUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [nbMoisMatelas, setNbMoisMatelas] = useState(6)

  const total = comptes.reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)
  const totalSecurite = comptes.filter(c => c.type === 'sécurité').reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)
  const objectifMatelas = depensesFixes * nbMoisMatelas
  const remplissageMatelas = objectifMatelas > 0 ? Math.min(Math.round((totalSecurite / objectifMatelas) * 100), 100) : 0
  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'
  const totalPourcentage = virements.reduce((acc, v) => acc + (parseFloat(v.pourcentage) || 0), 0)
  const predefiniSelectionne = COMPTES_PREDEFINIS.find(c => c.nom === selectedPredefini)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data: fin } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
      if (fin) {
        const { data: dep } = await supabase.from('depenses').select('*').eq('user_id', user.id)
        const totalDep = dep ? dep.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0) : 0
        const { data: ech } = await supabase.from('echeances').select('*').eq('user_id', user.id)
        const totalEch = ech ? ech.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0) : 0
        const totalRev = (fin.revenus || 0) + (fin.autre_revenu || 0)
        setDepensesFixes(Math.round((fin.depenses_fixes || 0)))
        setInvestissable(Math.round(totalRev - totalDep - totalEch))
      }

      const { data: comptesData } = await supabase.from('comptes').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
      if (comptesData && comptesData.length > 0) setComptes(comptesData)
      else setComptes(COMPTES_DEFAULT)

      const { data: virementsData } = await supabase.from('virements').select('*').eq('user_id', user.id).order('ordre', { ascending: true })
      if (virementsData && virementsData.length > 0) setVirements(virementsData)
      else setVirements(VIREMENTS_DEFAULT)

      setLoaded(true)
    }
    fetchData()

    if (!window.Chart) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      script.onload = () => setChartReady(true)
      document.head.appendChild(script)
    } else {
      setChartReady(true)
    }
  }, [])

  useEffect(() => {
    if (!chartReady || !canvasRef.current || total === 0) return
    const comptesAvecSolde = comptes.filter(c => parseFloat(c.solde) > 0)
    if (comptesAvecSolde.length === 0) return
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: comptesAvecSolde.map(c => c.nom),
        datasets: [{
          data: comptesAvecSolde.map(c => parseFloat(c.solde)),
          backgroundColor: COULEURS.slice(0, comptesAvecSolde.length),
          borderWidth: 0,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label} : ${Math.round(ctx.raw).toLocaleString('fr-FR')} € (${Math.round(ctx.raw / total * 100)}%)`
            }
          }
        }
      }
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [chartReady, comptes, total])

  const saveComptes = async (newComptes) => {
    if (!user || !loaded) return
    setSaving(true)
    await supabase.from('comptes').delete().eq('user_id', user.id)
    if (newComptes.length > 0) {
      await supabase.from('comptes').insert(newComptes.map(c => ({
        user_id: user.id,
        nom: c.nom,
        type: c.type,
        disponibilite: c.disponibilite,
        solde: parseFloat(c.solde) || 0,
        objectif: parseFloat(c.objectif) || 0,
      })))
    }
    setSaving(false)
  }

  const saveVirements = async (newVirements) => {
    if (!user || !loaded) return
    await supabase.from('virements').delete().eq('user_id', user.id)
    if (newVirements.length > 0) {
      await supabase.from('virements').insert(newVirements.map((v, i) => ({
        user_id: user.id,
        destination: v.destination,
        compte: v.compte,
        pourcentage: parseFloat(v.pourcentage) || 0,
        ordre: i,
      })))
    }
  }

  const couleurType = (type) => TYPES_DISPONIBILITE[type]?.color || '#9CA3AF'

  const handleEditStart = (i) => {
    setEditingIdx(i)
    setEditForm({ solde: comptes[i].solde, objectif: comptes[i].objectif })
  }

  const handleEditSave = async (i) => {
    const updated = [...comptes]
    updated[i] = { ...updated[i], solde: parseFloat(editForm.solde) || 0, objectif: parseFloat(editForm.objectif) || 0 }
    setComptes(updated)
    setEditingIdx(null)
    await saveComptes(updated)
  }

  const handleDelete = async (i) => {
    const updated = comptes.filter((_, j) => j !== i)
    setComptes(updated)
    await saveComptes(updated)
  }

  const handleAdd = async () => {
    const isAutre = selectedPredefini === 'Autre'
    const nom = isAutre ? newNomCustom.trim() : selectedPredefini
    if (!nom) return
    const type = isAutre ? newTypeCustom : predefiniSelectionne.type
    const disponibilite = isAutre ? newDispoCustom : predefiniSelectionne.disponibilite
    const updated = [...comptes, { nom, type, disponibilite, solde: parseFloat(newSolde) || 0, objectif: parseFloat(newObjectif) || 0 }]
    setComptes(updated)
    setSelectedPredefini('Livret A')
    setNewNomCustom('')
    setNewSolde('')
    setNewObjectif('')
    setShowAdd(false)
    await saveComptes(updated)
  }

  const handleVirementChange = async (i, field, value) => {
    const updated = [...virements]
    updated[i] = { ...updated[i], [field]: value }
    setVirements(updated)
    await saveVirements(updated)
  }

  const inputStyle = { padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, width: '100%' }

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar page="Portefeuille" />

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>Tableau des avoirs</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Gérez vos comptes et enveloppes</div>
          </div>
          <button onClick={() => setShowAdd(v => !v)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {showAdd ? '− Fermer' : '+ Ajouter un compte'}
          </button>
        </div>

        {showAdd && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 12 }}>Nouveau compte</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Compte / Support</div>
                <select value={selectedPredefini} onChange={e => setSelectedPredefini(e.target.value)} style={inputStyle}>
                  {COMPTES_PREDEFINIS.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                </select>
                {selectedPredefini === 'Autre' && (
                  <input placeholder="Nom du compte" value={newNomCustom} onChange={e => setNewNomCustom(e.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type</div>
                {selectedPredefini === 'Autre' ? (
                  <select value={newTypeCustom} onChange={e => setNewTypeCustom(e.target.value)} style={inputStyle}>
                    {Object.keys(TYPES_DISPONIBILITE).map(ty => <option key={ty} value={ty}>{ty}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '6px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, background: t.bgSecondary, color: t.textMuted }}>
                    {predefiniSelectionne?.type}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Disponibilité</div>
                {selectedPredefini === 'Autre' ? (
                  <select value={newDispoCustom} onChange={e => setNewDispoCustom(e.target.value)} style={inputStyle}>
                    {['Immédiate', 'Quelques jours', 'Bloqué (5 ans)'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '6px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, background: t.bgSecondary, color: t.textMuted }}>
                    {predefiniSelectionne?.disponibilite}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Solde actuel (€)</div>
                <input type="number" placeholder="0" value={newSolde} onChange={e => setNewSolde(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Objectif (€)</div>
                <input type="number" placeholder="0" value={newObjectif} onChange={e => setNewObjectif(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={handleAdd} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {saving ? '...' : 'Ajouter'}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
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
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: couleurType(c.type) + '20', color: couleurType(c.type) }}>{c.type}</span>
                            </td>
                            <td style={{ padding: '10px 14px', color: t.textSecondary, fontSize: 11 }}>{c.disponibilite}</td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" value={editForm.solde} onChange={e => setEditForm({ ...editForm, solde: e.target.value })} style={{ ...inputStyle, width: 90 }} />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" value={editForm.objectif} onChange={e => setEditForm({ ...editForm, objectif: e.target.value })} style={{ ...inputStyle, width: 90 }} />
                            </td>
                            <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                            <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                            <td style={{ padding: '6px 8px' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button onClick={() => handleEditSave(i)} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                                <button onClick={() => setEditingIdx(null)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{c.nom}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: couleurType(c.type) + '20', color: couleurType(c.type) }}>{c.type}</span>
                            </td>
                            <td style={{ padding: '10px 14px', color: t.textSecondary, fontSize: 11 }}>{c.disponibilite}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{(parseFloat(c.solde) || 0).toLocaleString('fr-FR')} €</td>
                            <td style={{ padding: '10px 14px', color: t.textSecondary }}>{c.objectif > 0 ? (parseFloat(c.objectif) || 0).toLocaleString('fr-FR') + ' €' : '—'}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 500, color: remplissage >= 100 ? '#4CAF2E' : t.text }}>{c.objectif > 0 ? remplissage + '%' : '—'}</td>
                            <td style={{ padding: '10px 14px', minWidth: 100 }}>
                              {c.objectif > 0 ? (
                                <div style={{ background: t.bgSecondary, borderRadius: 3, height: 6, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', borderRadius: 3, background: remplissage >= 100 ? '#4CAF2E' : bleu, width: `${remplissage}%`, transition: 'width 0.3s' }} />
                                </div>
                              ) : '—'}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button onClick={() => handleEditStart(i)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️</button>
                                <button onClick={() => handleDelete(i)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
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

            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Matelas de sécurité</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                    Couvrir{' '}
                    <select
                      value={nbMoisMatelas}
                      onChange={e => setNbMoisMatelas(parseInt(e.target.value))}
                      style={{ padding: '2px 6px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
                    >
                      {[3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {' '}mois de dépenses fixes
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: remplissageMatelas >= 100 ? '#4CAF2E' : t.text }}>{totalSecurite.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>sur {objectifMatelas.toLocaleString('fr-FR')} € objectif</div>
                </div>
              </div>
              <div style={{ background: t.bgSecondary, borderRadius: 4, height: 10, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', borderRadius: 4, background: remplissageMatelas >= 100 ? '#4CAF2E' : bleu, width: `${remplissageMatelas}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: t.textMuted }}>
                  Dépenses fixes : <span style={{ fontWeight: 500, color: t.text }}>{depensesFixes.toLocaleString('fr-FR')} €/mois</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: remplissageMatelas >= 100 ? '#4CAF2E' : '#E24B4A' }}>
                  {remplissageMatelas}%{remplissageMatelas >= 100 && ' ✓'}
                </div>
              </div>
              {remplissageMatelas < 100 && objectifMatelas > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: bleu, background: bleu + '15', padding: '6px 10px', borderRadius: 7, border: `0.5px solid ${bleu}30` }}>
                  Il vous manque <strong>{(objectifMatelas - totalSecurite).toLocaleString('fr-FR')} €</strong> pour atteindre votre objectif de {nbMoisMatelas} mois
                </div>
              )}
              {remplissageMatelas >= 100 && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#2E7D1E', background: '#EAF6E4', padding: '6px 10px', borderRadius: 7 }}>
                  🎉 Votre matelas de sécurité est complet !
                </div>
              )}
            </div>

            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Plan de virement mensuel</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                  Basé sur votre investissable : <span style={{ fontWeight: 500, color: '#4CAF2E' }}>{investissable.toLocaleString('fr-FR')} €/mois</span>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: t.bgSecondary }}>
                    {['', 'Destination', 'Compte bancaire', 'Répartition (%)', 'Montant à virer ce mois'].map(h => (
                      <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {virements.map((v, i) => (
                    <tr key={i} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                      <td style={{ padding: '10px 14px' }}>
                        <input type="checkbox" style={{ accentColor: bleu }} />
                      </td>
                      <td style={{ padding: '10px 14px', color: t.text, fontWeight: 500 }}>{v.destination}</td>
                      <td style={{ padding: '8px 14px' }}>
                        <select
                          value={v.compte}
                          onChange={e => handleVirementChange(i, 'compte', e.target.value)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
                        >
                          {comptes.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={v.pourcentage}
                            onChange={e => handleVirementChange(i, 'pourcentage', parseFloat(e.target.value) || 0)}
                            style={{ width: 60, padding: '5px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }}
                          />
                          <span style={{ fontSize: 11, color: t.textMuted }}>%</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 500, color: '#4CAF2E' }}>
                        {Math.round(investissable * v.pourcentage / 100).toLocaleString('fr-FR')} €
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: t.bgSecondary, borderTop: `0.5px solid ${t.border}` }}>
                    <td colSpan={3} style={{ padding: '10px 14px', fontWeight: 500, color: t.text, fontSize: 11 }}>TOTAL</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: totalPourcentage === 100 ? '#4CAF2E' : '#E24B4A' }}>
                      {totalPourcentage}%
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>
                      {Math.round(investissable).toLocaleString('fr-FR')} €
                    </td>
                  </tr>
                </tbody>
              </table>
              {totalPourcentage !== 100 && (
                <div style={{ padding: '8px 16px', background: '#FCEBEB', borderTop: `0.5px solid ${t.border}` }}>
                  <span style={{ fontSize: 11, color: '#E24B4A' }}>⚠️ Le total des pourcentages doit être égal à 100% (actuellement {totalPourcentage}%)</span>
                </div>
              )}
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Répartition du portefeuille</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 16 }}>Total : {total.toLocaleString('fr-FR')} €</div>
              {total > 0 ? (
                <>
                  <div style={{ position: 'relative', height: 180, marginBottom: 16 }}>
                    <canvas ref={canvasRef} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pointerEvents: 'none' }}>
                      <div style={{ fontSize: 18, fontWeight: 500, color: t.text }}>{total.toLocaleString('fr-FR')} €</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>total</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {comptes.filter(c => parseFloat(c.solde) > 0).map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 2, background: COULEURS[i], flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: t.text }}>{c.nom}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: t.textMuted }}>{(parseFloat(c.solde) || 0).toLocaleString('fr-FR')} €</span>
                          <span style={{ fontSize: 11, fontWeight: 500, color: t.text, minWidth: 36, textAlign: 'right' }}>{Math.round((parseFloat(c.solde) / total) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: t.textMuted, fontSize: 12, padding: '40px 0' }}>
                  Ajoutez des soldes pour voir la répartition
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}