import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const ENVELOPPES = ['CTO', 'PEA', 'Assurance-vie']
const TYPES_ETF = ['Capitalisant', 'Distribuant']
const TYPES = ['Achat', 'Vente']

const ENVELOPPE_LABELS = {
  'CTO': 'Compte-Titres Ordinaire (CTO)',
  'PEA': "Plan d'Épargne en Actions (PEA)",
  'Assurance-vie': 'Assurance-vie',
}

export default function Investissement() {
  const t = useTheme()
  const [investissements, setInvestissements] = useState([])
  const [comptes, setComptes] = useState([])
  const [cibles, setCibles] = useState({})
  const [user, setUser] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    ticker: '', actif: '', enveloppe: 'PEA', type_etf: 'Capitalisant',
    type: 'Achat', quantite: '', prix_achat_unitaire: '', prix_actuel: '', ter: '', frais_courtage: '',
  })

  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'

  const totalInvesti = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prix_achat_unitaire) + parseFloat(i.frais_courtage || 0)), 0)
  const valeurActuelle = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prix_actuel || i.prix_achat_unitaire)), 0)
  const plusValue = valeurActuelle - investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prix_achat_unitaire)), 0)
  const nbPositions = investissements.length

  const enveloppesActives = [...new Set([
    ...comptes.filter(c => c.type === 'investissement' || ENVELOPPES.includes(c.nom)).map(c => c.nom),
    ...investissements.map(i => i.enveloppe)
  ])].filter(e => ENVELOPPES.includes(e))

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: inv } = await supabase.from('investissements').select('*').eq('user_id', user.id).order('date', { ascending: false })
      if (inv) setInvestissements(inv)
      const { data: comp } = await supabase.from('comptes').select('*').eq('user_id', user.id)
      if (comp) setComptes(comp)
    }
    fetchData()
  }, [])

  const calcTotalInvesti = (inv) => (parseFloat(inv.quantite) * parseFloat(inv.prix_achat_unitaire)) + (parseFloat(inv.frais_courtage) || 0)
  const calcValeurActuelle = (inv) => parseFloat(inv.quantite) * (parseFloat(inv.prix_actuel) || parseFloat(inv.prix_achat_unitaire))
  const calcPlusValue = (inv) => calcValeurActuelle(inv) - (parseFloat(inv.quantite) * parseFloat(inv.prix_achat_unitaire))

  const handleAdd = async () => {
    if (!form.ticker || !form.quantite || !form.prix_achat_unitaire) return
    setLoading(true)
    const payload = {
      user_id: user.id, date: form.date, ticker: form.ticker.toUpperCase(), actif: form.actif,
      enveloppe: form.enveloppe, type_etf: form.type_etf, type: form.type,
      quantite: parseFloat(form.quantite), prix_achat_unitaire: parseFloat(form.prix_achat_unitaire),
      prix_actuel: parseFloat(form.prix_actuel) || parseFloat(form.prix_achat_unitaire),
      ter: parseFloat(form.ter) || 0, frais_courtage: parseFloat(form.frais_courtage) || 0,
    }
    const { data, error } = await supabase.from('investissements').insert(payload).select().single()
    if (data) {
      setInvestissements(prev => [data, ...prev])
      setForm({ date: new Date().toISOString().split('T')[0], ticker: '', actif: '', enveloppe: 'PEA', type_etf: 'Capitalisant', type: 'Achat', quantite: '', prix_achat_unitaire: '', prix_actuel: '', ter: '', frais_courtage: '' })
      setShowAdd(false)
    }
    if (error) console.error(error)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('investissements').delete().eq('id', id)
    setInvestissements(prev => prev.filter(i => i.id !== id))
  }

  const handleEditStart = (inv) => { setEditingId(inv.id); setEditForm({ ...inv }) }

  const handleEditSave = async () => {
    const payload = {
      date: editForm.date, ticker: editForm.ticker?.toUpperCase(), actif: editForm.actif,
      enveloppe: editForm.enveloppe, type_etf: editForm.type_etf, type: editForm.type,
      quantite: parseFloat(editForm.quantite), prix_achat_unitaire: parseFloat(editForm.prix_achat_unitaire),
      prix_actuel: parseFloat(editForm.prix_actuel) || parseFloat(editForm.prix_achat_unitaire),
      ter: parseFloat(editForm.ter) || 0, frais_courtage: parseFloat(editForm.frais_courtage) || 0,
    }
    await supabase.from('investissements').update(payload).eq('id', editingId)
    setInvestissements(prev => prev.map(i => i.id === editingId ? { ...i, ...payload } : i))
    setEditingId(null)
  }

  const inputStyle = { padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, width: '100%' }
  const selectStyle = { ...inputStyle }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Investissement" />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* CARTES RÉSUMÉ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
          {[
            ['Total investi', `${Math.round(totalInvesti).toLocaleString('fr-FR')} €`, t.text],
            ['Valeur actuelle', `${Math.round(valeurActuelle).toLocaleString('fr-FR')} €`, '#4CAF2E'],
            ["Plus-value (l'attente)", `${plusValue >= 0 ? '+' : ''}${Math.round(plusValue).toLocaleString('fr-FR')} €`, plusValue >= 0 ? '#4CAF2E' : '#E24B4A'],
            ['Nb positions', nbPositions.toString(), bleu],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* EN-TÊTE JOURNAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Journal d'investissement</div>
          <button onClick={() => setShowAdd(v => !v)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {showAdd ? '− Fermer' : '+ Ajouter'}
          </button>
        </div>

        {/* FORMULAIRE AJOUT */}
        {showAdd && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 12 }}>Nouvel investissement</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 10, marginBottom: 10 }}>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Date</div><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Ticker</div><input placeholder="ex: PE500" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Actif</div><input placeholder="ex: Amundi PEA S&P 500" value={form.actif} onChange={e => setForm({ ...form, actif: e.target.value })} style={inputStyle} /></div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Enveloppe</div>
                <select value={form.enveloppe} onChange={e => setForm({ ...form, enveloppe: e.target.value })} style={selectStyle}>
                  {ENVELOPPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type d'ETF</div>
                <select value={form.type_etf} onChange={e => setForm({ ...form, type_etf: e.target.value })} style={selectStyle}>
                  {TYPES_ETF.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type</div>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={selectStyle}>
                  {TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Quantité</div><input type="number" placeholder="ex: 10" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Prix achat unitaire (€)</div><input type="number" placeholder="ex: 48.10" value={form.prix_achat_unitaire} onChange={e => setForm({ ...form, prix_achat_unitaire: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Prix actuel (€)</div><input type="number" placeholder="ex: 52.00" value={form.prix_actuel} onChange={e => setForm({ ...form, prix_actuel: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>TER (%)</div><input type="number" placeholder="ex: 0.25" value={form.ter} onChange={e => setForm({ ...form, ter: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Frais courtage (€)</div><input type="number" placeholder="ex: 2.22" value={form.frais_courtage} onChange={e => setForm({ ...form, frais_courtage: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '7px 14px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
              <button onClick={handleAdd} disabled={loading} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>{loading ? 'Sauvegarde...' : 'Ajouter'}</button>
            </div>
          </div>
        )}

        {/* TABLEAU JOURNAL */}
        {investissements.length === 0 ? (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
            Aucun investissement enregistré — cliquez sur "+ Ajouter" pour enregistrer votre premier achat
          </div>
        ) : (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1100 }}>
              <thead>
                <tr style={{ background: t.bgSecondary }}>
                  {['Date', 'Ticker', 'Actif', 'Enveloppe', 'Type ETF', 'Type', 'Qté', 'Prix achat', 'Prix actuel', 'TER %', 'Frais', 'Total investi', 'Valeur actuelle', 'Plus-value', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investissements.map((inv) => {
                  const pv = calcPlusValue(inv)
                  const totalInv = calcTotalInvesti(inv)
                  const valAct = calcValeurActuelle(inv)
                  const isEditing = editingId === inv.id
                  return (
                    <tr key={inv.id} style={{ borderBottom: `0.5px solid ${t.border}`, background: isEditing ? t.bgSecondary : 'transparent' }}>
                      {isEditing ? (
                        <>
                          <td style={{ padding: '6px 8px' }}><input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={{ ...inputStyle, width: 120 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input value={editForm.ticker} onChange={e => setEditForm({ ...editForm, ticker: e.target.value })} style={{ ...inputStyle, width: 70 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input value={editForm.actif} onChange={e => setEditForm({ ...editForm, actif: e.target.value })} style={{ ...inputStyle, width: 150 }} /></td>
                          <td style={{ padding: '6px 8px' }}><select value={editForm.enveloppe} onChange={e => setEditForm({ ...editForm, enveloppe: e.target.value })} style={{ ...inputStyle, width: 80 }}>{ENVELOPPES.map(e => <option key={e} value={e}>{e}</option>)}</select></td>
                          <td style={{ padding: '6px 8px' }}><select value={editForm.type_etf} onChange={e => setEditForm({ ...editForm, type_etf: e.target.value })} style={{ ...inputStyle, width: 110 }}>{TYPES_ETF.map(e => <option key={e} value={e}>{e}</option>)}</select></td>
                          <td style={{ padding: '6px 8px' }}><select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} style={{ ...inputStyle, width: 80 }}>{TYPES.map(e => <option key={e} value={e}>{e}</option>)}</select></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.quantite} onChange={e => setEditForm({ ...editForm, quantite: e.target.value })} style={{ ...inputStyle, width: 60 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.prix_achat_unitaire} onChange={e => setEditForm({ ...editForm, prix_achat_unitaire: e.target.value })} style={{ ...inputStyle, width: 80 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.prix_actuel} onChange={e => setEditForm({ ...editForm, prix_actuel: e.target.value })} style={{ ...inputStyle, width: 80 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.ter} onChange={e => setEditForm({ ...editForm, ter: e.target.value })} style={{ ...inputStyle, width: 60 }} /></td>
                          <td style={{ padding: '6px 8px' }}><input type="number" value={editForm.frais_courtage} onChange={e => setEditForm({ ...editForm, frais_courtage: e.target.value })} style={{ ...inputStyle, width: 70 }} /></td>
                          <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                          <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                          <td style={{ padding: '6px 8px', color: t.textMuted }}>—</td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={handleEditSave} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                              <button onClick={() => setEditingId(null)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '8px 12px', color: t.textSecondary, whiteSpace: 'nowrap' }}>{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 500, color: bleu }}>{inv.ticker}</td>
                          <td style={{ padding: '8px 12px', color: t.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.actif}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: inv.enveloppe === 'PEA' ? '#EAF6E4' : inv.enveloppe === 'CTO' ? '#E8EEF6' : '#FFF8E6', color: inv.enveloppe === 'PEA' ? '#2E7D1E' : inv.enveloppe === 'CTO' ? bleu : '#BA7517' }}>{inv.enveloppe}</span>
                          </td>
                          <td style={{ padding: '8px 12px', color: t.textSecondary, fontSize: 11 }}>{inv.type_etf}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: inv.type === 'Achat' ? '#EAF6E4' : '#FCEBEB', color: inv.type === 'Achat' ? '#2E7D1E' : '#E24B4A' }}>{inv.type}</span>
                          </td>
                          <td style={{ padding: '8px 12px', color: t.text }}>{inv.quantite}</td>
                          <td style={{ padding: '8px 12px', color: t.text }}>{parseFloat(inv.prix_achat_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                          <td style={{ padding: '8px 12px', color: t.text }}>{parseFloat(inv.prix_actuel || inv.prix_achat_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                          <td style={{ padding: '8px 12px', color: t.textSecondary }}>{inv.ter}%</td>
                          <td style={{ padding: '8px 12px', color: t.textSecondary }}>{parseFloat(inv.frais_courtage || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                          <td style={{ padding: '8px 12px', fontWeight: 500, color: t.text }}>{Math.round(totalInv).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '8px 12px', fontWeight: 500, color: '#4CAF2E' }}>{Math.round(valAct).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '8px 12px', fontWeight: 500, color: pv >= 0 ? '#4CAF2E' : '#E24B4A' }}>{pv >= 0 ? '+' : ''}{Math.round(pv).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '8px 12px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleEditStart(inv)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>✏️</button>
                              <button onClick={() => handleDelete(inv.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLEAUX D'ALLOCATION PAR ENVELOPPE */}
        {enveloppesActives.length > 0 && (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginTop: 4 }}>Allocations par enveloppe</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {enveloppesActives.map(env => {
                const lignes = investissements.filter(i => i.enveloppe === env)
                const totalEnv = lignes.reduce((acc, i) => acc + calcValeurActuelle(i), 0)
                const totalInvestiEnv = lignes.reduce((acc, i) => acc + calcTotalInvesti(i), 0)
                const plusValueEnv = totalEnv - lignes.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prix_achat_unitaire)), 0)
                const nbPositionsEnv = lignes.length
                const totalCible = Object.entries(cibles).filter(([k]) => k.startsWith(env + '-')).reduce((a, [, v]) => a + v, 0)

                return (
                  <div key={env} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>

                    {/* TITRE */}
                    <div style={{ padding: '10px 16px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{ENVELOPPE_LABELS[env] || env}</div>
                      {totalCible > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 500, color: totalCible === 100 ? '#4CAF2E' : '#E24B4A' }}>
                          % Cible total : {totalCible}%
                        </div>
                      )}
                    </div>

                    {/* CORPS : 75% tableau + 25% cartes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>

                      {/* TABLEAU 75% */}
                      <div style={{ borderRight: `0.5px solid ${t.border}` }}>
                        {lignes.length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
                            Aucune position dans cette enveloppe
                          </div>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr style={{ background: t.bgSecondary }}>
                                {['Ticker', 'Actif', 'Prix actuel', 'Position', 'Valeur EUR', '% Actuel', '% Cible', 'Achat/Vente'].map(h => (
                                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {lignes.map((inv) => {
                                const valAct = calcValeurActuelle(inv)
                                const pctActuel = totalEnv > 0 ? Math.round((valAct / totalEnv) * 100) : 0
                                const cibleKey = `${env}-${inv.ticker}`
                                const pctCible = cibles[cibleKey] || 0
                                const prixActuel = parseFloat(inv.prix_actuel) || parseFloat(inv.prix_achat_unitaire)
                                const diff = pctCible > 0 ? Math.round((pctCible - pctActuel) / 100 * totalEnv / prixActuel) : 0
                                return (
                                  <tr key={inv.id} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                                    <td style={{ padding: '10px 14px', fontWeight: 500, color: bleu }}>{inv.ticker}</td>
                                    <td style={{ padding: '10px 14px', color: t.text, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.actif}</td>
                                    <td style={{ padding: '10px 14px', color: t.text }}>{prixActuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                                    <td style={{ padding: '10px 14px', color: t.text }}>{inv.quantite}</td>
                                    <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{Math.round(valAct).toLocaleString('fr-FR')} €</td>
                                    <td style={{ padding: '10px 14px', color: t.text }}>{pctActuel}%</td>
                                    <td style={{ padding: '10px 14px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <input
                                          type="number" min="0" max="100" placeholder="0"
                                          value={cibles[cibleKey] || ''}
                                          onChange={e => setCibles(prev => ({ ...prev, [cibleKey]: parseFloat(e.target.value) || 0 }))}
                                          style={{ width: 60, padding: '4px 6px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }}
                                        />
                                        <span style={{ fontSize: 11, color: t.textMuted }}>%</span>
                                      </div>
                                    </td>
                                    <td style={{ padding: '10px 14px', fontWeight: 500, color: diff > 0 ? '#4CAF2E' : diff < 0 ? '#E24B4A' : t.textMuted }}>
                                      {pctCible > 0 ? (diff === 0 ? '✓ OK' : `${diff > 0 ? '+' : ''}${diff} titres`) : '—'}
                                    </td>
                                  </tr>
                                )
                              })}
                              <tr style={{ background: t.bgSecondary, borderTop: `0.5px solid ${t.border}` }}>
                                <td colSpan={4} style={{ padding: '10px 14px', fontWeight: 500, color: t.text, fontSize: 11 }}>TOTAL</td>
                                <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{Math.round(totalEnv).toLocaleString('fr-FR')} €</td>
                                <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>100%</td>
                                <td style={{ padding: '10px 14px', fontWeight: 500, color: totalCible === 100 ? '#4CAF2E' : '#E24B4A' }}>{totalCible}%</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* CARTES 2x2 — 25% */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 0 }}>
                        {[
                          ['Total investi', `${Math.round(totalInvestiEnv).toLocaleString('fr-FR')} €`, t.text],
                          ['Valeur actuelle', `${Math.round(totalEnv).toLocaleString('fr-FR')} €`, '#4CAF2E'],
                          ["Plus-value (l'attente)", `${plusValueEnv >= 0 ? '+' : ''}${Math.round(plusValueEnv).toLocaleString('fr-FR')} €`, plusValueEnv >= 0 ? '#4CAF2E' : '#E24B4A'],
                          ['Nb positions', nbPositionsEnv.toString(), bleu],
                        ].map(([l, v, c], idx) => (
                          <div key={l} style={{
                            padding: '16px',
                            borderBottom: idx < 2 ? `0.5px solid ${t.border}` : 'none',
                            borderRight: idx % 2 === 0 ? `0.5px solid ${t.border}` : 'none',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                          }}>
                            <div style={{ fontSize: 9, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{l}</div>
                            <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}