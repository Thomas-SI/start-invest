import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const comptes = [
  { nom: 'Livret A', type: 'Sécurité', dispo: 'Immédiate', solde: 5000, objectif: 10000, couleur: '#EAF6E4', texte: '#2E7D1E' },
  { nom: 'LDDS', type: 'Sécurité', dispo: 'Immédiate', solde: 4000, objectif: 5000, couleur: '#EAF6E4', texte: '#2E7D1E' },
  { nom: 'PEA', type: 'Investissement', dispo: 'Bloqué 5 ans', solde: 2190, objectif: null, couleur: '#E3F0FF', texte: '#1565C0' },
  { nom: 'CTO', type: 'Investissement', dispo: 'Flexible', solde: 2548, objectif: null, couleur: '#EBE9FC', texte: '#3C3489' },
]

const investissements = [
  { date: '01/01/2026', ticker: 'VUAA', nom: 'Vanguard S&P 500 UCITS ETF', enveloppe: 'CTO', type: 'Capitalisant', qte: 20, prixAchat: 100, prixActuel: 109.74, ter: 0.07, frais: 3 },
  { date: '01/01/2026', ticker: 'PE500', nom: 'Amundi PEA S&P 500 Screened', enveloppe: 'PEA', type: 'Capitalisant', qte: 10, prixAchat: 40, prixActuel: 46.98, ter: 0.25, frais: 2.22 },
]

export default function Portefeuille() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [onglet, setOnglet] = useState('stock')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const totalStock = comptes.reduce((acc, c) => acc + c.solde, 0)
  const totalInvesti = investissements.reduce((acc, i) => acc + i.qte * i.prixAchat, 0)
  const totalActuel = investissements.reduce((acc, i) => acc + i.qte * i.prixActuel, 0)
  const plusValue = totalActuel - totalInvesti

  return (
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 20px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 8, color: '#1B2E4B', opacity: .5 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[['Finances', '/dashboard'], ['Explorer', '/explorer'], ['Portefeuille', '/portefeuille'], ['Communauté', '/communaute'], ['Concentration', '/concentration'], ['Abonnement', '/abonnement'], ['Compte', '/compte']].map(([l, path]) => (
            <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === 'Portefeuille' ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Portefeuille' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
          <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
          {[
            ['Total patrimoine', `${totalStock.toLocaleString('fr-FR')} €`, '#1B2E4B'],
            ['Total investi', `${totalInvesti.toLocaleString('fr-FR')} €`, '#1565C0'],
            ['Valeur actuelle', `${totalActuel.toLocaleString('fr-FR')} €`, '#4CAF2E'],
            ['Plus-value', `${plusValue >= 0 ? '+' : ''}${Math.round(plusValue).toLocaleString('fr-FR')} €`, plusValue >= 0 ? '#4CAF2E' : '#E24B4A'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['stock', 'Le Stock'], ['journal', "Journal d'investissement"]].map(([id, label]) => (
            <div key={id} onClick={() => setOnglet(id)} style={{ fontSize: 13, padding: '6px 16px', borderRadius: 20, background: onglet === id ? '#1B2E4B' : '#fff', color: onglet === id ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3', cursor: 'pointer', fontWeight: onglet === id ? 500 : 400 }}>{label}</div>
          ))}
        </div>

        {onglet === 'stock' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
              {comptes.map(({ nom, type, dispo, solde, objectif, couleur, texte }) => (
                <div key={nom} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: texte }}>{nom[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>{nom}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>{type} · {dispo}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B' }}>{solde.toLocaleString('fr-FR')} €</div>
                  </div>
                  {objectif && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>
                        <span>Progression</span><span>{Math.round(solde / objectif * 100)}% / {objectif.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div style={{ background: '#EAF6E4', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: '#4CAF2E', width: `${Math.min(solde / objectif * 100, 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {onglet === 'journal' && (
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F4F7F5' }}>
                  {['Date', 'Ticker', 'Nom', 'Enveloppe', 'Qté', 'Prix achat', 'Prix actuel', 'Total investi', 'Valeur actuelle', 'Plus-value'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500, borderBottom: '0.5px solid #E0EAE3' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investissements.map((inv, i) => {
                  const totalInv = inv.qte * inv.prixAchat
                  const valActuelle = inv.qte * inv.prixActuel
                  const pv = valActuelle - totalInv
                  return (
                    <tr key={i} style={{ borderBottom: '0.5px solid #F3F4F6' }}>
                      <td style={{ padding: '10px 12px', color: '#9CA3AF' }}>{inv.date}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: '#1B2E4B' }}>{inv.ticker}</td>
                      <td style={{ padding: '10px 12px', color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.nom}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: inv.enveloppe === 'PEA' ? '#E3F0FF' : '#EBE9FC', color: inv.enveloppe === 'PEA' ? '#1565C0' : '#3C3489', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500 }}>{inv.enveloppe}</span></td>
                      <td style={{ padding: '10px 12px', color: '#1B2E4B' }}>{inv.qte}</td>
                      <td style={{ padding: '10px 12px', color: '#1B2E4B' }}>{inv.prixAchat} €</td>
                      <td style={{ padding: '10px 12px', color: '#1B2E4B' }}>{inv.prixActuel} €</td>
                      <td style={{ padding: '10px 12px', color: '#1B2E4B' }}>{totalInv.toLocaleString('fr-FR')} €</td>
                      <td style={{ padding: '10px 12px', color: '#4CAF2E', fontWeight: 500 }}>{Math.round(valActuelle).toLocaleString('fr-FR')} €</td>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: pv >= 0 ? '#4CAF2E' : '#E24B4A' }}>{pv >= 0 ? '+' : ''}{Math.round(pv).toLocaleString('fr-FR')} €</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}