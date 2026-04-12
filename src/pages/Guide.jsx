import { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'
import Navbar from '../components/Navbar'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

const GUIDES = [
  {
    id: 1,
    titre: 'Guide Start Invest V2',
    description: 'Guide complet pour débuter et optimiser vos investissements en ETF.',
    url: 'https://ylxxdhwakdtmidtqpacj.supabase.co/storage/v1/object/public/guides/Guide%20Start%20Invest%20V2.pdf',
  }
]

export default function Guide() {
  const t = useTheme()
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])
  const [textePages, setTextePages] = useState([])
  const [chargement, setChargement] = useState(false)
  const [pdfCharge, setPdfCharge] = useState(false)

  useEffect(() => {
    const chargerPDF = async () => {
      setChargement(true)
      try {
        const pdf = await pdfjsLib.getDocument(GUIDES[0].url).promise
        const pages = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const texte = content.items.map(item => item.str).join(' ')
          pages.push({ page: i, texte })
        }
        setTextePages(pages)
        setPdfCharge(true)
      } catch (e) {
        console.error('Erreur chargement PDF:', e)
      }
      setChargement(false)
    }
    chargerPDF()
  }, [])

  const handleRecherche = (val) => {
    setRecherche(val)
    if (val.trim().length < 3) { setResultats([]); return }

    const mots = val.toLowerCase().trim().split(/\s+/).filter(m => m.length > 2)
    const res = []

    for (const { page, texte } of textePages) {
      const texteLower = texte.toLowerCase()
      const score = mots.filter(m => texteLower.includes(m)).length
      if (score === 0) continue

      // Trouver le meilleur extrait autour du premier mot trouvé
      const premierMot = mots.find(m => texteLower.includes(m))
      const idx = texteLower.indexOf(premierMot)
      const debut = Math.max(0, idx - 150)
      const fin = Math.min(texte.length, idx + 300)
      let extrait = texte.slice(debut, fin).trim()
      if (debut > 0) extrait = '...' + extrait
      if (fin < texte.length) extrait = extrait + '...'

      // Surligner les mots trouvés
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
          {chargement && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 8 }}>Chargement du guide...</div>}
          {pdfCharge && recherche.length === 0 && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 8 }}>Guide chargé — tapez votre question pour rechercher.</div>}

          {/* RÉSULTATS */}
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

          {resultats.length === 0 && recherche.length >= 3 && pdfCharge && (
            <div style={{ marginTop: 12, fontSize: 12, color: t.textMuted }}>Aucun résultat trouvé pour "{recherche}".</div>
          )}
        </div>

        {/* PDF */}
        {GUIDES.map(guide => (
          <div key={guide.id} style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.border}`, background: t.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{guide.titre}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{guide.description}</div>
              </div>
              <a href={guide.url} target="_blank" rel="noreferrer" style={{ background: '#1B2E4B', color: '#fff', fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 7, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                ↓ Télécharger
              </a>
            </div>
            <iframe
              src={`${guide.url}#toolbar=0`}
              style={{ width: '100%', height: 600, border: 'none' }}
              title={guide.titre}
            />
          </div>
        ))}

      </div>
    </div>
  )
}