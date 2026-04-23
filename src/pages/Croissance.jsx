import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import { useTheme } from '../lib/ThemeContext'
import { usePremium } from '../lib/usePremium'
import PremiumModal from '../components/PremiumModal'
import PageGuide from '../components/PageGuide'
import { usePageGuide } from '../lib/usePageGuide'

function simulerDCA(capitalInitial, versementMensuel, tauxAnnuel, dureeAnnees) {
  const tauxMensuel = tauxAnnuel / 100 / 12
  const mois = dureeAnnees * 12
  let capital = capitalInitial
  const historique = []
  for (let i = 0; i <= mois; i++) {
    if (i > 0) capital = capital * (1 + tauxMensuel) + versementMensuel
    if (i % 12 === 0) {
      const capitalInvesti = capitalInitial + versementMensuel * i
      historique.push({
        annee: i / 12,
        capitalInvesti: Math.round(capitalInvesti),
        capitalTotal: Math.round(capital),
        interets: Math.round(capital - capitalInvesti),
      })
    }
  }
  return historique
}

export default function Croissance() {
  const t = useTheme()
  const { showGuide, ouvrirGuide, fermerGuide } = usePageGuide()

const GUIDE_CROISSANCE = [
  {
    titre: '✨ La magie des intérêts composés',
    description: 'C\'est le principe le plus puissant en investissement — ton argent génère des intérêts, qui génèrent eux-mêmes des intérêts. Sur 20 ou 30 ans, l\'effet est spectaculaire. Cette page te le montre avec tes propres chiffres.',
  },
  {
    titre: '🎛️ Ajuste les paramètres',
    description: 'Ton montant investissable est directement repris depuis Mes Finances. Ajuste le % de performance annuelle et la durée pour voir différents scénarios. À 7% sur 30 ans, les résultats peuvent surprendre !',
  },
  {
    titre: '💡 PEA vs CTO',
    description: 'Tu te demandes quelle enveloppe choisir ? Utilise le comparateur de fiscalité pour voir la différence concrète entre PEA et CTO sur ton patrimoine final. La fiscalité, c\'est souvent le détail qui fait toute la différence.',
  },
]
  const { isPremium, loading: premiumLoading } = usePremium()
  const [user, setUser] = useState(null)
  const [investissable, setInvestissable] = useState(0)
  const [capitalInitial, setCapitalInitial] = useState(10000)
  const [versement, setVersement] = useState(300)
  const [taux, setTaux] = useState(7)
  const [duree, setDuree] = useState(25)
  const [enveloppe, setEnveloppe] = useState('PEA')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: fin } = await supabase.from('finances').select('*').eq('user_id', user.id).single()
      if (fin) {
        const { data: ech } = await supabase.from('echeances').select('*').eq('user_id', user.id)
        const totalEch = ech ? ech.reduce((acc, e) => acc + (e.montant_annuel / 12), 0) : 0
        const totalRev = (fin.revenus || 0) + (fin.autre_revenu || 0)
        const totalDep = (fin.depenses_fixes || 0) + (fin.depenses_variables || 0)
        const inv = Math.round(totalRev - totalDep - totalEch)
        setInvestissable(inv > 0 ? inv : 0)
        setVersement(inv > 0 ? inv : 300)
      }
    }
    fetchData()
  }, [])

  const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
  const historique = simulerDCA(capitalInitial, versement, taux, duree)
  const derniere = historique[historique.length - 1]
  const fiscalite = enveloppe === 'PEA' ? 0.182 : 0.314
  const capitalApresFisc = derniere ? Math.round(derniere.capitalInvesti + derniere.interets * (1 - fiscalite)) : 0
  const maxVal = derniere?.capitalTotal || 1

  if (premiumLoading) return null

if (!isPremium) {
  return <PremiumModal onClose={() => {}} />
}
  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Croissance" initiale={initiale} />
      <PageGuide
  pageId="croissance"
  titre="Croissance"
  etapes={GUIDE_CROISSANCE}
  forceVisible={showGuide}
  onClose={fermerGuide}
/>
<button
  onClick={ouvrirGuide}
  style={{
    position: 'fixed', bottom: 80, right: 16, zIndex: 100,
    width: 36, height: 36, borderRadius: '50%',
    background: '#1B2E4B', color: '#fff',
    border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}
>
  ?
</button>

      <div style={{ padding: isMobile ? '16px 12px' : '16px 20px', flex: 1 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: isMobile ? 18 : 16, fontWeight: 500, color: t.text }}>Simulateur de croissance</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Projetez votre patrimoine sur le long terme</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: isMobile ? 12 : 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 14 }}>Paramètres</div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
                  <span>Capital initial (€)</span>
                  <span style={{ fontWeight: 500, color: t.text }}>{capitalInitial.toLocaleString('fr-FR')} €</span>
                </div>
                <input type="range" min={0} max={100000} step={500} value={capitalInitial} onChange={e => setCapitalInitial(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
                  <span>Versement mensuel (€)</span>
                  <span style={{ fontWeight: 500, color: '#4CAF2E' }}>{versement.toLocaleString('fr-FR')} €</span>
                </div>
                <input type="range" min={0} max={5000} step={50} value={versement} onChange={e => setVersement(Number(e.target.value))} style={{ width: '100%' }} />
                {investissable > 0 && (
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>
                    Investissable : <span style={{ color: '#4CAF2E', fontWeight: 500 }}>{investissable} €</span>
                    {versement !== investissable && <span onClick={() => setVersement(investissable)} style={{ color: '#1565C0', cursor: 'pointer', marginLeft: 6 }}>Réinitialiser</span>}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
                  <span>Taux annuel (%)</span>
                  <span style={{ fontWeight: 500, color: t.text }}>{taux}%</span>
                </div>
                <input type="range" min={1} max={15} step={0.5} value={taux} onChange={e => setTaux(Number(e.target.value))} style={{ width: '100%' }} />
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4 }}>7% = performance historique moyenne ETF monde</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
                  <span>Durée (années)</span>
                  <span style={{ fontWeight: 500, color: t.text }}>{duree} ans</span>
                </div>
                <input type="range" min={1} max={50} step={1} value={duree} onChange={e => setDuree(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Enveloppe fiscale</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['PEA', 'CTO'].map(e => (
                    <div key={e} onClick={() => setEnveloppe(e)} style={{ flex: 1, textAlign: 'center', padding: '7px', borderRadius: 8, background: enveloppe === e ? '#1B2E4B' : t.bgSecondary, color: enveloppe === e ? '#fff' : t.textSecondary, fontSize: 12, fontWeight: enveloppe === e ? 500 : 400, cursor: 'pointer', border: `0.5px solid ${t.border}` }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: 10 }}>
              {[
                ['Capital investi', `${derniere?.capitalInvesti.toLocaleString('fr-FR')} €`, t.text],
                ['Capital total', `${derniere?.capitalTotal.toLocaleString('fr-FR')} €`, '#4CAF2E'],
                ['Intérêts gagnés', `${derniere?.interets.toLocaleString('fr-FR')} €`, '#4CAF2E'],
                [`Après fiscalité (${enveloppe})`, `${capitalApresFisc.toLocaleString('fr-FR')} €`, '#1565C0'],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500, color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 12 }}>Évolution du capital sur {duree} ans</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {historique.filter((_, i) => i % Math.max(1, Math.floor(historique.length / 8)) === 0 || i === historique.length - 1).map(({ annee, capitalInvesti, capitalTotal, interets }) => (
                  <div key={annee} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 10, color: t.textMuted, width: isMobile ? 32 : 40, flexShrink: 0 }}>An {annee}</div>
                    <div style={{ flex: 1, position: 'relative', height: 20 }}>
                      <div style={{ position: 'absolute', left: 0, top: 4, height: 12, borderRadius: 3, background: '#E3F0FF', width: `${capitalInvesti / maxVal * 100}%` }} />
                      <div style={{ position: 'absolute', left: `${capitalInvesti / maxVal * 100}%`, top: 4, height: 12, borderRadius: '0 3px 3px 0', background: '#4CAF2E', width: `${interets / maxVal * 100}%` }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: t.text, width: isMobile ? 70 : 90, textAlign: 'right', flexShrink: 0 }}>{capitalTotal.toLocaleString('fr-FR')} €</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: t.textMuted }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E3F0FF' }} />Capital investi
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: t.textMuted }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4CAF2E' }} />Intérêts composés
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterApp />
    </div>
  )
}