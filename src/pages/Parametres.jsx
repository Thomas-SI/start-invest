import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const POLICES = ['Inter', 'Georgia', 'Courier New', 'Arial', 'Verdana']
const LANGUES = ['Français', 'English', 'Español', 'Deutsch']

const ComingSoon = () => (
  <span style={{ fontSize: 9, background: '#FFF8E6', color: '#BA7517', padding: '2px 7px', borderRadius: 20, fontWeight: 500, marginLeft: 8 }}>Bientôt</span>
)

const Toggle = ({ active, onToggle, disabled }) => (
  <div onClick={disabled ? undefined : onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? '#4CAF2E' : '#E0EAE3', cursor: disabled ? 'default' : 'pointer', position: 'relative', transition: 'background 0.2s', opacity: disabled ? 0.4 : 1, flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, left: active ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
  </div>
)

const Row = ({ label, desc, children, t }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: t.bgSecondary, borderRadius: 10, marginBottom: 8 }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{label}</div>
      {desc && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{desc}</div>}
    </div>
    {children}
  </div>
)

const SectionTitle = ({ children, t }) => (
  <div style={{ fontSize: 11, fontWeight: 500, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, marginTop: 20 }}>{children}</div>
)

export default function Parametres() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [police, setPolice] = useState('Inter')
  const [langue, setLangue] = useState('Français')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Compte" initiale={initiale} />
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => navigate('/compte')} style={{ background: t.bgSecondary, border: `0.5px solid ${t.border}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: t.text, cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Retour
            </button>
            <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>Paramètres</div>
          </div>

          {/* APPARENCE */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Apparence</SectionTitle>
            <Row label={`Mode ${t.dark ? 'sombre' : 'clair'}`} desc={t.dark ? 'Interface sombre activée' : 'Interface claire activée'} t={t}>
              <Toggle active={t.dark} onToggle={t.toggle} />
            </Row>
            <Row label={<span>Mode Night Shift<ComingSoon /></span>} desc="Réduit la lumière bleue le soir" t={t}>
              <Toggle active={false} disabled />
            </Row>

            <SectionTitle t={t}>Police d'écriture</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {POLICES.map(p => (
                <button key={p} onClick={() => p === 'Inter' && setPolice(p)} style={{ padding: '6px 14px', borderRadius: 20, border: `0.5px solid ${police === p ? '#4CAF2E' : t.border}`, background: police === p ? '#EAF6E4' : t.bgSecondary, color: police === p ? '#2E7D1E' : p === 'Inter' ? t.text : t.textMuted, fontSize: 12, fontFamily: p, cursor: p === 'Inter' ? 'pointer' : 'default', opacity: p === 'Inter' ? 1 : 0.5, fontFamily: 'inherit' }}>
                  {p}{p !== 'Inter' && ' 🔒'}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUE */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Langue</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LANGUES.map(l => (
                <button key={l} onClick={() => l === 'Français' && setLangue(l)} style={{ padding: '6px 14px', borderRadius: 20, border: `0.5px solid ${langue === l ? '#4CAF2E' : t.border}`, background: langue === l ? '#EAF6E4' : t.bgSecondary, color: langue === l ? '#2E7D1E' : l === 'Français' ? t.text : t.textMuted, fontSize: 12, cursor: l === 'Français' ? 'pointer' : 'default', fontFamily: 'inherit', opacity: l === 'Français' ? 1 : 0.5 }}>
                  {l}{l !== 'Français' && ' 🔒'}
                </button>
              ))}
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Notifications <ComingSoon /></SectionTitle>
            <Row label="Notifications par email" desc="Recevoir les mises à jour par email" t={t}>
              <Toggle active={false} disabled />
            </Row>
            <Row label="Notifications par message" desc="Recevoir les alertes par SMS" t={t}>
              <Toggle active={false} disabled />
            </Row>
          </div>

          {/* FACTURATION */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Facturation <ComingSoon /></SectionTitle>
            {['Forfait', 'Paiement', 'Factures', 'Annulation'].map(item => (
              <Row key={item} label={item} desc="Disponible avec un plan Premium" t={t}>
                <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
              </Row>
            ))}
          </div>

          {/* DON */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Soutenir StartInvest <ComingSoon /></SectionTitle>
            <Row label="Faire un don" desc="Soutenez le développement de l'application" t={t}>
              <span style={{ fontSize: 16 }}>💚</span>
            </Row>
          </div>

          {/* CONNECTEURS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>Connecteurs <ComingSoon /></SectionTitle>
            <Row label="Compte bancaire" desc="Synchronisez votre banque" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
            <Row label="App de gestion du patrimoine" desc="Connectez vos outils" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
          </div>

          {/* IA AGENT */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <SectionTitle t={t}>IA Agent <ComingSoon /></SectionTitle>
            <Row label="Personnalisation de l'agent" desc="Disponible avec un plan Premium" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
          </div>

        </div>
      </div>
    </div>
  )
}