import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import FooterPublic from '../components/FooterPublic'

const LOGO_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/IMG_2819.jpeg'

const featuresGratuit = [
  { label: 'Suivi finances complet', inclus: true },
  { label: "Capacité d'épargne personnalisé", inclus: true },
  { label: 'Vu des challenges', inclus: true },
  { label: 'Abonnement avec des amis', inclus: true },
  { label: "Guide complet de l'investissement", inclus: true },
  { label: "Tableau d'allocations", inclus: false },
  { label: 'Plan de virement par comptes', inclus: false },
  { label: "Journal suivi d'investissement", inclus: false },
  { label: 'Données ETF en temps réel', inclus: false },
  { label: 'Projection de croissance', inclus: false },
  { label: 'Accès challenges et récompenses', inclus: false },
  
]

const featuresPremium = [
  { label: 'Suivi finances complet', inclus: true },
  { label: "Capacité d'épargne personnalisé", inclus: true },
  { label: "Tableau d'allocations", inclus: true },
  { label: 'Plan de virement par comptes', inclus: true },
  { label: "Journal suivi d'investissement", inclus: true },
  { label: 'Données ETF en temps réel', inclus: true },
  { label: 'Projection de croissance', inclus: true },
  { label: 'Accès challenges et récompenses', inclus: true },
  { label: 'Abonnement avec des amis', inclus: true },
  { label: "Guide complet de l'investissement", inclus: true },
]

function PublicNavbar({ isMobile, openLogin, openSignup, activeLink = 'Abonnement' }) {
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
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={openLogin} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #034065', background: 'transparent', color: '#034065', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
        <button onClick={openSignup} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
      </div>
    </nav>
  )
}
function FaqItem({ question, reponse }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', cursor: 'pointer' }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, color: '#034065', paddingRight: 16 }}>{question}</div>
        <div style={{ fontSize: 18, color: '#4CAF2E', flexShrink: 0 }}>{open ? '▲' : '▼'}</div>
      </div>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>{reponse}</div>
      )}
    </div>
  )
}
export default function AbonnementPublic() {
  const [annuel, setAnnuel] = useState(false)
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

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <PublicNavbar isMobile={isMobile} openLogin={openLogin} openSignup={openSignup} activeLink="Abonnement" />

      <section style={{ padding: isMobile ? '40px 16px 30px' : '60px 40px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Abonnement</div>
        <h1 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 700, color: '#034065', lineHeight: 1.2, margin: '0 0 16px' }}>
          Simple, transparent, sans surprise.
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', maxWidth: 440, margin: '0 auto 12px' }}>
          Commencez gratuitement. Passez a Premium quand vous etes pret.
        </p>
        <div style={{ fontSize: 13, color: '#4CAF2E', fontWeight: 500, background: '#EAF6E4', display: 'inline-block', padding: '6px 16px', borderRadius: 20, marginBottom: isMobile ? 28 : 36 }}>
          Essayez gratuitement pendant 15 jours
        </div>
{/* TEXTE INTRO */}
<div style={{ textAlign: 'justify', fontSize: isMobile ? 13 : 14, color: '#6B7280', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 24px' }}>
  Un abonnement pensé pour récompenser la discipline. Après 10 ans, l'app devient gratuite et vos performances s'envolent. À 7% de moyenne annuelle, votre abonnement est remboursé à partir de 80€/mois investi la 1ère année, et seulement 35€/mois dès la 2ème.
</div>

{/* TABLEAU DÉGRESSIF */}
<div style={{ maxWidth: 480, margin: '0 auto 32px' }}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
    {[
      ['Année 1', '67€'], ['Année 6', '30€'],
      ['Année 2', '59€'], ['Année 7', '22€'],
      ['Année 3', '52€'], ['Année 8', '15€'],
      ['Année 4', '45€'], ['Année 9', '7,50€'],
      ['Année 5', '37€'], ['Année 10', '🎉 Gratuit'],
    ].map(([annee, prix]) => (
      <div key={annee} style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
        <span style={{ color: '#9CA3AF' }}>{annee}</span>
        <span style={{ color: prix === '🎉 Gratuit' ? '#4CAF2E' : '#034065', fontWeight: 600 }}>{prix}</span>
      </div>
    ))}
  </div>
</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 30, padding: '4px', marginBottom: isMobile ? 36 : 48 }}>
          <button onClick={() => setAnnuel(false)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: !annuel ? '#034065' : 'transparent', color: !annuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>Mensuel</button>
          <button onClick={() => setAnnuel(true)} style={{ padding: '7px 20px', borderRadius: 20, border: 'none', background: annuel ? '#034065' : 'transparent', color: annuel ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
            Annuel
            <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, maxWidth: 720, margin: '0 auto' }}>

          {/* GRATUIT */}
          <div style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 20, padding: isMobile ? '28px 22px' : '32px 28px', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>Gratuit</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#034065', marginBottom: 4 }}>0 euros</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>pour toujours</div>
            <div style={{ borderTop: '0.5px solid #E0EAE3', paddingTop: 20, marginBottom: 24 }}>
              {featuresGratuit.map(({ label, inclus }) => (
  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: inclus ? '#034065' : '#9CA3AF' }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: inclus ? '#EAF6E4' : 'transparent', border: inclus ? 'none' : '0.5px solid #E0EAE3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {inclus && <svg width="9" height="9" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
    </div>
    {label}
  </div>
))}
            </div>
            <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: '0.5px solid #E0EAE3', background: '#F4F7F5', color: '#034065', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Commencer gratuitement
            </button>
          </div>

          {/* PREMIUM */}
          <div style={{ background: '#034065', border: '2px solid #4CAF2E', borderRadius: 20, padding: isMobile ? '28px 22px' : '32px 28px', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#4CAF2E', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>Recommandé</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Premium</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{annuel ? '67 euros' : '7.99 euros'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{annuel ? 'facture en une fois par an' : 'par mois'}</div>
            <div style={{ fontSize: 11, color: '#4CAF2E', fontWeight: 500, marginBottom: 24 }}>15 jours gratuits pour essayer</div>
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: 20, marginBottom: 24 }}>
              {featuresPremium.map(({ label, inclus }) => (
  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: inclus ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: inclus ? 'rgba(76,175,46,0.25)' : 'transparent', border: inclus ? 'none' : '0.5px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {inclus && <svg width="9" height="9" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
    </div>
    {label}
  </div>
))}
            </div>
            <button onClick={openSignup} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Essayer 15 jours gratuitement
            </button>
          </div>

        </div>
      </section>

      {/* FAQ */}
<section style={{ padding: isMobile ? '40px 16px 60px' : '60px 40px', maxWidth: 720, margin: '0 auto' }}>
  <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#034065', textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>Questions fréquentes</h2>
  {[
    {
      q: 'En quoi c\'est différent des autres applications ?',
      r: 'Start Invest est la seule application qui combine suivi financier, investissement ETF, challenges et communauté entre amis. Pas de pub, pas de conflits d\'intérêts, pas de produits financiers à vendre. Juste des outils transparents pour construire ton patrimoine à ton rythme.'
    },
    {
      q: 'À qui l\'application s\'adresse-t-elle ?',
      r: 'À tout le monde. Que tu démarres de zéro ou que tu aies déjà un portefeuille, Start Invest s\'adapte à ton niveau. Étudiant, salarié, entrepreneur, parent — peu importe si tu es stressé, fatigué ou que tu n\'as pas le temps. L\'objectif : rendre l\'investissement accessible, ludique et motivant pour tous. La seule condition : être majeur.'
    },
    {
      q: 'Puis-je annuler à tout moment ?',
      r: 'Oui, sans engagement et sans condition. Tu peux résilier ton abonnement à tout moment depuis ton espace compte. Tu gardes l\'accès jusqu\'à la fin de ta période payée.'
    },
    {
      q: 'L\'app remplace-t-elle un conseiller financier ?',
      r: 'Non. Start Invest est un outil éducatif et de suivi. Nous ne sommes pas Conseillers en Investissement Financier (CIF). Les informations fournies sont à titre pédagogique uniquement et ne constituent pas un conseil en investissement. Les performances passées ne préjugent pas des performances futures.'
    },
    {
      q: 'Comment fonctionne l\'abonnement dégressif sur 10 ans ?',
      r: 'C\'est notre façon de récompenser ta fidélité et ta discipline. Le prix de l\'abonnement annuel baisse chaque année : 67€ la 1ère année, 59€ la 2ème, jusqu\'à devenir complètement gratuit à partir de la 10ème année. Parce que la discipline mérite d\'être récompensée.'
    },
    {
      q: 'Mes données sont-elles sécurisées ?',
      r: 'Oui. Tes données sont chiffrées et hébergées sur des serveurs sécurisés en Europe (Frankfurt). Nous n\'utilisons aucun traceur publicitaire et ne revendons jamais tes informations à des tiers.'
    },
  ].map(({ q, r }) => (
    <FaqItem key={q} question={q} reponse={r} />
  ))}
</section>

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}