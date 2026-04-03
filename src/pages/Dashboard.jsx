import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const etfs = [
  { lettre: 'W', couleur: '#E3F0FF', texte: '#1565C0', nom: 'MSCI World', zone: 'Monde', perf: '+18.4%', frais: '0.20%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'S', couleur: '#EAF6E4', texte: '#2E7D1E', nom: 'S&P 500', zone: 'États-Unis', perf: '+22.1%', frais: '0.07%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
  { lettre: 'E', couleur: '#EBE9FC', texte: '#3C3489', nom: 'Euro Bonds', zone: 'Europe', perf: '+4.2%', frais: '0.15%', volatilite: 'Faible', type: 'Obligations', typeBg: '#E3F0FF', typeColor: '#0C447C' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [finances, setFinances] = useState({ revenus: 0, depenses: 0, pourcentage_invest: 20 })
  const [showModal, setShowModal] = useState(false)
  const [showEcheances, setShowEcheances] = useState(false)
  const [form, setForm] = useState({ revenus: '', depenses: '', pourcentage_invest: '' })
  const [echeances, setEcheances] = useState([])
  const [formEch, setFormEch] = useState({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  const disponible = finances.revenus - finances.depenses
  const totalEcheances = echeances.reduce((acc, e) => acc + (e.montant_annuel / 12), 0)
  const investissable = Math.round((disponible - totalEcheances) * finances.pourcentage_invest / 100)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: fin } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
      if (fin) setFinances(fin)
      const { data: ech } = await supabase.from('echeances').select('*').eq('user_id', user.id)
      if (ech) setEcheances(ech)
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      user_id: user.id,
      revenus: parseFloat(form.revenus),
      depenses: parseFloat(form.depenses),
      pourcentage_invest: parseFloat(form.pourcentage_invest),
    }
    const { data: existing } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
    if (existing) {
      await supabase.from('finances').update(payload).eq('user_id', user.id)
    } else {
      await supabase.from('finances').insert(payload)
    }
    setFinances(payload)
    setShowModal(false)
    setLoading(false)
  }

  const handleAddEcheance = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      user_id: user.id,
      categorie: formEch.categorie,
      libelle: formEch.libelle,
      mois: formEch.mois,
      montant_annuel: parseFloat(formEch.montant_annuel),
    }
    const { data } = await supabase.from('echeances').insert(payload).select().single()
    if (data) setEcheances([...echeances, data])
    setFormEch({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  }

  const handleDeleteEcheance = async (id) => {
    await supabase.from('echeances').delete().eq('id', id)
    setEcheances(echeances.filter(e => e.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', width: 360, border: '0.5px solid #E0EAE3' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', marginBottom: 20 }}>Modifier mes finances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Revenus mensuels (€)</div>
                <input type="number" placeholder="ex: 3400" value={form.revenus} onChange={e => setForm({ ...form, revenus: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Dépenses mensuelles (€)</div>
                <input type="number" placeholder="ex: 2330" value={form.depenses} onChange={e => setForm({ ...form, depenses: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>% du disponible à investir</div>
                <input type="number" placeholder="ex: 20" value={form.pourcentage_invest} onChange={e => setForm({ ...form, pourcentage_invest: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '0.5px solid #C8D8CE', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '0.5px solid #C8D8CE', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEcheances && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', width: 480, border: '0.5px solid #E0EAE3', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', marginBottom: 20 }}>Calendrier des échéances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {echeances.length === 0 && <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>Aucune échéance ajoutée</div>}
              {echeances.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F4F7F5', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B' }}>{e.libelle}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{e.categorie} · {e.mois} · {Math.round(e.montant_annuel / 12)} €/mois</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B' }}>{e.montant_annuel} €/an</span>
                    <button onClick={() => handleDeleteEcheance(e.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Suppr.</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '0.5px solid #E0EAE3', paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 10 }}>Ajouter une échéance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input placeholder="Catégorie (ex: Logement)" value={formEch.categorie} onChange={e => setFormEch({ ...formEch, categorie: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
                <input placeholder="Libellé (ex: Taxe foncière)" value={formEch.libelle} onChange={e => setFormEch({ ...formEch, libelle: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
                <input placeholder="Mois (ex: Octobre)" value={formEch.mois} onChange={e => setFormEch({ ...formEch, mois: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
                <input type="number" placeholder="Montant annuel (€)" value={formEch.montant_annuel} onChange={e => setFormEch({ ...formEch, montant_annuel: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: '0.5px solid #C8D8CE', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <button onClick={handleAddEcheance} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>Total provision : <span style={{ fontWeight: 500, color: '#1B2E4B' }}>{Math.round(totalEcheances)} €/mois</span></div>
              <button onClick={() => setShowEcheances(false)} style={{ background: '#1B2E4B', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

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
            <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === 'Finances' ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Finances' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
          <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 220px', gap: 12, padding: 12, flex: 1, minHeight: 0 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Investissable / mois</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#4CAF2E', marginBottom: 8 }}>{investissable} € <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>/mois</span></div>
            <div style={{ background: '#EAF6E4', borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#4CAF2E', width: `${Math.min(finances.pourcentage_invest, 100)}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF' }}>
              <span>{finances.pourcentage_invest}% dispo</span><span>{Math.round(disponible)} € libre</span>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Mes finances</div>
            {[['Revenus', `${finances.revenus} €`, '#4CAF2E'], ['Dépenses', `${finances.depenses} €`, '#E24B4A'], ['Échéances', `-${Math.round(totalEcheances)} €`, '#BA7517'], ['Disponible', `${Math.round(disponible - totalEcheances)} €`, '#1B2E4B'], ['% investi', `${finances.pourcentage_invest}%`, '#4CAF2E']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              <button onClick={() => { setForm({ revenus: finances.revenus, depenses: finances.depenses, pourcentage_invest: finances.pourcentage_invest }); setShowModal(true) }} style={{ width: '100%', background: '#EAF6E4', color: '#2E7D1E', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                + Modifier mes finances
              </button>
              <button onClick={() => setShowEcheances(true)} style={{ width: '100%', background: '#FFF8E6', color: '#BA7517', fontSize: 11, fontWeight: 500, padding: 7, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                📅 Calendrier des échéances
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>ETF populaires</span>
              <span onClick={() => navigate('/explorer')} style={{ fontSize: 11, color: '#4CAF2E', cursor: 'pointer' }}>Voir tout →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              {etfs.map(({ lettre, couleur, texte, nom, zone, perf, frais, volatilite, type, typeBg, typeColor }) => (
                <div key={nom} style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: 11, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: couleur, color: texte, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{lettre}</div>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 20, background: typeBg, color: typeColor }}>{type}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 1 }}>{nom}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 7 }}>{zone}</div>
                  {[['Perf. 1an', perf, true], ['Frais', frais, false], ['Volatilité', volatilite, false]].map(([k, v, green]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                      <span style={{ color: '#9CA3AF' }}>{k}</span>
                      <span style={{ fontWeight: 500, color: green ? '#4CAF2E' : '#1B2E4B' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B', marginBottom: 8 }}>Concentration & résilience</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { titre: 'Pensez à 5 ans, pas à 5 mois', txt: 'Le DCA fonctionne sur le long terme. Investissez uniquement ce que vous pouvez immobiliser.', bg: '#EAF6E4' },
                { titre: 'Diversifiez vos ETF', txt: 'Mixer actions et obligations réduit le risque. Évitez 40%+ sur un seul marché.', bg: '#E8EEF6' },
              ].map(({ titre, txt, bg }) => (
                <div key={titre} style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: 11 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: bg, marginBottom: 7 }} />
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#1B2E4B', marginBottom: 3 }}>{titre}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>{txt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 13, flex: 1 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Mon plan</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EAF6E4', borderRadius: 8, padding: '8px 10px', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#2E7D1E' }}>Gratuit</span>
              <span style={{ fontSize: 10, background: '#4CAF2E', color: '#fff', padding: '2px 8px', borderRadius: 20 }}>Actif</span>
            </div>
            {[['3 ETF / mois', true], ['Finances de base', true], ['IA & recommandations', false], ['Données avancées', false]].map(([f, actif]) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: actif ? '#6B7280' : '#C4C9C7', padding: '3px 0' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: actif ? '#EAF6E4' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {actif && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                </div>
                {f}
              </div>
            ))}
            <button onClick={() => navigate('/abonnement')} style={{ width: '100%', marginTop: 10, background: '#1B2E4B', color: '#fff', fontSize: 12, fontWeight: 500, padding: 9, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Passer à Premium →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}