import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function Cookies() {
  const navigate = useNavigate()

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
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 40px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#034065', fontStyle: 'italic' }}>START</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
        </div>
        <button onClick={() => navigate(-1)} style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #E0EAE3', background: '#fff', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14, background: '#EAF6E4', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>Légal</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#034065', margin: '0 0 12px' }}>Politique de Gestion des Cookies</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>

          <Article numero="1" titre="Qu'est-ce qu'un cookie ?">
            Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations sur votre navigation et vos préférences.
          </Article>

          <Article numero="2" titre="Les cookies que nous utilisons">
            Start Invest utilise uniquement des <strong>cookies strictement nécessaires</strong> au fonctionnement de l'application. Ces cookies permettent de :<br /><br />
            — Maintenir votre session de connexion<br />
            — Mémoriser vos préférences (thème clair/sombre)<br />
            — Assurer la sécurité de votre compte<br /><br />
            Ces cookies ne peuvent pas être désactivés car ils sont indispensables au bon fonctionnement du service. <strong>Aucun cookie publicitaire ou de tracking n'est utilisé.</strong>
          </Article>

          <Article numero="3" titre="Cookies tiers">
            Start Invest utilise les services suivants qui peuvent déposer des cookies :<br /><br />
            <strong>Supabase</strong> — authentification et stockage sécurisé des données<br />
            <strong>Stripe</strong> — traitement sécurisé des paiements<br /><br />
            Ces cookies sont nécessaires au fonctionnement des services de connexion et de paiement. Ces prestataires disposent de leurs propres politiques de confidentialité.
          </Article>

          <Article numero="4" titre="LocalStorage">
            Start Invest utilise le localStorage de votre navigateur pour mémoriser certaines préférences locales (pages vues, thème d'affichage). Ces données restent sur votre appareil, ne sont pas transmises à nos serveurs et peuvent être supprimées à tout moment depuis les paramètres de votre navigateur.
          </Article>

          <Article numero="5" titre="Durée de conservation">
            — <strong>Cookies de session</strong> : supprimés à la fermeture de votre navigateur<br />
            — <strong>Cookies persistants</strong> (préférences, authentification) : conservés pour une durée maximale de 12 mois
          </Article>

          <Article numero="6" titre="Gestion des cookies">
            Vous pouvez configurer votre navigateur pour refuser ou supprimer les cookies. Cependant, le refus des cookies nécessaires peut empêcher le bon fonctionnement de l'application, notamment la connexion à votre compte.<br /><br />
            Paramètres cookies selon votre navigateur :<br />
            — <strong>Chrome</strong> : Paramètres → Confidentialité → Cookies<br />
            — <strong>Safari</strong> : Préférences → Confidentialité<br />
            — <strong>Firefox</strong> : Paramètres → Vie privée et sécurité
          </Article>

          <Article numero="7" titre="Modifications">
            Start Invest se réserve le droit de modifier cette politique à tout moment. La date de dernière mise à jour est indiquée en haut de ce document.
          </Article>

          <div style={{ marginTop: 40, padding: '20px', background: '#EAF6E4', borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#034065', marginBottom: 8 }}>Questions sur les cookies ?</div>
            <div style={{ fontSize: 13, color: '#4B5563' }}>
              Email : <a href="mailto:contact@start-invest.fr" style={{ color: '#4CAF2E' }}>contact@start-invest.fr</a>
            </div>
          </div>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}