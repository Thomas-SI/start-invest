import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function CGV() {
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
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1B2E4B', margin: '0 0 4px' }}>Conditions Générales de Vente</h1>
          <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 12px' }}>CGV</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>
          <Article numero="1" titre="Objet">
            Les présentes Conditions Générales de Vente (CGV) régissent de manière exclusive les relations contractuelles entre l'entreprise <strong>START_INVEST</strong> (ci-après "l'Éditeur") et toute personne physique ou morale (ci-après "le Client") procédant à l'achat de produits numériques (guides, formations vidéo) ou à l'accès à l'application web de gestion financière sur le site www.start-invest.fr.
          </Article>

          <Article numero="2" titre="Prix et paiement">
            Les prix de nos produits sont indiqués en Euros (€).<br /><br />
            <strong>TVA non applicable :</strong> En tant qu'Entrepreneur Individuel, la TVA est non applicable conformément à l'article 293 B du Code Général des Impôts.<br /><br />
            <strong>Exigibilité :</strong> Le paiement est exigible immédiatement au moment de la commande.<br /><br />
            <strong>Modes de paiement :</strong> Le règlement s'effectue par carte bancaire via les plateformes sécurisées Stripe ou PayPal. L'Éditeur n'a jamais accès aux coordonnées bancaires du Client.
          </Article>

          <Article numero="3" titre="Livraison des produits numériques">
            Le contenu (formation, guides et accès à l'application web) est livré par voie électronique immédiatement après la validation du paiement. Le Client reçoit ses accès par e-mail à l'adresse renseignée lors de la commande.
          </Article>

          <Article numero="4" titre="Accès et maintenance de l'application">
            L'Éditeur s'efforce d'assurer un accès à l'application web 24h/24 et 7j/7. Toutefois, l'accès peut être temporairement suspendu pour des raisons de maintenance technique ou de mise à jour des fonctionnalités, sans que cela n'ouvre droit à une quelconque indemnité.<br /><br />
            L'accès à l'application est garanti pour une durée illimitée, sauf en cas d'arrêt définitif du service, auquel cas un préavis de 3 mois sera communiqué au Client.
          </Article>

          <Article numero="5" titre="Droit de rétractation">
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenus numériques non fournis sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.<br /><br />
            En validant sa commande, le Client accepte l'accès immédiat au contenu et renonce expressément à son droit de rétractation.
          </Article>

          <Article numero="6" titre="Responsabilité et avertissement légal">
            Start Invest fournit des informations, des méthodes et des outils de calcul à titre purement éducatif et pédagogique.<br /><br />
            <strong>Conseil Financier :</strong> L'Éditeur n'est pas Conseiller en Investissement Financier (CIF). Les informations présentées ne constituent en aucun cas un conseil en investissement ou une sollicitation à l'achat ou à la vente d'instruments financiers.<br /><br />
            <strong>Risques :</strong> L'investissement comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures.<br /><br />
            <strong>Décisions du Client :</strong> Le Client est seul responsable de ses décisions financières. L'Éditeur ne pourra être tenu responsable des pertes directes ou indirectes résultant de l'utilisation des outils ou des informations fournies.
          </Article>

          <Article numero="7" titre="Propriété intellectuelle">
            Tous les éléments du site et de l'application (textes, logos, codes sources, calculateurs, vidéos) sont et restent la propriété intellectuelle exclusive de START_INVEST. Toute reproduction, exploitation ou utilisation à quelque titre que ce soit est strictement interdite sans accord préalable.
          </Article>

          <Article numero="8" titre="Droit applicable">
            Les présentes CGV sont soumises à la loi française. En cas de litige, et après tentative de résolution amiable, compétence est donnée aux tribunaux français compétents.
          </Article>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}