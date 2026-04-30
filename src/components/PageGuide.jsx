import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

export default function PageGuide({ pageId, titre, etapes, forceVisible, onClose }) {
  const t = useTheme()
  const [visible, setVisible] = useState(false)
  const [etape, setEtape] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profil } = await supabase
        .from('profils')
        .select('id, pages_vues')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!profil) {
        setVisible(true)
        setLoading(false)
        return
      }

      const pagesVues = profil.pages_vues ?? []
      if (!pagesVues.includes(pageId)) {
        setVisible(true)
        const newPages = [...pagesVues, pageId]
        await supabase
          .from('profils')
          .update({ pages_vues: newPages })
          .eq('user_id', user.id)
      }
      setLoading(false)
    }
    check()
  }, [pageId])

  const handleClose = () => {
    setVisible(false)
    setEtape(0)
    if (onClose) onClose()
  }

  if (loading || (!visible && !forceVisible)) return null

  const current = etapes[etape]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        width: '100%',
        maxWidth: 480,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0' }}>
          {etapes.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= etape ? '#4CAF2E' : t.border,
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#4CAF2E', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
            {titre} · Étape {etape + 1}/{etapes.length}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: t.text, marginBottom: 12 }}>
            {current.titre}
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
            {current.description}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleClose} style={{ fontSize: 12, color: t.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Passer
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {etape > 0 && (
                <button
                  onClick={() => setEtape(e => e - 1)}
                  style={{ padding: '9px 18px', borderRadius: 9, border: `0.5px solid ${t.border}`, background: t.bgSecondary, fontSize: 13, color: t.textMuted, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  ← Retour
                </button>
              )}
              <button
                onClick={() => etape < etapes.length - 1 ? setEtape(e => e + 1) : handleClose()}
                style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: '#4CAF2E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {etape < etapes.length - 1 ? 'Suivant →' : 'Commencer !'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}