import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const etfs = [
  { lettre: 'W', couleur: '#E3F0FF', texte: '#1565C0', nom: 'MSCI World', zone: 'Monde', perf: '+18.4%', frais: '0.20%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'S', couleur: '#EAF6E4', texte: '#2E7D1E', nom: 'S&P 500', zone: 'États-Unis', perf: '+22.1%', frais: '0.07%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'E', couleur: '#EBE9FC', texte: '#3C3489', nom: 'Euro Bonds', zone: 'Europe', perf: '+4.2%', frais: '0.15%', volatilite: 'Faible', type: 'Obligations', typeBg: '#E3F0FF', typeColor: '#0C447C' },
  { lettre: 'C', couleur: '#EAF6E4', texte: '#2E7D1E', nom: 'CAC 40', zone: 'France', perf: '+8.2%', frais: '0.25%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'N', couleur: '#E3F0FF', texte: '#1565C0', nom: 'Nasdaq 100', zone: 'États-Unis', perf: '+28.1%', frais: '0.20%', volatilite: 'Élevée', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'A', couleur: '#FFF8E6', texte: '#BA7517', nom: 'MSCI Emerging', zone: 'Monde émergent', perf: '+6.3%', frais: '0.18%', volatilite: 'Élevée', type: 'Actions', typeBg: '#FFF8E6', typeColor: '#BA7517' },
]

function simulerDCA(capitalInitial, versementMensuel, tauxAnnuel, dureeAnnees) {
  const tauxMensuel = tauxAnnuel / 100 / 12
  const mois = dureeAnnees * 12
  let capital = capitalInitial
  const historique = []
  for (let i = 0; i <= mois; i++) {
    if (i > 0) {
      capital = capital * (1 + tauxMensuel) + versementMensuel
    }
    if (i % 12 === 0) {
      const capitalInvesti = capitalInitial + versementMensuel * i
      historique.push({
        annee: i / 12,
        capitalInvesti: Math.round(capitalInvesti),
        capitalTotal: Math.round(capital),
        interets: Math.round(capital - capitalInvesti),
      })
    }
  }
  return historique
}

export default function Explorer() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [onglet, setOnglet] = useState('catalogue')
  const [capitalInitial, setCapitalInitial] = useState(10000)
  const [versement, setVersement] = useState(300)
  const [taux, setTaux] = useState(7)
  const [duree, setDuree] = useState(25)
  const [enveloppe, setEnveloppe] = useState('PEA')

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
  const historique = simulerDCA(capitalInitial, versement, taux, duree)
  const derniere = historique[historique.length - 1]
  const fiscalite = enveloppe === 'PEA' ? 0.172 : 0.30
  const capitalApresFisc = derniere ? Math.round(derniere.capitalInvesti + derniere.interets * (1 - fiscalite)) : 0
  const impots = derniere ? Math.round(derniere.interets * fiscalite) : 0
  const maxVal = derniere?.capitalTotal || 1

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
            <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === 'Explorer' ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Explorer' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
          <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['catalogue', 'Catalogue ETF'], ['simulateur', 'Simulateur DCA']].map(([id, label]) => (
            <div key={id} onClick={() => setOnglet(id)} style={{ fontSize: 13, padding: '6px 16px', borderRadius: 20, background: onglet === id ? '#1B2E4B' : '#fff', color: onglet === id ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3', cursor: 'pointer', fontWeight: onglet === id ? 500 : 400 }}>{label}</div>
          ))}
        </div>

        {onglet === 'catalogue' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>6 ETF disponibles</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Tous', 'Actions', 'Obligations'].map(f => (
                  <div key={f} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: f === 'Tous' ? '#1B2E4B' : '#fff', color: f === 'Tous' ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3', cursor: 'pointer' }}>{f}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
              {etfs.map(({ lettre, couleur, texte, nom, zone, perf, frais, volatilite, type, typeBg, typeColor }) => (
                <div key={nom} style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 12, padding: 14, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: couleur, color: texte, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{lettre}</div>
                    <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: typeBg, color: typeColor }}>{type}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B', marginBottom: 2 }}>{nom}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>{zone}</div>
                  {[['Performance 1 an', perf, true], ['Frais annuels', frais, false], ['Volatilité', volatilite, false]].map(([k, v, green]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                      <span style={{ color: '#9CA3AF' }}>{k}</span>
                      <span style={{ fontWeight: 500, color: green ? '#4CAF2E' : '#1B2E4B' }}>{v}</span>
                    </div>
                  ))}
                  <button onClick={() => setOnglet('simulateur')} style={{ width: '100%', marginTop: 12, background: '#EAF6E4', color: '#2E7D1E', fontSize: 11, fontWeight: 500, padding: '7px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Simuler le DCA →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {onglet === 'simulateur' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B', marginBottom: 14 }}>Paramètres</div>
                {[
                  { label: 'Capital initial (€)', value: capitalInitial, setter: setCapitalInitial, min: 0, max: 100000, step: 500 },
                  { label: 'Versement mensuel (€)', value: versement, setter: setVersement, min: 0, max: 5000, step: 50 },
                  { label: 'Taux annuel (%)', value: taux, setter: setTaux, min: 1, max: 15, step: 0.5 },
                  { label: 'Durée (années)', value: duree, setter: setDuree, min: 1, max: 50, step: 1 },
                ].map(({ label, value, setter, min, max, step }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 500, color: '#1B2E4B' }}>{value}{label.includes('%') ? '%' : label.includes('années') ? ' ans' : ' €'}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={value} onChange={e => setter(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                ))}
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>Enveloppe fiscale</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['PEA', 'CTO'].map(e => (
                      <div key={e} onClick={() => setEnveloppe(e)} style={{ flex: 1, textAlign: 'center', padding: '7px', borderRadius: 8, background: enveloppe === e ? '#1B2E4B' : '#F4F7F5', color: enveloppe === e ? '#fff' : '#6B7280', fontSize: 12, fontWeight: enveloppe === e ? 500 : 400, cursor: 'pointer', border: '0.5px solid #E0EAE3' }}>{e}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
                {[
                  ['Capital investi', `${derniere?.capitalInvesti.toLocaleString('fr-FR')} €`, '#1B2E4B'],
                  ['Capital total', `${derniere?.capitalTotal.toLocaleString('fr-FR')} €`, '#4CAF2E'],
                  ['Intérêts gagnés', `${derniere?.interets.toLocaleString('fr-FR')} €`, '#4CAF2E'],
                  [`Après fiscalité (${enveloppe})`, `${capitalApresFisc.toLocaleString('fr-FR')} €`, '#1565C0'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 16, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 12 }}>Évolution du capital sur {duree} ans</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {historique.filter((_, i) => i % Math.max(1, Math.floor(historique.length / 8)) === 0 || i === historique.length - 1).map(({ annee, capitalInvesti, capitalTotal, interets }) => (
                    <div key={annee} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 10, color: '#9CA3AF', width: 40, flexShrink: 0 }}>An {annee}</div>
                      <div style={{ flex: 1, position: 'relative', height: 20 }}>
                        <div style={{ position: 'absolute', left: 0, top: 4, height: 12, borderRadius: 3, background: '#E3F0FF', width: `${capitalInvesti / maxVal * 100}%` }} />
                        <div style={{ position: 'absolute', left: `${capitalInvesti / maxVal * 100}%`, top: 4, height: 12, borderRadius: '0 3px 3px 0', background: '#4CAF2E', width: `${interets / maxVal * 100}%` }} />
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: '#1B2E4B', width: 80, textAlign: 'right', flexShrink: 0 }}>{capitalTotal.toLocaleString('fr-FR')} €</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9CA3AF' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9CA3AF' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Intérêts composés
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}