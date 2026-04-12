import { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'

const PDF_URL = 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Guide%20Start%20Invest%20V2.pdf'

const CHAPITRES = [
  {
    numero: '01',
    titre: "Comprendre l'environnement",
    resume: "Avant d'investir le moindre euro, comprends pourquoi ne pas agir est déjà une décision — et souvent la pire.",
    sujets: ["L'inflation", "Le piège du Livret A", "Le risque de ne pas investir", "Le mythe du bon moment"],
    couleur: '#3B82F6',
  },
  {
    numero: '02',
    titre: "Stratégies d'investissement",
    resume: "Comment investir intelligemment — les concepts clés que tout débutant doit maîtriser.",
    sujets: ["Lump Sum vs DCA", "L'effet boule de neige", "Les intérêts composés", "Commencer tôt"],
    couleur: '#4CAF2E',
  },
  {
    numero: '03',
    titre: "Choisir sa banque",
    resume: "Banque classique ou banque en ligne ? Et surtout, quelle enveloppe choisir ?",
    sujets: ["Banques classiques vs en ligne", "CTO vs PEA", "Comparatif des meilleures plateformes"],
    couleur: '#F59E0B',
  },
  {
    numero: '04',
    titre: "Les bases essentielles",
    resume: "Ce que tout investisseur débutant doit absolument maîtriser avant de passer à l'action.",
    sujets: ["Le matelas de sécurité", "La fiscalité complète", "Les ETF", "La diversification", "Les frais"],
    couleur: '#8B5CF6',
  },
  {
    numero: '05',
    titre: "Passer à l'action",
    resume: "Investir intelligemment ne prend pas des heures. Avec la bonne méthode, 15 minutes par mois suffisent.",
    sujets: ["Comment et où investir", "La routine de 15 minutes", "Le rééquilibrage"],
    couleur: '#EC4899',
  },
]

const CONTENU = [
  { page: 1, texte: "START INVEST GUIDE DE L'INVESTISSEUR DÉBUTANT Bâtir son mental pour construire son avenir. Ce guide a été conçu pour les utilisateurs de l'application Start Invest. Chaque fiche est claire, simple et directement actionnable. Aucun jargon inutile — uniquement ce que tu as besoin de savoir pour commencer à investir intelligemment." },
  { page: 2, texte: "SOMMAIRE 01 Comprendre l'environnement L'inflation Le piège du Livret A Le risque de ne pas investir Le mythe du bon moment 02 Stratégies d'investissement Lump Sum vs DCA L'effet boule de neige Les intérêts composés Commencer tôt 03 Choisir sa banque Banques classiques vs en ligne CTO vs PEA Comparatif des meilleures plateformes 04 Les bases essentielles Le matelas de sécurité La fiscalité complète Les ETF La diversification Les frais 05 Passer à l'action Comment et où investir La routine de 15 minutes Le rééquilibrage" },
  { page: 3, texte: "PARTIE 01 Comprendre l'Environnement. Avant d'investir le moindre euro, comprends pourquoi ne pas agir est déjà une décision — et souvent la pire. 1.1 L'ennemi invisible : l'inflation. L'inflation, c'est l'augmentation générale des prix chaque année. En France, elle tourne autour de 2 à 3% par an. Sur le long terme, l'effet est dévastateur pour ton épargne. 10 000€ immobilisés valent 8 200€ dans 10 ans et 6 730€ dans 20 ans. 1.2 Le piège du Livret A. Le Livret A rapporte actuellement 1,7% par an. Si l'inflation dépasse ce taux, ton argent perd du pouvoir d'achat chaque année malgré les intérêts. Le Livret A reste utile uniquement pour ton matelas de sécurité, pas pour investir. 1.3 Le risque de ne pas prendre de risque. Ne pas investir n'est pas la solution la plus sûre. Le vrai risque c'est de se réveiller dans 20 ans et de réaliser que tes économies ne permettent plus de maintenir ton niveau de vie. 1.4 Le mythe du bon moment. Personne ne connaît le bon moment pour investir. Les études montrent que rester investi en permanence bat systématiquement le market timing sur le long terme." },
  { page: 5, texte: "PARTIE 02 Stratégies d'Investissement. 2.1 Lump Sum vs DCA. Lump Sum : tu investis tout d'un coup, maximise le temps sur le marché. DCA investissement régulier : tu investis un montant fixe chaque mois, réduit le risque de mal timing. Pour un débutant, le DCA est la stratégie recommandée. 2.2 L'effet boule de neige et les intérêts composés. 100€/mois à 8% : 18 417€ après 10 ans, 59 295€ après 20 ans, 150 030€ après 30 ans. 2.3 L'importance de commencer tôt. Commencer à 25 ans avec 100€/mois donne 351 000€ à 65 ans. Commencer à 35 ans donne 150 000€. Commencer à 45 ans donne seulement 58 000€." },
  { page: 7, texte: "PARTIE 03 Choisir sa Banque. 3.1 Banques classiques vs banques en ligne. Les banques classiques coûtent 5 à 25€/mois. Les banques en ligne sont gratuites. 3.2 CTO vs PEA. CTO : plafond illimité, flat tax 31,4%. PEA : plafond 150 000€, exonéré d'IR après 5 ans. Stratégie : ouvre un PEA en priorité, complète avec un CTO. 3.3 Comparatif plateformes. Bourso Bank, Fortuneo, Bourse Direct, Trade Republic, Degiro, Interactive Brokers, Linxea." },
  { page: 9, texte: "PARTIE 04 Les Bases Essentielles. 4.1 Le matelas de sécurité. Entre 3 et 12 mois de charges fixes sur Livret A ou LDDS. 4.4 La fiscalité flat tax PFU 31,4%. Le PEA après 5 ans : gains imposés uniquement à 18,6%. Déclarer les comptes étrangers via formulaire 3916. 4.5 ETF Exchange Traded Fund : fonds qui réplique un indice boursier. ETF World investit dans les 1 500 plus grandes entreprises mondiales. TER frais annuels moins de 0,30% recommandé. 4.6 La diversification. ETF World plus Obligations plus SCPI = risque faible." },
  { page: 11, texte: "PARTIE 05 Passer à l'Action. Étape 1 : matelas de sécurité 3 à 12 mois. Étape 2 : PEA chez Bourso Bank ou Bourse Direct, CTO chez Trade Republic ou Degiro. Étape 3 : ETF World éligible PEA. Étape 4 : virement automatique le jour de la paie. Étape 5 : même montant même ETF chaque mois. La routine 15 minutes par mois. Le rééquilibrage une fois par trimestre ou par an." },
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
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' }}>

        {/* HEADER */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Guide de l'investisseur débutant</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>5 parties · 12 pages · Par Thomas Bouchard</div>
          </div>
          <a href={PDF_URL} target="_blank" rel="noreferrer" style={{ background: '#1B2E4B', color: '#fff', fontSize: 12, fontWeight: 500, padding: '10px 18px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ↓ Télécharger le guide
          </a>
        </div>

        {/* RECHERCHE */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>🔍 Recherche dans le guide</div>
          <input
            placeholder="ex: comment diversifier mon portefeuille, qu'est-ce qu'un ETF, fiscalité PEA..."
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

        {/* CHAPITRES */}
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Sommaire</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {CHAPITRES.map((ch) => (
            <div key={ch.numero} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ch.couleur + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: ch.couleur, flexShrink: 0 }}>
                  {ch.numero}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{ch.titre}</div>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{ch.resume}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ch.sujets.map(s => (
                  <span key={s} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: ch.couleur + '15', color: ch.couleur, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}