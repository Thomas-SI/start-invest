import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'
import { useBadgesNonVus } from '../lib/useBadgesNonVus'

export default function Navbar({ page, initiale, photoUrl }) {
  const navigate = useNavigate()
  const t = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [menuOpen, setMenuOpen] = useState(false)
  const { nbNonVus } = useBadgesNonVus()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const liens = [
    ['Mes Finances', '/dashboard'],
    ['Portefeuille', '/portefeuille'],
    ['Investissement', '/investissement'],
    ['Croissance', '/croissance'],
    ['Challenge', '/challenge'],
    ['Guide', '/guide'],
    ['Abonnement', '/abonnement'],
    ['Compte', '/compte'],
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleNavigate = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const Logo = () => (
    <div onClick={() => handleNavigate('/dashboard')} style={{ cursor: 'pointer' }}>
      {t.dark ? (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#E8E8E8', fontFamily: 'Arial Black, sans-serif', fontStyle: 'italic', WebkitTextStroke: '0.5px #E8E8E8' }}>START</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#4CAF2E', fontFamily: 'Arial Black, sans-serif', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 7, color: '#606060', letterSpacing: 0.3 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
      ) : (
        <img src="/logo-clair.jpeg" alt="StartInvest" style={{ height: 105, width: 'auto' }} />
      )}
    </div>
  )

  // ============ VERSION MOBILE ============
  if (isMobile) {
    return (
      <>
        <nav style={{ background: t.nav, borderBottom: `0.5px solid ${t.navBorder}`, padding: '0 16px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative', zIndex: 100 }}>
          <Logo />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, width: 48, height: 48 }}
          >
            <span style={{ width: 22, height: 2, background: t.text, borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: t.text, borderRadius: 2, transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: t.text, borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </nav>

        {menuOpen && (
          <div style={{ position: 'fixed', top: 100, left: 0, right: 0, bottom: 0, background: t.nav, zIndex: 99, display: 'flex', flexDirection: 'column', padding: '20px 0', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 20px', borderBottom: `0.5px solid ${t.navBorder}` }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
              <div style={{ color: t.text, fontSize: 14, fontWeight: 500 }}>Connecté</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
              {liens.map(([l, path]) => (
                <div
                  key={l}
                  onClick={() => handleNavigate(path)}
                  style={{
                    fontSize: 16,
                    color: l === page ? '#4CAF2E' : t.text,
                    padding: '16px 24px',
                    cursor: 'pointer',
                    fontWeight: l === page ? 600 : 400,
                    borderLeft: l === page ? '3px solid #4CAF2E' : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {l}
                  {l === 'Challenge' && nbNonVus > 0 && (
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#E24B4A', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {nbNonVus}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', marginTop: 'auto', borderTop: `0.5px solid ${t.navBorder}` }}>
              <button
                onClick={handleLogout}
                style={{ width: '100%', background: '#034065', color: '#fff', fontSize: 14, fontWeight: 500, padding: '14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // ============ VERSION DESKTOP ============
  return (
    <nav style={{ background: t.nav, borderBottom: `0.5px solid ${t.navBorder}`, padding: '0 20px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <Logo />
      <div style={{ display: 'flex', gap: 2 }}>
        {liens.map(([l, path]) => (
          <div key={l} onClick={() => navigate(path)} style={{ fontSize: 15, color: l === page ? '#4CAF2E' : t.textSecondary, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === page ? 500 : 400, position: 'relative' }}>
            {l}
            {l === 'Challenge' && nbNonVus > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: '50%', background: '#E24B4A', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {nbNonVus}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, color: '#2E7D1E', flexShrink: 0 }}>
  {photoUrl ? <img src={photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initiale}
</div>
        <button onClick={handleLogout} style={{ background: '#034065', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
      </div>
    </nav>
  )
}