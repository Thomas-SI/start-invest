import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const moisListe = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const categoriesListe = ['Logement', 'Véhicules', 'Abonnement', 'Santé', 'Impôts', 'Assurances', 'Autres']

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useTheme()
  const [finances, setFinances] = useState({ revenus: 0, depenses: 0, pourcentage_invest: 20 })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ revenus: '', depenses: '', pourcentage_invest: '' })
  const [echeances, setEcheances] = useState([])
  const [formEch, setFormEch] = useState({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [alertes, setAlertes] = useState([])
  const [showAddEch, setShowAddEch] = useState(false)

  const disponible = finances.revenus - finances.depenses
  const totalEcheances = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0) / 12, 0)
  const investissable = Math.round((disponible - totalEcheances) * finances.pourcentage_invest / 100)
  const moisActuel = new Date().getMonth()
  const totalAnnuel = echeances.reduce((acc, e) => acc + (parseFloat(e.montant_annuel) || 0), 0)

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
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { user_id: user.id, revenus: parseFloat(form.revenus), depenses: parseFloat(form.depenses), pourcentage_invest: parseFloat(form.pourcentage_invest) }
    const { data: existing } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
    if (existing) await supabase.from('finances').update(payload).eq('user_id', user.id)
    else await supabase.from('finances').insert(payload)
    setFinances(payload)
    setShowModal(false)
    setLoading(false)
  }

  const handleAddEcheance = async () => {
    if (!formEch.categorie || !formEch.libelle || !formEch.mois || !formEch.montant_annuel) return
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      user_id: user.id,
      categorie: formEch.categorie,
      libelle: formEch.libelle,
      mois: formEch.mois,
      montant_annuel: parseFloat(formEch.montant_annuel)
    }
    const { data, error } = await supabase.from('echeances').insert(payload).select().single()
    if (data) {
      setEcheances(prev => [...prev, data])
      setFormEch({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
      setShowAddEch(false)
    }
    if (error) console.error('Erreur ajout échéance:', error)
  }

  const handleDeleteEcheance = async (id) => {
    await supabase.from('echeances').delete().eq('id', id)
    setEcheances(prev => prev.filter(e => e.id !== id))
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  const echeancesParCategorie = categoriesListe.reduce((acc, cat) => {
    const items = echeances.filter(e => e.categorie?.toLowerCase() === cat.toLowerCase())
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: '32px 28px', width: 360, border: `0.5px solid ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 20 }}>Modifier mes finances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Revenus mensuels (€)', 'revenus', 'ex: 3400'], ['Dépenses mensuelles (€)', 'depenses', 'ex: 2330'], ['% du disponible à investir', 'pourcentage_invest', 'ex: 20']].map(([label, key, ph]) => (
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
            <div style={{ fontSize: 22, fontWeight: 500, color: '#4CAF2E', marginBottom: 8 }}>{investissable} € <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400 }}>/mois</span></div>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#4CAF2E', width: `${Math.min(finances.pourcentage_invest, 100)}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted }}>
              <span>{finances.pourcentage_invest}% dispo</span><span>{Math.round(disponible)} € libre</span>
            </div>
          </div>

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Mes finances</div>
            {[
              ['Revenus', `${finances.revenus} €`, '#4CAF2E'],
              ['Dépenses', `${finances.depenses} €`, '#E24B4A'],
              ['Échéances', `-${Math.round(totalEcheances)} €`, '#BA7517'],
              ['Disponible', `${Math.round(disponible - totalEcheances)} €`, t.text],
              ['% investi', `${finances.pourcentage_invest}%`, '#4CAF2E'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `0.5px solid ${t.border}` }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</span>
              </div>
            ))}
            <button onClick={() => { setForm({ revenus: finances.revenus, depenses: finances.depenses, pourcentage_invest: finances.pourcentage_invest }); setShowModal(true) }} style={{ width: '100%', marginTop: 10, background: '#EAF6E4', color: '#2E7D1E', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
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
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>Résumé financier</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Taux d\'épargne', `${finances.revenus > 0 ? Math.round((disponible / finances.revenus) * 100) : 0}%`, '#4CAF2E'],
                ['Dépenses fixes', `${Math.round((finances.depenses / (finances.revenus || 1)) * 100)}% du revenu`, '#E24B4A'],
                ['Provision échéances', echeances.length > 0 ? `${Math.round(totalEcheances)} €/mois` : '—', '#BA7517'],
                ['Reste après invest.', `${Math.round(disponible - totalEcheances - investissable)} €`, t.text],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: t.bgSecondary, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
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
              <button onClick={() => setShowAddEch(!showAddEch)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
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
                    <input placeholder="ex: Taxe foncière" value={formEch.libelle} onChange={e => setFormEch({ ...formEch, libelle: e.target.value })} style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text }} />
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
                      <tr key={e.id} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                        {i === 0 && (
                          <td rowSpan={items.length} style={{ padding: '8px 14px', fontWeight: 500, color: t.text, verticalAlign: 'middle', borderRight: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 11 }}>
                            {cat}
                          </td>
                        )}
                        <td style={{ padding: '7px 14px', color: t.text }}>{e.libelle}</td>
                        <td style={{ padding: '7px 14px', color: t.textSecondary }}>{e.mois}</td>
                        <td style={{ padding: '7px 14px', color: t.text, fontWeight: 500 }}>{parseFloat(e.montant_annuel).toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '7px 14px', color: '#4CAF2E', fontWeight: 500 }}>{Math.round(parseFloat(e.montant_annuel) / 12)} €</td>
                        <td style={{ padding: '7px 14px' }}>
                          <button onClick={() => handleDeleteEcheance(e.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                        </td>
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