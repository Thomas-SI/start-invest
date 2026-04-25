import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import ChallengesModal from '../components/ChallengesModal'
import FooterPublic from '../components/FooterPublic'
import CookieBanner from '../components/CookieBanner'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'
const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

const plansData = [
  {
    id: 'gratuit', nom: 'Gratuit',
    prixMensuel: '0 euros', prixAnnuel: '0 euros',
    periodeMensuel: 'pour toujours', periodeAnnuel: 'pour toujours',
    pages: ['Mes Finances', 'Challenge', 'Abonnement', 'Compte'],
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
    pages: ['Mes Finances', 'Portefeuille', 'Investissement', 'Croissance', 'Challenge', 'Abonnement', 'Guide', 'Compte'],
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

function PlanCard({ plan, abonnementAnnuel, openSignup }) {
  const [expanded, setExpanded] = useState(false)
  const { nom, recommande, features, pages, prixMensuel, prixAnnuel, periodeMensuel, periodeAnnuel } = plan
  const prix = abonnementAnnuel ? prixAnnuel : prixMensuel
  const periode = abonnementAnnuel ? periodeAnnuel : periodeMensuel
  const featuresVisible = expanded ? features : features.slice(0, 5)

  return (
    <div style={{ background: recommande ? '#034065' : '#fff', border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#4CAF2E' : '#E0EAE3'}`, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative', textAlign: 'left' }}>
      {recommande && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>Recommandé</div>}
      <div style={{ fontSize: 16, fontWeight: 600, color: recommande ? '#fff' : '#034065', marginBottom: 4 }}>{nom}</div>
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
      <img src={LOGO_URL} alt="StartInvest" style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'cover' }} />
    </div>
  )

  if (isMobile) {
    return (
      <>
        <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 16px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
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
    <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Logo />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {links.map(([label, path]) => (
          <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === activeLink ? '#034065' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === activeLink ? 500 : 400 }}
            onMouseEnter={e => e.currentTarget.style.color = '#034065'}
            onMouseLeave={e => e.currentTarget.style.color = label === activeLink ? '#034065' : '#6B7280'}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
        <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </div>
    </nav>
  )
}

export default function Accueil() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [challengesOpen, setChallengesOpen] = useState(false)
  const [abonnementAnnuel, setAbonnementAnnuel] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <PublicNavbar isMobile={isMobile} openLogin={openLogin} openSignup={openSignup} activeLink="Accueil" />

      {/* HERO */}
      <section id="hero" style={{ padding: isMobile ? '40px 16px 80px' : '80px 40px 60px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 60, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Nouvelle façon d'investir</div>
          <h1 style={{ fontSize: isMobile ? 32 : 42, fontWeight: 700, color: '#034065', lineHeight: 1.2, margin: '0 0 20px' }}>
            Prenez une longueur<br />
            <span style={{ color: '#4CAF2E' }}>d'avance.</span>
          </h1>
          <p style={{ fontSize: isMobile ? 13 : 14, color: '#6B7280', lineHeight: 1.8, margin: '0 0 36px', textAlign: 'justify' }}>
  "La retraite est incertaine. Ton avenir, lui, peut l'être un peu moins."
  <br /><br />
  Une nouvelle génération prend les choses en main. Sans tabou, sans jargon, sans prétendre être des experts, juste des gens qui décident de construire quelque chose, euro par euro, mois après mois. Peu importe ton objectif. Peu importe ton point de départ. Ce qui compte, c'est de commencer.
  <br /><br />
  Start Invest, c'est l'équivalent d'une grande app de sport très connue, mais appliqué à ton patrimoine. Comme elle t'apprends à te dépasser et à rester régulier, Start Invest t'accompagne pour construire ta liberté financière. Challenges-toi, collectionne tes badges, suis ta progression et celle de tes amis. Ensemble, restez motivés et avancez avec discipline. Le temps est ton meilleur allié, utilise-le à bon escient.
  <br /><br />
  <strong style={{ color: '#034065' }}>"Le chemin commence maintenant. Ensemble, tirons-nous vers les sommets."</strong>
</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={openSignup} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Commencer gratuitement
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: isMobile ? 30 : 0 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: isMobile ? '20px' : '24px', boxShadow: '0 4px 24px rgba(27,46,75,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#034065', marginBottom: 2 }}>Mon Portefeuille</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 20 }}>Repartition par enveloppe</div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? 20 : 28 }}>
              <div style={{ flexShrink: 0 }}>
                <svg width="160" height="160" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#034065" strokeWidth="26" strokeDasharray="141.3 141.3" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#4CAF2E" strokeWidth="26" strokeDasharray="84.8 198.0" strokeDashoffset="-141.3" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#BA7517" strokeWidth="26" strokeDasharray="56.5 226.2" strokeDashoffset="-226.1" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="33" fill="#fff" />
                  <text x="60" y="57" textAnchor="middle" fontSize="10" fontWeight="700" fill="#034065">34 600</text>
                  <text x="60" y="69" textAnchor="middle" fontSize="9" fill="#9CA3AF">euros</text>
                </svg>
              </div>
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'PEA', pct: '50%', val: '15 400 euros', color: '#034065' },
                  { label: 'CTO', pct: '30%', val: '6 800 euros', color: '#4CAF2E' },
                  { label: 'Ass. Vie', pct: '20%', val: '4 200 euros', color: '#BA7517' },
                ].map(({ label, pct, val, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#034065' }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{val}</div>
                      <div style={{ background: '#F0F0F0', borderRadius: 3, height: 4, marginTop: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: color, width: pct }} />
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ paddingTop: 10, borderTop: '0.5px solid #E0EAE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#034065' }}>34 600 euros</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: isMobile ? -15 : -20, right: isMobile ? 10 : -20, background: '#fff', border: '0.5px solid #185FA5', borderRadius: 14, padding: isMobile ? '8px 10px' : '10px 14px', display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, boxShadow: '0 4px 16px rgba(24,95,165,0.12)' }}>
            <div style={{ width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 15 : 18, border: '2px solid #185FA5', flexShrink: 0 }}>🏗️</div>
            <div>
              <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 600, color: '#034065' }}>L'Architecte</div>
              <div style={{ fontSize: isMobile ? 9 : 10, color: '#185FA5' }}>Accomplissement débloqué !</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: isMobile ? '40px 16px 20px' : '80px 40px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Revenus', val: '2 000 euros', color: '#4CAF2E', w: '80%' },
                { label: 'Dépenses fixes', val: '1 000 euros', color: '#034065', w: '50%' },
                { label: 'Investissable', val: '400 euros', color: '#BA7517', w: '20%' },
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
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4CAF2E' }}>OK</span>
              </div>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#034065', marginBottom: 6 }}>Analysez vos dépenses</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Donnez-leur une importance.</div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '28px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'PEA', desc: 'Bourse européenne', color: '#034065', w: '80%', tag: 'Plafond 150 000 euros' },
                { label: 'CTO', desc: 'Bourse mondiale', color: '#3B82F6', w: '60%', tag: 'Sans plafond' },
                { label: 'Ass. Vie', desc: 'Épargne long terme', color: '#BA7517', w: '40%', tag: 'Avantage fiscal' },
              ].map(({ label, desc, color, w, tag }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', border: '0.5px solid #E0EAE3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#034065' }}>{label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{desc}</div>
                    </div>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: '#F4F7F5', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{tag}</span>
                  </div>
                  <div style={{ background: '#E0EAE3', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: color, width: w }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#034065', marginBottom: 6 }}>Découvrez comment investir</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Il y a différentes facons d'investir, choisissez les bonnes.</div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', overflow: 'hidden' }}>
            <div style={{ background: '#F4F7F5', padding: '20px 24px', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <DCAChart />
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#034065', marginBottom: 6 }}>Prévoyez vos performances</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Découvrez les performances atteignables selon votre capacite d'épargne.</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: isMobile ? 32 : 48 }}>
          <button onClick={openSignup} style={{ padding: isMobile ? '12px 40px' : '14px 48px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Go</button>
        </div>
      </section>

      {/* CHALLENGE */}
      <section id="challenge" style={{ background: '#034065', padding: isMobile ? '50px 16px' : '80px 40px', marginTop: isMobile ? 40 : 60 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Challenge</div>
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 16px' }}>
              Pensez a 5 ans, <span style={{ color: '#4CAF2E' }}>pas à 5 mois.</span>
            </h2>
            <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: '0 auto 32px', maxWidth: 460 }}>
              Fixez-vous des objectifs et atteignez-les avec discipline au fil du temps.
            </p>
            <button onClick={() => setChallengesOpen(true)} style={{ padding: '11px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Voir tous les challenges
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 14 : 20 }}>
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
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF0DC', color: '#854F0B', fontWeight: 500 }}>Bronze 3 mois</span>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: '#854F0B', width: '50%' }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>3 / 6 mois vers Argent</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: '2px solid #854F0B' }}>💰</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Ascension</div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FFF8DC', color: '#633806', fontWeight: 500 }}>Or 1 000 euros</span>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: '#BA7517', width: '60%' }} />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>1 200 / 2 000 euros vers Platine</div>
            </div>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 30, padding: '4px', marginBottom: 40 }}>
            <button onClick={() => setAbonnementAnnuel(false)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: !abonnementAnnuel ? '#034065' : 'transparent', color: !abonnementAnnuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>Mensuel</button>
            <button onClick={() => setAbonnementAnnuel(true)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: abonnementAnnuel ? '#034065' : 'transparent', color: abonnementAnnuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
              Annuel
              <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            {plansData.map(plan => (
              <PlanCard key={plan.id} plan={plan} abonnementAnnuel={abonnementAnnuel} openSignup={openSignup} />
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section style={{ background: '#fff', borderTop: '0.5px solid #E0EAE3', padding: isMobile ? '40px 16px' : '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#034065', marginBottom: 28 }}>Vous pouvez me rejoindre sur :</div>
          <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', border: '3px solid #E0EAE3' }}>
            <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2914.jpeg" alt="StartInvest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <a href="https://instagram.com/startinvest.fr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', textDecoration: 'none', width: 240, maxWidth: '100%', boxSizing: 'border-box' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Instagram</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#034065' }}>startinvest.fr</div>
              </div>
            </a>
            <a href="https://tiktok.com/@startinvest.fr" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', textDecoration: 'none', width: 240, maxWidth: '100%', boxSizing: 'border-box' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>TikTok</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#034065' }}>@startinvest.fr</div>
              </div>
            </a>
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