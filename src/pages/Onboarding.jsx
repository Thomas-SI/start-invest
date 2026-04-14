import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const t = useTheme()
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [metier, setMetier] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const handleSubmit = async () => {
    if (loading) return
    if (!prenom.trim() || !nom.trim() || !metier.trim()) {
      setErreur('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    setErreur(null)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { prenom: prenom.trim(), nom: nom.trim(), metier: metier.trim(), onboarding_done: true }
      })
      if (error) throw new Error('Erreur lors de la sauvegarde.')
      navigate('/dashboard')
    } catch (e) {
      setErreur(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480, background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 20, padding: 36 }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>
            <span style={{ color: '#4CAF2E' }}>START</span>INVEST
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 4 }}>Bienvenue ! 👋</div>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>
            Avant de commencer, dites-nous en un peu plus sur vous.
          </div>
        </div>

        {erreur && (
          <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#E24B4A', marginBottom: 16 }}>
            ⚠️ {erreur}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 6 }}>Prénom *</div>
            <input
              placeholder="ex: Thomas"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 6 }}>Nom *</div>
            <input
              placeholder="ex: Dupont"
              value={nom}
              onChange={e => setNom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 6 }}>Métier *</div>
            <input
              placeholder="ex: Ingénieur, Étudiant, Entrepreneur..."
              value={metier}
              onChange={e => setMetier(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 12, marginBottom: 20 }}>* Champs obligatoires</div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
        >
          {loading ? '⏳ Sauvegarde...' : 'Commencer →'}
        </button>

      </div>
    </div>
  )
}