import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import FooterPublic from '../components/FooterPublic'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'
const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

function PublicNavbar({ isMobile, openLogin, openSignup, activeLink = 'Challenge' }) {
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
            <span style={{ width: 22, height: 2, background: '#1B2E4B', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: '#1B2E4B', borderRadius: 2, transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: '#1B2E4B', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
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
                    color: label === activeLink ? '#4CAF2E' : '#1B2E4B',
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
              <button onClick={() => { setMenuOpen(false); openLogin() }} style={{ padding: '12px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
              <button onClick={() => { setMenuOpen(false); openSignup() }} style={{ padding: '12px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Logo />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {links.map(([label, path]) => (
          <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === activeLink ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === activeLink ? 500 : 400 }}
            onMouseEnter={e => e.currentTarget.style.color = '#1B2E4B'}
            onMouseLeave={e => e.currentTarget.style.color = label === activeLink ? '#1B2E4B' : '#6B7280'}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
        <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </div>
    </nav>
  )
}

export default function ChallengePublic() {
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

  const BADGES = [
    { emoji: '🌱', nom: 'Premier Pas', desc: "Des l'inscription sur StartInvest.", message: 'Bienvenue chez Start Invest.', tag: 'Automatique', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
    { emoji: '🚀', nom: 'Le Grand Saut', desc: 'Acheter son premier ETF.', message: "Tu n'es plus spectateur, tu es le pilote de ton futur.", tag: 'Premier achat', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
    { img: METRONOME_URL, nom: 'Le Métronome', desc: 'Investir régulièrement chaque mois.', message: 'La magie des intérêts composes adore ta régularité.', tag: 'Bronze vers Platine', tagColor: '#854F0B', tagBg: '#FFF0DC' },
    { emoji: '🗿', nom: 'Main de Fer', desc: '6 mois sans aucune vente.', message: 'Le calme est une competence.', tag: 'Discipline', tagColor: '#444441', tagBg: '#F0F0F0' },
    { emoji: '🏗️', nom: "L'Architecte", desc: 'Posséder 3 ETF différents.', message: 'Ton patrimoine est maintenant solide et diversifie.', tag: 'Diversification', tagColor: '#185FA5', tagBg: '#E6F1FB' },
    { emoji: '💰', nom: 'Ascension', desc: "Atteindre un palier d'investissement.", message: 'Le premier palier est le plus dur. La machine est lancee.', tag: 'Bronze vers Légendaire', tagColor: '#633806', tagBg: '#FFF8DC' },
    { emoji: '⚡', nom: 'Loin et Vite', desc: "S'abonner a StartInvest Premium.", message: "Je vois déjà l'avenir.", tag: 'Premium', tagColor: '#534AB7', tagBg: '#EEEDFE' },
  ]

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <PublicNavbar isMobile={isMobile} openLogin={openLogin} openSignup={openSignup} activeLink="Challenge" />

      {/* HERO */}
      <section style={{ background: '#1B2E4B', padding: isMobile ? '50px 16px' : '80px 40px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Challenge</div>
          <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, color: '#fff', lineHeight: 1.4, margin: '0 0 24px' }}>
            Parce que l investissement se court comme un <span style={{ color: '#4CAF2E' }}>marathon</span> et non comme un sprint,
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: 560 }}>
            nous avons cree les challenges pour vous tirer vers le haut.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14, maxWidth: 600, margin: '0 auto' }}>
            {[
              { val: 'Long terme', label: 'La clé de la richesse' },
              { val: 'Regularite', label: 'Plus que le timing' },
              { val: 'Discipline', label: "L'arme secrete" },
            ].map(({ val, label }) => (
              <div key={val} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: isMobile ? '14px' : '16px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BADGES */}
      <section style={{ padding: isMobile ? '50px 16px' : '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Accomplissements</div>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 12px' }}>Le livret d'accomplissements</h2>
          <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
            Debloquez des badges en progressant dans votre parcours d investisseur. Chaque accomplissement recompense une action concrete.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: isMobile ? 12 : 16 }}>
          {BADGES.map(({ emoji, img, nom, desc, message, tag, tagColor, tagBg }) => (
            <div key={nom} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: tagBg, border: `2px solid ${tagColor}`, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {img ? <img src={img} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26 }}>{emoji}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2E4B' }}>{nom}</div>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: tagBg, color: tagColor, fontWeight: 500, whiteSpace: 'nowrap' }}>{tag}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{desc}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', borderLeft: `2px solid ${tagColor}`, paddingLeft: 8 }}>{message}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '50px 16px' : '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 16px' }}>Commencez votre parcours</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Premier Pas vous attend des l'inscription.</p>
        <button onClick={openSignup} style={{ padding: isMobile ? '12px 32px' : '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </section>

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}