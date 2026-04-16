import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import FooterPublic from '../components/FooterPublic'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'

export default function Fonctionnalites() {
  const navigate = useNavigate()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['Accueil', '/'], ['Fonctionnalites', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === 'Fonctionnalites' ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === 'Fonctionnalites' ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B2E4B'}
              onMouseLeave={e => e.currentTarget.style.color = label === 'Fonctionnalites' ? '#1B2E4B' : '#6B7280'}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
          <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S inscrire gratuitement</button>
        </div>
      </nav>

      <section style={{ padding: '60px 40px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Fonctionnalites</div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.2, margin: '0 0 16px' }}>
          Tout ce dont vous avez besoin pour investir intelligemment.
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 48px' }}>
          StartInvest regroupe tous les outils pour analyser vos finances, suivre vos investissements et construire votre avenir.
        </p>
      </section>

      <section style={{ padding: '40px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 40 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '28px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', marginBottom: 12 }}>Mes Finances</div>
          {[
            { label: 'Revenus', val: '2 000 euros', color: '#4CAF2E', w: '80%' },
            { label: 'Depenses fixes', val: '1 000 euros', color: '#1B2E4B', w: '50%' },
            { label: 'Envies', val: '600 euros', color: '#BA7517', w: '30%' },
            { label: 'Investissable', val: '400 euros', color: '#3B82F6', w: '20%' },
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
            <span style={{ fontSize: 12, color: '#2E7D1E' }}>Regle 50/30/20</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4CAF2E' }}>OK Respectee</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Budget</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Analysez vos finances en un coup d oeil</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Saisissez vos revenus et depenses. StartInvest calcule automatiquement combien vous pouvez investir chaque mois selon la regle 50/30/20.</p>
          {['Suivi revenus et depenses', 'Regle 50/30/20 automatique', 'Calcul capacite d epargne', 'Echeances et charges annuelles'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>ok</span>{f}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#fff', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Portefeuille</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Gerez tous vos comptes au meme endroit</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Livret A, PEA, CTO, Assurance-vie — visualisez votre patrimoine complet, suivez votre matelas de securite et planifiez vos virements mensuels.</p>
            {['Suivi multi-comptes', 'Matelas de securite', 'Plan de virement mensuel automatique', 'Repartition du patrimoine', 'Objectif d epargne par compte'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>ok</span>{f}
              </div>
            ))}
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
            {[
              { nom: 'Livret A', solde: '8 200 euros', color: '#4CAF2E', w: '82%', type: 'securite' },
              { nom: 'PEA', solde: '15 400 euros', color: '#1B2E4B', w: '100%', type: 'investissement' },
              { nom: 'CTO', solde: '6 800 euros', color: '#3B82F6', w: '68%', type: 'investissement' },
              { nom: 'Assurance-vie', solde: '4 200 euros', color: '#BA7517', w: '42%', type: 'investissement' },
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
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>34 600 euros</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total investi', val: '12 400 euros', color: '#1B2E4B' },
              { label: 'Valeur actuelle', val: '14 820 euros', color: '#4CAF2E' },
              { label: 'Plus-value', val: '+2 420 euros', color: '#4CAF2E' },
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
              { ticker: 'PE500', env: 'PEA', val: '6 240 euros', pv: '+8.2%', color: '#4CAF2E' },
              { ticker: 'VUAA', env: 'CTO', val: '4 180 euros', pv: '+12.1%', color: '#4CAF2E' },
              { ticker: 'VFEA', env: 'CTO', val: '2 400 euros', pv: '-2.3%', color: '#E24B4A' },
              { ticker: 'IWDA', env: 'CTO', val: '2 000 euros', pv: '+5.8%', color: '#4CAF2E' },
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Suivez vos ETF et plus-values en temps reel</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Gardez une trace de chaque mouvement. Notez vos decisions, apprenez de vos investissements.</p>
          {['Journal d achat ETF', 'Calcul PRU automatique', 'Suivi par enveloppe', '+140 ETF europeens references', 'Mise a jour prix quotidienne'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>ok</span>{f}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#fff', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Croissance</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Simulez votre croissance avec le DCA</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Decouvrez combien votre investissement peut valoir dans 5, 10 ou 20 ans grace au simulateur DCA.</p>
            {['Simulateur DCA', 'Projection sur 1 a 30 ans', 'Calcul des interets composes', 'Base sur votre capacite d epargne reelle'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>ok</span>{f}
              </div>
            ))}
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Versement mensuel</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2E4B' }}>400 euros/mois</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Sur 10 ans</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#4CAF2E' }}>+127%</div>
              </div>
            </div>
            <svg width="100%" height="120" viewBox="0 0 260 120">
              <defs>
                <linearGradient id="dcafill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CAF2E" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#4CAF2E" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="savefill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B2E4B" stopOpacity="0.1"/>
                  <stop offset="100%" stopColor="#1B2E4B" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 110 C60 108, 120 100, 180 90 C220 83, 240 80, 260 76 L260 120 L0 120 Z" fill="url(#savefill2)"/>
              <path d="M0 110 C60 108, 120 100, 180 90 C220 83, 240 80, 260 76" fill="none" stroke="#1B2E4B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
              <path d="M0 110 C40 100, 80 85, 120 65 C160 45, 200 28, 260 8 L260 120 L0 120 Z" fill="url(#dcafill2)"/>
              <path d="M0 110 C40 100, 80 85, 120 65 C160 45, 200 28, 260 8" fill="none" stroke="#4CAF2E" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="260" cy="8" r="4" fill="#4CAF2E"/>
              <text x="195" y="6" fill="#4CAF2E" fontSize="10" fontWeight="700">DCA +127%</text>
              <text x="185" y="73" fill="#1B2E4B" fontSize="10">Epargne +30%</text>
            </svg>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Investi', val: '48 000 euros', color: '#1B2E4B' },
                { label: 'Valeur finale', val: '108 960 euros', color: '#4CAF2E' },
                { label: 'Gain net', val: '+60 960 euros', color: '#4CAF2E' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Challenge</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1B2E4B', lineHeight: 1.3, margin: '0 0 14px' }}>Apprendre et rester motive</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Collectionnez les badges, maintenez vos efforts et regardez votre empire grandir sans stress.</p>
          {['Livret d accomplissements', 'Badges evolutifs (Bronze vers Legendaire)', 'Suivi de progression en temps reel', 'Defis bases sur vos actions reelles'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>ok</span>{f}
            </div>
          ))}
        </div>
        <div style={{ background: '#1B2E4B', borderRadius: 16, padding: '28px 24px' }}>
          {[
            { img: null, emoji: '🚀', nom: 'Le Grand Saut', tag: 'Obtenu', tagColor: '#2E7D1E', tagBg: '#EAF6E4', desc: 'Tu n es plus spectateur.', progress: null },
            { img: METRONOME_URL, emoji: null, nom: 'Le Metronome', tag: 'Bronze 3 mois', tagColor: '#854F0B', tagBg: '#FFF0DC', desc: '3 / 6 mois vers Argent', progress: 50 },
            { img: null, emoji: '💰', nom: 'Cap des X euros', tag: 'Or 1 000 euros', tagColor: '#633806', tagBg: '#FFF8DC', desc: '1 200 / 2 000 euros vers Platine', progress: 60 },
            { img: null, emoji: '🗿', nom: 'Main de Fer', tag: '?', tagColor: '#9CA3AF', tagBg: 'rgba(255,255,255,0.08)', desc: '6 mois sans vente', progress: null, locked: true },
          ].map(({ img, emoji, nom, tag, tagColor, tagBg, desc, progress, locked }) => (
            <div key={nom} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: locked ? 'rgba(255,255,255,0.06)' : tagBg, border: `2px solid ${locked ? 'rgba(255,255,255,0.15)' : tagColor}`, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {locked ? <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>?</span>
                  : img ? <img src={img} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 20 }}>{emoji}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: locked ? 'rgba(255,255,255,0.3)' : '#fff' }}>{nom}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: tagBg, color: tagColor, fontWeight: 500 }}>{tag}</span>
                </div>
                {progress && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3, height: 4, overflow: 'hidden', marginBottom: 3 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: tagColor, width: `${progress}%` }} />
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 16px' }}>Pret a batir votre futur ?</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Commencer l aventure Start Invest.</p>
        <button onClick={openSignup} style={{ padding: '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>S inscrire gratuitement</button>
      </section>

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}