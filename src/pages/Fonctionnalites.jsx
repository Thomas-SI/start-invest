import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import FooterPublic from '../components/FooterPublic'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'
const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

const DCAChart = () => {
  const data = [
    { annee: 2, investi: 9600, interets: 800, total: 10400 },
    { annee: 4, investi: 19200, interets: 3200, total: 22400 },
    { annee: 6, investi: 28800, interets: 7800, total: 36600 },
    { annee: 8, investi: 38400, interets: 14600, total: 53000 },
    { annee: 10, investi: 48000, interets: 20960, total: 68960 },
  ]
  const max = 68960
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Versement mensuel</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#034065' }}>400 euros/mois</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Sur 10 ans · 7%/an</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#4CAF2E' }}>+127%</div>
        </div>
      </div>
      {data.map(({ annee, investi, interets, total }) => (
        <div key={annee} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', width: 36, flexShrink: 0 }}>An {annee}</div>
          <div style={{ flex: 1, position: 'relative', height: 20 }}>
            <div style={{ position: 'absolute', left: 0, top: 4, height: 12, borderRadius: 3, background: '#E3F0FF', width: `${investi / max * 100}%` }} />
            <div style={{ position: 'absolute', left: `${investi / max * 100}%`, top: 4, height: 12, borderRadius: '0 3px 3px 0', background: '#4CAF2E', width: `${interets / max * 100}%` }} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#034065', width: 85, textAlign: 'right', flexShrink: 0 }}>{total.toLocaleString('fr-FR')} euros</div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9CA3AF' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9CA3AF' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Interets composes
        </div>
      </div>
    </div>
  )
}

function PublicNavbar({ isMobile, openLogin, openSignup, activeLink = 'Fonctionnalites' }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    ['Accueil', '/'],
    ['Fonctionnalites', '/fonctionnalites'],
    ['Challenge', '/challenge-public'],
    ['Abonnement', '/abonnement-public'],
  ]

  const handleNavigate = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const Logo = () => (
    <div onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
      <img src={LOGO_URL} alt="StartInvest" style={{ height: 105, width: 105, borderRadius: '50%', objectFit: 'cover' }} />
    </div>
  )

  if (isMobile) {
    return (
      <>
        <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 16px', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <Logo />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, width: 40, height: 40 }}
          >
            <span style={{ width: 22, height: 2, background: '#034065', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: '#034065', borderRadius: 2, transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: '#034065', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </nav>

        {menuOpen && (
          <div style={{ position: 'fixed', top: 58, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 99, display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
              {links.map(([label, path]) => (
                <div
                  key={label}
                  onClick={() => handleNavigate(path)}
                  style={{
                    fontSize: 16,
                    color: label === activeLink ? '#4CAF2E' : '#034065',
                    padding: '16px 24px',
                    cursor: 'pointer',
                    fontWeight: label === activeLink ? 600 : 400,
                    borderLeft: label === activeLink ? '3px solid #4CAF2E' : '3px solid transparent',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', marginTop: 'auto', borderTop: '0.5px solid #E0EAE3', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => { setMenuOpen(false); openLogin() }} style={{ padding: '12px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
              <button onClick={() => { setMenuOpen(false); openSignup() }} style={{ padding: '12px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop
  return (
    <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Logo />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {links.map(([label, path]) => (
          <span key={label} onClick={() => navigate(path)} style={{ fontSize: 15, color: label === activeLink ? '#034065' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === activeLink ? 500 : 400 }}
            onMouseEnter={e => e.currentTarget.style.color = '#034065'}
            onMouseLeave={e => e.currentTarget.style.color = label === activeLink ? '#034065' : '#6B7280'}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={openLogin} style={{ padding: '9px 20px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
        <button onClick={openSignup} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </div>
    </nav>
  )
}

export default function Fonctionnalites() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  const padSection = isMobile ? '40px 16px' : '60px 40px'
  const h1Size = isMobile ? 30 : 38
  const h2Size = isMobile ? 24 : 28
  const gridCols = isMobile ? '1fr' : '1fr 1fr'
  const gridGap = isMobile ? 32 : 60

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <PublicNavbar isMobile={isMobile} openLogin={openLogin} openSignup={openSignup} activeLink="Fonctionnalites" />

      <section style={{ padding: isMobile ? '40px 16px 30px' : '60px 40px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Fonctionnalités</div>
        <h1 style={{ fontSize: h1Size, fontWeight: 700, color: '#034065', lineHeight: 1.2, margin: '0 0 16px' }}>
          Tout ce dont vous avez besoin pour investir intelligemment.
        </h1>
       <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 48px', textAlign: 'justify' }}>
  Start Invest regroupe tous les outils pour analyser vos finances, suivre vos investissements et construire votre avenir. Mais investir seul, c'est plus difficile. C'est pourquoi on a pensé la communauté au cœur de l'app : Challenges, badges, motivation entre amis. Parce que se tirer vers le haut ensemble, c'est toujours plus puissant.
</p>
      </section>

      {/* FINANCES */}
      <section style={{ padding: padSection, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: gridCols, gap: gridGap, alignItems: 'center', marginBottom: isMobile ? 20 : 40 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '28px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', marginBottom: 12 }}>Mes Finances</div>
          {[
            { label: 'Revenus', val: '2 000 euros', color: '#4CAF2E', w: '80%' },
            { label: 'Dépenses fixes', val: '1 000 euros', color: '#034065', w: '50%' },
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
          <div style={{ marginTop: 16, background: '#EAF6E4', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#2E7D1E' }}>Règle 50/30/20</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4CAF2E' }}>OK Respectee</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Budget</div>
          <h2 style={{ fontSize: h2Size, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 14px' }}>Analysez vos finances en un coup d œil</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Saisissez vos revenus et dépenses. StartInvest calcule automatiquement combien vous pouvez investir chaque mois selon la règle 50/30/20.</p>
          {['Suivi revenus et depenses', 'Regle 50/30/20 automatique', 'Calcul capacite d epargne', 'Echeances et charges annuelles'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>✓</span>{f}
            </div>
          ))}
        </div>
      </section>

      {/* PORTEFEUILLE */}
      <section style={{ background: '#fff', padding: padSection }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: gridCols, gap: gridGap, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Portefeuille</div>
            <h2 style={{ fontSize: h2Size, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 14px' }}>Gérez tous vos comptes au même endroit</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Livret A, PEA, CTO, Assurance-vie — visualisez votre patrimoine complet, suivez votre matelas de sécurité et planifiez vos virements mensuels.</p>
            {['Suivi multi-comptes', 'Matelas de securite', 'Plan de virement mensuel automatique', 'Repartition du patrimoine', 'Objectif d epargne par compte'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>✓</span>{f}
              </div>
            ))}
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
            {[
              { nom: 'Livret A', solde: '8 200 euros', color: '#4CAF2E', w: '82%', type: 'securite' },
              { nom: 'PEA', solde: '15 400 euros', color: '#034065', w: '100%', type: 'investissement' },
              { nom: 'CTO', solde: '6 800 euros', color: '#3B82F6', w: '68%', type: 'investissement' },
              { nom: 'Assurance-vie', solde: '4 200 euros', color: '#BA7517', w: '42%', type: 'investissement' },
            ].map(({ nom, solde, color, w, type }) => (
              <div key={nom} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#034065' }}>{nom}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8 }}>{type}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{solde}</span>
                </div>
                <div style={{ background: '#E0EAE3', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: color, width: w }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, background: '#034065', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Total patrimoine</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>34 600 euros</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTISSEMENT */}
      <section style={{ padding: padSection, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: gridCols, gap: gridGap, alignItems: 'center' }}>
        <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total investi', val: '12 400 euros', color: '#034065' },
              { label: 'Valeur actuelle', val: '14 820 euros', color: '#4CAF2E' },
              { label: 'Plus-value', val: '+2 420 euros', color: '#4CAF2E' },
              { label: 'Positions', val: '4', color: '#3B82F6' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color }}>{val}</div>
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
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#034065' }}>{ticker}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{env}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#034065' }}>{val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color }}>{pv}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Investissement</div>
          <h2 style={{ fontSize: h2Size, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 14px' }}>Suivez vos ETF et plus-values en temps reel</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Gardez une trace de chaque mouvement. Notez vos decisions, apprenez de vos investissements.</p>
          {['Journal d achat ETF', 'Calcul PRU automatique', 'Suivi par enveloppe', '+140 ETF europeens references', 'Mise a jour prix quotidienne'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>✓</span>{f}
            </div>
          ))}
        </div>
      </section>

      {/* CROISSANCE */}
      <section style={{ background: '#fff', padding: padSection }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: gridCols, gap: gridGap, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Croissance</div>
            <h2 style={{ fontSize: h2Size, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 14px' }}>Simulez votre croissance avec le DCA</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Découvrez combien votre investissement peut valoir dans 5, 10 ou 20 ans grâce au simulateur DCA.</p>
            {['Simulateur DCA', 'Projection sur 1 a 30 ans', 'Calcul des interets composes', 'Base sur votre capacite d epargne reelle'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
                <span style={{ color: '#4CAF2E' }}>✓</span>{f}
              </div>
            ))}
          </div>
          <div style={{ background: '#F4F7F5', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <DCAChart />
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section style={{ padding: padSection, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: gridCols, gap: gridGap, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '3px 10px', borderRadius: 20 }}>Challenge</div>
          <h2 style={{ fontSize: h2Size, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 14px' }}>Apprendre et rester motive</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 20px' }}>Collectionnez les badges, maintenez vos efforts et regardez votre empire grandir sans stress.</p>
          {['Livret d accomplissements', 'Badges evolutifs Bronze vers Legendaire', 'Suivi de progression en temps reel', 'Defis bases sur vos actions reelles'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#6B7280' }}>
              <span style={{ color: '#4CAF2E' }}>✓</span>{f}
            </div>
          ))}
        </div>
        <div style={{ background: '#034065', borderRadius: 16, padding: '28px 24px' }}>
          {[
            { img: null, emoji: '🚀', nom: 'Le Grand Saut', tag: 'Obtenu', tagColor: '#2E7D1E', tagBg: '#EAF6E4', desc: "Tu n'es plus spectateur.", progress: null },
            { img: METRONOME_URL, emoji: null, nom: 'Le Métronome', tag: 'Bronze 3 mois', tagColor: '#854F0B', tagBg: '#FFF0DC', desc: '3 / 6 mois vers Argent', progress: 50 },
            { img: null, emoji: '💰', nom: 'Ascension', tag: 'Or 1 000 euros', tagColor: '#633806', tagBg: '#FFF8DC', desc: '1 200 / 2 000 euros vers Platine', progress: 60 },
            { img: null, emoji: '🗿', nom: 'Main de Fer', tag: '?', tagColor: '#9CA3AF', tagBg: 'rgba(255,255,255,0.08)', desc: '6 mois sans vente', progress: null, locked: true },
          ].map(({ img, emoji, nom, tag, tagColor, tagBg, desc, progress, locked }) => (
            <div key={nom} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: locked ? 'rgba(255,255,255,0.06)' : tagBg, border: `2px solid ${locked ? 'rgba(255,255,255,0.15)' : tagColor}`, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {locked ? <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>?</span>
                  : img ? <img src={img} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 20 }}>{emoji}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 6, flexWrap: 'wrap' }}>
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

      {/* CTA */}
      <section style={{ padding: isMobile ? '50px 16px' : '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#034065', margin: '0 0 16px' }}>Prêt à bâtir votre futur ?</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Commencer l'aventure Start Invest.</p>
        <button onClick={openSignup} style={{ padding: isMobile ? '12px 32px' : '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </section>

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}