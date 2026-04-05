import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const categories = ['Logement', 'Véhicules', 'Abonnement', 'Santé', 'Impôts', 'Assurances', 'Autres']

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useTheme()
  const [finances, setFinances] = useState({ revenus: 0, depenses: 0, pourcentage_invest: 20 })
  const [showModal, setShowModal] = useState(false)
  const [showEcheances, setShowEcheances] = useState(false)
  const [form, setForm] = useState({ revenus: '', depenses: '', pourcentage_invest: '' })
  const [echeances, setEcheances] = useState([])
  const [formEch, setFormEch] = useState({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [alertes, setAlertes] = useState([])

  const disponible = finances.revenus - finances.depenses
  const totalEcheances = echeances.reduce((acc, e) => acc + (e.montant_annuel / 12), 0)
  const investissable = Math.round((disponible - totalEcheances) * finances.pourcentage_invest / 100)
  const moisActuel = new Date().getMonth()

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
          const moisEch = mois.indexOf(e.mois)
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
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { user_id: user.id, categorie: formEch.categorie, libelle: formEch.libelle, mois: formEch.mois, montant_annuel: parseFloat(formEch.montant_annuel) }
    const { data } = await supabase.from('echeances').insert(payload).select().single()
    if (data) setEcheances([...echeances, data])
    setFormEch({ categorie: '', libelle: '', mois: '', montant_annuel: '' })
  }

  const handleDeleteEcheance = async (id) => {
    await supabase.from('echeances').delete().eq('id', id)
    setEcheances(echeances.filter(e => e.id !== id))
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

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

      {showEcheances && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: '28px', width: 520, border: `0.5px solid ${t.border}`, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 20 }}>Calendrier des échéances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {echeances.length === 0 && <div style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', padding: '16px 0' }}>Aucune échéance ajoutée</div>}
              {echeances.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: t.bgSecondary, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{e.libelle}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{e.categorie} · {e.mois} · {Math.round(e.montant_annuel / 12)} €/mois</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{e.montant_annuel} €/an</span>
                    <button onClick={() => handleDeleteEcheance(e.id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Suppr.</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `0.5px solid ${t.border}`, paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 10 }}>Ajouter une échéance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <select value={formEch.categorie} onChange={e => setFormEch({ ...formEch, categorie: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  <option value="">Catégorie</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Libellé" value={formEch.libelle} onChange={e => setFormEch({ ...formEch, libelle: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
                <select value={formEch.mois} onChange={e => setFormEch({ ...formEch, mois: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  <option value="">Mois</option>
                  {mois.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input type="number" placeholder="Montant annuel (€)" value={formEch.montant_annuel} onChange={e => setFormEch({ ...formEch, montant_annuel: e.target.value })} style={{ padding: '8px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
              <button onClick={handleAddEcheance} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: t.textMuted }}>Total provision : <span style={{ fontWeight: 500, color: t.text }}>{Math.round(totalEcheances)} €/mois</span></div>
              <button onClick={() => setShowEcheances(false)} style={{ background: '#1B2E4B', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      <Navbar page="Mes Finances" initiale={initiale} />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, padding: 12, flex: 1, minHeight: 0 }}>

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
            {[['Revenus', `${finances.revenus} €`, '#4CAF2E'], ['Dépenses', `${finances.depenses} €`, '#E24B4A'], ['Échéances', `-${Math.round(totalEcheances)} €`, '#BA7517'], ['Disponible', `${Math.round(disponible - totalEcheances)} €`, t.text], ['% investi', `${finances.pourcentage_invest}%`, '#4CAF2E']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `0.5px solid ${t.border}` }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{l}</span>
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
          {alertes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alertes.map((a, i) => (
                <div key={i} style={{ background: a.type === '7 jours' ? '#FCEBEB' : '#FFF8E6', border: `0.5px solid ${a.type === '7 jours' ? '#F09595' : '#FAC775'}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{a.type === '7 jours' ? '🔴' : '🟠'}</span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: a.type === '7 jours' ? '#A32D2D' : '#633806' }}>Échéance dans {a.type} — </span>
                    <span style={{ fontSize: 12, color: a.type === '7 jours' ? '#A32D2D' : '#633806' }}>{a.libelle} · {a.montant_annuel} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 20, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 16 }}>Résumé financier</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Taux d\'épargne', `${finances.revenus > 0 ? Math.round((disponible / finances.revenus) * 100) : 0}%`, '#4CAF2E'],
                ['Dépenses fixes', `${Math.round((finances.depenses / (finances.revenus || 1)) * 100)}% du revenu`, '#E24B4A'],
                ['Provision échéances', `${Math.round(totalEcheances)} €/mois`, '#BA7517'],
                ['Reste après invest.', `${Math.round(disponible - totalEcheances - investissable)} €`, t.text],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: t.bgSecondary, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}