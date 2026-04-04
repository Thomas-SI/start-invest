import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const enveloppes = ['CTO', 'PEA', 'Assurance-vie', 'PER']
const typesETF = ['Capitalisant', 'Distributif']

export default function Investissement() {
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

  const handleDelete = (id) => {
    setInvestissements(investissements.filter(i => i.id !== id))
  }

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
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: couleur, display: 'inline-block' }} />
          {titre}
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F4F7F5' }}>
                {['Date', 'Ticker', 'Nom', 'Type', 'Qté', 'Prix achat', 'Prix actuel', 'TER', 'Frais', 'Total investi', 'Valeur actuelle', 'Plus-value', ''].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500, borderBottom: '0.5px solid #E0EAE3', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((inv) => {
                const totalInv = parseFloat(inv.quantite) * parseFloat(inv.prixAchat) || 0
                const valActuelle = parseFloat(inv.quantite) * parseFloat(inv.prixActuel || inv.prixAchat) || 0
                const pv = valActuelle - totalInv
                return (
                  <tr key={inv.id} style={{ borderBottom: '0.5px solid #F3F4F6' }}>
                    <td style={{ padding: '8px 10px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{inv.date}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 500, color: '#1B2E4B' }}>{inv.ticker}</td>
                    <td style={{ padding: '8px 10px', color: '#6B7280', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.nom}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ background: inv.type === 'Capitalisant' ? '#EAF6E4' : '#E3F0FF', color: inv.type === 'Capitalisant' ? '#2E7D1E' : '#1565C0', padding: '2px 7px', borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{inv.type}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#1B2E4B' }}>{inv.quantite}</td>
                    <td style={{ padding: '8px 10px', color: '#1B2E4B' }}>{parseFloat(inv.prixAchat).toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', color: '#1B2E4B' }}>{parseFloat(inv.prixActuel || inv.prixAchat).toFixed(2)} €</td>
                    <td style={{ padding: '8px 10px', color: '#9CA3AF' }}>{inv.ter ? `${inv.ter}%` : '—'}</td>
                    <td style={{ padding: '8px 10px', color: '#9CA3AF' }}>{inv.frais ? `${inv.frais} €` : '—'}</td>
                    <td style={{ padding: '8px 10px', color: '#1B2E4B', fontWeight: 500 }}>{totalInv.toFixed(2)} €</td>
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
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 520, border: '0.5px solid #E0EAE3', maxHeight: '85vh', overflow: 'auto' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', marginBottom: 16 }}>Ajouter un investissement</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Date</div>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Ticker</div>
                <input placeholder="ex: VUAA" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Nom complet</div>
                <input placeholder="ex: Vanguard S&P 500 UCITS ETF" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Enveloppe</div>
                <select value={form.enveloppe} onChange={e => setForm({ ...form, enveloppe: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }}>
                  {enveloppes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Type d'ETF</div>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#1B2E4B' }}>
                  {typesETF.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Quantité</div>
                <input type="number" placeholder="ex: 10" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Prix d'achat (€)</div>
                <input type="number" placeholder="ex: 100" value={form.prixAchat} onChange={e => setForm({ ...form, prixAchat: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Prix actuel (€)</div>
                <input type="number" placeholder="ex: 110" value={form.prixActuel} onChange={e => setForm({ ...form, prixActuel: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>TER (%)</div>
                <input type="number" placeholder="ex: 0.07" value={form.ter} onChange={e => setForm({ ...form, ter: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Frais courtage (€)</div>
                <input type="number" placeholder="ex: 2.5" value={form.frais} onChange={e => setForm({ ...form, frais: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1B2E4B' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '0.5px solid #C8D8CE', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      <Navbar page="Investissement" initiale={initiale} />

      <div style={{ padding: '12px 20px', flex: 1, overflow: 'auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
          {[
            ['Total investi', `${totalInvesti.toFixed(2)} €`, '#1B2E4B'],
            ['Valeur actuelle', `${totalActuel.toFixed(2)} €`, '#4CAF2E'],
            ['Plus-value', `${plusValue >= 0 ? '+' : ''}${plusValue.toFixed(2)} €`, plusValue >= 0 ? '#4CAF2E' : '#E24B4A'],
            ['Nb positions', `${investissements.length}`, '#1565C0'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B' }}>Journal d'investissement</div>
          <button onClick={() => setShowModal(true)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
        </div>

        {investissements.length === 0 && (
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 4 }}>Aucun investissement enregistré</div>
            <div style={{ fontSize: 12, color: '#C4C9C7' }}>Cliquez sur "+ Ajouter" pour enregistrer votre premier achat</div>
          </div>
        )}

        <TableauInvestissements items={pea} titre="PEA — Plan d'Épargne Actions" couleur="#1565C0" />
        <TableauInvestissements items={cto} titre="CTO — Compte-Titres Ordinaire" couleur="#534AB7" />
        <TableauInvestissements items={autres} titre="Autres enveloppes" couleur="#BA7517" />

      </div>
    </div>
  )
}