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
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Premier%20Pas.png', nom: 'Premier Pas', desc: "Dès l'inscription sur StartInvest.", message: 'Bienvenue chez Start Invest.', tag: 'Automatique', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Le%20grand%20saut.png', nom: 'Le Grand Saut', desc: 'Acheter son premier ETF.', message: "Tu n'es plus spectateur, tu es le pilote de ton futur.", tag: 'Premier achat', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Metronome.png', nom: 'Le Métronome', desc: 'Investir régulièrement chaque mois.', message: 'La magie des intérêts composés adore ta régularité.', tag: 'Bronze vers Platine', tagColor: '#854F0B', tagBg: '#FFF0DC' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Main%20de%20fer.png', nom: 'Main de Fer', desc: '6 mois sans aucune vente.', message: 'Le calme est une compétence.', tag: 'Discipline', tagColor: '#444441', tagBg: '#F0F0F0' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Larchitecte.png', nom: "L'Architecte", desc: 'Posséder 3 ETF différents.', message: 'Ton patrimoine est maintenant solide et diversifié.', tag: 'Diversification', tagColor: '#185FA5', tagBg: '#E6F1FB' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Ascension.png', nom: 'Ascension', desc: "Atteindre un palier d'investissement.", message: 'Le premier palier est le plus dur. La machine est lancée.', tag: 'Bronze vers Légendaire', tagColor: '#633806', tagBg: '#FFF8DC' },
  { img: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Lambitieux.png', nom: "L'Ambitieux", desc: "S'abonner à StartInvest Premium.", message: "Je vois déjà l'avenir.", tag: 'Premium', tagColor: '#534AB7', tagBg: '#EEEDFE' },
]

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      <PublicNavbar isMobile={isMobile} openLogin={openLogin} openSignup={openSignup} activeLink="Challenge" />

      {/* HERO */}
      <section style={{ background: '#034065', padding: isMobile ? '50px 16px' : '80px 40px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Challenge</div>
          <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, color: '#fff', lineHeight: 1.4, margin: '0 0 24px' }}>
            Parce que l'investissement se court comme un <span style={{ color: '#4CAF2E' }}>marathon</span> et non comme un sprint
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: 560 }}>
            Nous avons créé les challenges pour vous tirer vers les sommets, comme dans le sport, avec une communauté qui nous pousse à nous dépasser.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14, maxWidth: 600, margin: '0 auto' }}>
            {[
              { val: 'LONG TERME', label: 'La clé de la richesse' },
              { val: 'RÉGULARITÉ', label: 'Plus que le timing' },
              { val: 'DISCIPLINE', label: "L'arme secrète" },
            ].map(({ val, label }) => (
              <div key={val} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: isMobile ? '14px' : '16px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOMPLISSEMENTS */}
<section style={{ padding: isMobile ? '50px 16px' : '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
  <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Accomplissements</div>
    <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#034065', margin: '0 0 12px' }}>Le livret d'accomplissements</h2>
    <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
      Débloquez des badges en progressant dans votre parcours d'investisseur. Chaque accomplissement récompense une action concrète.
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
            <div style={{ fontSize: 14, fontWeight: 600, color: '#034065' }}>{nom}</div>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: tagBg, color: tagColor, fontWeight: 500, whiteSpace: 'nowrap' }}>{tag}</span>
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{desc}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', borderLeft: `2px solid ${tagColor}`, paddingLeft: 8 }}>{message}</div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* STREAK */}
<section style={{ background: '#034065', padding: isMobile ? '50px 16px' : '80px 40px' }}>
  <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Streak</div>
    <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
      🔥 Collecte tes flammes !
    </h2>
    <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: 500 }}>
      À chaque mois où tu investis, tu gagnes une flamme. Plus ta série est longue, plus tu es discipliné. Ne laisse pas ta flamme s'éteindre, la  est la clé de la richesse sur le long terme.
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 36 }}>
      {[1,2,3,4,5,6].map((i) => (
        <span key={i} style={{ opacity: 1 - (i - 1) * 0.12 }}>🔥</span>
      ))}
    </div>
    <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>6 mois de suite investis</div>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginTop: 40 }}>
      {[
        { mois: '3 mois', niveau: 'Bronze 🥉', color: '#854F0B', bg: '#FFF0DC' },
        { mois: '6 mois', niveau: 'Argent 🥈', color: '#444441', bg: '#F0F0F0' },
        { mois: '12 mois', niveau: 'Or 🥇', color: '#633806', bg: '#FFF8DC' },
      ].map(({ mois, niveau, color, bg }) => (
        <div key={mois} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{mois}</div>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: bg, color, fontWeight: 600 }}>{niveau}</span>
        </div>
      ))}
    </div>
  </div>
</section>

{/* GUIDE */}
<section style={{ padding: isMobile ? '50px 16px' : '80px 40px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
  <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Guide</div>
  <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#034065', margin: '0 0 16px' }}>
    📚 5 chapitres pour devenir investisseur
  </h2>
  <p style={{ fontSize: isMobile ? 14 : 15, color: '#6B7280', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: 500 }}>
    Valide chaque chapitre du guide et débloque ton badge. De zéro à investisseur autonome. Sans jargon, sans prise de tête.
  </p>
  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: 12 }}>
    {[
      { num: '01', titre: "Comprendre l'environnement", couleur: '#3B82F6' },
      { num: '02', titre: "Stratégies d'investissement", couleur: '#4CAF2E' },
      { num: '03', titre: 'Choisir sa banque', couleur: '#F59E0B' },
      { num: '04', titre: 'Les bases essentielles', couleur: '#8B5CF6' },
      { num: '05', titre: "Passer à l'action", couleur: '#EC4899' },
    ].map(({ num, titre, couleur }) => (
      <div key={num} style={{ background: couleur + '15', border: `0.5px solid ${couleur}40`, borderRadius: 12, padding: '16px 10px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: couleur, marginBottom: 6 }}>{num}</div>
        <div style={{ fontSize: 11, color: '#034065', lineHeight: 1.4 }}>{titre}</div>
      </div>
    ))}
  </div>
</section>

{/* COMMUNAUTÉ */}
<section style={{ background: '#034065', padding: isMobile ? '50px 16px' : '80px 40px' }}>
  <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Communauté</div>
    <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
      👥 Ensemble, on va plus loin
    </h2>
    <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 auto 40px', maxWidth: 500 }}>
      Ajoute tes amis, suis leurs badges et leur progression. La force du groupe est décuplée. S'entourer de personnes disciplinées, motivées et qui investissent, c'est le meilleur moyen de ne jamais flancher.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
      {[
        { emoji: '🏆', titre: 'Badges partagés', desc: 'Vois les accomplissements de tes amis' },
        { emoji: '🔥', titre: 'Streak de tes amis', desc: 'Reste motivé en voyant leur régularité' },
        { emoji: '💪', titre: 'Motivation collective', desc: 'Tire-toi vers le haut ensemble' },
      ].map(({ emoji, titre, desc }) => (
        <div key={titre} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{titre}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{desc}</div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA */}
<section style={{ padding: isMobile ? '50px 16px' : '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
  <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#034065', margin: '0 0 16px' }}>Commencez votre parcours</h2>
  <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Le badge "Premier Pas" vous attend dès l'inscription avec une surprise 🎁 </p>
  <button onClick={openSignup} style={{ padding: isMobile ? '12px 32px' : '14px 40px', borderRadius: 12, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
</section>

      <FooterPublic />

      {authOpen && <AuthModal defaultMode={authMode} onClose={() => setAuthOpen(false)} />}
    </div>
  )
}