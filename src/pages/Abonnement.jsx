import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import { loadStripe } from '@stripe/stripe-js'
import { usePremium } from '../lib/usePremium'

const STRIPE_PUBLIC_KEY = 'pk_live_51SvbH1GMNsMdNOBmdNWY6SVPNYlcNEfA8m0cZDO82JaDqFg3AaYeMRfIlAcQcNOWG3aaEvmYGRQcyf7gv39lOUY200Xh9800Es'
const PRICE_IDS = {
  mensuel: 'price_1TOLROGMNsMdNOBmk8HGZWfh',
  annuel: 'price_1TOLSfGMNsMdNOBmG0Ta3VM9',
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

export default function Abonnement() {
  const navigate = useNavigate()
  const t = useTheme()
  const [user, setUser] = useState(null)
  const [annuel, setAnnuel] = useState(true)
  const { isPremium } = usePremium()
  const [portalUrl, setPortalUrl] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [photoUrl, setPhotoUrl] = useState(null)

  const plans = [
    {
      id: 'gratuit', nom: 'Gratuit', actuel: !isPremium,
      prixMensuel: '0€', prixAnnuel: '0€',
      periodeMensuel: 'pour toujours', periodeAnnuel: 'pour toujours',
      pages: ['Mes Finances', 'Challenge', 'Guide', 'Abonnement', 'Compte'],
      features: [
        { label: 'Suivi finances complet', inclus: true },
        { label: 'Capacité d\'épargne personnalisé', inclus: true },
        { label: 'Vu des challenges', inclus: true },
        { label: 'Abonnement avec des amis', inclus: true },
        { label: 'Guide complet de l\'investissement', inclus: true },
        { label: 'Tableau d\'allocations', inclus: false },
        { label: 'Plan de virement par comptes', inclus: false },
        { label: 'Données ETF en temps réel', inclus: false },
        { label: 'Projection de croissance', inclus: false },
        
      ]
    },
    {
      id: 'premium', nom: 'Premium', actuel: isPremium, recommande: true,
      prixMensuel: '7.99€', prixAnnuel: '67€',
      periodeMensuel: 'par mois', periodeAnnuel: 'par an · économisez 29%',
      pages: ['Mes Finances', 'Portefeuille', 'Investissement', 'Croissance', 'Challenge', 'Guide', 'Abonnement', 'Compte'],
      features: [
        { label: 'Suivi finances complet', inclus: true },
        { label: 'Capacité d\'épargne personnalisé', inclus: true },
        { label: 'Tableau d\'allocations', inclus: true },
        { label: 'Plan de virement par comptes', inclus: true },
        { label: 'Journal suivi d\'investissement', inclus: true },
        { label: 'Données ETF en temps réel', inclus: true },
        { label: 'Projection de croissance', inclus: true },
        { label: 'Accès challenges et récompenses', inclus: true },
        { label: 'Abonnement avec des amis', inclus: true },
        { label: 'Guide complet de l\'investissement', inclus: true },
        
      ]
    },
  ]

  useEffect(() => {
    if (!isPremium) return
    const preloadPortal = async () => {
      const { data } = await supabase.functions.invoke('create-portal-session', {})
      if (data?.url) setPortalUrl(data.url)
    }
    preloadPortal()
  }, [isPremium])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setAlertMsg('🎉 Paiement réussi ! Ton abonnement Premium est actif.')
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (params.get('canceled') === 'true') {
      setAlertMsg('Paiement annulé.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setPhotoUrl(user.user_metadata?.photo_url || null)
    }
  }
  fetchUser()
}, [])

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non connecté')
      const priceId = annuel ? PRICE_IDS.annuel : PRICE_IDS.mensuel
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      })
      if (error || !data?.url) throw new Error(error?.message ?? 'Erreur lors de la création de la session')
      window.location.href = data.url
    } catch (err) {
      alert(err.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Abonnement" initiale={initiale} photoUrl={photoUrl} />

      <div style={{ padding: isMobile ? '20px 12px' : '24px 20px', flex: 1 }}>

        {alertMsg && (
          <div style={{ background: '#034065', border: '1px solid #ffffff22', borderRadius: 12, padding: '14px 20px', marginBottom: 24, color: '#ffffff', fontSize: 14, textAlign: 'center' }}>
            {alertMsg}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ background: '#034065', borderRadius: 12, padding: '12px 20px', marginBottom: 16, display: 'inline-block' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
              Un abonnement pensé pour récompenser la discipline.
            </div>
          </div>
         <div style={{ textAlign: 'justify', fontSize: 13, color: t.textMuted, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 10px', padding: isMobile ? '0 8px' : '0' }}>
  Après 10 ans, l'application devient gratuite et vos performances s'envolent. Commencez à bâtir votre futur dès aujourd'hui, le temps est votre meilleur allié. Une application ludique et éducative, sans être expert. Un abonnement juste, pour toutes les personnes motivés, rentabilisé grâce à vos efforts.
</div>

{/* TABLEAU DÉGRESSIF */}
<div style={{ maxWidth: 480, margin: '0 auto 16px', padding: isMobile ? '0 8px' : '0' }}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
    {[
      ['Année 1', '67€'], ['Année 6', '30€'],
      ['Année 2', '59€'], ['Année 7', '22€'],
      ['Année 3', '52€'], ['Année 8', '15€'],
      ['Année 4', '45€'], ['Année 9', '7,50€'],
      ['Année 5', '37€'], ['Année 10', '🎉 Gratuit'],
    ].map(([annee, prix]) => (
      <div key={annee} style={{ display: 'flex', justifyContent: 'space-between', background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
        <span style={{ color: t.textMuted }}>{annee}</span>
        <span style={{ color: prix === '🎉 Gratuit' ? '#4CAF2E' : t.text, fontWeight: 600 }}>{prix}</span>
      </div>
    ))}
  </div>
</div>

<div style={{ textAlign: 'justify', fontSize: 13, color: t.textMuted, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 10px', padding: isMobile ? '0 8px' : '0' }}>
  À 7% de moyenne annuelle (ce qui est très conservateur), votre abonnement est remboursé à partir de 80€/mois investi la 1ère année, et seulement 35€/mois dès la 2ème. C'est un cadeau pour construire votre avenir sans vous ruiner en frais. Transparence, aucun frais cachés, juste un abonnement.
</div>
<div style={{ textAlign: 'justify', fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.7, maxWidth: 480, margin: '10px auto 20px', padding: isMobile ? '0 8px' : '0' }}>
  N'attendez plus ! Profitez de 15 jours d'essai gratuit avant l'abonnement.
</div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))', gap: 20, maxWidth: 780, margin: '0 auto' }}>

          {plans.map(({ id, nom, actuel, recommande, features, pages, prixMensuel, prixAnnuel, periodeMensuel, periodeAnnuel }) => {
            const prix = annuel ? prixAnnuel : prixMensuel
            const periode = annuel ? periodeAnnuel : periodeMensuel
            return (
              <div key={id} style={{ background: recommande ? '#034065' : t.bgCard, border: `${recommande ? '2px' : '0.5px'} solid ${recommande ? '#4CAF2E' : t.border}`, borderRadius: 16, padding: isMobile ? 20 : 24, display: 'flex', flexDirection: 'column' }}>

                {/* BADGE */}
                <div style={{ marginBottom: 16 }}>
                  {actuel && <div style={{ background: isPremium ? '#4CAF2E' : t.bgSecondary, color: isPremium ? '#fff' : t.textMuted, fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>✓ Plan actuel</div>}
                </div>

                {/* NOM + PRIX */}
<div style={{ fontSize: 18, fontWeight: 600, color: recommande ? '#fff' : t.text, marginBottom: 4 }}>{nom}</div>
{recommande && (
  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 30, padding: '4px 6px', marginBottom: 10 }}>
    <button onClick={() => setAnnuel(false)} style={{ padding: '4px 12px', borderRadius: 20, border: 'none', background: !annuel ? '#fff' : 'transparent', color: !annuel ? '#034065' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>Mensuel</button>
    <button onClick={() => setAnnuel(true)} style={{ padding: '4px 12px', borderRadius: 20, border: 'none', background: annuel ? '#fff' : 'transparent', color: annuel ? '#034065' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4 }}>
      Annuel
      <span style={{ fontSize: 9, background: '#4CAF2E', color: '#fff', padding: '1px 5px', borderRadius: 10, fontWeight: 600 }}>-29%</span>
    </button>
  </div>
)}
<div style={{ fontSize: 32, fontWeight: 700, color: recommande ? '#fff' : t.text, marginBottom: 2 }}>{prix}</div>
                <div style={{ fontSize: 11, color: recommande ? 'rgba(255,255,255,0.5)' : t.textMuted, marginBottom: 20 }}>{periode}</div>

                {/* PAGES ACCESSIBLES */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: recommande ? 'rgba(255,255,255,0.5)' : t.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Pages accessibles</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {pages.map(p => (
                      <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: recommande ? 'rgba(255,255,255,0.1)' : t.bgSecondary, color: recommande ? '#fff' : t.text, border: `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : t.border}` }}>{p}</span>
                    ))}
                  </div>
                </div>

                {/* SÉPARATEUR */}
                <div style={{ height: 0.5, background: recommande ? 'rgba(255,255,255,0.1)' : t.border, marginBottom: 16 }} />

                {/* FONCTIONNALITÉS */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {features.map(({ label, inclus }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: inclus ? (recommande ? '#fff' : t.text) : (recommande ? 'rgba(255,255,255,0.25)' : t.textMuted) }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: inclus ? (recommande ? 'rgba(76,175,46,0.3)' : '#EAF6E4') : 'transparent', border: inclus ? 'none' : `0.5px solid ${recommande ? 'rgba(255,255,255,0.15)' : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {inclus && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="#4CAF2E" strokeWidth="1.2" strokeLinecap="round"/></svg>}
                      </div>
                      {label}
                    </div>
                  ))}
                </div>

                {/* BOUTON */}
                <button
                  onClick={() => {
                    if (actuel && !isPremium) return
                    if (isPremium && id === 'gratuit') { if (portalUrl) window.location.href = portalUrl; return }
                    if (actuel && isPremium) return
                    handleCheckout()
                  }}
                  disabled={(actuel && !isPremium) || (actuel && isPremium) || (isPremium && id === 'gratuit' && !portalUrl) || checkoutLoading}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10,
                    border: `0.5px solid ${actuel ? t.border : isPremium && id === 'gratuit' ? t.border : 'transparent'}`,
                    background: actuel && isPremium ? 'transparent' : actuel ? 'transparent' : isPremium && id === 'gratuit' ? 'transparent' : '#4CAF2E',
                    color: actuel ? t.textMuted : isPremium && id === 'gratuit' ? t.text : '#fff',
                    fontSize: 13, fontWeight: 500,
                    cursor: actuel ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    opacity: checkoutLoading || (isPremium && id === 'gratuit' && !portalUrl) ? 0.7 : 1
                  }}
                >
                  {actuel && isPremium
                    ? '✓ Plan actuel'
                    : actuel && !isPremium
                      ? 'Plan actuel'
                      : isPremium && id === 'gratuit'
                        ? portalUrl ? 'Gérer mon abonnement →' : 'Chargement...'
                        : checkoutLoading ? 'Chargement...' : `Passer à ${nom} →`}
                </button>

              </div>
            )
          })}
        </div>
      </div>
      <FooterApp />
    </div>
  )
}