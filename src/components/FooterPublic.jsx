export default function FooterPublic() {
  return (
    <footer style={{ background: '#1B2E4B', padding: '40px 40px 28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Une question ? Contactez moi :</div>
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
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Avertissement legal</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            Les informations presentees dans cette application sont partagees a titre purement educatif et pedagogique. Elles ne constituent en aucun cas un conseil en investissement, une sollicitation a l achat ou a la vente d instruments financiers. L investissement comporte des risques de perte en capital. Les performances passees ne prejudgent pas des performances futures. Thomas Start-Invest ne pourra etre tenu responsable des decisions prises par l utilisateur. Les simulations et calculs presentes sont bases sur des hypotheses et ne garantissent aucun resultat reel.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="/mentions-legales" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>Mentions Legales</a>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>|</span>
            <a href="/confidentialite" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>Politique de Confidentialite</a>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>|</span>
            <a href="/cgv" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>CGV</a>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Copyright {new Date().getFullYear()} StartInvest</div>
        </div>
      </div>
    </footer>
  )
}
