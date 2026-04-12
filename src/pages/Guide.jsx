import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'

export default function Guide() {
  const t = useTheme()

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Guide" />
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Guide & Formations</div>
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 8 }}>Formations à venir</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>Des guides, articles et vidéos sur l'investissement en ETF seront disponibles prochainement.</div>
        </div>
      </div>
    </div>
  )
}