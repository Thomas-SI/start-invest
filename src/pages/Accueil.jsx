import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'
const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

export default function Accueil() {
  const navigate = useNavigate()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={LOGO_URL} alt="StartInvest" style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === 'Accueil' ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === 'Accueil' ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B2E4B'}
              onMouseLeave={e => e.currentTarget.style.color = label === 'Accueil' ? '#1B2E4B' : '#6B7280'}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
          <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ padding: '80px 40px 60px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Nouvelle façon d'investir</div>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.2, margin: '0 0 20px' }}>
            Prenez une longueur<br />
            <span style={{ color: '#4CAF2E' }}>d'avance.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 420 }}>
            Suivez vos finances. Atteignez vos objectifs.<br />Ayez un pas dans le futur.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={openSignup} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Commencer gratuitement →
            </button>
          </div>
        </div>

        {/* CAMEMBERT */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '20px 24px', boxShadow: '0 4px 24px rgba(27,46,75,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E4B', marginBottom: 4 }}>Mon Portefeuille</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 20 }}>Répartition par enveloppe</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <svg width="130" height="130" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#1B2E4B" strokeWidth="28"
                  strokeDasharray="141.3 141.3" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#4CAF2E" strokeWidth="28"
                  strokeDasharray="84.8 198.0" strokeDashoffset="-141.3" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#BA7517" strokeWidth="28"
                  strokeDasharray="56.5 226.2" strokeDashoffset="-226.1" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="31" fill="#fff" />
                <text x="60" y="56" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1B2E4B">34 600 €</text>
                <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#9CA3AF">patrimoine</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { label: 'PEA', pct: '50%', val: '15 400 €', color: '#1B2E4B' },
                  { label: 'CTO', pct: '30%', val: '6 800 €', color: '#4CAF2E' },
                  { label: 'Ass. Vie', pct: '20%', val: '4 200 €', color: '#BA7517' },
                ].map(({ label, pct, val, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B' }}>{label}</span>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{pct}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BADGE ARCHITECTE */}
          <div style={{ position: 'absolute', bottom: -20, right: -20, background: '#fff', border: '0.5px solid #185FA5', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(24,95,165,0.12)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #185FA5' }}>🏗️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1B2E4B' }}>L'Architecte</div>
              <div style={{ fontSize: 10, color: '#185FA5' }}>Accomplissement débloqué !</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 40px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

          {/* CARD FINANCES */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Revenus', val: '2 000 €', color: '#4CAF2E', w: '80%' },
                { label: 'Dépenses fixes', val: '1 000 €', color: '#1B2E4B', w: '50%' },
                { label: 'Investissable', val: '400 €', color: '#BA7517', w: '20%' },
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

          {/* CARD ENVELOPPES */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'PEA', desc: 'Bourse européenne', color: '#1B2E4B', w: '80%', tag: 'Plafond 150 000 €' },
                { label: 'CTO', desc: 'Bourse mondiale', color: '#3B82F6', w: '60%', tag: 'Sans plafond' },
                { label: 'Ass. Vie', desc: 'Épargne long terme', color: '#BA7517', w: '40%', tag: 'Avantage fiscal' },
              ].map(({ label, desc, color, w, tag }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', border: '0.5px solid #E0EAE3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2E4B' }}>{label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{desc}</div>
                    </div>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: '#F4F7F5', color: '#6B7280' }}>{tag}</span>
                  </div>
                  <div style={{ background: '#E0EAE3', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: color, width: w }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2E4B', marginBottom: 6 }}>Découvrez comment investir</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Il y a différentes façons d'investir, choisissez les bonnes.</div>
            </div>
          </div>

          {/* CARD DCA */}
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '20px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Versement mensuel</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2E4B' }}>400 €/mois</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Sur 10 ans</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4CAF2E' }}>+127%</div>
                </div>
              </div>
              <svg width="100%" height="100" viewBox="0 0 260 100">
                <defs>
                  <linearGradient id="dcafill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4CAF2E" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#4CAF2E" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="savefill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B2E4B" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#1B2E4B" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 90 C60 88, 120 82, 180 75 C220 70, 240 68, 260 65 L260 100 L0 100 Z" fill="url(#savefill)"/>
                <path d="M0 90 C60 88, 120 82, 180 75 C220 70, 240 68, 260 65" fill="none" stroke="#1B2E4B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
                <path d="M0 90 C40 82, 80 70, 120 55 C160 40, 200 25, 260 8 L260 100 L0 100 Z" fill="url(#dcafill)"/>
                <path d="M0 90 C40 82, 80 70, 120 55 C160 40, 200 25, 260 8" fill="none" stroke="#4CAF2E" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="260" cy="8" r="3" fill="#4CAF2E"/>
                <text x="195" y="6" fill="#4CAF2E" fontSize="9" fontWeight="700">DCA +127%</text>
                <text x="185" y="62" fill="#1B2E4B" fontSize="9">Épargne +30%</text>
              </svg>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 2, background: '#4CAF2E', borderRadius: 1 }} />
                  <span style={{ fontSize: 10, color: '#6B7280' }}>Avec DCA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 2, background: '#1B2E4B', borderRadius: 1, opacity: 0.5 }} />
                  <span style={{ fontSize: 10, color: '#6B7280' }}>Épargne classique</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1B2E4B', marginBottom: 6 }}>Prévoyez vos performances</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Découvrez les performances atteignables selon votre capacité d'épargne.</div>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button onClick={openSignup} style={{ padding: '14px 48px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Go →</button>
          <div style={{ marginTop: 12, fontSize: 12, color: '#9CA3AF' }}>Gratuit · Sans carte bancaire · En 2 minutes</div>
        </div>
      </section>

      {/* MINDSET */}
      <section id="challenge" style={{ background: '#1B2E4B', padding: '80px 40px', marginTop: 60 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Mindset</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 16px' }}>
              Pensez à 5 ans,{' '}<span style={{ color: '#4CAF2E' }}>pas à 5 mois.</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: '0 auto', maxWidth: 460 }}>
              Apprenez à investir et créez-vous une fortune solide et diversifiée au fil du temps.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EAF6E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: '2px solid #4CAF2E' }}>🚀</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Le Grand Saut</div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#EAF6E4', color: '#2E7D1E', fontWeight: 500 }}>Obtenu</span>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Tu n'es plus spectateur, tu es le pilote de ton futur.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #854F0B', overflow: 'hidden' }}>
                <img src={METRONOME_URL} alt="métronome" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Le Métronome</div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF0DC', color: '#854F0B', fontWeight: 500 }}>Bronze — 3 mois</span>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: '#854F0B', width: '50%' }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>3 / 6 mois → Argent</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: '2px solid #854F0B' }}>💰</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Cap des X€</div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF8DC', color: '#633806', fontWeight: 500 }}>Or — 1 000 €</span>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: '#BA7517', width: '60%' }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>1 200 / 2 000 € → Platine</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABONNEMENT */}
      <section id="abonnement" style={{ padding: '100px 40px 80px', background: '#F4F7F5', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Rejoignez-nous</div>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 16px' }}>
            Ne laissez plus jamais<br /><span style={{ color: '#4CAF2E' }}>votre argent dormir.</span>
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 8px' }}>Rejoignez Start Invest et ses utilisateurs.</p>
          <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, margin: '0 0 40px' }}>Trouvez votre façon de faire de l'argent en dormant.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40, textAlign: 'left' }}>
            <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E4B', marginBottom: 4 }}>Gratuit</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', marginBottom: 16 }}>0 €<span style={{ fontSize: 13, fontWeight: 400, color: '#9CA3AF' }}>/mois</span></div>
              {['Mes Finances', 'Portefeuille', 'Journal ETF', 'Accomplissements'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                  <span style={{ color: '#4CAF2E', fontSize: 14 }}>✓</span>{f}
                </div>
              ))}
              <button onClick={openSignup} style={{ width: '100%', marginTop: 16, padding: '10px', borderRadius: 9, border: '0.5px solid #E0EAE3', background: '#F4F7F5', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Commencer</button>
            </div>
            <div style={{ background: '#1B2E4B', border: '2px solid #4CAF2E', borderRadius: 16, padding: '24px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#4CAF2E', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 12px', borderRadius: 20 }}>POPULAIRE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Premium</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16 }}>7.99 €<span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/mois</span></div>
              {['Tout le plan Gratuit', 'Simulateur DCA', 'Concentration', 'Vroum Vroum 🏎️', 'Support prioritaire'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#4CAF2E', fontSize: 14 }}>✓</span>{f}
                </div>
              ))}
              <button onClick={openSignup} style={{ width: '100%', marginTop: 16, padding: '10px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Commencer</button>
            </div>
          </div>
          <button onClick={openSignup} style={{ padding: '14px 48px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Go →</button>
          <div style={{ marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>Gratuit · Sans carte bancaire · En 2 minutes</div>
        </div>
      </section>

      {/* SOCIAL */}
      <section style={{ background: '#fff', borderTop: '0.5px solid #E0EAE3', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B', marginBottom: 28 }}>Vous pouvez me rejoindre sur :</div>
          <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', border: '3px solid #E0EAE3' }}>
            <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2914.jpeg" alt="StartInvest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <a href="https://instagram.com/startinvest.fr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', textDecoration: 'none', width: 240 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Instagram</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>startinvest.fr</div>
              </div>
            </a>
            <a href="https://tiktok.com/@startinvest.fr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', textDecoration: 'none', width: 240 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>TikTok</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B' }}>@startinvest.fr</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '0.5px solid #E0EAE3', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>© 2026 StartInvest — Bâtir son mental, construire son avenir.</div>
      </footer>

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}