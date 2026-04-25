import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function CGU() {
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
          <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 700, color: '#034065', margin: '0 0 12px' }}>Conditions Générales d'Utilisation</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: isMobile ? '20px 16px' : '40px' }}>
          <Article numero="1" titre="Objet">
            Les présentes CGU régissent l'accès et l'utilisation de l'application Start Invest, accessible sur www.start-invest.fr, éditée par Thomas BOUCHARD, micro-entrepreneur (SIRET : 90915142500024).
          </Article>
          <Article numero="2" titre="Acceptation des CGU">
            L'utilisation de l'application implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser l'application.
          </Article>
          <Article numero="3" titre="Accès au service">
            L'application Start Invest est accessible à toute personne physique majeure disposant d'un accès à internet. L'accès à certaines fonctionnalités nécessite la création d'un compte et/ou la souscription à un abonnement Premium.
          </Article>
          <Article numero="4" titre="Création de compte">
            L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte. Il est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée depuis son compte. Tout utilisateur doit être majeur pour s'inscrire.
          </Article>
          <Article numero="5" titre="Utilisation du service">
            L'utilisateur s'engage à utiliser l'application conformément à sa destination et aux lois en vigueur. Il est interdit d'utiliser l'application à des fins illicites, frauduleuses ou portant atteinte aux droits de tiers. Start Invest se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.
          </Article>
          <Article numero="6" titre="Avertissement financier">
            Start Invest est un outil éducatif et de suivi. Les informations présentées ne constituent pas un conseil en investissement. Thomas BOUCHARD n'est pas Conseiller en Investissement Financier (CIF). L'investissement comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. L'utilisateur est seul responsable de ses décisions financières.
          </Article>
          <Article numero="7" titre="Propriété intellectuelle">
            L'ensemble des contenus de l'application (textes, graphiques, logos, icônes, code source) est protégé par le droit d'auteur et appartient exclusivement à Thomas BOUCHARD. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
          </Article>
          <Article numero="8" titre="Disponibilité du service">
            Start Invest s'efforce d'assurer la disponibilité de l'application 24h/24 et 7j/7. Des interruptions peuvent survenir pour des raisons de maintenance ou de force majeure. Start Invest ne pourra être tenu responsable des interruptions de service ni de leurs conséquences.
          </Article>
          <Article numero="9" titre="Données personnelles">
            Le traitement des données personnelles est régi par notre Politique de Confidentialité, disponible à l'adresse <a href="/confidentialite" style={{ color: '#4CAF2E' }}>/confidentialite</a>. Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données.
          </Article>
          <Article numero="10" titre="Modification des CGU">
            Start Invest se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications par email ou via l'application. L'utilisation continue du service après notification vaut acceptation des nouvelles CGU.
          </Article>
          <Article numero="11" titre="Droit applicable">
            Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux français seront compétents.
          </Article>
        </div>
      </div>
      <FooterPublic />
    </div>
  )
}