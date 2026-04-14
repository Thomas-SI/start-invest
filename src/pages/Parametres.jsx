import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const LANGUES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dispo: true },
  { code: 'en', label: 'English', flag: '🇬🇧', dispo: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', dispo: false },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dispo: false },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dispo: false },
  { code: 'pt', label: 'Português', flag: '🇵🇹', dispo: false },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', dispo: false },
  { code: 'pl', label: 'Polski', flag: '🇵🇱', dispo: false },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪', dispo: false },
  { code: 'da', label: 'Dansk', flag: '🇩🇰', dispo: false },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮', dispo: false },
  { code: 'nb', label: 'Norsk', flag: '🇳🇴', dispo: false },
  { code: 'ro', label: 'Română', flag: '🇷🇴', dispo: false },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿', dispo: false },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺', dispo: false },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷', dispo: false },
]

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
  const [langue, setLangue] = useState('fr')
  const [tailleTexte, setTailleTexte] = useState(t.fontSize)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  const handleFontSize = (val) => {
    setTailleTexte(val)
    t.toggleFontSize(val)
  }

  const handleResetFont = () => {
    setTailleTexte(14)
    t.resetFontSize()
  }

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
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Apparence</div>

            <SectionTitle t={t}>Thème</SectionTitle>
            <Row label={`Mode ${t.dark ? 'sombre' : 'clair'}`} desc={t.dark ? 'Interface sombre activée' : 'Interface claire activée'} t={t}>
              <Toggle active={t.dark} onToggle={t.toggle} />
            </Row>
            <Row label="Mode Night Shift" desc="Réduit la lumière bleue de l'écran" t={t}>
              <Toggle active={t.nightShift} onToggle={t.toggleNightShift} />
            </Row>

            <SectionTitle t={t}>Taille du texte</SectionTitle>
            <div style={{ padding: '12px 16px', background: t.bgSecondary, borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: t.textMuted }}>Petit</span>
                <span style={{ fontSize: tailleTexte, color: t.text, fontWeight: 500 }}>Aa — {tailleTexte}px</span>
                <span style={{ fontSize: 11, color: t.textMuted }}>Grand</span>
              </div>
              <input
                type="range" min="11" max="18" value={tailleTexte}
                onChange={e => handleFontSize(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#4CAF2E', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 11, color: t.textMuted }}>
                  {tailleTexte === 14 ? '✓ Taille par défaut' : `Taille modifiée (défaut : 14px)`}
                </span>
                {tailleTexte !== 14 && (
                  <button
                    onClick={handleResetFont}
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgCard, color: t.text, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Remettre par défaut
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LANGUE */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Langue</div>
            <SectionTitle t={t}>Langue de l'application</SectionTitle>
            <div style={{ position: 'relative' }}>
              <select
                value={langue}
                onChange={e => {
                  const selected = LANGUES.find(l => l.code === e.target.value)
                  if (selected?.dispo) setLangue(e.target.value)
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, cursor: 'pointer', appearance: 'none' }}
              >
                {LANGUES.map(l => (
                  <option key={l.code} value={l.code} disabled={!l.dispo}>
                    {l.flag} {l.label}{!l.dispo ? ' 🔒' : ''}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: t.textMuted, fontSize: 10 }}>▼</div>
            </div>
            {langue !== 'fr' && (
              <div style={{ fontSize: 11, color: '#BA7517', background: '#FFF8E6', padding: '6px 10px', borderRadius: 7, marginTop: 8 }}>
                Cette langue sera disponible prochainement.
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Notifications <ComingSoon /></div>
            <SectionTitle t={t}>Canaux</SectionTitle>
            <Row label="Notifications par email" desc="Recevoir les mises à jour par email" t={t}>
              <Toggle active={false} disabled />
            </Row>
            <Row label="Notifications par message" desc="Recevoir les alertes par SMS" t={t}>
              <Toggle active={false} disabled />
            </Row>
          </div>

          {/* FACTURATION */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Facturation <ComingSoon /></div>
            <SectionTitle t={t}>Gestion</SectionTitle>
            {['Forfait', 'Paiement', 'Factures', 'Annulation'].map(item => (
              <Row key={item} label={item} desc="Disponible avec un plan Premium" t={t}>
                <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
              </Row>
            ))}
          </div>

          {/* DON */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Soutenir StartInvest <ComingSoon /></div>
            <SectionTitle t={t}>Don</SectionTitle>
            <Row label="Faire un don" desc="Soutenez le développement de l'application" t={t}>
              <span style={{ fontSize: 16 }}>💚</span>
            </Row>
          </div>

          {/* CONNECTEURS */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>Connecteurs <ComingSoon /></div>
            <SectionTitle t={t}>Intégrations</SectionTitle>
            <Row label="Compte bancaire" desc="Synchronisez votre banque" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
            <Row label="App de gestion du patrimoine" desc="Connectez vos outils" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
          </div>

          {/* IA AGENT */}
          <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 4 }}>IA Agent <ComingSoon /></div>
            <SectionTitle t={t}>Personnalisation</SectionTitle>
            <Row label="Personnalisation de l'agent" desc="Disponible avec un plan Premium" t={t}>
              <span style={{ fontSize: 11, color: t.textMuted }}>→</span>
            </Row>
          </div>

        </div>
      </div>
    </div>
  )
}