import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Se connecter
          </button>
          <button onClick={() => navigate('/signup')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            S'inscrire gratuitement
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 40px 60px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Nouvelle façon d'investir</div>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.2, margin: '0 0 20px' }}>
            Prenez une longueur<br />
            <span style={{ color: '#4CAF2E' }}>d'avance.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 420 }}>
            Suivez vos finances. Atteignez vos objectifs.<br />Ayez un pas dans le futur.
          </p>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 400 }}>
            Développement, investissement, organisation de comptes. Start Invest vous aide à devenir celui de demain.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/signup')} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Commencer gratuitement →
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '12px 20px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#fff', color: '#6B7280', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Se connecter
            </button>
          </div>
        </div>

        {/* GRAPHIQUE + BADGE */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '20px 24px', boxShadow: '0 4px 24px rgba(27,46,75,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E4B' }}>PE500</div>
              <div style={{ fontSize: 12, color: '#4CAF2E', fontWeight: 500 }}>+18.4% cette année</div>
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>Amundi PEA S&P 500</div>
            <svg width="100%" height="120" viewBox="0 0 300 120">
              <defs>
                <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CAF2E" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#4CAF2E" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 90 C20 85, 40 88, 60 75 C80 62, 90 70, 110 58 C130 46, 140 52, 160 40 C180 28, 190 35, 210 25 C230 15, 250 20, 270 12 L270 120 L0 120 Z" fill="url(#gfill)"/>
              <path d="M0 90 C20 85, 40 88, 60 75 C80 62, 90 70, 110 58 C130 46, 140 52, 160 40 C180 28, 190 35, 210 25 C230 15, 250 20, 270 12" fill="none" stroke="#4CAF2E" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="270" cy="12" r="4" fill="#4CAF2E"/>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginTop: 8 }}>
              {['Jan', 'Mar', 'Mai', 'Juil', 'Sep', 'Nov'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>

          {/* BADGE Le Grand Saut */}
          <div style={{ position: 'absolute', bottom: -20, right: -20, background: '#fff', border: '0.5px solid #4CAF2E', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(76,175,46,0.12)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EAF6E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #4CAF2E' }}>🚀</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1B2E4B' }}>Le Grand Saut</div>
              <div style={{ fontSize: 10, color: '#4CAF2E' }}>Accomplissement débloqué !</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

          {/* Card 1 — Mes Finances */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', height: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Revenus', val: '3 200 €', color: '#4CAF2E', w: '80%' },
                { label: 'Dépenses fixes', val: '1 100 €', color: '#1B2E4B', w: '45%' },
                { label: 'Investissable', val: '640 €', color: '#BA7517', w: '26%' },
              ].map(({ label, val, color, w }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: '#6B7280' }}>{label}</span>
                    <span style={{ fontWeight: 600, color }}>{val}</span>
                  </div>
                  <div style={{ background: '#E0EAE3', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: color, width: w }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, background: '#EAF6E4', borderRadius: 8, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#2E7D1E' }}>Règle 50/30/20</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4CAF2E' }}>✓</span>
              </div>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2E4B', marginBottom: 6 }}>Analysez vos dépenses</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Donnez-leur une importance.</div>
            </div>
          </div>

          {/* Card 2 — ETF */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', height: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { ticker: 'PE500', enveloppe: 'PEA', pv: '+18.4%', color: '#4CAF2E' },
                { ticker: 'VUAA', enveloppe: 'CTO', pv: '+22.1%', color: '#4CAF2E' },
                { ticker: 'VFEA', enveloppe: 'CTO', pv: '-2.3%', color: '#E24B4A' },
                { ticker: 'IWDA', enveloppe: 'CTO', pv: '+14.7%', color: '#4CAF2E' },
              ].map(({ ticker, enveloppe, pv, color }) => (
                <div key={ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 8, padding: '6px 10px', border: '0.5px solid #E0EAE3' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2E4B' }}>{ticker}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{enveloppe}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color }}>{pv}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2E4B', marginBottom: 6 }}>Découvrez comment investir</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Il y a différentes façons d'investir, choisissez les bonnes.</div>
            </div>
          </div>

          {/* Card 3 — Performance */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <svg width="100%" height="130" viewBox="0 0 260 130">
                <defs>
                  <linearGradient id="pfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B2E4B" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#1B2E4B" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 110 C30 108, 50 105, 80 95 C110 85, 120 88, 140 75 C160 62, 170 65, 190 50 C210 35, 230 30, 260 15 L260 130 L0 130 Z" fill="url(#pfill)"/>
                <path d="M0 110 C30 108, 50 105, 80 95 C110 85, 120 88, 140 75 C160 62, 170 65, 190 50 C210 35, 230 30, 260 15" fill="none" stroke="#1B2E4B" strokeWidth="2" strokeLinecap="round"/>
                <path d="M0 110 C30 112, 50 115, 80 110 C110 105, 120 108, 140 104 C160 100, 170 102, 190 98 C210 94, 230 92, 260 88" fill="none" stroke="#4CAF2E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
                <text x="200" y="12" fill="#1B2E4B" fontSize="10" fontWeight="600">+127%</text>
                <text x="200" y="84" fill="#4CAF2E" fontSize="10">+68%</text>
              </svg>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 2, background: '#1B2E4B', borderRadius: 1 }} />
                  <span style={{ fontSize: 10, color: '#6B7280' }}>Avec DCA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 2, background: '#4CAF2E', borderRadius: 1, borderTop: '1px dashed #4CAF2E' }} />
                  <span style={{ fontSize: 10, color: '#6B7280' }}>Sans DCA</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2E4B', marginBottom: 6 }}>Prévoyez vos performances</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Découvrez les performances atteignables selon vos données.</div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '60px 40px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', marginBottom: 14, lineHeight: 1.3 }}>
            Prêt à construire<br />votre avenir financier ?
          </div>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 32, lineHeight: 1.7 }}>
            Rejoignez StartInvest et commencez à investir intelligemment dès aujourd'hui.
          </p>
          <button onClick={() => navigate('/signup')} style={{ padding: '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.02em' }}>
            Go →
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>Gratuit · Sans carte bancaire · En 2 minutes</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '0.5px solid #E0EAE3', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>© 2026 StartInvest — Bâtir son mental, construire son avenir.</div>
      </footer>

    </div>
  )
}