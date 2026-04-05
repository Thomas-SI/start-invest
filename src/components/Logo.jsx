export default function Logo({ size = 'md', theme = 'light' }) {
  const scales = { sm: 0.55, md: 1, lg: 1.8 }
  const s = scales[size] || 1
  const startColor = theme === 'dark' ? 'rgba(255,255,255,0.9)' : '#1B2E4B'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontSize: 22 * s,
          fontWeight: 800,
          color: 'transparent',
          WebkitTextStroke: `${1.5 * s}px ${startColor}`,
          letterSpacing: 1 * s,
          fontFamily: 'Arial Black, sans-serif',
          lineHeight: 1,
        }}>START</span>
        <span style={{
          fontSize: 22 * s,
          fontWeight: 800,
          color: '#4CAF2E',
          letterSpacing: 1 * s,
          fontFamily: 'Arial Black, sans-serif',
          lineHeight: 1,
          marginTop: -2 * s,
        }}>INVEST</span>
      </div>
      <div style={{ fontSize: 7 * s, color: startColor, opacity: 0.6, marginTop: 2 * s, letterSpacing: 0.3 }}>
        Bâtir son mental, <span style={{ color: '#4CAF2E', opacity: 1 }}>construire son avenir.</span>
      </div>
    </div>
  )
}