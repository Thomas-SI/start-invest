import { useNavigate } from 'react-router-dom'

export default function FooterPublic() {
  const navigate = useNavigate()
  
  return (
    <footer style={{ background: '#034065', padding: '40px 40px 28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* CONTACT + RÉSEAUX */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Une question ? Contactez-nous :</div>
          <a href="mailto:contact@start-invest.fr" style={{ fontSize: 16, fontWeight: 600, color: '#fff', textDecoration: 'none' }}>contact@start-invest.fr</a>
          <div style={{ marginTop: 12 }}>
            <a href="https://instagram.com/startinvest.fr" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 16px', textDecoration: 'none' }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>@startinvest.fr</span>
            </a>
          </div>
        </div>

        {/* AVERTISSEMENT LÉGAL */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Avertissement légal</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            Les informations présentées dans cette application sont partagées à titre purement éducatif et pédagogique. Elles ne constituent en aucun cas un conseil en investissement, une sollicitation à l'achat ou à la vente d'instruments financiers. L'investissement comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. Start Invest ne pourra être tenu responsable des décisions prises par l'utilisateur.
          </div>
        </div>

        {/* LIENS LÉGAUX */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
          {[
            ['Mentions légales', '/mentions-legales'],
            ['CGV', '/cgv'],
            ['CGU', '/cgu'],
            ['Politique de confidentialité', '/confidentialite'],
            ['Politique de réclamation', '/reclamation'],
            ['Gestion des cookies', '/cookies'],
          ].map(([label, path], i, arr) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                onClick={() => navigate(path)}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {label}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>|</span>}
            </span>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/logo-bleu-start-invest.png" alt="StartInvest" style={{ height: 40, width: 'auto' }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Start Invest — Tous droits réservés</div>
        </div>

      </div>
    </footer>
  )
}