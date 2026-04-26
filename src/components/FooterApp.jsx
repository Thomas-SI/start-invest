import { useNavigate } from 'react-router-dom'

export default function FooterApp() {
  const navigate = useNavigate()

  return (
    <footer style={{ background: '#034065', padding: '24px 20px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* AVERTISSEMENT */}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, textAlign: 'center', marginBottom: 16 }}>
          Les informations présentées sont à titre éducatif uniquement. Elles ne constituent pas un conseil en investissement. L'investissement comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures.
        </div>

        {/* LIENS LÉGAUX */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          {[
            ['Mentions légales', '/mentions-legales'],
            ['CGV', '/cgv'],
            ['CGU', '/cgu'],
            ['Confidentialité', '/confidentialite'],
            ['Réclamation', '/reclamation'],
            ['Cookies', '/cookies'],
          ].map(([label, path], i, arr) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                onClick={() => navigate(path)}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {label}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>|</span>}
            </span>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
          <img src="https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/logo-bleu-start-invest.png" alt="StartInvest" style={{ height: 40, width: 'auto' }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Start Invest — Tous droits réservés</div>
        </div>

      </div>
    </footer>
  )
}