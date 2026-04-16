import React, { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'

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
  {
    page: 3,
    chapitre: '01',
    titreChapitre: "Comprendre l'environnement",
    couleur: '#3B82F6',
    texte: "Avant d'investir le moindre euro, comprends pourquoi ne pas agir est déjà une décision — et souvent la pire. L'inflation, c'est l'augmentation générale des prix chaque année. En France, elle tourne autour de 2 à 3% par an. Sur le long terme, l'effet est dévastateur pour ton épargne. 10 000€ immobilisés valent 8 200€ dans 10 ans et 6 730€ dans 20 ans. Le Livret A rapporte actuellement 1,7% par an. Si l'inflation dépasse ce taux, ton argent perd du pouvoir d'achat chaque année malgré les intérêts. Le Livret A reste utile uniquement pour ton matelas de sécurité, pas pour investir. Ne pas investir n'est pas la solution la plus sûre. Le vrai risque c'est de se réveiller dans 20 ans et de réaliser que tes économies ne permettent plus de maintenir ton niveau de vie. Personne ne connaît le bon moment pour investir. Les études montrent que rester investi en permanence bat systématiquement le market timing sur le long terme.",
  },
  {
    page: 5,
    chapitre: '02',
    titreChapitre: "Stratégies d'investissement",
    couleur: '#4CAF2E',
    texte: "Lump Sum : tu investis tout d'un coup, maximise le temps sur le marché. DCA investissement régulier : tu investis un montant fixe chaque mois, réduit le risque de mal timing. Pour un débutant, le DCA est la stratégie recommandée. L'effet boule de neige : 100€/mois à 8% donnent 18 417€ après 10 ans, 59 295€ après 20 ans, 150 030€ après 30 ans. L'importance de commencer tôt : commencer à 25 ans avec 100€/mois donne 351 000€ à 65 ans. Commencer à 35 ans donne 150 000€. Commencer à 45 ans donne seulement 58 000€.",
  },
  {
    page: 7,
    chapitre: '03',
    titreChapitre: "Choisir sa banque",
    couleur: '#F59E0B',
    texte: "Les banques classiques coûtent 5 à 25€/mois. Les banques en ligne sont gratuites. CTO : plafond illimité, flat tax 31,4%. PEA : plafond 150 000€, exonéré d'IR après 5 ans. Stratégie : ouvre un PEA en priorité, complète avec un CTO. Comparatif plateformes : Bourso Bank, Fortuneo, Bourse Direct, Trade Republic, Degiro, Interactive Brokers, Linxea.",
  },
  {
    page: 9,
    chapitre: '04',
    titreChapitre: "Les bases essentielles",
    couleur: '#8B5CF6',
    texte: "Le matelas de sécurité : entre 3 et 12 mois de charges fixes sur Livret A ou LDDS. La fiscalité : flat tax PFU 31,4%. Le PEA après 5 ans : gains imposés uniquement à 18,6%. Déclarer les comptes étrangers via formulaire 3916. ETF Exchange Traded Fund : fonds qui réplique un indice boursier. ETF World investit dans les 1 500 plus grandes entreprises mondiales. TER frais annuels moins de 0,30% recommandé. La diversification : ETF World plus Obligations plus SCPI égal risque faible.",
  },
  {
    page: 11,
    chapitre: '05',
    titreChapitre: "Passer à l'action",
    couleur: '#EC4899',
    texte: "Étape 1 : matelas de sécurité 3 à 12 mois. Étape 2 : PEA chez Bourso Bank ou Bourse Direct, CTO chez Trade Republic ou Degiro. Étape 3 : ETF World éligible PEA. Étape 4 : virement automatique le jour de la paie. Étape 5 : même montant même ETF chaque mois. La routine 15 minutes par mois. Le rééquilibrage une fois par trimestre ou par an.",
  },
]

export default function Guide() {
  const t = useTheme()
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])
  const [expandedResults, setExpandedResults] = useState({})
  const rechercheRef = React.useRef(null)

  const toggleExpand = (index) => {
    setExpandedResults(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const lancerRecherche = (val) => {
    setRecherche(val)
    setExpandedResults({})
    setTimeout(() => {
      rechercheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)

    if (val.trim().length < 3) { setResultats([]); return }

    const mots = val.toLowerCase().trim().split(/\s+/).filter(m => m.length > 2)
    const res = []

    for (const contenu of CONTENU) {
      const texteLower = contenu.texte.toLowerCase()
      const titreLower = contenu.titreChapitre.toLowerCase()
      const score = mots.filter(m => texteLower.includes(m) || titreLower.includes(m)).length
      if (score === 0) continue

      const premierMot = mots.find(m => texteLower.includes(m))
      let extrait = ''
      if (premierMot) {
        const idx = texteLower.indexOf(premierMot)
        const debut = Math.max(0, idx - 80)
        const fin = Math.min(contenu.texte.length, idx + 300)
        extrait = contenu.texte.slice(debut, fin).trim()
        if (debut > 0) extrait = '...' + extrait
        if (fin < contenu.texte.length) extrait = extrait + '...'
      } else {
        extrait = contenu.texte.slice(0, 300) + '...'
      }

      // Surligner dans l'extrait
      let extraitSurligne = extrait
      for (const mot of mots) {
        const regex = new RegExp(`(${mot})`, 'gi')
        extraitSurligne = extraitSurligne.replace(regex, '[[[$1]]]')
      }

      // Surligner dans le texte complet
      let texteSurligne = contenu.texte
      for (const mot of mots) {
        const regex = new RegExp(`(${mot})`, 'gi')
        texteSurligne = texteSurligne.replace(regex, '[[[$1]]]')
      }

      res.push({ ...contenu, extrait: extraitSurligne, texteComplet: texteSurligne, score })
    }

    res.sort((a, b) => b.score - a.score)
    setResultats(res.slice(0, 4))
  }

  const renderTexte = (texte) => {
    const parts = texte.split(/\[\[\[|\]\]\]/)
    return parts.map((part, i) =>
      i % 2 === 1
        ? <mark key={i} style={{ background: '#EAF6E4', color: '#2E7D1E', borderRadius: 3, padding: '0 2px', fontWeight: 600 }}>{part}</mark>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Guide" />
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' }}>

        {/* HEADER */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Guide de l'investisseur débutant</div>
          <a href={PDF_URL} target="_blank" rel="noreferrer" style={{ background: '#1B2E4B', color: '#fff', fontSize: 12, fontWeight: 500, padding: '10px 18px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ↓ Télécharger le guide
          </a>
        </div>

        {/* RECHERCHE */}
        <div ref={rechercheRef} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginBottom: 8 }}>🔍 Recherche dans le guide</div>
          <input
            placeholder="ex: comment diversifier mon portefeuille, qu'est-ce qu'un ETF, fiscalité PEA..."
            value={recherche}
            onChange={e => lancerRecherche(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }}
          />

          {resultats.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: t.textMuted, display: 'flex', justifyContent: 'space-between' }}>
                <span>{resultats.length} résultat{resultats.length > 1 ? 's' : ''} pour "{recherche}"</span>
                <span onClick={() => { setResultats([]); setRecherche(''); setExpandedResults({}) }} style={{ cursor: 'pointer', color: '#E24B4A' }}>✕ Effacer</span>
              </div>
              {resultats.map((r, i) => (
                <div key={i} style={{ background: t.bgSecondary, borderRadius: 10, border: `0.5px solid ${r.couleur}30`, overflow: 'hidden' }}>
                  {/* En-tête du chapitre */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: r.couleur + '12', borderBottom: `0.5px solid ${r.couleur}20` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: r.couleur + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: r.couleur, flexShrink: 0 }}>
                      {r.chapitre}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: r.couleur }}>{r.titreChapitre}</div>
                      <div style={{ fontSize: 10, color: t.textMuted }}>Page {r.page}</div>
                    </div>
                  </div>
                  {/* Contenu */}
                  <div style={{ padding: '12px 14px', fontSize: 12, color: t.text, lineHeight: 1.7 }}>
                    {expandedResults[i]
                      ? renderTexte(r.texteComplet)
                      : renderTexte(r.extrait)
                    }
                  </div>
                  {/* Bouton afficher plus/moins */}
                  <div
                    onClick={() => toggleExpand(i)}
                    style={{ padding: '8px 14px', borderTop: `0.5px solid ${r.couleur}15`, cursor: 'pointer', fontSize: 11, color: r.couleur, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, background: r.couleur + '05' }}
                  >
                    {expandedResults[i] ? '▲ Afficher moins' : '▼ Afficher le chapitre complet'}
                  </div>
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
                  <span
                    key={s}
                    onClick={() => lancerRecherche(s)}
                    style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: recherche === s ? ch.couleur : ch.couleur + '15', color: recherche === s ? '#fff' : ch.couleur, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
      <FooterApp />
    </div>
  )
}