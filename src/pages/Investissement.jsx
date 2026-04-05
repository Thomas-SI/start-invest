import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const enveloppes = ['CTO', 'PEA', 'Assurance-vie', 'PER']
const typesETF = ['Capitalisant', 'Distributif']

export default function Investissement() {
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [investissements, setInvestissements] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ date: '', ticker: '', nom: '', enveloppe: 'PEA', type: 'Capitalisant', quantite: '', prixAchat: '', prixActuel: '', ter: '', frais: '' })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  const handleAdd = () => {
    if (!form.ticker || !form.quantite || !form.prixAchat) return
    setInvestissements([...investissements, { ...form, id: Date.now() }])
    setForm({ date: '', ticker: '', nom: '', enveloppe: 'PEA', type: 'Capitalisant', quantite: '', prixAchat: '', prixActuel: '', ter: '', frais: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => setInvestissements(investissements.filter(i => i.id !== id))

  const pea = investissements.filter(i => i.enveloppe === 'PEA')
  const cto = investissements.filter(i => i.enveloppe === 'CTO')
  const autres = investissements.filter(i => !['PEA', 'CTO'].includes(i.enveloppe))

  const totalInvesti = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prixAchat) || 0), 0)
  const totalActuel = investissements.reduce((acc, i) => acc + (parseFloat(i.quantite) * parseFloat(i.prixActuel || i.prixAchat) || 0), 0)
  const plusValue = totalActuel - totalInvesti

  const TableauInvestissements = ({ items, titre, couleur }) => {
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: couleur, display: 'inline-block' }} />
          {titre}
        </div>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: t.bgSecondary }}>
                {['Date', 'Ticker', 'Nom', 'Type', 'Qté', 'Prix achat', 'Prix actuel', 'TER', 'Frais', 'Total investi', 'Valeur actuelle', 'Plus-value', ''].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((inv) => {
                const totalInv = parseFloat(inv.quantite) * parseFloat(inv.prixAchat) || 0
                const valActuelle = parseFloat(inv.quantite) * parseFloat(inv.prixActuel || inv.prixAchat) || 0
                const pv = valActuelle - totalInv
                return (
                  <tr key={inv.id} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                    <td style={{ padding: '8px 10px', color: t.textMuted, whiteSpace: 'nowrap' }}>{inv.date}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 500, color: t.text }}>{inv.ticker}</td>
                    <td style={{ padding: '8px 10px', color: t.textSecondary, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.nom}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ background: inv.type === 'Capitalisant' ? '#EAF6E4' : '#E3F0FF', color: inv.type === 'Capitalisant' ? '#2E7D1E' : '#1565C0', padding: '2px 7px', borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{inv.type}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: t.text }}>{inv.quantite}</td>
                    <td style={{ padding: '8px 10px', color: t.text }}>{parseFloat(inv.prixAchat).toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', color: t.text }}>{parseFloat(inv.prixActuel || inv.prixAchat).toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', color: t.textMuted }}>{inv.ter ? `${inv.ter}%` : '—'}</td>
                    <td style={{ padding: '8px 10px', color: t.textMuted }}>{inv.frais ? `${inv.frais} €` : '—'}</td>
                    <td style={{ padding: '8px 10px', color: t.text, fontWeight: 500 }}>{totalInv.toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', color: '#4CAF2E', fontWeight: 500 }}>{valActuelle.toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', fontWeight: 500, color: pv >= 0 ? '#4CAF2E' : '#E24B4A' }}>{pv >= 0 ? '+' : ''}{pv.toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px' }}>
                      <button onClick={() => handleDelete(inv.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 6, padding: '3px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: '28px', width: 520, border: `0.5px solid ${t.border}`, maxHeight: '85vh', overflow: 'auto' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 16 }}>Ajouter un investissement</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                ['Date', 'date', 'date', ''],
                ['Ticker', 'ticker', 'text', 'ex: VUAA'],
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: type === 'text' && key === 'ticker' ? e.target.value.toUpperCase() : e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Nom complet</div>
                <input placeholder="ex: Vanguard S&P 500 UCITS ETF" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Enveloppe</div>
                <select value={form.enveloppe} onChange={e => setForm({ ...form, enveloppe: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  {enveloppes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Type d'ETF</div>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  {typesETF.map(ty => <option key={ty} value={ty}>{ty}</option>)}
                </select>
              </div>
              {[['Quantité', 'quantite', 'ex: 10'], ['Prix d\'achat (€)', 'prixAchat', 'ex: 100'], ['Prix actuel (€)', 'prixActuel', 'ex: 110'], ['TER (%)', 'ter', 'ex: 0.07'], ['Frais courtage (€)', 'frais', 'ex: 2.5']].map(([label, key, ph]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                  <input type="number" placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      <Navbar page="Investissement" initiale={initiale} />

      <div style={{ padding: '12px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
          {[
            ['Total investi', `${totalInvesti.toFixed(2)} €`, t.text],
            ['Valeur actuelle', `${totalActuel.toFixed(2)} €`, '#4CAF2E'],
            ['Plus-value', `${plusValue >= 0 ? '+' : ''}${plusValue.toFixed(2)} €`, plusValue >= 0 ? '#4CAF2E' : '#E24B4A'],
            ['Nb positions', `${investissements.length}`, '#1565C0'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Journal d'investissement</div>
          <button onClick={() => setShowModal(true)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
        </div>

        {investissements.length === 0 && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 4 }}>Aucun investissement enregistré</div>
            <div style={{ fontSize: 12, color: t.textMuted, opacity: 0.6 }}>Cliquez sur "+ Ajouter" pour enregistrer votre premier achat</div>
          </div>
        )}

        <TableauInvestissements items={pea} titre="PEA — Plan d'Épargne Actions" couleur="#1565C0" />
        <TableauInvestissements items={cto} titre="CTO — Compte-Titres Ordinaire" couleur="#534AB7" />
        <TableauInvestissements items={autres} titre="Autres enveloppes" couleur="#BA7517" />
      </div>
    </div>
  )
}