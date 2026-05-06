import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import ChallengesModal from '../components/ChallengesModal'
import FooterPublic from '../components/FooterPublic'
import CookieBanner from '../components/CookieBanner'
import { supabase } from '../lib/supabase'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'
const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

const plansData = [
  {
    id: 'gratuit', nom: 'Gratuit',
    prixMensuel: '0 euros', prixAnnuel: '0 euros',
    periodeMensuel: 'pour toujours', periodeAnnuel: 'pour toujours',
    pages: ['Mes Finances', 'Challenge', 'Guide', 'Abonnement', 'Compte'],
    features: [
      { label: 'Suivi finance de base', inclus: true },
      { label: "Taux d'épargne personnalisé", inclus: true },
      { label: 'Simulateur de croissance', inclus: true },
      { label: 'Vue des challenges', inclus: true },
      { label: 'Accès portefeuille', inclus: false },
      { label: 'Tableau des allocations', inclus: false },
      { label: "Journal suivi d'investissement", inclus: false },
      { label: 'Guide complet investissement', inclus: false },
    ]
  },
  {
    id: 'premium', nom: 'Premium', recommande: true,
    prixMensuel: '7.99 euros', prixAnnuel: '67 euros',
    periodeMensuel: 'par mois', periodeAnnuel: 'par an économisez 29%',
    pages: ['Mes Finances', 'Portefeuille', 'Investissement', 'Croissance', 'Challenge', 'Guide', 'Abonnement', 'Compte'],
    features: [
      { label: 'Suivi finance de base', inclus: true },
      { label: "Capacite d'épargne personnalisée", inclus: true },
      { label: 'Simulateur de croissance', inclus: true },
      { label: 'Accès portefeuille', inclus: true },
      { label: 'Vue des challenges', inclus: true },
      { label: 'Tableau des allocations', inclus: true },
      { label: 'Plan virement par compte', inclus: true },
      { label: "Journal suivi d'investissement", inclus: true },
      { label: 'Projection croissance', inclus: true },
      { label: 'Accès challenge et récompense', inclus: true },
      { label: 'Guide complet investissement', inclus: true },
    ]
  },
]

function PlanCard({ plan, abonnementAnnuel, setAbonnementAnnuel, openSignup }) {
  const [expanded, setExpanded] = useState(false)
  const { nom, recommande, features, pages, prixMensuel, prixAnnuel, periodeMensuel, periodeAnnuel } = plan
  const prix = abonnementAnnuel ? prixAnnuel : prixMensuel
  const periode = abonnementAnnuel ? periodeAnnuel : periodeMensuel
  const featuresVisible = expanded ? features : features.slice(0, 5)

  return (
    <div style={{ background: recommande ? '#034065' : '#fff', border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#4CAF2E' : '#E0EAE3'}`, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative', textAlign: 'left' }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: recommande ? '#fff' : '#034065', marginBottom: 4 }}>{nom}</div>
      {recommande && (
  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 30, padding: '4px 6px', marginBottom: 10 }}>
    <button onClick={() => setAbonnementAnnuel(false)} style={{ padding: '4px 12px', borderRadius: 20, border: 'none', background: !abonnementAnnuel ? '#fff' : 'transparent', color: !abonnementAnnuel ? '#034065' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Mensuel</button>
<button onClick={() => setAbonnementAnnuel(true)} style={{ padding: '4px 12px', borderRadius: 20, border: 'none', background: abonnementAnnuel ? '#fff' : 'transparent', color: abonnementAnnuel ? '#034065' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
  Annuel
  <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '1px 5px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
</button>
  </div>
)}
      <div style={{ fontSize: 32, fontWeight: 700, color: recommande ? '#fff' : '#034065', marginBottom: 2 }}>{prix}</div>
      <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginBottom: recommande ? 4 : 20 }}>{periode}</div>
      {recommande && <div style={{ fontSize: 11, color: '#4CAF2E', fontWeight: 500, marginBottom: 16 }}>15 jours gratuits pour essayer</div>}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: recommande ? 'rgba(255,255,255,0.5)' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Pages accessibles</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {pages.map(p => (
            <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: recommande ? 'rgba(255,255,255,0.1)' : '#F4F7F5', color: recommande ? '#fff' : '#034065', border: `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : '#E0EAE3'}` }}>{p}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 0.5, background: recommande ? 'rgba(255,255,255,0.1)' : '#E0EAE3', marginBottom: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {featuresVisible.map(({ label, inclus }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : '#034065') : (recommande ? 'rgba(255,255,255,0.25)' : '#9CA3AF') }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(76,175,46,0.3)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : '#E0EAE3'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
            </div>
            {label}
          </div>
        ))}
      </div>
      {features.length > 5 && (
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', color: '#4CAF2E', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16, textAlign: 'left', padding: 0 }}>
          {expanded ? 'Voir moins' : `Voir ${features.length - 5} de plus`}
        </button>
      )}
      <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 'auto' }}>
        {recommande ? 'Essayer 15 jours gratuitement' : 'Commencer gratuitement'}
      </button>
    </div>
  )
}

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Versement mensuel</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#034065' }}>400 euros/mois</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Sur 10 ans 7%/an</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#4CAF2E' }}>+127%</div>
        </div>
      </div>
      {data.map(({ annee, investi, interets, total }) => (
        <div key={annee} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', width: 36, flexShrink: 0 }}>An {annee}</div>
          <div style={{ flex: 1, position: 'relative', height: 18 }}>
            <div style={{ position: 'absolute', left: 0, top: 3, height: 12, borderRadius: 3, background: '#E3F0FF', width: `${investi / max * 100}%` }} />
            <div style={{ position: 'absolute', left: `${investi / max * 100}%`, top: 3, height: 12, borderRadius: '0 3px 3px 0', background: '#4CAF2E', width: `${interets / max * 100}%` }} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#034065', width: 80, textAlign: 'right', flexShrink: 0 }}>{total.toLocaleString('fr-FR')} euros</div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#9CA3AF' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#9CA3AF' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Interets composes
        </div>
      </div>
    </div>
  )
}

// Navbar publique avec menu burger sur mobile
function PublicNavbar({ isMobile, openLogin, openSignup, activeLink = 'Accueil' }) {
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
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
  <button onClick={openLogin} style={{ padding: '9px 20px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
  <button onClick={openSignup} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
</div>
    </nav>
  )
}

export default function Accueil() {
  const navigate = useNavigate()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [challengesOpen, setChallengesOpen] = useState(false)
  const [abonnementAnnuel, setAbonnementAnnuel] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) navigate('/dashboard')
  }
  checkSession()
}, [])

  const [searchParams] = useSearchParams()

useEffect(() => {
  if (searchParams.get('login') === 'true') {
    setAuthMode('login')
    setAuthOpen(true)
  }
}, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      {/* HERO */}
<section style={{ position: 'relative', height: isMobile ? '100svh' : '90vh', overflow: 'hidden' }}>

  <img
    src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/image-montagne.jpeg"
    alt="Montagne"
    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
  />

  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)' }} />

  {/* NAVBAR */}
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: isMobile ? '16px 20px' : '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg" alt="StartInvest" style={{ height: 60, width: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)' }} />
  
  {!isMobile && (
    <div style={{ display: 'flex', gap: 4 }}>
      {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
        <span key={label} onClick={() => navigate(path)} style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
        >
          {label}
        </span>
      ))}
    </div>
  )}

  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    {!isMobile && (
      <>
        <button onClick={openLogin} style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
        <button onClick={openSignup} style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </>
    )}
    {isMobile && (
      <button onClick={() => setMobileMenuOpen(v => !v)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 8 }}>
        <span style={{ width: 24, height: 2, background: '#fff', borderRadius: 2 }} />
        <span style={{ width: 24, height: 2, background: '#fff', borderRadius: 2 }} />
        <span style={{ width: 24, height: 2, background: '#fff', borderRadius: 2 }} />
      </button>
    )}
  </div>
</div>

{/* MENU MOBILE */}
{isMobile && mobileMenuOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20, background: '#fff', padding: '20px 0', overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px', borderBottom: '0.5px solid #E0EAE3' }}>
  <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#034065' }}>×</button>
</div>
    {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
      <div key={label} onClick={() => { navigate(path); setMobileMenuOpen(false) }} style={{ fontSize: 16, color: '#034065', padding: '14px 24px', cursor: 'pointer', fontWeight: 500, borderBottom: '0.5px solid #E0EAE3' }}>
        {label}
      </div>
    ))}
    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button onClick={() => { openLogin(); setMobileMenuOpen(false) }} style={{ padding: '12px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
      <button onClick={() => { openSignup(); setMobileMenuOpen(false) }} style={{ padding: '12px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
    </div>
  </div>
)}

  {/* TEXTE BAS */}
  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isMobile ? '0 20px 40px' : '0 60px 60px' }}>
    <div style={{ display: 'inline-block', background: 'rgba(76,175,46,0.25)', border: '1px solid rgba(76,175,46,0.5)', color: '#fff', fontSize: 11, fontWeight: 500, padding: '3px 12px', borderRadius: 20, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>
      Nouvelle façon d'investir
    </div>
    <h1 style={{ fontSize: isMobile ? 34 : 52, fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: '0 0 16px', maxWidth: 600 }}>
      Prenez une longueur<br />
      <span style={{ color: '#4CAF2E' }}>d'avance.</span>
    </h1>
    <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 500 }}>
      "Le bonheur ne se trouve pas au sommet de la montagne,<br />mais dans la façon dont on l'a gravie."
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
  <button onClick={openSignup} style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
    Commencer gratuitement
  </button>
  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
    Déjà + de 50 utilisateurs, rejoins-les !
  </span>
</div>
</div>

</section>

{/* MOT DU FONDATEUR */}
<section style={{ background: '#fff', padding: isMobile ? '40px 20px' : '60px 60px', borderBottom: '0.5px solid #E0EAE3' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
    <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid #4CAF2E', flexShrink: 0 }}>
      <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2914.jpeg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ fontSize: 11, color: '#4CAF2E', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Le mot du fondateur</div>
      <p style={{ fontSize: 15, color: '#034065', lineHeight: 1.8, margin: '0 0 12px' }}>
        J'ai créé Start Invest parce que j'ai cherché cette application, et elle n'existait pas. Un outil ludique, éducatif, qui te challenge dans le temps. Pas une application froide pleine de jargon technique, pas juste un simple tracker de dépenses. Quelque chose de différent, pensé pour t'accompagner sur le long terme.
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: '0 0 24px' }}>
        Si tu es discipliné dans ton sport ou ton travail, tu peux l'être dans tes finances. Le reste, c'est une question d'outils et de régularité.
      </p>
      <div style={{ background: '#F4F7F5', borderRadius: 12, padding: '20px 24px', borderLeft: '3px solid #4CAF2E', borderRadius: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#034065', lineHeight: 1.8, margin: '0 0 12px' }}>
          La retraite est incertaine. Ton avenir, lui, peut l'être un peu moins.
        </p>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.8, margin: '0 0 12px' }}>
          Une nouvelle génération prend les choses en main. Sans tabou, sans jargon, sans prétendre être des experts. Juste des gens qui décident de construire quelque chose, euro par euro, mois après mois. Peu importe ton point de départ. Ce qui compte, c'est de commencer.
        </p>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.8, margin: 0 }}>
          Start Invest, c'est l'équivalent d'une grande app de sport, appliqué à ton patrimoine. Challenge-toi, collectionne tes badges, suis ta progression et celle de tes amis. Le temps est ton meilleur allié, utilise-le.
        </p>
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>Thomas — Fondateur de Start Invest</div>
    </div>
  </div>
</section>

      {/* 4 ÉTAPES */}
<section style={{ background: '#F4F7F5', padding: isMobile ? '50px 20px' : '80px 60px' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 32 : 60, gap: 16 }}>
  <div style={{ textAlign: 'center', flex: 1 }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Comment ça marche</div>
    <h2 style={{ fontSize: isMobile ? 22 : 34, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: 0 }}>
      4 étapes pour construire<br /><span style={{ color: '#4CAF2E' }}>ton avenir.</span>
    </h2>
  </div>
  {isMobile && (
    <div style={{ flexShrink: 0 }}>
      <div style={{ width: 110, background: '#111', borderRadius: 20, padding: '6px' }}>
        <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ background: '#000', height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 3, background: '#222', borderRadius: 2 }} />
          </div>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/screen-app-ia.PNG" alt="App" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
    </div>
  )}
</div>

    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center' }}>

  {/* ÉTAPES */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {[
      { num: '01', titre: 'Pose tes bases', desc: 'Réponds à 5 questions. L\'IA analyse ton profil et génère ton bilan personnalisé.' },
      { num: '02', titre: 'Suis tes finances', desc: 'Revenus, dépenses, règle 50/30/20. Tu vois exactement combien tu peux investir.' },
      { num: '03', titre: 'Forme-toi', desc: '23 fiches sans jargon pour comprendre l\'investissement et choisir ta stratégie.' },
      { num: '04', titre: 'Investis et challenge-toi', desc: 'Suis tes ETF, débloque des badges, avance avec tes amis.' },
    ].map(({ num, titre, desc }) => (
      <div key={num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', borderRadius: 12, padding: '18px 20px', border: '0.5px solid #E0EAE3' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#4CAF2E', lineHeight: 1, flexShrink: 0, width: 36 }}>{num}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#034065', marginBottom: 4 }}>{titre}</div>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{desc}</div>
        </div>
      </div>
    ))}
  </div>

  {/* MOCKUP TÉLÉPHONE */}
  {!isMobile && (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 200, background: '#111', borderRadius: 32, padding: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#000', borderRadius: 26, overflow: 'hidden' }}>
          <div style={{ background: '#000', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 60, height: 5, background: '#222', borderRadius: 3 }} />
          </div>
          <img
            src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/screen-app-ia.PNG"
            alt="App Start Invest"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>
    </div>
  )}

</div>

{/* BOUTON CENTRÉ */}
<div style={{ textAlign: 'center', marginTop: 40 }}>
  <button onClick={openSignup} style={{ background: '#4CAF2E', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 40px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
    Commencer gratuitement
  </button>
</div>

  </div>
</section>

      {/* CHALLENGE */}
<section id="challenge" style={{ background: '#034065', padding: isMobile ? '50px 16px' : '80px 40px' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>

    {/* HEADER */}
    <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Challenge</div>
      <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 16px' }}>
        Pensez à cinq ans, <span style={{ color: '#4CAF2E' }}>pas à cinq mois.</span>
      </h2>
      <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: '0 auto 32px', maxWidth: 460 }}>
        Fixez-vous des objectifs et atteignez-les avec discipline au fil du temps. Motivez-vous avec vos amis et grâce à une communauté qui vous tire vers le haut.
      </p>
    </div>

    {/* COMPTEURS */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: isMobile ? 36 : 52 }}>
      {[
        { val: '47+', label: 'membres actifs' },
        { val: '312', label: 'badges débloqués' },
        { val: '89', label: 'challenges en cours' },
      ].map(({ val, label }) => (
        <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 8px' }}>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#4CAF2E' }}>{val}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>

    {/* MEMBRES FICTIFS */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 20, marginBottom: isMobile ? 36 : 52 }}>
      {[
        { initiales: 'LM', nom: 'Lucas', age: 24, badge: 'Le Métronome', niveau: 'Bronze · 3 mois', color: '#854F0B', bg: '#FFF0DC', phrase: '"3 mois d\'affilée, je lâche plus !"' },
        { initiales: 'MR', nom: 'Marie', age: 31, badge: 'L\'Architecte', niveau: 'Or · 10 000€', color: '#633806', bg: '#FFF8DC', phrase: '"Mon portefeuille a doublé en 5 ans."' },
        { initiales: 'TG', nom: 'Thomas', age: 35, badge: 'Le Grand Saut', niveau: 'Obtenu', color: '#2E7D1E', bg: '#EAF6E4', phrase: '"J\'aurais dû commencer bien plus tôt !"' },
      ].map(({ initiales, nom, age, badge, niveau, color, bg, phrase }) => (
        <div key={nom} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {initiales}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{nom}, {age} ans</div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: bg, color: color, fontWeight: 500 }}>{badge} · {niveau}</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{phrase}</p>
        </div>
      ))}
    </div>

    {/* BADGES */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 14 : 20, marginBottom: 40 }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #4CAF2E' }}>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Le%20grand%20saut.png" alt="Grand Saut" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Le Grand Saut</div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#EAF6E4', color: '#2E7D1E', fontWeight: 500 }}>Obtenu</span>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Tu n'es plus spectateur, tu es le pilote de ton futur.</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #854F0B', overflow: 'hidden' }}>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Metronome.png" alt="métronome" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Le Métronome</div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF0DC', color: '#854F0B', fontWeight: 500 }}>Bronze 3 mois</span>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>3 / 6 mois vers Argent</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #854F0B' }}>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Ascension.png" alt="Ascension" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Ascension</div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF8DC', color: '#633806', fontWeight: 500 }}>Or 1 000 euros</span>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>1 200 / 2 000 euros vers Platine</div>
      </div>
    </div>

    {/* CTA */}
<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
  <button onClick={() => setChallengesOpen(true)} style={{ padding: '11px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: 'auto' }}>
    Voir tous les challenges
  </button>
  <button onClick={openSignup} style={{ padding: '11px 28px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: 'auto' }}>
    Rejoindre la communauté
  </button>
</div>

  </div>
</section>

      {/* ABONNEMENT */}
<section id="abonnement" style={{ padding: isMobile ? '60px 16px 50px' : '100px 40px 80px', background: '#F4F7F5', textAlign: 'center' }}>
  <div style={{ maxWidth: 820, margin: '0 auto' }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Rejoignez-nous</div>
    <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, color: '#034065', lineHeight: 1.3, margin: '0 0 16px' }}>
      Ne laissez plus jamais <span style={{ color: '#4CAF2E' }}>votre argent dormir.</span>
    </h2>
    <p style={{ fontSize: isMobile ? 13 : 14, color: '#9CA3AF', lineHeight: 1.8, margin: '0 0 8px' }}>Trouvez votre façon de faire de l'argent en dormant.</p>
    <p style={{ fontSize: 13, color: '#4CAF2E', fontWeight: 500, margin: '0 0 32px' }}>Essayez gratuitement pendant 15 jours</p>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
      {plansData.map(plan => (
        <PlanCard key={plan.id} plan={plan} abonnementAnnuel={abonnementAnnuel} setAbonnementAnnuel={setAbonnementAnnuel} openSignup={openSignup} />
      ))}
    </div>
  </div>
</section>

      <CookieBanner />

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
      {challengesOpen && <ChallengesModal onClose={() => setChallengesOpen(false)} />}
    </div>
  )
}