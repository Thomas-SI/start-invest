import { useNavigate } from 'react-router-dom'

export default function Fonctionnalites() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === 'Fonctionnalités' ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === 'Fonctionnalités' ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B2E4B'}
              onMouseLeave={e => e.currentTarget.style.color = label === 'Fonctionnalités' ? '#1B2E4B' : '#6B7280'}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
          <button onClick={() => navigate('/signup')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '60px 40px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Fonctionnalités</div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.2, margin: '0 0 16px' }}>
          Tout ce dont vous avez besoin<br />
          <span style={{ color: '#4CAF2E' }}>pour investir intelligemment.</span>
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 48px' }}>
          StartInvest regroupe tous les outils pour analyser vos finances, suivre vos investissements et construire votre avenir.
        </p>
      </section>

      {/* FEATURE 1 — MES FINANCES */}
      <section style={{ padding: '40px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 40 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '28px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', marginBottom: 12 }}>Mes Finances</div>
          {[
            { label: 'Revenus', val: '3 200 €', color: '#4CAF2E', w: '80%' },
            { label: 'Dépenses fixes', val: '1 100 €', color: '#1B2E4B', w: '45%' },
            { label: 'Envies', val: '460 €', color: '#BA7517', w: '20%' },
            { label: 'Investissable', val: '640 €', color: '#3B82F6', w: '26%' },
          ].map(({ label, val, color, w }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: '#6B7280' }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{val}</span>
              </div>
              <div style={{ background: '#F0F0F0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: color, width: w }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, background: '#EAF6E4', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#2E7D1E' }}>Règle 50/30/20</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4CAF2E' }}>✓ Respectée</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Budget</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Analysez vos finances en un coup d'œil</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Saisissez vos revenus et dépenses. StartInvest calcule automatiquement combien vous pouvez investir chaque mois selon la règle 50/30/20.</p>
          {['Suivi revenus et dépenses', 'Règle 50/30/20 automatique', 'Calcul de l\'investissable mensuel', 'Échéances et charges annuelles'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>✓</span>{f}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE 2 — PORTEFEUILLE */}
      <section style={{ background: '#fff', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Portefeuille</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Gérez tous vos comptes au même endroit</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Livret A, PEA, CTO, Assurance-vie — visualisez votre patrimoine complet, suivez votre matelas de sécurité et planifiez vos virements mensuels.</p>
            {['Suivi multi-comptes', 'Matelas de sécurité', 'Plan de virement mensuel automatique', 'Répartition du patrimoine', 'Objectif d\'épargne par compte'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>✓</span>{f}
              </div>
            ))}
            <div style={{ marginTop: 16, background: '#F4F7F5', borderRadius: 10, padding: '12px 14px', border: '0.5px solid #E0EAE3' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 4 }}>Plan de versement mensuel</div>
              <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>Définissez vos pourcentages d'allocation et StartInvest calcule exactement combien virer sur chaque compte chaque mois.</div>
            </div>
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
            {[
              { nom: 'Livret A', solde: '8 200 €', color: '#4CAF2E', w: '82%', type: 'sécurité' },
              { nom: 'PEA', solde: '15 400 €', color: '#1B2E4B', w: '100%', type: 'investissement' },
              { nom: 'CTO', solde: '6 800 €', color: '#3B82F6', w: '68%', type: 'investissement' },
              { nom: 'Assurance-vie', solde: '4 200 €', color: '#BA7517', w: '42%', type: 'investissement' },
            ].map(({ nom, solde, color, w, type }) => (
              <div key={nom} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>{nom}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8 }}>{type}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{solde}</span>
                </div>
                <div style={{ background: '#E0EAE3', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: color, width: w }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, background: '#1B2E4B', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Total patrimoine</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>34 600 €</span>
            </div>
            <div style={{ marginTop: 10, background: '#EAF6E4', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#2E7D1E' }}>Virement ce mois</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#4CAF2E' }}>440 €</span>
              </div>
              {[
                { dest: 'Livret A', pct: '30%', val: '132 €' },
                { dest: 'PEA', pct: '50%', val: '220 €' },
                { dest: 'CTO', pct: '20%', val: '88 €' },
              ].map(({ dest, pct, val }) => (
                <div key={dest} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280', marginBottom: 3 }}>
                  <span>{dest}</span>
                  <span>{pct} — {val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 3 — INVESTISSEMENT */}
      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total investi', val: '12 400 €', color: '#1B2E4B' },
              { label: 'Valeur actuelle', val: '14 820 €', color: '#4CAF2E' },
              { label: 'Plus-value', val: '+2 420 €', color: '#4CAF2E' },
              { label: 'Positions', val: '4', color: '#3B82F6' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            {[
              { ticker: 'PE500', env: 'PEA', val: '6 240 €', pv: '+8.2%', color: '#4CAF2E' },
              { ticker: 'VUAA', env: 'CTO', val: '4 180 €', pv: '+12.1%', color: '#4CAF2E' },
              { ticker: 'VFEA', env: 'CTO', val: '2 400 €', pv: '-2.3%', color: '#E24B4A' },
              { ticker: 'IWDA', env: 'CTO', val: '2 000 €', pv: '+5.8%', color: '#4CAF2E' },
            ].map(({ ticker, env, val, pv, color }) => (
              <div key={ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #F0F0F0' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2E4B' }}>{ticker}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{env}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#1B2E4B' }}>{val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color }}>{pv}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Investissement</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Suivez vos ETF et plus-values en temps réel</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 12px' }}>
            Gardez une trace de chaque mouvement. Notez vos décisions, apprenez de vos investissements.
          </p>
          <p style={{ fontSize: 13, color: '#4CAF2E', fontWeight: 500, fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.6, borderLeft: '3px solid #4CAF2E', paddingLeft: 12 }}>
            "Le journal qui vous transforme en investisseur pro."
          </p>
          {['Journal d\'achat ETF', 'Calcul PRU automatique', 'Suivi par enveloppe', '+140 ETF européens référencés', 'Mise à jour prix quotidienne'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>✓</span>{f}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE 4 — CROISSANCE */}
      <section style={{ background: '#fff', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Croissance</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Simulez votre croissance avec le DCA</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Découvrez combien votre investissement peut valoir dans 5, 10 ou 20 ans grâce au simulateur DCA. La puissance des intérêts composés visualisée.</p>
            {['Simulateur DCA', 'Projection sur 1 à 30 ans', 'Comparaison avec/sans DCA', 'Calcul des intérêts composés'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>✓</span>{f}
              </div>
            ))}
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
            <svg width="100%" height="160" viewBox="0 0 300 160">
              <defs>
                <linearGradient id="gf1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B2E4B" stopOpacity="0.12"/>
                  <stop offset="100%" stopColor="#1B2E4B" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="gf2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CAF2E" stopOpacity="0.12"/>
                  <stop offset="100%" stopColor="#4CAF2E" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 140 C40 138, 70 130, 100 115 C130 100, 150 105, 180 85 C210 65, 240 55, 300 20 L300 160 L0 160 Z" fill="url(#gf1)"/>
              <path d="M0 140 C40 138, 70 130, 100 115 C130 100, 150 105, 180 85 C210 65, 240 55, 300 20" fill="none" stroke="#1B2E4B" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0 140 C40 140, 70 138, 100 133 C130 128, 150 130, 180 120 C210 110, 240 105, 300 88 L300 160 L0 160 Z" fill="url(#gf2)"/>
              <path d="M0 140 C40 140, 70 138, 100 133 C130 128, 150 130, 180 120 C210 110, 240 105, 300 88" fill="none" stroke="#4CAF2E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 4"/>
              <text x="248" y="16" fill="#1B2E4B" fontSize="11" fontWeight="700">+127%</text>
              <text x="248" y="84" fill="#4CAF2E" fontSize="11">+68%</text>
            </svg>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 2.5, background: '#1B2E4B', borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: '#6B7280' }}>Avec DCA mensuel</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 2, background: '#4CAF2E', borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: '#6B7280' }}>Sans DCA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 16px' }}>Prêt à commencer ?</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Toutes ces fonctionnalités disponibles gratuitement.</p>
        <button onClick={() => navigate('/signup')} style={{ padding: '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          S'inscrire gratuitement →
        </button>
      </section>

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