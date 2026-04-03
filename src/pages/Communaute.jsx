import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const discussions = [
  { id: 1, auteur: 'Alex L.', initiales: 'AL', bg: '#EAF6E4', color: '#2E7D1E', titre: 'Comment diversifier à 200€/mois avec le DCA ?', contenu: 'Je débute avec 200€/mois et je ne sais pas comment répartir entre MSCI World et S&P 500. Des conseils ?', temps: 'Il y a 12 min', likes: 8, reponses: 5, tag: 'Débutant' },
  { id: 2, auteur: 'Sara R.', initiales: 'SR', bg: '#E3F0FF', color: '#0C447C', titre: 'MSCI World vs S&P 500 sur 10 ans — mon analyse', contenu: 'Après 6 mois de recherche, voici ma comparaison détaillée entre les deux ETF phares. Le MSCI World offre une meilleure diversification géographique...', temps: 'Il y a 1h', likes: 24, reponses: 12, tag: 'Analyse' },
  { id: 3, auteur: 'Thomas M.', initiales: 'TM', bg: '#EBE9FC', color: '#3C3489', titre: 'Mon retour après 6 mois de DCA — thread complet', contenu: 'J\'ai commencé le DCA en juillet avec 300€/mois sur le PEA. Voici mon bilan après 6 mois...', temps: 'Il y a 3h', likes: 41, reponses: 18, tag: 'Retour d\'expérience' },
  { id: 4, auteur: 'Marie K.', initiales: 'MK', bg: '#FFF8E6', color: '#BA7517', titre: 'PEA ou CTO pour commencer ?', contenu: 'Je suis perdue entre PEA et CTO. Le PEA a des avantages fiscaux mais est bloqué 5 ans...', temps: 'Il y a 5h', likes: 15, reponses: 9, tag: 'Question' },
  { id: 5, auteur: 'Lucas B.', initiales: 'LB', bg: '#FCEBEB', color: '#A32D2D', titre: 'L\'impact des frais sur le long terme — calcul concret', contenu: 'On sous-estime souvent l\'impact des frais. Un TER de 0.2% vs 0.07% sur 30 ans...', temps: 'Il y a 1j', likes: 33, reponses: 7, tag: 'Éducation' },
]

const tagColors = {
  'Débutant': { bg: '#EAF6E4', color: '#2E7D1E' },
  'Analyse': { bg: '#E3F0FF', color: '#0C447C' },
  "Retour d'expérience": { bg: '#EBE9FC', color: '#3C3489' },
  'Question': { bg: '#FFF8E6', color: '#BA7517' },
  'Éducation': { bg: '#E8EEF6', color: '#1B2E4B' },
}

export default function Communaute() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [filtre, setFiltre] = useState('Tous')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const filtres = ['Tous', 'Débutant', 'Analyse', "Retour d'expérience", 'Question', 'Éducation']
  const discussionsFiltrees = filtre === 'Tous' ? discussions : discussions.filter(d => d.tag === filtre)

  return (
    <div style={{ background: '#F4F7F5', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #E0EAE3', padding: '0 20px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#1B2E4B', fontStyle: 'italic' }}>START</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#4CAF2E', fontStyle: 'italic' }}>INVEST</span>
          </div>
          <div style={{ fontSize: 8, color: '#1B2E4B', opacity: .5 }}>Bâtir son mental, <span style={{ color: '#4CAF2E' }}>construire son avenir.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[['Finances', '/dashboard'], ['Explorer', '/explorer'], ['Portefeuille', '/portefeuille'], ['Communauté', '/communaute'], ['Concentration', '/concentration'], ['Abonnement', '/abonnement'], ['Compte', '/compte']].map(([l, path]) => (
            <div key={l} onClick={() => navigate(path)} style={{ fontSize: 12, color: l === 'Communauté' ? '#4CAF2E' : '#6B7280', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: l === 'Communauté' ? 500 : 400 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#2E7D1E' }}>{initiale}</div>
          <button onClick={handleLogout} style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#1B2E4B' }}>Communauté</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Échangez avec d'autres investisseurs DCA</div>
          </div>
          <button style={{ background: '#4CAF2E', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Nouvelle discussion
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {filtres.map(f => (
            <div key={f} onClick={() => setFiltre(f)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: filtre === f ? '#1B2E4B' : '#fff', color: filtre === f ? '#fff' : '#6B7280', border: '0.5px solid #E0EAE3', cursor: 'pointer' }}>{f}</div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {discussionsFiltrees.map(({ id, auteur, initiales, bg, color, titre, contenu, temps, likes, reponses, tag }) => (
            <div key={id} style={{ background: '#fff', border: '0.5px solid #E0EAE3', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{initiales}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#1B2E4B' }}>{auteur}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: tagColors[tag]?.bg, color: tagColors[tag]?.color }}>{tag}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>{temps}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1B2E4B', marginBottom: 4 }}>{titre}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contenu}</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="#9CA3AF" strokeWidth="1.3" fill="none"/></svg>
                      {likes}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M14 8c0 3.3-2.7 6-6 6H3l-1 2V8c0-3.3 2.7-6 6-6s6 2.7 6 6z" stroke="#9CA3AF" strokeWidth="1.3" fill="none"/></svg>
                      {reponses} réponses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}