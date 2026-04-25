import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CookieBanner() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accepter = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const refuser = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#1B2E4B', borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
          🍪 Nous utilisons des cookies
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          Start Invest utilise uniquement des cookies nécessaires au fonctionnement du service. Aucun cookie publicitaire.{' '}
          <span
            onClick={() => navigate('/cookies')}
            style={{ color: '#4CAF2E', cursor: 'pointer', textDecoration: 'underline' }}
          >
            En savoir plus
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={refuser}
          style={{
            padding: '8px 16px', borderRadius: 8,
            border: '0.5px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Refuser
        </button>
        <button
          onClick={accepter}
          style={{
            padding: '8px 20px', borderRadius: 8,
            border: 'none', background: '#4CAF2E',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  )
}