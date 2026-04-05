import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const enveloppes = ['Livret A', 'LDDS', 'LEP', 'Livret Jeune', 'CEL', 'PEL', 'PEA', 'CTO', 'Assurance-vie', 'PER', 'PEAC']

export default function Portefeuille() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [comptes, setComptes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nom: '', solde: '', objectif: '' })
  const [depensesMensuelles, setDepensesMensuelles] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: fin } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
      if (fin) setDepensesMensuelles(fin.depenses)
    }
    fetchData()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const totalPatrimoine = comptes.reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)
  const objectifMatelas = depensesMensuelles * 6
  const epargneDisponible = comptes.filter(c => ['Livret A', 'LDDS', 'LEP', 'Livret Jeune'].includes(c.nom)).reduce((acc, c) => acc + (parseFloat(c.solde) || 0), 0)

  const repartition = comptes.reduce((acc, c) => {
    const type = ['Livret A', 'LDDS', 'LEP', 'Livret Jeune', 'CEL', 'PEL'].includes(c.nom) ? 'Sécurité' :
      ['PEA', 'CTO', 'Assurance-vie', 'PER', 'PEAC'].includes(c.nom) ? 'Investissement' : 'Autre'
    acc[type] = (acc[type] || 0) + (parseFloat(c.solde) || 0)
    return acc
  }, {})

  const couleurs = { 'Sécurité': '#4CAF2E', 'Investissement': '#1565C0', 'Autre': '#BA7517' }

  const handleAddCompte = () => {
    if (!form.nom || !form.solde) return
    setComptes([...comptes, { ...form, id: Date.now() }])
    setForm({ nom: '', solde: '', objectif: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => setComptes(comptes.filter(c => c.id !== id))

  return (
    <div style={{ background: t.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: '28px', width: 380, border: `0.5px solid ${t.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 16 }}>Ajouter un compte</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Enveloppe / Compte</div>
                <select value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}>
                  <option value="">Sélectionner</option>
                  {enveloppes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Solde actuel (€)</div>
                <input type="number" placeholder="ex: 5000" value={form.solde} onChange={e => setForm({ ...form, solde: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Objectif (€) — optionnel</div>
                <input type="number" placeholder="ex: 10000" value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: t.text }}>Annuler</button>
              <button onClick={handleAddCompte} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      <Navbar page="Portefeuille" initiale={initiale} />

      <div style={{ padding: '12px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 12 }}>
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Total patrimoine</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text }}>{totalPatrimoine.toLocaleString('fr-FR')} €</div>
          </div>
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Matelas de sécurité</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#4CAF2E', marginBottom: 6 }}>{epargneDisponible.toLocaleString('fr-FR')} €</div>
            <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#4CAF2E', width: `${Math.min((epargneDisponible / (objectifMatelas || 1)) * 100, 100)}%` }} />
            </div>
            <div style={{ fontSize: 10, color: t.textMuted }}>Objectif 6 mois : {objectifMatelas.toLocaleString('fr-FR')} €</div>
          </div>
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Répartition du portefeuille</div>
            {Object.entries(repartition).map(([type, val]) => (
              <div key={type} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: t.textSecondary }}>{type}</span>
                  <span style={{ fontWeight: 500, color: couleurs[type] }}>{totalPatrimoine > 0 ? Math.round(val / totalPatrimoine * 100) : 0}%</span>
                </div>
                <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: couleurs[type], width: `${totalPatrimoine > 0 ? val / totalPatrimoine * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Mes comptes</div>
          <button onClick={() => setShowModal(true)} style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter</button>
        </div>

        {comptes.length === 0 && (
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>Aucun compte ajouté</div>
            <div style={{ fontSize: 12, color: t.textMuted, opacity: 0.6 }}>Cliquez sur "+ Ajouter" pour commencer</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
          {comptes.map(({ id, nom, solde, objectif }) => {
            const typeCompte = ['Livret A', 'LDDS', 'LEP', 'Livret Jeune', 'CEL', 'PEL'].includes(nom) ? 'Sécurité' : 'Investissement'
            const bg = typeCompte === 'Sécurité' ? '#EAF6E4' : '#E3F0FF'
            const color = typeCompte === 'Sécurité' ? '#2E7D1E' : '#1565C0'
            return (
              <div key={id} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color }}>{nom[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{nom}</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>{typeCompte}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(id)} style={{ background: '#FCEBEB', color: '#E24B4A', border: 'none', borderRadius: 6, padding: '3px 7px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, color: t.text, marginBottom: objectif ? 8 : 0 }}>{parseFloat(solde).toLocaleString('fr-FR')} €</div>
                {objectif && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted, marginBottom: 4 }}>
                      <span>Progression</span>
                      <span>{Math.round(parseFloat(solde) / parseFloat(objectif) * 100)}% / {parseFloat(objectif).toLocaleString('fr-FR')} €</span>
                    </div>
                    <div style={{ background: t.bgSecondary, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, background: '#4CAF2E', width: `${Math.min(parseFloat(solde) / parseFloat(objectif) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}