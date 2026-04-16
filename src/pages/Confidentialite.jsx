import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function Confidentialite() {
  const navigate = useNavigate()

  const Article = ({ numero, titre, children }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2E4B', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, paddingBottom: 8, borderBottom: '0.5px solid #E0EAE3' }}>
        {numero}. {titre}
      </div>
      <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8 }}>{children}</div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <button onClick={() => navigate(-1)} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #E0EAE3', background: '#fff', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Légal</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1B2E4B', margin: '0 0 12px' }}>Politique de Confidentialité</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>
          <Article numero="1" titre="Collecte des données">
            Les chiffres que vous saisissez dans vos outils de gestion (dépenses, montants d'investissement) sont strictement personnels et ne sont jamais partagés avec des tiers. Ils sont chiffrés et ne servent qu'à votre propre consultation au sein de l'application.
          </Article>

          <Article numero="2" titre="Utilisation des données">
            Nous n'utilisons aucun traceur publicitaire tiers et ne revendons jamais vos informations à des partenaires commerciaux. Les données collectées servent uniquement au bon fonctionnement de votre espace personnel StartInvest.
          </Article>

          <Article numero="3" titre="Données de contact">
            Vos informations d'identification (nom, e-mail) sont conservées tant que vous restez inscrit sur la plateforme. Pour supprimer définitivement votre compte et l'intégralité de vos données de calcul (budgets, investissements), vous pouvez vous rendre dans l'onglet <strong>Paramètres</strong> de l'application et cliquer sur <strong>"Supprimer mon compte"</strong>.
          </Article>

          <Article numero="4" titre="Données applicatives">
            Vos données de calcul (budgets, simulateurs, journal d'investissement) sont conservées pendant toute la durée de vie de votre compte Start Invest. En cas d'inactivité prolongée de plus de 24 mois, ou sur simple demande de votre part, ces données seront définitivement supprimées de nos serveurs sécurisés.
          </Article>

          <Article numero="5" titre="Sécurité et stockage">
            Vos données d'identification (nom, e-mail) et vos données d'utilisation de l'application (calculs de budget, simulateurs) sont stockées de manière sécurisée. Nous utilisons les services de <strong>Supabase Inc.</strong> (infrastructure AWS située en Europe, région Frankfurt) pour la base de données, et <strong>Vercel Inc.</strong> pour l'hébergement de l'interface.
          </Article>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}