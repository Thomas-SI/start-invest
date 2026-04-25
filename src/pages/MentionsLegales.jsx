import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function MentionsLegales() {
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
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#034065', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <button onClick={() => navigate(-1)} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #E0EAE3', background: '#fff', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: isMobile ? '20px 16px' : '60px 40px' }}>
        <div style={{ marginBottom: isMobile ? 24 : 48 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Légal</div>
          <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 700, color: '#034065', margin: '0 0 12px' }}>Mentions Légales</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: isMobile ? '20px 16px' : '40px' }}>
          <Article numero="1" titre="Éditeur du site">
            Le site <strong>www.start-invest.fr</strong> est édité par :<br /><br />
            <strong>Nom :</strong> Thomas BOUCHARD<br />
            <strong>Statut juridique :</strong> Micro-entrepreneur<br />
            <strong>Siège social :</strong> 44 Rue Pasquier, 75008 Paris, France<br />
            <strong>SIRET :</strong> 90915142500024<br />
            <strong>Année de création :</strong> 2026<br />
            <strong>TVA :</strong> Non applicable (article 293 B du CGI)<br />
            <strong>Email :</strong> contact@start-invest.fr<br />
            <strong>Directeur de la publication :</strong> Thomas BOUCHARD
          </Article>
          <Article numero="2" titre="Hébergement">
            Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
            Siège social : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
            Site web : https://vercel.com<br /><br />
            Les données applicatives sont stockées via la plateforme <strong>Supabase Inc.</strong> sur des serveurs situés en Union Européenne (Région Frankfurt, Allemagne), garantissant ainsi la conformité avec le RGPD.
          </Article>
          <Article numero="3" titre="Description du service">
            Start Invest est une application web de gestion financière personnelle et d'éducation à l'investissement. Elle permet aux utilisateurs de suivre leurs finances, gérer leur portefeuille d'ETF, simuler leur croissance patrimoniale et progresser grâce à un système de challenges et de badges.<br /><br />
            L'application ne dispose d'aucune connexion bancaire directe — toutes les données sont saisies manuellement par l'utilisateur. Start Invest ne vend aucun produit financier et n'affiche aucune publicité.
          </Article>
          <Article numero="4" titre="Avertissement financier">
            Start Invest est un outil purement éducatif et pédagogique. Thomas BOUCHARD n'est pas Conseiller en Investissement Financier (CIF) agréé. Les informations, simulations et contenus présentés ne constituent en aucun cas un conseil en investissement, une recommandation d'achat ou de vente de titres financiers.<br /><br />
            L'investissement en bourse comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. L'utilisateur est seul responsable de ses décisions d'investissement.
          </Article>
          <Article numero="5" titre="Propriété intellectuelle">
            L'ensemble des éléments composant le site et l'application Start Invest (textes, graphiques, logos, icônes, code source) sont protégés par les dispositions du Code de la propriété intellectuelle et appartiennent exclusivement à Thomas BOUCHARD.<br /><br />
            Toute reproduction, représentation, modification ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable.
          </Article>
          <Article numero="6" titre="Protection des données personnelles">
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.<br /><br />
            Les données collectées sont : email, prénom, nom, métier, pseudo, photo de profil et données financières saisies manuellement. Ces données sont hébergées sur des serveurs sécurisés en Europe (Supabase, Frankfurt) et ne sont jamais vendues ou partagées avec des tiers à des fins commerciales.<br /><br />
            Pour exercer vos droits : <strong>contact@start-invest.fr</strong>
          </Article>
          <Article numero="7" titre="Responsabilité">
            Start Invest s'efforce d'assurer l'exactitude des informations diffusées. Cependant, Start Invest ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation de l'application, des décisions d'investissement prises par l'utilisateur, ou de l'impossibilité d'accéder au service.
          </Article>
          <Article numero="8" titre="Droit applicable">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, compétence est donnée aux tribunaux français compétents.
          </Article>
        </div>
      </div>
      <FooterPublic />
    </div>
  )
}