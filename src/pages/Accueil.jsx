import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const navigate = useNavigate()

  const etfs = [
    { lettre: 'W', couleur: '#E3F0FF', texte: '#1565C0', nom: 'MSCI World', zone: 'Monde', perf: '+18.4%', frais: '0.20%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
    { lettre: 'S', couleur: '#EAF6E4', texte: '#2E7D1E', nom: 'S&P 500', zone: 'États-Unis', perf: '+22.1%', frais: '0.07%', volatilite: 'Moyenne', type: 'Actions', typeBg: '#EAF6E4', typeColor: '#2E7D1E' },
    { lettre: 'E', couleur: '#EBE9FC', texte: '#3C3489', nom: 'Euro Bonds', zone: 'Europe', perf: '+4.2%', frais: '0.15%', volatilite: 'Faible', type: 'Obligations', typeBg: '#E3F0FF', typeColor: '#0C447C' },
  ]

  const features = [
    { titre: 'Analyse financière', txt: 'Revenus, dépenses et capacité DCA calculés automatiquement.', bg: '#EAF6E4' },
    { titre: 'ETF & DCA', txt: 'Catalogue d\'ETF avec performances, frais et simulateur DCA.', bg: '#E3F0FF' },
    { titre: 'Recommandations IA', txt: 'Suggestions adaptées à votre profil et horizon d\'investissement.', bg: '#EBE9FC' },
    { titre: 'Communauté', txt: 'Échangez avec d\'autres investisseurs DCA, partagez vos stratégies.', bg: '#E8EEF6' },
  ]

  const stats = [
    { val: '200+', label: 'ETF référencés' },
    { val: '12 K', label: 'Utilisateurs actifs' },
    { val: '94%', label: 'Satisfaction' },
  ]

  return (
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E8F0EA', padding: '0 32px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B', letterSpacing: '.04em', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#4CAF2E', letterSpacing: '.02em', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 8, color: '#1B2E4B', opacity: .5 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['Accueil', 'Fonctionnalités', 'Abonnement', 'Communauté'].map(l => (
            <div key={l} style={{ fontSize: 13, color: l === 'Accueil' ? '#4CAF2E' : '#6B7280', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Accueil' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#1B2E4B', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #C8D8CE', background: '#fff', cursor: 'pointer' }}>Se connecter</button>
          <button onClick={() => navigate('/signup')} style={{ fontSize: 13, fontWeight: 500, color: '#fff', padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4CAF2E', cursor: 'pointer' }}>Commencer gratuitement</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>

        {/* Gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 36px 40px 40px', borderRight: '0.5px solid #EEF4F0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EAF6E4', border: '0.5px solid #A8D98A', borderRadius: 20, padding: '4px 12px', marginBottom: 20, width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF2E' }} />
            <span style={{ fontSize: 11, color: '#2E7D1E', fontWeight: 500 }}>ETF sélectionnés · Données en temps réel</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 500, color: '#1B2E4B', lineHeight: 1.2, letterSpacing: '-.025em', marginBottom: 14 }}>
            Investissez en ETF<br />avec la méthode<br /><span style={{ color: '#4CAF2E' }}>DCA qui fonctionne</span>
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 24, maxWidth: 340 }}>
            Calculez votre capacité d'investissement mensuelle, choisissez vos ETF, et laissez le DCA travailler pour vous sur le long terme.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => navigate('/signup')} style={{ fontSize: 14, fontWeight: 500, color: '#fff', padding: '11px 24px', borderRadius: 9, border: 'none', background: '#4CAF2E', cursor: 'pointer' }}>Créer mon compte</button>
            <button style={{ fontSize: 14, fontWeight: 500, color: '#1B2E4B', padding: '11px 24px', borderRadius: 9, border: '1.5px solid #1B2E4B', background: '#fff', cursor: 'pointer' }}>Voir une démo</button>
          </div>
          <div style={{ fontSize: 11, color: '#B0B8B4' }}>Gratuit pour commencer · <span style={{ color: '#4CAF2E' }}>Aucune carte requise</span> · Pas un service financier</div>
          <div style={{ display: 'flex', gap: 24, marginTop: 24, paddingTop: 20, borderTop: '0.5px solid #EEF4F0' }}>
            {stats.map(({ val, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 20, fontWeight: 500, color: '#1B2E4B' }}>{val}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Droite */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 32px', background: '#F7FAF7', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {features.map(({ titre, txt, bg }) => (
              <div key={titre} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 11, padding: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: bg, marginBottom: 9 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 3 }}>{titre}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{txt}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F0F9F3', border: '0.5px solid #C8E6C9', borderRadius: 11, padding: 12 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>ETF populaires</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              {etfs.map(({ lettre, couleur, texte, nom, zone, perf, frais, volatilite, type, typeBg, typeColor }) => (
                <div key={nom} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 10, padding: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: couleur, color: texte, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{lettre}</div>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 20, background: typeBg, color: typeColor }}>{type}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B', marginBottom: 1 }}>{nom}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 7 }}>{zone}</div>
                  {[['Perf. 1an', perf, true], ['Frais', frais, false], ['Volatilité', volatilite, false]].map(([k, v, green]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0', borderBottom: '0.5px solid #F3F4F6' }}>
                      <span style={{ color: '#9CA3AF' }}>{k}</span>
                      <span style={{ fontWeight: 500, color: green ? '#4CAF2E' : '#1B2E4B' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1B2E4B', borderRadius: 8, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#fff', opacity: .85, flex: 1 }}>Connectez-vous pour accéder à votre dashboard DCA</span>
            <span onClick={() => navigate('/login')} style={{ fontSize: 11, color: '#4CAF2E', fontWeight: 500, cursor: 'pointer' }}>Accéder →</span>
          </div>
        </div>

      </div>
    </div>
  )
}