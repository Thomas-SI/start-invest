import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function CGV() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const Article = ({ numero, titre, children }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#034065', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10, paddingBottom: 8, borderBottom: '0.5px solid #E0EAE3' }}>
        {numero}. {titre}
      </div>
      <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, textAlign: 'justify' }}>{children}</div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'inherit', background: '#F4F7F5', minHeight: '100vh' }}>
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
  <img src="/logo-clair.jpeg" alt="StartInvest" style={{ height: 48, width: 'auto' }} />
</div>
        <button onClick={() => navigate(-1)} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #E0EAE3', background: '#fff', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: isMobile ? '20px 16px' : '60px 40px' }}>
        <div style={{ marginBottom: isMobile ? 24 : 48 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Légal</div>
          <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 700, color: '#034065', margin: '0 0 4px' }}>Conditions Générales de Vente</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: isMobile ? '20px 16px' : '40px' }}>
          <Article numero="1" titre="Objet">
            Les présentes CGV régissent les relations contractuelles entre <strong>Thomas BOUCHARD</strong>, micro-entrepreneur (SIRET : 90915142500024), et toute personne physique majeure (ci-après "le Client") souscrivant à l'application web Start Invest sur www.start-invest.fr.
          </Article>
          <Article numero="2" titre="Offres et tarifs">
            Start Invest propose deux formules :<br /><br />
            <strong>Plan Gratuit :</strong> Accès gratuit et illimité aux fonctionnalités de base.<br /><br />
            <strong>Plan Premium :</strong> Accès à l'ensemble des fonctionnalités au tarif de 7,99€/mois ou 67€/an. L'abonnement annuel est dégressif sur 10 ans et devient gratuit à partir de la 10ème année de souscription continue.<br /><br />
            <strong>Essai gratuit :</strong> Tout nouvel abonnement Premium bénéficie de 15 jours d'essai gratuit. Aucun débit n'est effectué avant la fin de la période d'essai.<br /><br />
            <strong>TVA :</strong> Non applicable en tant que micro-entrepreneur (article 293 B du CGI). Les prix sont indiqués en euros TTC.
          </Article>
          <Article numero="3" titre="Paiement">
            Le paiement est sécurisé via <strong>Stripe</strong>. Start Invest n'a jamais accès aux coordonnées bancaires du Client — elles sont gérées exclusivement par Stripe.<br /><br />
            Le renouvellement de l'abonnement est automatique. Le Client peut résilier à tout moment depuis son espace compte pour éviter le prochain renouvellement.
          </Article>
          <Article numero="4" titre="Accès au service">
            L'accès à l'application est fourni immédiatement après validation du paiement. Start Invest s'efforce d'assurer une disponibilité 24h/24 et 7j/7. Des interruptions peuvent survenir pour maintenance sans ouvrir droit à indemnité.<br /><br />
            En cas d'arrêt définitif du service, un préavis de 3 mois sera communiqué au Client.
          </Article>
          <Article numero="5" titre="Résiliation et remboursement">
            Le Client peut résilier son abonnement à tout moment depuis son espace compte. L'accès Premium est maintenu jusqu'à la fin de la période payée.<br /><br />
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques dont l'exécution a commencé avec l'accord exprès du consommateur.<br /><br />
            Toutefois, Start Invest s'engage à étudier toute demande de remboursement justifiée. Pour toute réclamation : <strong>contact@start-invest.fr</strong>
          </Article>
          <Article numero="6" titre="Abonnement dégressif">
            L'abonnement annuel Premium est conçu pour récompenser la fidélité : le tarif baisse chaque année de souscription continue, de 67€ la 1ère année jusqu'à 0€ à partir de la 10ème année. Le détail des tarifs annuels est disponible sur la page Abonnement de l'application.
          </Article>
          <Article numero="7" titre="Responsabilité et avertissement financier">
            Start Invest est un outil éducatif. Thomas BOUCHARD n'est pas Conseiller en Investissement Financier (CIF). Les informations fournies ne constituent pas un conseil en investissement.<br /><br />
            L'investissement comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. Le Client est seul responsable de ses décisions financières.
          </Article>
          <Article numero="8" titre="Propriété intellectuelle">
            Tous les éléments de l'application (textes, logos, code source, guides, simulateurs) sont la propriété exclusive de Thomas BOUCHARD. Toute reproduction sans accord préalable est interdite.
          </Article>
          <Article numero="9" titre="Médiation">
            En cas de litige non résolu, le Client peut recourir gratuitement à un médiateur de la consommation. Les coordonnées du médiateur compétent seront communiquées prochainement. Dans l'attente, la plateforme européenne de règlement des litiges est accessible à : https://ec.europa.eu/consumers/odr
          </Article>
          <Article numero="10" titre="Droit applicable">
            Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, compétence est donnée aux tribunaux français compétents.
          </Article>
        </div>
      </div>
      <FooterPublic />
    </div>
  )
}