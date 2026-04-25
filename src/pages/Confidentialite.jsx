import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function Confidentialite() {
  const navigate = useNavigate()

  const Article = ({ numero, titre, children }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2E4B', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, paddingBottom: 8, borderBottom: '0.5px solid #E0EAE3' }}>
        {numero}. {titre}
      </div>
      <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, textAlign: 'justify' }}>{children}</div>
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
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>

          <Article numero="1" titre="Responsable du traitement">
            Le responsable du traitement des données personnelles est :<br /><br />
            <strong>Thomas BOUCHARD</strong> — Micro-entrepreneur<br />
            44 Rue Pasquier, 75008 Paris, France<br />
            SIRET : 90915142500024<br />
            Email : contact@start-invest.fr
          </Article>

          <Article numero="2" titre="Données collectées">
            Start Invest collecte uniquement les données nécessaires au fonctionnement du service :<br /><br />
            <strong>Données d'identification :</strong> prénom, nom, adresse email, métier, pseudo, photo de profil (optionnelle).<br /><br />
            <strong>Données financières :</strong> revenus, dépenses, soldes de comptes, transactions d'investissement — toutes saisies manuellement par l'utilisateur. Aucune connexion bancaire directe.<br /><br />
            <strong>Données de navigation :</strong> pages visitées dans l'application, préférences d'affichage (thème clair/sombre).<br /><br />
            <strong>Données de paiement :</strong> gérées exclusivement par Stripe. Start Invest n'a jamais accès à vos coordonnées bancaires.
          </Article>

          <Article numero="3" titre="Finalités du traitement">
            Les données collectées sont utilisées pour :<br /><br />
            — Fournir et améliorer le service Start Invest<br />
            — Gérer votre compte et votre abonnement<br />
            — Vous envoyer les emails transactionnels (confirmation, réinitialisation de mot de passe, reçus de paiement)<br />
            — Assurer la sécurité et prévenir la fraude<br /><br />
            Vos données ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales. Aucun traceur publicitaire n'est utilisé.
          </Article>

          <Article numero="4" titre="Base légale du traitement">
            Le traitement de vos données repose sur :<br /><br />
            — L'<strong>exécution du contrat</strong> : pour fournir le service auquel vous avez souscrit<br />
            — Le <strong>consentement</strong> : pour les communications optionnelles<br />
            — L'<strong>intérêt légitime</strong> : pour la sécurité et l'amélioration du service
          </Article>

          <Article numero="5" titre="Destinataires des données">
            Vos données sont partagées uniquement avec nos prestataires techniques nécessaires au fonctionnement du service :<br /><br />
            <strong>Supabase Inc.</strong> — stockage des données (serveurs Frankfurt, EU)<br />
            <strong>Vercel Inc.</strong> — hébergement de l'application<br />
            <strong>Stripe Inc.</strong> — traitement des paiements<br />
            <strong>Resend</strong> — envoi des emails transactionnels<br /><br />
            Ces prestataires sont contractuellement tenus de protéger vos données et ne peuvent les utiliser qu'aux fins pour lesquelles elles leur sont transmises.
          </Article>

          <Article numero="6" titre="Durée de conservation">
            Vos données sont conservées pendant toute la durée de votre compte actif. En cas de suppression de compte, toutes vos données sont définitivement supprimées dans un délai de 30 jours.<br /><br />
            Les données de facturation sont conservées 10 ans conformément aux obligations légales françaises.
          </Article>

          <Article numero="7" titre="Vos droits">
            Conformément au RGPD, vous disposez des droits suivants :<br /><br />
            — <strong>Droit d'accès</strong> : obtenir une copie de vos données<br />
            — <strong>Droit de rectification</strong> : corriger vos données inexactes<br />
            — <strong>Droit à l'effacement</strong> : supprimer votre compte et vos données<br />
            — <strong>Droit à la portabilité</strong> : recevoir vos données dans un format lisible<br />
            — <strong>Droit d'opposition</strong> : vous opposer à certains traitements<br /><br />
            Pour exercer ces droits : <strong>contact@start-invest.fr</strong><br /><br />
            Vous pouvez également déposer une réclamation auprès de la CNIL : www.cnil.fr
          </Article>

          <Article numero="8" titre="Sécurité">
            Vos données sont protégées par des mesures de sécurité adaptées : chiffrement des données en transit (HTTPS), authentification sécurisée, hébergement sur des serveurs certifiés en Europe (ISO 27001).<br /><br />
            En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés, nous nous engageons à vous en informer dans les meilleurs délais.
          </Article>

          <Article numero="9" titre="Cookies et stockage local">
            Start Invest utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session de connexion, préférences). Aucun cookie publicitaire ou de tracking n'est utilisé.<br /><br />
            L'application utilise le localStorage de votre navigateur pour mémoriser certaines préférences locales. Ces données restent sur votre appareil et peuvent être supprimées depuis les paramètres de votre navigateur.<br /><br />
            Pour plus de détails, consultez notre <a href="/cookies" style={{ color: '#4CAF2E' }}>Politique de Gestion des Cookies</a>.
          </Article>

          <Article numero="10" titre="Modifications">
            Start Invest se réserve le droit de modifier cette politique de confidentialité. Toute modification significative vous sera notifiée par email ou via l'application. La date de dernière mise à jour est indiquée en haut de ce document.
          </Article>

        </div>
      </div>

      <FooterPublic />
    </div>
  )
}