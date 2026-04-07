import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const moisListe = ['Mensuel', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const categoriesListe = ['Logement', 'Véhicules', 'Abonnement', 'Santé', 'Impôts', 'Assurances', 'Autres']

const placeholders = {
  'Logement': 'ex: Taxe foncière',
  'Véhicules': 'ex: Contrôle technique',
  'Abonnement': 'ex: Netflix',
  'Santé': 'ex: Mutuelle',
  'Impôts': 'ex: Impôt sur le revenu',
  'Assurances': 'ex: Assurance auto',
  'Autres': 'ex: Cotisation club',
}

function simulerDCA(versement, capitalInitial, taux, annees) {
  const tauxMensuel = taux / 100 / 12
  let capital = capitalInitial
  const labels = []
  const investi = []
  const interets = []
  for (let an = 0; an <= annees; an++) {
    if (an > 0) {
      for (let m = 0; m < 12; m++) {
        capital = capital * (1 + tauxMensuel) + versement
      }
    }
    const totalInvesti = capitalInitial + versement * an * 12
    labels.push('An ' + an)
    investi.push(Math.round(totalInvesti))
    interets.push(Math.max(0, Math.round(capital - totalInvesti)))
  }
  return { labels, investi, interets, final: Math.round(capital) }
}

function PopupSimulateur({ versement, onClose }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [duree, setDuree] = useState(10)
  const [ready, setReady] = useState(false)
  const taux = 7

  useEffect(() => {
    const loadChart = () => {
      if (window.Chart) { setReady(true); return }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      script.onload = () => setReady(true)
      document.head.appendChild(script)
    }
    loadChart()
  }, [])

  useEffect(() => {
    if (!ready || !canvasRef.current) return
    const { labels, investi, interets } = simulerDCA(versement, 0, taux, duree)
    if (chartRef.current) chartRef.current.destroy()
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Capital investi', data: investi, backgroundColor: '#E3F0FF', stack: 'a' },
          { label: 'Intérêts', data: interets, backgroundColor: '#4CAF2E', stack: 'a' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ' : ' + Math.round(ctx.raw).toLocaleString('fr-FR') + ' €' } }
        },
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 560, border: '0.5px solid #E0EAE3', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B' }}>Projection de croissance</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Basé sur {versement.toLocaleString('fr-FR')} €/mois · taux 7%/an</div>
          </div>
          <button onClick={onClose} style={{ background: '#F4F7F5', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 14, cursor: 'pointer', color: '#6B7280' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[10, 20, 30].map(d => (
            <div key={d} onClick={() => setDuree(d)} style={{ fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', background: duree === d ? '#1B2E4B' : '#F4F7F5', color: duree === d ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3' }}>{d} ans</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
          {[
            ['Total investi', `${totalInvesti.toLocaleString('fr-FR')} €`, '#1B2E4B'],
            ['Capital final', `${final.toLocaleString('fr-FR')} €`, '#4CAF2E'],
            ['Intérêts générés', `+${totalInterets.toLocaleString('fr-FR')} €`, '#4CAF2E'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: '#F4F7F5', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {ready ? (
          <div style={{ position: 'relative', height: 220 }}>
            <canvas ref={canvasRef} />
          </div>
        ) : (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 12 }}>Chargement...</div>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Intérêts composés
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useTheme()
  const [finances, setFinances] = useState({ revenus: 0, autre_revenu: 0, depenses_fixes: 0, depenses_variables: 0 })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ revenus: '', autre_revenu: '', depenses_fixes: '', depenses_variables: '' })
  const [echeances, setEcheances] = useState([])
  const [formEch, setFormEch] = useState({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [alertes, setAlertes] = useState([])
  const [showAddEch, setShowAddEch] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ libelle: '', mois: '', montant_annuel: '' })
  const [showSimulateur, setShowSimulateur] = useState(false)

  const totalRevenus = (parseFloat(finances.revenus) || 0) + (parseFloat(finances.autre_revenu) || 0)
  const totalDepenses = (parseFloat(finances.depenses_fixes) || 0) + (parseFloat(finances.depenses_variables) || 0)
  const totalEcheances = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0)
  const totalAnnuel = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0), 0)

  const investissable20 = Math.round(totalRevenus * 0.20)
  const reelInvestissable = Math.round(totalRevenus - totalDepenses - totalEcheances)
  const pourcentageReel = totalRevenus > 0 ? Math.round((reelInvestissable / totalRevenus) * 100) : 0
  const moisActuel = new Date().getMonth()

  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'
  const bleuBg = t.dark ? 'rgba(59,130,246,0.15)' : '#E8EEF6'

  const regle5030 = totalRevenus > 0 ? {
    besoins: Math.round((parseFloat(finances.depenses_fixes) || 0) / totalRevenus * 100),
    envies: Math.round((parseFloat(finances.depenses_variables) || 0) / totalRevenus * 100),
    invest: pourcentageReel,
  } : { besoins: 0, envies: 0, invest: 0 }

  const couleurBesoins = regle5030.besoins > 50 ? '#E24B4A' : bleu
  const couleurEnvies = regle5030.envies > 30 ? '#E24B4A' : bleu
  const couleurInvest = regle5030.invest < 20 ? '#E24B4A' : bleu

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: fin } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
      if (fin) setFinances(fin)
      const { data: ech } = await supabase.from('echeances').select('*').eq('user_id', user.id)
      if (ech) {
        setEcheances(ech)
        const alertesTemp = []
        ech.forEach(e => {
          const moisEch = moisListe.indexOf(e.mois)
          const diff = moisEch - moisActuel
          if (diff === 1) alertesTemp.push({ ...e, type: '1 mois' })
          if (diff === 0) alertesTemp.push({ ...e, type: '7 jours' })
        })
        setAlertes(alertesTemp)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const payload = {
      user_id: currentUser.id,
      revenus: parseFloat(form.revenus) || 0,
      autre_revenu: parseFloat(form.autre_revenu) || 0,
      depenses_fixes: parseFloat(form.depenses_fixes) || 0,
      depenses_variables: parseFloat(form.depenses_variables) || 0,
    }
    const { data: existing } = await supabase.from('finances').select('*').eq('user_id', currentUser.id).single()
    if (existing) await supabase.from('finances').update(payload).eq('user_id', currentUser.id)
    else await supabase.from('finances').insert(payload)
    setFinances(payload)
    setShowModal(false)
    setLoading(false)
  }

  const handleAddEcheance = async () => {
    if (!formEch.categorie || !formEch.libelle || !formEch.mois || !formEch.montant_annuel) return
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return
    const payload = {
      user_id: currentUser.id,
      categorie: formEch.categorie,
      libelle: formEch.libelle,
      mois: formEch.mois,
      montant_annuel: parseFloat(formEch.montant_annuel)
    }
    const { data, error } = await supabase.from('echeances').insert(payload).select().single()
    if (data) {
      setEcheances(prev => [...prev, data])
      setFormEch({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
    }
    if (error) console.error('Erreur:', error)
  }

  const handleDeleteEcheance = async (id) => {
    await supabase.from('echeances').delete().eq('id', id)
    setEcheances(prev => prev.filter(e => e.id !== id))
  }

  const handleEditStart = (e) => {
    setEditingId(e.id)
    setEditForm({ libelle: e.libelle, mois: e.mois, montant_annuel: e.montant_annuel })
  }

  const handleEditSave = async (id) => {
    const payload = {
      libelle: editForm.libelle,
      mois: editForm.mois,
      montant_annuel: parseFloat(editForm.montant_annuel)
    }
    await supabase.from('echeances').update(payload).eq('id', id)
    setEcheances(prev => prev.map(e => e.id === id ? { ...e, ...payload } : e))
    setEditingId(null)
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  const echeancesParCategorie = categoriesListe.reduce((acc, cat) => {
    const items = echeances.filter(e => e.categorie?.toLowerCase() === cat.toLowerCase())
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showSimulateur && (
        <PopupSimulateur versement={reelInvestissable} onClose={() => setShowSimulateur(false)} />
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: '32px 28px', width: 400, border: `0.5px solid ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 20 }}>Modifier mes finances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Revenus</div>
              {[['Salaire / Revenus principaux (€)', 'revenus', 'ex: 3400'], ['Autres revenus (€)', 'autre_revenu', 'ex: 200']].map(([label, key, ph]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                  <input type="number" placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
                </div>
              ))}
              <div style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>Dépenses</div>
              {[['Dépenses fixes — Besoins (€)', 'depenses_fixes', 'ex: 1500'], ['Dépenses variables — Envies (€)', 'depenses_variables', 'ex: 500']].map(([label, key, ph]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                  <input type="number" placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar page="Mes Finances" initiale={initiale} />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, padding: 12, flex: 1, minHeight: 0, overflow: 'auto' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Investissable / mois</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: reelInvestissable >= investissable20 ? '#4CAF2E' : '#E24B4A', marginBottom: 6 }}>{reelInvestissable} € <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400 }}>/mois</span></div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>Objectif 20% : <span style={{ fontWeight: 500, color: t.text }}>{investissable20} €</span></div>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', borderRadius: 3, background: reelInvestissable >= investissable20 ? bleu : '#E24B4A', width: `${Math.min(Math.max(pourcentageReel, 0), 100)}%`, transition: 'width 0.3s' }} />
            </div>
            {pourcentageReel >= 20 ? (
              <div style={{ fontSize: 10, color: '#fff', background: bleu, padding: '5px 8px', borderRadius: 6, fontWeight: 500 }}>
                🎉 Bravo ! Vous investissez {pourcentageReel}% de vos revenus !
              </div>
            ) : pourcentageReel > 0 ? (
              <div style={{ fontSize: 10, color: '#E24B4A', background: '#FCEBEB', padding: '5px 8px', borderRadius: 6 }}>
                ⚠️ Seulement {pourcentageReel}% investis — objectif : 20%
              </div>
            ) : (
              <div style={{ fontSize: 10, color: '#E24B4A', background: '#FCEBEB', padding: '5px 8px', borderRadius: 6 }}>
                ⚠️ Vos dépenses dépassent vos revenus !
              </div>
            )}
            {reelInvestissable > 0 && (
              <button onClick={() => setShowSimulateur(true)} style={{ width: '100%', marginTop: 10, background: '#EAF6E4', color: '#2E7D1E', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                📈 Voir ma projection de croissance
              </button>
            )}
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Mes finances</div>
            {[
              ['Revenus', `${finances.revenus || 0} €`, '#4CAF2E'],
              ['Autres revenus', `${finances.autre_revenu || 0} €`, '#4CAF2E'],
              ['Dép. fixes', `-${finances.depenses_fixes || 0} €`, '#E24B4A'],
              ['Dép. variables', `-${finances.depenses_variables || 0} €`, '#BA7517'],
              ['Échéances', `-${Math.round(totalEcheances)} €`, '#BA7517'],
              ['Investissable', `${reelInvestissable} €`, reelInvestissable >= investissable20 ? '#4CAF2E' : '#E24B4A'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `0.5px solid ${t.border}` }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</span>
              </div>
            ))}
            <button onClick={() => { setForm({ revenus: finances.revenus || '', autre_revenu: finances.autre_revenu || '', depenses_fixes: finances.depenses_fixes || '', depenses_variables: finances.depenses_variables || '' }); setShowModal(true) }} style={{ width: '100%', marginTop: 10, background: bleu, color: '#fff', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Modifier mes finances
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>

          {alertes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alertes.map((a, i) => (
                <div key={i} style={{ background: a.type === '7 jours' ? '#FCEBEB' : '#FFF8E6', border: `0.5px solid ${a.type === '7 jours' ? '#F09595' : '#FAC775'}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{a.type === '7 jours' ? '🔴' : '🟠'}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: a.type === '7 jours' ? '#A32D2D' : '#633806' }}>Échéance dans {a.type} — {a.libelle} · {a.montant_annuel} €</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Règle 50 / 30 / 20</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>50% besoins · 30% envies · 20% investissement</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Besoins (dép. fixes)', regle5030.besoins, 50, couleurBesoins],
                ['Envies (dép. variables)', regle5030.envies, 30, couleurEnvies],
                ['Investissement', regle5030.invest, 20, couleurInvest],
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `0.5px solid ${t.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Calendrier des échéances</div>
                {echeances.length > 0 && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Provision totale : <span style={{ color: '#4CAF2E', fontWeight: 500 }}>{Math.round(totalEcheances)} €/mois</span></div>}
              </div>
              <button onClick={() => setShowAddEch(v => !v)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {showAddEch ? '− Fermer' : '+ Ajouter'}
              </button>
            </div>

            {showAddEch && (
              <div style={{ padding: '12px 16px', background: t.bgSecondary, borderBottom: `0.5px solid ${t.border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Catégorie</div>
                    <select value={formEch.categorie} onChange={e => setFormEch({ ...formEch, categorie: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }}>
                      <option value="">Sélectionner</option>
                      {categoriesListe.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Libellé</div>
                    <input placeholder={placeholders[formEch.categorie] || 'ex: Libellé'} value={formEch.libelle} onChange={e => setFormEch({ ...formEch, libelle: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Mois</div>
                    <select value={formEch.mois} onChange={e => setFormEch({ ...formEch, mois: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }}>
                      <option value="">Sélectionner</option>
                      {moisListe.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 3 }}>Montant annuel (€)</div>
                    <input type="number" placeholder="ex: 600" value={formEch.montant_annuel} onChange={e => setFormEch({ ...formEch, montant_annuel: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} />
                  </div>
                  <button onClick={handleAddEcheance} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Ajouter</button>
                </div>
              </div>
            )}

            {echeances.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
                Aucune échéance — cliquez sur "+ Ajouter" pour commencer
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
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
                        {i === 0 && (
                          <td rowSpan={items.length} style={{ padding: '8px 14px', fontWeight: 500, color: t.text, verticalAlign: 'middle', borderRight: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 11 }}>
                            {cat}
                          </td>
                        )}
                        {editingId === e.id ? (
                          <>
                            <td style={{ padding: '6px 8px' }}>
                              <input value={editForm.libelle} onChange={ev => setEditForm({ ...editForm, libelle: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <select value={editForm.mois} onChange={ev => setEditForm({ ...editForm, mois: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }}>
                                {moisListe.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" value={editForm.montant_annuel} onChange={ev => setEditForm({ ...editForm, montant_annuel: ev.target.value })} style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} />
                            </td>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}