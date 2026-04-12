import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'

const GUIDES = [
  {
    id: 1,
    titre: 'Guide Start Invest V2',
    description: 'Guide complet pour débuter et optimiser vos investissements en ETF.',
    url: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Guide%20Start%20Invest%20V2.pdf',
  }
]

export default function Guide() {
  const t = useTheme()

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Guide" />
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 1000, margin: '0 auto', width: '100%' }}>

        <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Guide & Formations</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GUIDES.map(guide => (
            <div key={guide.id} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{guide.titre}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{guide.description}</div>
                </div>
                <a href={guide.url} target="_blank" rel="noreferrer" style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  ↓ Télécharger
                </a>
              </div>
              <iframe
                src={`${guide.url}#toolbar=0`}
                style={{ width: '100%', height: 600, border: 'none' }}
                title={guide.titre}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}