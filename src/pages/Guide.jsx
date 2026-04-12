import { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'

const PDF_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Guide%20Start%20Invest%20V2.pdf'

const CONTENU = [
  { page: 1, texte: "START INVEST GUIDE DE L'INVESTISSEUR DÉBUTANT Bâtir son mental pour construire son avenir. Ce guide a été conçu pour les utilisateurs de l'application Start Invest. Chaque fiche est claire, simple et directement actionnable. Aucun jargon inutile — uniquement ce que tu as besoin de savoir pour commencer à investir intelligemment." },
  { page: 2, texte: "SOMMAIRE 01 Comprendre l'environnement L'inflation Le piège du Livret A Le risque de ne pas investir Le mythe du bon moment 02 Stratégies d'investissement Lump Sum vs DCA L'effet boule de neige Les intérêts composés Commencer tôt 03 Choisir sa banque Banques classiques vs en ligne CTO vs PEA Comparatif des meilleures plateformes 04 Les bases essentielles Le matelas de sécurité La fiscalité complète Les ETF La diversification Les frais 05 Passer à l'action Comment et où investir La routine de 15 minutes Le rééquilibrage" },
  { page: 3, texte: "PARTIE 01 Comprendre l'Environnement. Avant d'investir le moindre euro, comprends pourquoi ne pas agir est déjà une décision — et souvent la pire. 1.1 L'ennemi invisible : l'inflation. L'inflation, c'est l'augmentation générale des prix chaque année. En France, elle tourne autour de 2 à 3% par an. Sur le long terme, l'effet est dévastateur pour ton épargne. 10 000€ immobilisés valent 8 200€ dans 10 ans et 6 730€ dans 20 ans. 1.2 Le piège du Livret A. Le Livret A rapporte actuellement 1,7% par an. Si l'inflation dépasse ce taux, ton argent perd du pouvoir d'achat chaque année malgré les intérêts. Le Livret A reste utile uniquement pour ton matelas de sécurité, pas pour investir. 1.3 Le risque de ne pas prendre de risque. Ne pas investir n'est pas la solution la plus sûre. Le vrai risque c'est de se réveiller dans 20 ans et de réaliser que tes économies ne permettent plus de maintenir ton niveau de vie. 1.4 Le mythe du bon moment. Personne ne connaît le bon moment pour investir. Les études montrent que rester investi en permanence bat systématiquement le market timing sur le long terme. Le temps passé sur le marché bat toujours le timing du marché." },
  { page: 5, texte: "PARTIE 02 Stratégies d'Investissement. 2.1 Lump Sum vs DCA. Lump Sum : tu investis tout d'un coup, maximise le temps sur le marché. DCA investissement régulier : tu investis un montant fixe chaque mois, réduit le risque de mal timing, accessible avec petit budget. Pour un débutant, le DCA est la stratégie recommandée. Simple, régulier, efficace sur le long terme. 2.2 L'effet boule de neige et les intérêts composés. Les intérêts composés : tes intérêts génèrent eux-mêmes des intérêts. 100€/mois à 8% : 18 417€ après 10 ans, 59 295€ après 20 ans, 150 030€ après 30 ans. 2.3 L'importance de commencer tôt. Commencer à 25 ans avec 100€/mois donne 351 000€ à 65 ans. Commencer à 35 ans donne 150 000€. Commencer à 45 ans donne seulement 58 000€." },
  { page: 7, texte: "PARTIE 03 Choisir sa Banque. 3.1 Banques classiques vs banques en ligne. Les banques classiques coûtent 5 à 25€/mois avec des frais de courtage de 0,5 à 1,5%. Les banques en ligne sont gratuites avec des frais de 0,1 à 0,5%. 3.2 CTO vs PEA. CTO compte-titres ordinaire : plafond illimité, flat tax 31,4% sur chaque gain, tous produits disponibles. PEA plan épargne en actions : plafond 150 000€, exonéré d'IR après 5 ans, actions et ETF européens uniquement. Stratégie recommandée : ouvre un PEA en priorité pour l'avantage fiscal, et complète avec un CTO. 3.3 Comparatif plateformes. Bourso Bank PEA CTO 0% ETF sélectionnés. Fortuneo PEA CTO. Bourse Direct PEA CTO 0,99€ par ordre. Trade Republic CTO 1€ par ordre. Degiro CTO dès 0,50€. Interactive Brokers CTO dès 0€. Linxea Assurance-vie 0% sur UC." },
  { page: 9, texte: "PARTIE 04 Les Bases Essentielles. 4.1 Le matelas de sécurité. Le matelas de sécurité c'est une somme d'argent liquide accessible immédiatement pour faire face aux imprévus sans toucher à tes investissements. 4.2 Combien mettre de côté. Entre 3 et 12 mois de charges fixes. Un salarié en CDI peut se contenter de 3 mois. Un freelance préférera 6 à 12 mois. 4.3 Où placer. Livret A à 1,7% idéal, LDDS à 1,7% complément, LEP à 3,5% si éligible. 4.4 La fiscalité flat tax PFU. Impôt sur le revenu 12,8% + prélèvements sociaux CSG CRDS 18,6% = total 31,4%. Le PEA après 5 ans : gains imposés uniquement à 18,6%. Déclarer les comptes étrangers Degiro Trade Republic Interactive Brokers via formulaire 3916. 4.5 Qu'est-ce qu'un ETF. Un ETF Exchange Traded Fund est un fonds qui réplique la performance d'un indice boursier. Un ETF World investit dans les 1 500 plus grandes entreprises mondiales en un seul achat. TER frais annuels moins de 0,30% recommandé. Taille du fonds plus de 100 millions euros. Réplication physique recommandée. 4.6 La diversification. Ne jamais mettre tous ses oeufs dans le même panier. ETF World plus Obligations plus SCPI = risque faible." },
  { page: 11, texte: "PARTIE 05 Passer à l'Action. 5.1 Comment investir concrètement. Étape 1 : constitue ton matelas de sécurité entre 3 et 12 mois de charges sur Livret A ou LDDS. Étape 2 : ouvre ton enveloppe fiscale PEA chez Bourso Bank ou Bourse Direct, CTO chez Trade Republic ou Degiro. Étape 3 : choisis un ETF World éligible PEA. Étape 4 : programme ton virement automatique le jour de ta paie. Étape 5 : passe ton ordre d'achat même montant même ETF chaque mois. 5.2 La routine Start Invest 15 minutes par mois. Semaine 1 : virement automatique 5 minutes. Semaine 1 : passage de l'ordre 5 minutes. Fin de mois : mise à jour de l'application 3 minutes. Trimestriel : bilan et ajustements 10 minutes. 5.3 Le rééquilibrage. Au fil du temps certains actifs performent mieux. Le rééquilibrage ramène chaque actif à son allocation cible une fois par trimestre ou par an." },
]

export default function Guide() {
  const t = useTheme()
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])

  const handleRecherche = (val) => {
    setRecherche(val)
    if (val.trim().length < 3) { setResultats([]); return }

    const mots = val.toLowerCase().trim().split(/\s+/).filter(m => m.length > 2)
    const res = []

    for (const { page, texte } of CONTENU) {
      const texteLower = texte.toLowerCase()
      const score = mots.filter(m => texteLower.includes(m)).length
      if (score === 0) continue

      const premierMot = mots.find(m => texteLower.includes(m))
      const idx = texteLower.indexOf(premierMot)
      const debut = Math.max(0, idx - 150)
      const fin = Math.min(texte.length, idx + 300)
      let extrait = texte.slice(debut, fin).trim()
      if (debut > 0) extrait = '...' + extrait
      if (fin < texte.length) extrait = extrait + '...'

      let extraitSurligne = extrait
      for (const mot of mots) {
        const regex = new RegExp(`(${mot})`, 'gi')
        extraitSurligne = extraitSurligne.replace(regex, '[[[$1]]]')
      }

      res.push({ page, extrait: extraitSurligne, score })
    }

    res.sort((a, b) => b.score - a.score)
    setResultats(res.slice(0, 5))
  }

  const renderExtrait = (extrait) => {
    const parts = extrait.split(/\[\[\[|\]\]\]/)
    return parts.map((part, i) =>
      i % 2 === 1
        ? <mark key={i} style={{ background: '#EAF6E4', color: '#2E7D1E', borderRadius: 3, padding: '0 2px' }}>{part}</mark>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Guide" />
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 1000, margin: '0 auto', width: '100%' }}>

        <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Guide & Formations</div>

        {/* BARRE DE RECHERCHE */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>🔍 Recherche dans le guide</div>
          <input
            placeholder="ex: comment diversifier mon portefeuille, qu'est-ce qu'un ETF..."
            value={recherche}
            onChange={e => handleRecherche(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }}
          />

          {resultats.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: t.textMuted }}>{resultats.length} résultat{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}</div>
              {resultats.map((r, i) => (
                <div key={i} style={{ background: t.bgSecondary, borderRadius: 8, padding: 12, border: `0.5px solid ${t.border}` }}>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 6 }}>Page {r.page}</div>
                  <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>{renderExtrait(r.extrait)}</div>
                </div>
              ))}
            </div>
          )}

          {resultats.length === 0 && recherche.length >= 3 && (
            <div style={{ marginTop: 12, fontSize: 12, color: t.textMuted }}>Aucun résultat trouvé pour "{recherche}".</div>
          )}
        </div>

        {/* PDF */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Guide Start Invest V2</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Guide complet pour débuter et optimiser vos investissements en ETF.</div>
            </div>
            <a href={PDF_URL} target="_blank" rel="noreferrer" style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              ↓ Télécharger
            </a>
          </div>
          <iframe
            src={`${PDF_URL}#toolbar=0`}
            style={{ width: '100%', height: 600, border: 'none' }}
            title="Guide Start Invest V2"
          />
        </div>

      </div>
    </div>
  )
}