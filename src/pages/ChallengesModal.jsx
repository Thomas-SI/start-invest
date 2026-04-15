import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const METRONOME_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/AB94501C-5932-4B4C-93F1-D1CD5A4BAA25.png'

const BADGES_DATA = [
  { slug: 'premier-pas', nom: 'Premier Pas', emoji: '🌱', desc: 'Dès l\'inscription sur StartInvest.', message: 'Bienvenue chez Start Invest.', tag: 'Automatique', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
  { slug: 'grand-saut', nom: 'Le Grand Saut', emoji: '🚀', desc: 'Acheter son premier ETF.', message: 'Tu n\'es plus spectateur, tu es le pilote de ton futur.', tag: 'Premier achat', tagColor: '#2E7D1E', tagBg: '#EAF6E4' },
  { slug: 'metronome', img: METRONOME_URL, nom: 'Le Métronome', desc: 'Investir régulièrement chaque mois.', message: 'La magie des intérêts composés adore ta régularité.', tag: 'Bronze → Platine', tagColor: '#854F0B', tagBg: '#FFF0DC' },
  { slug: 'main-de-fer', nom: 'Main de Fer', emoji: '🗿', desc: '6 mois sans aucune vente.', message: 'Le calme est une compétence.', tag: 'Discipline', tagColor: '#444441', tagBg: '#F0F0F0' },
  { slug: 'architecte', nom: 'L\'Architecte', emoji: '🏗️', desc: 'Posséder 3 ETF différents.', message: 'Ton patrimoine est maintenant solide et diversifié.', tag: 'Diversification', tagColor: '#185FA5', tagBg: '#E6F1FB' },
  { slug: 'cap', nom: 'Cap des X€', emoji: '💰', desc: 'Atteindre un palier d\'investissement.', message: 'Le premier palier est le plus dur. La machine est lancée.', tag: 'Bronze → Légendaire', tagColor: '#633806', tagBg: '#FFF8DC' },
  { slug: 'vroum-vroum', nom: 'Vroum Vroum', emoji: '⚡', desc: 'S\'abonner à StartInvest Premium.', message: 'Je vois déjà l\'avenir.', tag: 'Premium', tagColor: '#534AB7', tagBg: '#EEEDFE' },
]

export default function ChallengesModal({ onClose }) {
  const [slugsObtenus, setSlugsObtenus] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccomplissements = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('accomplissements').select('slug').eq('user_id', user.id)
        if (data) setSlugsObtenus(new Set(data.map(a => a.slug)))
      }
      setLoading(false)
    }
    fetchAccomplissements()
  }, [])

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: '#fff', borderRadius: 20, width: 680, maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(27,46,75,0.15)', fontFamily: 'inherit' }}>

        <div style={{ padding: '24px 28px 20px', borderBottom: '0.5px solid #E0EAE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2E4B' }}>Livret d'accomplissements</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {loading ? 'Chargement...' : `${slugsObtenus.size} / ${BADGES_DATA.length} débloqués`}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
        </div>

        {!loading && (
          <div style={{ padding: '12px 28px', borderBottom: '0.5px solid #E0EAE3', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
              <span>Progression globale</span>
              <span style={{ color: '#4CAF2E', fontWeight: 500 }}>{Math.round((slugsObtenus.size / BADGES_DATA.length) * 100)}%</span>
            </div>
            <div style={{ background: '#F0F0F0', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: '#4CAF2E', width: `${Math.round((slugsObtenus.size / BADGES_DATA.length) * 100)}%`, transition: 'width 0.5s' }} />
            </div>
          </div>
        )}

        <div style={{ overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BADGES_DATA.map(({ slug, emoji, img, nom, desc, message, tag, tagColor, tagBg }) => {
            const obtenu = slugsObtenus.has(slug)
            return (
              <div key={slug} style={{ background: obtenu ? '#F6FFF3' : '#F9FAFB', border: `0.5px solid ${obtenu ? '#4CAF2E' : '#E0EAE3'}`, borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: obtenu ? tagBg : '#F0F0F0', border: `2px solid ${obtenu ? tagColor : '#E0EAE3'}`, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {obtenu
                    ? img ? <img src={img} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 24 }}>{emoji}</span>
                    : <span style={{ fontSize: 20, color: '#C0C0C0' }}>?</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: obtenu ? '#1B2E4B' : '#9CA3AF' }}>{nom}</div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: obtenu ? tagBg : '#F0F0F0', color: obtenu ? tagColor : '#9CA3AF', fontWeight: 500 }}>
                      {obtenu ? tag : 'Verrouillé'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: obtenu ? 6 : 0 }}>{desc}</div>
                  {obtenu && <div style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', borderLeft: `2px solid ${tagColor}`, paddingLeft: 8 }}>"{message}"</div>}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}