import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'
import FooterApp from '../components/FooterApp'

const ENVELOPPES = ['CTO', 'PEA', 'Assurance-vie']
const TYPES_ETF = ['Capitalisant', 'Distribuant']
const TYPES = ['Achat', 'Vente']

const ENVELOPPE_LABELS = {
  'CTO': 'Compte-Titres Ordinaire (CTO)',
  'PEA': "Plan d'Epargne en Actions (PEA)",
  'Assurance-vie': 'Assurance-vie',
}

const fetchInvestissementData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecte')
  const [invRes, txRes, compRes] = await Promise.all([
    supabase.from('investissements').select('*').eq('user_id', user.id).order('ticker', { ascending: true }),
    supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
    supabase.from('comptes').select('*').eq('user_id', user.id),
  ])
  return {
    user,
    investissements: invRes.data || [],
    transactions: txRes.data || [],
    comptes: compRes.data || [],
  }
}

export default function Investissement() {
  const t = useTheme()
  const queryClient = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [showJournal, setShowJournal] = useState(true)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [succes, setSucces] = useState(false)
  const [editingTxId, setEditingTxId] = useState(null)
  const [editTxForm, setEditTxForm] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    ticker: '', actif: '', enveloppe: 'PEA', type_etf: 'Capitalisant',
    type: 'Achat', quantite: '', prix_achat_unitaire: '', ter: '', frais_courtage: '',
  })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['investissement'],
    queryFn: fetchInvestissementData,
  })

  const user = data?.user || null
  const investissements = data?.investissements || []
  const transactions = data?.transactions || []
  const comptes = data?.comptes || []

  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'
  const totalInvesti = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0)), 0)
  const valeurActuelle = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prix_actuel || i.pru || i.prix_achat_unitaire || 0)), 0)
  const plusValue = valeurActuelle - totalInvesti
  const nbPositions = investissements.length

  const enveloppesActives = [...new Set([
    ...comptes.filter(c => c.type === 'investissement' || ENVELOPPES.includes(c.nom)).map(c => c.nom),
    ...investissements.map(i => i.enveloppe)
  ])].filter(e => ENVELOPPES.includes(e))

  const calcValeurActuelle = (inv) => parseFloat(inv.quantite) * parseFloat(inv.prix_actuel || inv.pru || inv.prix_achat_unitaire || 0)

  const handleTickerChange = async (val) => {
    const upper = val.toUpperCase().trim()
    setForm(prev => ({ ...prev, ticker: val }))
    if (upper.length < 2) return
    const existingPos = investissements.find(i => i.ticker === upper)
    if (existingPos) {
      setForm(prev => ({ ...prev, ticker: upper, actif: existingPos.actif || prev.actif, enveloppe: existingPos.enveloppe || prev.enveloppe, type_etf: existingPos.type_etf || prev.type_etf, ter: existingPos.ter?.toString() || prev.ter }))
      return
    }
    const tickerBase = upper.split('.')[0]
    const { data: ref } = await supabase.from('etf_reference').select('*').or(`ticker.eq.${upper},ticker.eq.${tickerBase}`).single()
    if (ref) {
      setForm(prev => ({ ...prev, ticker: upper, actif: ref.nom || prev.actif, enveloppe: ref.enveloppe_defaut || prev.enveloppe, ter: ref.ter?.toString() || prev.ter, type_etf: ref.type_etf || prev.type_etf || 'Capitalisant' }))
    }
  }

  const handleCibleChange = async (inv, value) => {
    const cible = parseFloat(value) || 0
    await supabase.from('investissements').update({ cible }).eq('id', inv.id)
    queryClient.invalidateQueries({ queryKey: ['investissement'] })
  }

  const handleAdd = async () => {
    if (loading) return
    if (!form.ticker || !form.quantite || !form.prix_achat_unitaire) { setErreur('Veuillez remplir le ticker, la quantite et le prix unitaire.'); return }
    if (parseFloat(form.quantite) <= 0) { setErreur('La quantite doit etre superieure a 0.'); return }
    if (parseFloat(form.prix_achat_unitaire) <= 0) { setErreur('Le prix unitaire doit etre superieur a 0.'); return }
    setLoading(true); setErreur(null)
    try {
      const ticker = form.ticker.toUpperCase()
      const quantite = parseFloat(form.quantite)
      const prixUnitaire = parseFloat(form.prix_achat_unitaire)
      const frais = parseFloat(form.frais_courtage) || 0
      const { error: txError } = await supabase.from('transactions').insert({ user_id: user.id, date: form.date, ticker, enveloppe: form.enveloppe, type: form.type, quantite, prix_unitaire: prixUnitaire, frais_courtage: frais })
      if (txError) throw new Error('Erreur lors de l enregistrement de la transaction.')
      const { data: existingPositions } = await supabase.from('investissements').select('*').eq('user_id', user.id).eq('ticker', ticker).eq('enveloppe', form.enveloppe)
      const existing = existingPositions?.[0]
      if (existing) {
        const ancienneQuantite = parseFloat(existing.quantite)
        const ancienPru = parseFloat(existing.pru || existing.prix_achat_unitaire || 0)
        let nouvelleQuantite, nouveauPru
        if (form.type === 'Achat') { nouvelleQuantite = ancienneQuantite + quantite; nouveauPru = ((ancienneQuantite * ancienPru) + (quantite * prixUnitaire)) / nouvelleQuantite }
        else { nouvelleQuantite = ancienneQuantite - quantite; nouveauPru = ancienPru }
        const { error } = await supabase.from('investissements').update({ quantite: nouvelleQuantite, pru: Math.round(nouveauPru * 10000) / 10000 }).eq('id', existing.id)
        if (error) throw new Error('Erreur lors de la mise a jour de la position.')
      } else {
        const { error } = await supabase.from('investissements').insert({ user_id: user.id, date: form.date, ticker, actif: form.actif, enveloppe: form.enveloppe, type_etf: form.type_etf, type: form.type, quantite, prix_achat_unitaire: prixUnitaire, pru: prixUnitaire, prix_actuel: prixUnitaire, ter: parseFloat(form.ter) || 0, frais_courtage: frais, cible: 0 })
        if (error) throw new Error('Erreur lors de la creation de la position.')
      }
      queryClient.invalidateQueries({ queryKey: ['investissement'] })
      setForm({ date: new Date().toISOString().split('T')[0], ticker: '', actif: '', enveloppe: 'PEA', type_etf: 'Capitalisant', type: 'Achat', quantite: '', prix_achat_unitaire: '', ter: '', frais_courtage: '' })
      setShowAdd(false); setSucces(true)
      setTimeout(() => setSucces(false), 3000)
    } catch (e) {
      setErreur(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditTxStart = (tx) => {
    setEditingTxId(tx.id)
    setEditTxForm({
      date: tx.date ? tx.date.substring(0, 10) : new Date().toISOString().split('T')[0],
      quantite: String(tx.quantite),
      prix_unitaire: String(tx.prix_unitaire),
      frais_courtage: String(tx.frais_courtage || 0),
    })
  }

  const handleEditTxSave = async (tx) => {
    if (loading) return
    setLoading(true)
    setErreur(null)
    try {
      const newDate = editTxForm.date
      const newQuantite = parseFloat(editTxForm.quantite)
      const newPrix = parseFloat(editTxForm.prix_unitaire)
      const newFrais = parseFloat(editTxForm.frais_courtage) || 0

      if (isNaN(newQuantite) || newQuantite <= 0) throw new Error('Quantite invalide.')
      if (isNaN(newPrix) || newPrix <= 0) throw new Error('Prix invalide.')

      const { error: updateError } = await supabase.from('transactions').update({
        date: newDate,
        quantite: newQuantite,
        prix_unitaire: newPrix,
        frais_courtage: newFrais,
      }).eq('id', tx.id)
      if (updateError) throw new Error('Erreur lors de la modification: ' + updateError.message)

      const { data: freshTx, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('ticker', tx.ticker)
        .eq('enveloppe', tx.enveloppe)
      if (fetchError) throw new Error('Erreur lors du rechargement.')

      let quantiteTotale = 0
      let coutTotal = 0
      for (const t of (freshTx || [])) {
        const q = parseFloat(t.quantite)
        const p = parseFloat(t.prix_unitaire)
        if (t.type === 'Achat') { quantiteTotale += q; coutTotal += q * p }
        else { quantiteTotale -= q }
      }
      const nouveauPru = quantiteTotale > 0 ? Math.round((coutTotal / quantiteTotale) * 10000) / 10000 : 0

      const { error: posError } = await supabase.from('investissements')
        .update({ quantite: quantiteTotale, pru: nouveauPru })
        .eq('user_id', user.id)
        .eq('ticker', tx.ticker)
        .eq('enveloppe', tx.enveloppe)
      if (posError) throw new Error('Erreur lors de la mise a jour de la position.')

      queryClient.invalidateQueries({ queryKey: ['investissement'] })
      setEditingTxId(null)
      setSucces(true)
      setTimeout(() => setSucces(false), 3000)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (confirmDeleteId === id) {
      try {
        const tx = transactions.find(t => t.id === id)
        if (!tx) return
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) throw new Error('Erreur lors de la suppression.')
        const transactionsRestantes = transactions.filter(t => t.id !== id && t.ticker === tx.ticker && t.enveloppe === tx.enveloppe)
        if (transactionsRestantes.length === 0) {
          await supabase.from('investissements').delete().eq('user_id', user.id).eq('ticker', tx.ticker).eq('enveloppe', tx.enveloppe)
        } else {
          let quantiteTotale = 0, coutTotal = 0
          for (const t of transactionsRestantes) {
            if (t.type === 'Achat') { quantiteTotale += parseFloat(t.quantite); coutTotal += parseFloat(t.quantite) * parseFloat(t.prix_unitaire) }
            else quantiteTotale -= parseFloat(t.quantite)
          }
          const nouveauPru = quantiteTotale > 0 ? Math.round((coutTotal / quantiteTotale) * 10000) / 10000 : 0
          await supabase.from('investissements').update({ quantite: quantiteTotale, pru: nouveauPru }).eq('user_id', user.id).eq('ticker', tx.ticker).eq('enveloppe', tx.enveloppe)
        }
        queryClient.invalidateQueries({ queryKey: ['investissement'] })
        setConfirmDeleteId(null)
      } catch (e) {
        setErreur('Erreur lors de la suppression. Veuillez reessayer.')
      }
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  const inputStyle = { padding: '5px 8px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgCard, color: t.text, width: '100%', boxSizing: 'border-box' }
  const inputEditStyle = { padding: '4px 6px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }

  if (isLoading) return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Investissement" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: 13 }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Investissement" />
      <div style={{ padding: isMobile ? '16px 12px' : '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {succes && <div style={{ background: '#EAF6E4', border: '0.5px solid #4CAF2E', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#2E7D1E', fontWeight: 500 }}>Transaction modifiee avec succes !</div>}
        {erreur && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#E24B4A' }}>⚠️ {erreur}</div>}

        {enveloppesActives.length > 0 && (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Allocations par enveloppe</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enveloppesActives.map((env) => {
                const lignes = investissements.filter(i => i.enveloppe === env)
                const totalEnv = lignes.reduce((acc, i) => acc + calcValeurActuelle(i), 0)
                const totalInvestiEnv = lignes.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0), 0)
                const plusValueEnv = totalEnv - totalInvestiEnv
                const nbPositionsEnv = lignes.length
                const totalCible = lignes.reduce((a, i) => a + (parseFloat(i.cible) || 0), 0)
                return (
                  <div key={env} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 16px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{ENVELOPPE_LABELS[env] || env}</div>
                      {totalCible > 0 && <div style={{ fontSize: 11, fontWeight: 500, color: totalCible === 100 ? '#4CAF2E' : '#E24B4A' }}>% Cible total : {totalCible}%</div>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 1fr' }}>
                      <div style={{ borderRight: isMobile ? 'none' : `0.5px solid ${t.border}`, borderBottom: isMobile ? `0.5px solid ${t.border}` : 'none' }}>
                        {lignes.length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Aucune position dans cette enveloppe</div>
                        ) : (
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
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
                                  const pctCible = parseFloat(inv.cible) || 0
                                  const prixActuel = parseFloat(inv.prix_actuel) || parseFloat(inv.pru || inv.prix_achat_unitaire || 0)
                                  const diff = pctCible > 0 ? Math.round((pctCible - pctActuel) / 100 * totalEnv / prixActuel) : 0
                                  return (
                                    <tr key={inv.id} style={{ borderBottom: `0.5px solid ${t.border}`, background: 'transparent' }}>
                                      <td style={{ padding: '10px 14px', fontWeight: 500, color: bleu }}>{inv.ticker}</td>
                                      <td style={{ padding: '10px 14px', color: t.text, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.actif}</td>
                                      <td style={{ padding: '10px 14px', color: t.text }}>{prixActuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                                      <td style={{ padding: '10px 14px', color: t.text }}>{inv.quantite}</td>
                                      <td style={{ padding: '10px 14px', fontWeight: 500, color: t.text }}>{Math.round(valAct).toLocaleString('fr-FR')} €</td>
                                      <td style={{ padding: '10px 14px', color: t.text }}>{pctActuel}%</td>
                                      <td style={{ padding: '10px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                          <input type="number" min="0" max="100" placeholder="0" defaultValue={pctCible || ''} onBlur={e => handleCibleChange(inv, e.target.value)} style={{ width: 60, padding: '4px 6px', borderRadius: 5, border: `0.5px solid ${t.border}`, fontSize: 11, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, textAlign: 'right' }} />
                                          <span style={{ fontSize: 11, color: t.textMuted }}>%</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '10px 14px', fontWeight: 500, color: diff > 0 ? '#4CAF2E' : diff < 0 ? '#E24B4A' : t.textMuted }}>
                                        {pctCible > 0 ? (diff === 0 ? 'OK' : `${diff > 0 ? '+' : ''}${diff} titres`) : '—'}
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
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 0 }}>
                        {[
                          ['Total investi', `${Math.round(totalInvestiEnv).toLocaleString('fr-FR')} €`, t.text],
                          ['Valeur actuelle', `${Math.round(totalEnv).toLocaleString('fr-FR')} €`, '#4CAF2E'],
                          ['Plus-value', `${plusValueEnv >= 0 ? '+' : ''}${Math.round(plusValueEnv).toLocaleString('fr-FR')} €`, plusValueEnv >= 0 ? '#4CAF2E' : '#E24B4A'],
                          ['Nb positions', nbPositionsEnv.toString(), bleu],
                        ].map(([l, v, c], idx) => (
                          <div key={l} style={{ padding: isMobile ? '12px' : '16px', background: 'transparent', borderBottom: idx < 2 ? `0.5px solid ${t.border}` : 'none', borderRight: idx % 2 === 0 ? `0.5px solid ${t.border}` : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: 9, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{l}</div>
                            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500, color: c }}>{v}</div>
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

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: 10 }}>
          {[
            ['Total investi', `${Math.round(totalInvesti).toLocaleString('fr-FR')} €`, t.text],
            ['Valeur actuelle', `${Math.round(valeurActuelle).toLocaleString('fr-FR')} €`, '#4CAF2E'],
            ['Plus-value', `${plusValue >= 0 ? '+' : ''}${Math.round(plusValue).toLocaleString('fr-FR')} €`, plusValue >= 0 ? '#4CAF2E' : '#E24B4A'],
            ['Nb positions', nbPositions.toString(), bleu],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: isMobile ? 12 : 16 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Journal d investissement</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowJournal(v => !v)} style={{ background: t.bgSecondary, color: t.text, fontSize: 11, padding: '5px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
              {showJournal ? 'Masquer' : 'Afficher'}
            </button>
            <button onClick={() => { setShowAdd(v => !v); setErreur(null) }} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showAdd ? 'Fermer' : '+ Ajouter'}
            </button>
          </div>
        </div>

        {showAdd && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 12 }}>Nouvel achat / vente</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, minmax(0,1fr))', gap: 10, marginBottom: 10 }}>
              <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Date</div><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Ticker *</div><input placeholder="ex: PE500" value={form.ticker} onChange={e => handleTickerChange(e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Actif</div><input placeholder="ex: Amundi PEA S&P 500" value={form.actif} onChange={e => setForm({ ...form, actif: e.target.value })} style={inputStyle} /></div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Enveloppe</div>
                <select value={form.enveloppe} onChange={e => setForm({ ...form, enveloppe: e.target.value })} style={inputStyle}>
                  {ENVELOPPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type ETF</div>
                <select value={form.type_etf} onChange={e => setForm({ ...form, type_etf: e.target.value })} style={inputStyle}>
                  {TYPES_ETF.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, minmax(0,1fr))', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Type</div>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  {TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Quantite *</div><input type="number" min="0" placeholder="ex: 10" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} style={inputStyle} /></div>
              <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Prix unitaire (euros) *</div><input type="number" min="0" placeholder="ex: 48.10" value={form.prix_achat_unitaire} onChange={e => setForm({ ...form, prix_achat_unitaire: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>TER (%)</div><input type="number" min="0" placeholder="ex: 0.25" value={form.ter} onChange={e => setForm({ ...form, ter: e.target.value })} style={inputStyle} /></div>
              <div><div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>Frais courtage (euros)</div><input type="number" min="0" placeholder="ex: 2.22" value={form.frais_courtage} onChange={e => setForm({ ...form, frais_courtage: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 10, color: t.textMuted }}>* Champs obligatoires</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setShowAdd(false); setErreur(null) }} style={{ padding: '7px 14px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
                <button onClick={handleAdd} disabled={loading} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Sauvegarde...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showJournal && (
          transactions.length === 0 ? (
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
              Aucun achat enregistre — cliquez sur Ajouter pour enregistrer votre premier achat
            </div>
          ) : (
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: t.bgSecondary }}>
                    {['Date', 'Ticker', 'Enveloppe', 'Type', 'Quantite', 'Prix achat', 'Prix actuel', 'Frais', 'Cout total', 'Valeur actuelle', ''].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: t.textMuted, fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const coutTotal = parseFloat(tx.quantite) * parseFloat(tx.prix_unitaire) + parseFloat(tx.frais_courtage || 0)
                    const invPosition = investissements.find(i => i.ticker === tx.ticker && i.enveloppe === tx.enveloppe)
                    const prixActuel = parseFloat(invPosition?.prix_actuel || tx.prix_unitaire)
                    const valeurActuelleTx = parseFloat(tx.quantite) * prixActuel
                    const plusValueTx = valeurActuelleTx - (parseFloat(tx.quantite) * parseFloat(tx.prix_unitaire))
                    const isEditing = editingTxId === tx.id

                    return (
                      <tr key={tx.id} style={{ borderBottom: `0.5px solid ${t.border}`, background: isEditing ? t.bgSecondary : 'transparent' }}>
                        {isEditing ? (
                          <>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="date" value={editTxForm.date} onChange={e => setEditTxForm({ ...editTxForm, date: e.target.value })} style={{ ...inputEditStyle, width: 120 }} />
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: bleu }}>{tx.ticker}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: tx.enveloppe === 'PEA' ? '#EAF6E4' : tx.enveloppe === 'CTO' ? '#E8EEF6' : '#FFF8E6', color: tx.enveloppe === 'PEA' ? '#2E7D1E' : tx.enveloppe === 'CTO' ? bleu : '#BA7517' }}>{tx.enveloppe}</span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: tx.type === 'Achat' ? '#EAF6E4' : '#FCEBEB', color: tx.type === 'Achat' ? '#2E7D1E' : '#E24B4A' }}>{tx.type}</span>
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" min="0" value={editTxForm.quantite} onChange={e => setEditTxForm({ ...editTxForm, quantite: e.target.value })} style={{ ...inputEditStyle, width: 70 }} />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" min="0" value={editTxForm.prix_unitaire} onChange={e => setEditTxForm({ ...editTxForm, prix_unitaire: e.target.value })} style={{ ...inputEditStyle, width: 80 }} />
                            </td>
                            <td style={{ padding: '8px 12px', color: t.textMuted, fontSize: 11 }}>—</td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" min="0" value={editTxForm.frais_courtage} onChange={e => setEditTxForm({ ...editTxForm, frais_courtage: e.target.value })} style={{ ...inputEditStyle, width: 60 }} />
                            </td>
                            <td style={{ padding: '8px 12px', color: t.textMuted, fontSize: 11 }}>—</td>
                            <td style={{ padding: '8px 12px', color: t.textMuted, fontSize: 11 }}>—</td>
                            <td style={{ padding: '6px 8px' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button onClick={() => handleEditTxSave(tx)} disabled={loading} style={{ background: '#EAF6E4', color: '#2E7D1E', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                  {loading ? '...' : 'OK'}
                                </button>
                                <button onClick={() => { setEditingTxId(null); setErreur(null) }} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>X</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '8px 12px', color: t.textSecondary, whiteSpace: 'nowrap' }}>{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: bleu }}>{tx.ticker}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: tx.enveloppe === 'PEA' ? '#EAF6E4' : tx.enveloppe === 'CTO' ? '#E8EEF6' : '#FFF8E6', color: tx.enveloppe === 'PEA' ? '#2E7D1E' : tx.enveloppe === 'CTO' ? bleu : '#BA7517' }}>{tx.enveloppe}</span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: tx.type === 'Achat' ? '#EAF6E4' : '#FCEBEB', color: tx.type === 'Achat' ? '#2E7D1E' : '#E24B4A' }}>{tx.type}</span>
                            </td>
                            <td style={{ padding: '8px 12px', color: t.text }}>{tx.quantite}</td>
                            <td style={{ padding: '8px 12px', color: t.text }}>{parseFloat(tx.prix_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} euros</td>
                            <td style={{ padding: '8px 12px', color: t.text }}>{prixActuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} euros</td>
                            <td style={{ padding: '8px 12px', color: t.textSecondary }}>{parseFloat(tx.frais_courtage || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} euros</td>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: t.text }}>{Math.round(coutTotal).toLocaleString('fr-FR')} euros</td>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: plusValueTx >= 0 ? '#4CAF2E' : '#E24B4A' }}>
                              {Math.round(valeurActuelleTx).toLocaleString('fr-FR')} euros
                              <span style={{ fontSize: 10, marginLeft: 4 }}>({plusValueTx >= 0 ? '+' : ''}{Math.round(plusValueTx).toLocaleString('fr-FR')} euros)</span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button onClick={() => handleEditTxStart(tx)} style={{ background: t.bgSecondary, color: t.textMuted, border: `0.5px solid ${t.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>edit</button>
                                <button onClick={() => handleDeleteTransaction(tx.id)} style={{ background: confirmDeleteId === tx.id ? '#E24B4A' : '#FCEBEB', color: confirmDeleteId === tx.id ? '#fff' : '#E24B4A', border: 'none', borderRadius: 5, padding: '2px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                                  {confirmDeleteId === tx.id ? 'Confirmer ?' : 'x'}
                                </button>
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
          )
        )}
      </div>
      <FooterApp />
    </div>
  )
}