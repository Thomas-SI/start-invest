export default function FooterApp() {
  return (
    <footer style={{ background: '#1B2E4B', padding: '24px 40px', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 500, textAlign: 'center' }}>
          Les informations presentees sont a titre educatif uniquement. Elles ne constituent pas un conseil en investissement. L investissement comporte des risques de perte en capital.
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Copyright {new Date().getFullYear()} StartInvest</div>
      </div>
    </footer>
  )
}
