import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

const ETAPES = [
  {
    id: 1,
    emoji: '🎉',
    titre: 'Bienvenue sur StartInvest',
    description: 'L\'application tout-en-un pour gérer vos finances, suivre vos investissements et construire votre avenir financier.',
    animation: 'welcome',
  },
  {
    id: 2,
    emoji: '💰',
    titre: 'Mes Finances',
    description: 'Saisissez vos revenus et dépenses, visualisez la règle 50/30/20 et découvrez combien vous pouvez investir chaque mois.',
    animation: 'finances',
  },
  {
    id: 3,
    emoji: '🏦',
    titre: 'Portefeuille',
    description: 'Gérez vos comptes bancaires, suivez votre matelas de sécurité et planifiez vos virements mensuels automatiquement.',
    animation: 'portefeuille',
  },
  {
    id: 4,
    emoji: '📈',
    titre: 'Investissement',
    description: 'Enregistrez vos achats d\'ETF, suivez vos positions par enveloppe (PEA, CTO) et visualisez vos plus-values en temps réel.',
    animation: 'investissement',
  },
  {
    id: 5,
    emoji: '📚',
    titre: 'Concentration',
    description: 'Développez votre mindset d\'investisseur avec des conseils pratiques pour rester discipliné sur le long terme.',
    animation: 'concentration',
  },
  {
    id: 6,
    emoji: '🚀',
    titre: 'Vous êtes prêt !',
    description: 'Tout est en place pour commencer votre parcours d\'investisseur. Bonne chance et bienvenue dans la communauté StartInvest !',
    animation: 'ready',
  },
]

function AnimationWelcome() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:1 } 50% { transform: scale(1.08); opacity:0.85 } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
      <div style={{ textAlign: 'center', animation: 'float 3s ease-in-out infinite' }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: 'pulse 2s ease-in-out infinite' }}>📊</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Finances', 'ETF', 'Croissance', 'DCA'].map((l, i) => (
            <div key={l} style={{ background: i % 2 === 0 ? '#EAF6E4' : '#E8EEF6', color: i % 2 === 0 ? '#2E7D1E' : '#1B2E4B', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, animation: `fadeIn 0.5s ease ${i * 0.15}s both` }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnimationFinances() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`
        @keyframes growBar { from { width: 0 } to { width: var(--w) } }
        @keyframes countUp { from { opacity:0 } to { opacity:1 } }
      `}</style>
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', marginBottom: 12, textAlign: 'center' }}>Règle 50 / 30 / 20</div>
        {[
          { label: 'Besoins', pct: 50, color: '#1B2E4B', w: '50%' },
          { label: 'Envies', pct: 28, color: '#BA7517', w: '28%' },
          { label: 'Investissement', pct: 22, color: '#4CAF2E', w: '22%' },
        ].map(({ label, pct, color, w }, i) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: '#6B7280' }}>{label}</span>
              <span style={{ fontWeight: 600, color }}>{pct}%</span>
            </div>
            <div style={{ background: '#F0F0F0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: color, '--w': w, animation: `growBar 1s ease ${i * 0.3}s both` } as any} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 16, background: '#EAF6E4', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#2E7D1E' }}>Investissable / mois</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#4CAF2E' }}>440 €</span>
        </div>
      </div>
    </div>
  )
}

function AnimationPortefeuille() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`
        @keyframes fillBar { from { width:0 } to { width: var(--w) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px) } to { opacity:1; transform:translateX(0) } }
      `}</style>
      <div style={{ width: '100%', maxWidth: 280 }}>
        {[
          { nom: 'Livret A', solde: '8 200 €', pct: 82, color: '#4CAF2E', w: '82%', delay: '0s' },
          { nom: 'PEA', solde: '15 400 €', pct: 100, color: '#1B2E4B', w: '100%', delay: '0.2s' },
          { nom: 'CTO', solde: '6 800 €', pct: 68, color: '#3B82F6', w: '68%', delay: '0.4s' },
        ].map(({ nom, solde, pct, color, w, delay }) => (
          <div key={nom} style={{ marginBottom: 12, animation: `slideIn 0.5s ease ${delay} both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ fontWeight: 500, color: '#1B2E4B' }}>{nom}</span>
              <span style={{ color: '#6B7280' }}>{solde}</span>
            </div>
            <div style={{ background: '#F0F0F0', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: color, '--w': w, animation: `fillBar 1s ease ${delay} both` } as any} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14, background: '#F4F7F5', borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Total patrimoine</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2E4B' }}>30 400 €</span>
        </div>
      </div>
    </div>
  )
}

function AnimationInvestissement() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform:scale(0.8) } to { opacity:1; transform:scale(1) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Total investi', val: '12 400 €', color: '#1B2E4B' },
            { label: 'Valeur actuelle', val: '14 820 €', color: '#4CAF2E' },
            { label: 'Plus-value', val: '+2 420 €', color: '#4CAF2E' },
            { label: 'Positions', val: '4', color: '#3B82F6' },
          ].map(({ label, val, color }, i) => (
            <div key={label} style={{ background: '#F4F7F5', borderRadius: 8, padding: '8px 10px', animation: `popIn 0.4s ease ${i * 0.1}s both` }}>
              <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#F4F7F5', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { ticker: 'PE500', enveloppe: 'PEA', val: '6 240 €', pv: '+8.2%', color: '#4CAF2E' },
            { ticker: 'VUAA', enveloppe: 'CTO', val: '4 180 €', pv: '+12.1%', color: '#4CAF2E' },
            { ticker: 'VFEA', enveloppe: 'CTO', val: '2 400 €', pv: '-2.3%', color: '#E24B4A' },
          ].map(({ ticker, enveloppe, val, pv, color }, i) => (
            <div key={ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderBottom: '0.5px solid #E0EAE3', animation: `slideUp 0.4s ease ${0.4 + i * 0.1}s both` }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1B2E4B' }}>{ticker}</div>
                <div style={{ fontSize: 9, color: '#9CA3AF' }}>{enveloppe}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#1B2E4B' }}>{val}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color }}>{pv}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnimationConcentration() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
      <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { titre: 'Pensez à 5 ans, pas à 5 mois', cat: 'Mindset', color: '#EAF6E4', text: '#2E7D1E', delay: '0s' },
          { titre: 'Ne timer jamais le marché', cat: 'Mindset', color: '#EAF6E4', text: '#2E7D1E', delay: '0.2s' },
          { titre: 'Les frais, l\'ennemi silencieux', cat: 'Technique', color: '#EBE9FC', text: '#3C3489', delay: '0.4s' },
        ].map(({ titre, cat, color, text, delay }) => (
          <div key={titre} style={{ background: '#F4F7F5', borderRadius: 10, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: `fadeSlide 0.5s ease ${delay} both` }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#1B2E4B', flex: 1, marginRight: 8 }}>{titre}</span>
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: color, color: text, whiteSpace: 'nowrap' }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimationReady() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes rocket { 0% { transform: translateY(0) rotate(-45deg) } 50% { transform: translateY(-20px) rotate(-45deg) } 100% { transform: translateY(0) rotate(-45deg) } }
        @keyframes sparkle { 0%,100% { opacity:0; transform:scale(0) } 50% { opacity:1; transform:scale(1) } }
      `}</style>
      <div style={{ fontSize: 64, animation: 'rocket 1.5s ease-in-out infinite' }}>🚀</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {['⭐', '✨', '🌟'].map((s, i) => (
          <div key={i} style={{ fontSize: 24, animation: `sparkle 1.5s ease ${i * 0.3}s infinite` }}>{s}</div>
        ))}
      </div>
    </div>
  )
}

function TourApp({ onTerminer }) {
  const [etape, setEtape] = useState(0)
  const current = ETAPES[etape]

  const renderAnimation = () => {
    switch (current.animation) {
      case 'welcome': return <AnimationWelcome />
      case 'finances': return <AnimationFinances />
      case 'portefeuille': return <AnimationPortefeuille />
      case 'investissement': return <AnimationInvestissement />
      case 'concentration': return <AnimationConcentration />
      case 'ready': return <AnimationReady />
      default: return null
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* BARRE DE PROGRESSION */}
        <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0' }}>
          {ETAPES.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= etape ? '#4CAF2E' : '#E0EAE3', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* ANIMATION */}
        <div style={{ height: 200, padding: '8px 20px' }}>
          {renderAnimation()}
        </div>

        {/* CONTENU */}
        <div style={{ padding: '0 28px 24px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1B2E4B', marginBottom: 8 }}>
            {current.emoji} {current.titre}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, marginBottom: 24 }}>
            {current.description}
          </div>

          {/* BOUTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={onTerminer}
              style={{ fontSize: 12, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Passer le tour
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {etape > 0 && (
                <button
                  onClick={() => setEtape(e => e - 1)}
                  style={{ padding: '9px 18px', borderRadius: 9, border: '0.5px solid #E0EAE3', background: '#F4F7F5', fontSize: 13, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  ← Retour
                </button>
              )}
              <button
                onClick={() => etape < ETAPES.length - 1 ? setEtape(e => e + 1) : onTerminer()}
                style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {etape < ETAPES.length - 1 ? 'Suivant →' : 'Commencer !'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const t = useTheme()
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [metier, setMetier] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [showTour, setShowTour] = useState(false)

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
      setShowTour(true)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTerminerTour = () => {
    navigate('/dashboard')
  }

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${t.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' as 'border-box' }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>

      {showTour && <TourApp onTerminer={handleTerminerTour} />}

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
            <input placeholder="ex: Thomas" value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 6 }}>Nom *</div>
            <input placeholder="ex: Dupont" value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 6 }}>Métier *</div>
            <input placeholder="ex: Ingénieur, Étudiant, Entrepreneur..." value={metier} onChange={e => setMetier(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 12, marginBottom: 20 }}>* Champs obligatoires</div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
        >
          {loading ? '⏳ Sauvegarde...' : 'Continuer →'}
        </button>

      </div>
    </div>
  )
}