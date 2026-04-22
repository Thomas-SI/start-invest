import { useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/ThemeContext'

export default function PremiumModal({ onClose }) {
  const navigate = useNavigate()
  const t = useTheme()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.bgCard,
          border: '1px solid #4CAF2E55',
          borderRadius: 20,
          padding: '32px 28px',
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }}>⭐</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>
          Fonctionnalité Premium
        </div>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 28, lineHeight: 1.6 }}>
          Cette page est réservée aux membres Premium. Abonne-toi pour débloquer toutes les fonctionnalités.
        </div>
        <button
          onClick={() => { navigate('/abonnement'); onClose(); }}
          style={{
            width: '100%', padding: '13px', borderRadius: 12,
            border: 'none', background: '#4CAF2E',
            color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10,
          }}
        >
          Voir les offres →
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '11px', borderRadius: 12,
            border: `0.5px solid ${t.border}`, background: 'transparent',
            color: t.textMuted, fontSize: 14, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  )
}