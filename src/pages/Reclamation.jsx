import { useNavigate } from 'react-router-dom'
import FooterPublic from '../components/FooterPublic'

export default function Reclamation() {
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
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1B2E4B', margin: '0 0 12px' }}>Politique de Réclamation</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Dernière mise à jour : janvier 2026</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0EAE3', padding: '40px' }}>

          <Article numero="1" titre="Notre engagement">
            Start Invest s'engage à traiter toute réclamation de manière sérieuse, équitable et dans les meilleurs délais. La satisfaction de nos utilisateurs est notre priorité.
          </Article>

          <Article numero="2" titre="Comment soumettre une réclamation">
            Toute réclamation doit être adressée par email à <strong>contact@start-invest.fr</strong> en précisant :<br /><br />
            — Vos nom et prénom<br />
            — Votre adresse email de compte<br />
            — La description détaillée du problème rencontré<br />
            — La date à laquelle le problème s'est produit<br />
            — Tout justificatif utile (capture d'écran, référence de paiement...)
          </Article>

          <Article numero="3" titre="Délai de traitement">
            Nous accusons réception de votre réclamation dans un délai de <strong>48 heures ouvrées</strong>. Une réponse complète vous sera apportée dans un délai maximum de <strong>10 jours ouvrés</strong> à compter de la réception de votre réclamation.
          </Article>

          <Article numero="4" titre="Remboursement">
            En cas de litige concernant un paiement, Start Invest s'engage à étudier votre demande dans un délai de 10 jours ouvrés. Les remboursements accordés sont effectués via le même moyen de paiement utilisé lors de l'achat, dans un délai de 14 jours.
          </Article>

          <Article numero="5" titre="Médiation">
            Si votre réclamation n'a pas été résolue de manière satisfaisante, vous pouvez recourir gratuitement à un médiateur de la consommation. Les coordonnées du médiateur compétent seront communiquées prochainement.<br /><br />
            Dans l'attente, vous pouvez contacter la plateforme européenne de règlement en ligne des litiges :<br />
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF2E' }}>https://ec.europa.eu/consumers/odr</a>
          </Article>

          <Article numero="6" titre="Voies de recours">
            En cas de désaccord persistant, vous conservez la possibilité de saisir les juridictions compétentes conformément au droit français.
          </Article>

          <div style={{ marginTop: 40, padding: '20px', background: '#EAF6E4', borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E4B', marginBottom: 8 }}>📬 Nous contacter</div>
            <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
              Email : <a href="mailto:contact@start-invest.fr" style={{ color: '#4CAF2E' }}>contact@start-invest.fr</a><br />
              Start Invest — 44 Rue Pasquier, 75008 Paris, France<br />
              Réponse garantie sous 48h ouvrées.
            </div>
          </div>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}