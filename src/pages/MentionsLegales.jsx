import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function MentionsLegales() {
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
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1B2E4B', margin: '0 0 12px' }}>Mentions Légales</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>
          <Article numero="1" titre="Éditeur du site">
            Le site <strong>www.start-invest.fr</strong> est édité par :<br /><br />
            <strong>Nom de la société :</strong> START_INVEST<br />
            <strong>Statut juridique :</strong> Entrepreneur Individuel<br />
            <strong>Siège social :</strong> 44 Rue Pasquier, 75008 PARIS, FRANCE<br />
            <strong>Adresse e-mail :</strong> contact@start-invest.fr<br />
            <strong>Numéro de SIRET :</strong> 90915142500024<br />
            <strong>Directeur de la publication :</strong> Thomas BOUCHARD
          </Article>

          <Article numero="2" titre="Hébergeur du site">
            Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
            Siège social : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
            Site web : https://vercel.com<br /><br />
            Les données applicatives sont stockées via la plateforme <strong>Supabase Inc.</strong> sur des serveurs situés en Union Européenne (Région Frankfurt, Allemagne), garantissant ainsi la conformité avec le Règlement Général sur la Protection des Données (RGPD).
          </Article>

          <Article numero="3" titre="Propriété intellectuelle">
            L'ensemble de ce site, ainsi que les produits numériques (guides, fichiers Excel, formations) vendus sous la marque Start Invest, relèvent de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés. Toute extraction et/ou reproduction de tout ou partie des informations diffusées sur le site est interdite sans l'autorisation expresse et préalable de l'éditeur.
          </Article>

          <Article numero="4" titre="Données personnelles">
            Le stockage des données applicatives (calculs de budget et investissements) est assuré par la société Supabase Inc. dont les serveurs sont situés en Europe (Région AWS Frankfurt). Ces données sont strictement confidentielles et ne sont jamais partagées avec des tiers à des fins commerciales.
          </Article>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}