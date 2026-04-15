import { useNavigate } from 'react-router-dom'

export default function ChallengePublic() {
  const navigate = useNavigate()

  const BADGES = [
    { emoji: '🌱', nom: 'Premier Pas', desc: 'Dès l\'inscription sur StartInvest.', message: 'Bienvenue chez Start Invest.', tag: 'Automatique', tagColor: '#4CAF2E', tagBg: '#EAF6E4' },
    { emoji: '🚀', nom: 'Le Grand Saut', desc: 'Acheter son premier ETF.', message: 'Tu n\'es plus spectateur, tu es le pilote de ton futur.', tag: 'Automatique', tagColor: '#4CAF2E', tagBg: '#EAF6E4' },
    { emoji: '🧗', nom: 'Le Métronome', desc: 'Investir régulièrement chaque mois.', message: 'La magie des intérêts composés adore ta régularité.', tag: 'Bronze / Argent / Or / Platine', tagColor: '#854F0B', tagBg: '#FFF0DC' },
    { emoji: '🗿', nom: 'Main de Fer', desc: '6 mois sans aucune vente.', message: 'Le calme est une compétence.', tag: 'Discipline', tagColor: '#444441', tagBg: '#F0F0F0' },
    { emoji: '🏗️', nom: 'L\'Architecte', desc: 'Posséder 3 ETF différents.', message: 'Ton patrimoine est maintenant solide et diversifié.', tag: 'Diversification', tagColor: '#185FA5', tagBg: '#E6F1FB' },
    { emoji: '💰', nom: 'Cap des X€', desc: 'Atteindre un palier d\'investissement.', message: 'Le premier palier est le plus dur. La machine est lancée.', tag: 'Bronze → Légendaire', tagColor: '#633806', tagBg: '#FFF8DC' },
    { emoji: '⚡', nom: 'Vroum Vroum', desc: 'S\'abonner à StartInvest Premium.', message: 'Je vois déjà l\'avenir.', tag: 'Premium', tagColor: '#534AB7', tagBg: '#EEEDFE' },
  ]

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['Accueil', '/'], ['Fonctionnalités', '/fonctionnalites'], ['Challenge', '/challenge-public'], ['Abonnement', '/abonnement-public']].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{ fontSize: 13, color: label === 'Challenge' ? '#1B2E4B' : '#6B7280', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: label === 'Challenge' ? 500 : 400 }}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #1B2E4B', background: 'transparent', color: '#1B2E4B', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Se connecter</button>
          <button onClick={() => navigate('/signup')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>S'inscrire gratuitement</button>
        </div>
      </nav>

      {/* HERO MINDSET */}
      <section style={{ background: '#1B2E4B', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16, background: 'rgba(76,175,46,0.15)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Mindset</div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 16px' }}>
            Pensez à 5 ans,{' '}
            <span style={{ color: '#4CAF2E' }}>pas à 5 mois.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 48px' }}>
            Apprenez à investir et créez-vous une fortune solide et diversifiée au fil du temps. Chaque action compte.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
            {[
              { val: 'Long terme', label: 'La clé de la richesse' },
              { val: 'Régularité', label: 'Plus que le timing' },
              { val: 'Discipline', label: 'L\'arme secrète' },
            ].map(({ val, label }) => (
              <div key={val} style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#4CAF2E', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOMPLISSEMENTS */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Accomplissements</div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 12px' }}>Le livret d'accomplissements</h2>
          <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
            Débloquez des badges en progressant dans votre parcours d'investisseur. Chaque accomplissement récompense une action concrète.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {BADGES.map(({ emoji, nom, desc, message, tag, tagColor, tagBg }) => (
            <div key={nom} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: `2px solid ${tagColor}`, flexShrink: 0 }}>
                {emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2E4B' }}>{nom}</div>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: tagBg, color: tagColor, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}>{tag}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{desc}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>"{message}"</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#F4F7F5' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1B2E4B', margin: '0 0 16px' }}>Commencez votre parcours</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>Premier Pas vous attend dès l'inscription.</p>
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