import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { useTheme } from '../lib/ThemeContext'

const ACCOMPLISSEMENTS = [
  {
    slug: 'premier-pas',
    nom: 'Premier Pas',
    emoji: '🌱',
    message: 'Bienvenue chez Start Invest.',
    quete: 'S\'inscrire sur StartInvest',
    auto: true,
  },
  {
    slug: 'grand-saut',
    nom: 'Le Grand Saut',
    emoji: '🚀',
    message: 'Tu n\'es plus spectateur, tu es le pilote de ton futur.',
    quete: 'Acheter votre premier ETF',
    auto: true,
  },
  {
    slug: 'metronome-bronze',
    nom: 'Le Métronome',
    emoji: '🎵',
    message: 'La magie des intérêts composés adore ta régularité. Continue !',
    quete: 'Investir régulièrement pendant 3 mois',
    niveau: 'Bronze',
    niveauColor: '#854F0B',
    niveauBg: '#FFF0DC',
  },
  {
    slug: 'metronome-argent',
    nom: 'Le Métronome',
    emoji: '🎵',
    message: 'La magie des intérêts composés adore ta régularité. Continue !',
    quete: 'Investir régulièrement pendant 6 mois',
    niveau: 'Argent',
    niveauColor: '#444441',
    niveauBg: '#F0F0F0',
  },
  {
    slug: 'metronome-or',
    nom: 'Le Métronome',
    emoji: '🎵',
    message: 'La magie des intérêts composés adore ta régularité. Continue !',
    quete: 'Investir régulièrement pendant 12 mois',
    niveau: 'Or',
    niveauColor: '#633806',
    niveauBg: '#FFF8DC',
  },
  {
    slug: 'metronome-platine',
    nom: 'Le Métronome',
    emoji: '🎵',
    message: 'La magie des intérêts composés adore ta régularité. Continue !',
    quete: 'Investir régulièrement pendant 18 mois',
    niveau: 'Platine',
    niveauColor: '#185FA5',
    niveauBg: '#E6F1FB',
  },
  {
    slug: 'main-de-fer',
    nom: 'Main de Fer',
    emoji: '🗿',
    message: 'Le calme est une compétence.',
    quete: '6 mois sans aucune vente',
    auto: true,
  },
  {
    slug: 'architecte',
    nom: 'L\'Architecte',
    emoji: '🏗️',
    message: 'Ton patrimoine est maintenant solide et diversifié. Beau travail !',
    quete: 'Posséder 3 ETF différents',
    auto: true,
  },
  {
    slug: 'cap-bronze',
    nom: 'Cap des 100 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 100 €',
    niveau: 'Bronze',
    niveauColor: '#854F0B',
    niveauBg: '#FFF0DC',
    palier: 100,
  },
  {
    slug: 'cap-argent',
    nom: 'Cap des 500 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 500 €',
    niveau: 'Argent',
    niveauColor: '#444441',
    niveauBg: '#F0F0F0',
    palier: 500,
  },
  {
    slug: 'cap-or',
    nom: 'Cap des 1 000 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 1 000 €',
    niveau: 'Or',
    niveauColor: '#633806',
    niveauBg: '#FFF8DC',
    palier: 1000,
  },
  {
    slug: 'cap-platine',
    nom: 'Cap des 2 000 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 2 000 €',
    niveau: 'Platine',
    niveauColor: '#185FA5',
    niveauBg: '#E6F1FB',
    palier: 2000,
  },
  {
    slug: 'cap-epique',
    nom: 'Cap des 5 000 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 5 000 €',
    niveau: 'Épique',
    niveauColor: '#534AB7',
    niveauBg: '#EEEDFE',
    palier: 5000,
  },
  {
    slug: 'cap-legendaire',
    nom: 'Cap des 10 000 €',
    emoji: '💰',
    message: 'Le premier palier est le plus dur. La machine est lancée.',
    quete: 'Investir 10 000 €',
    niveau: 'Légendaire',
    niveauColor: '#993556',
    niveauBg: '#FBEAF0',
    palier: 10000,
  },
  {
    slug: 'vroum-vroum',
    nom: 'Vroum Vroum',
    emoji: '⚡',
    message: 'Je vois déjà l\'avenir.',
    quete: 'S\'abonner à StartInvest Premium',
    auto: true,
  },
]

const fetchChallengeData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non connecté')
  const [accRes, invRes, txRes] = await Promise.all([
    supabase.from('accomplissements').select('*').eq('user_id', user.id),
    supabase.from('investissements').select('*').eq('user_id', user.id),
    supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: true }),
  ])
  return {
    user,
    accomplissements: accRes.data || [],
    investissements: invRes.data || [],
    transactions: txRes.data || [],
  }
}

const getProgression = (slug, investissements, transactions) => {
  const totalInvesti = investissements.reduce((acc, i) => acc + parseFloat(i.quantite) * parseFloat(i.pru || i.prix_achat_unitaire || 0), 0)
  const nbEtfDifferents = [...new Set(investissements.map(i => i.ticker))].length
  const achats = transactions.filter(t => t.type === 'Achat')

  if (slug === 'grand-saut') return { current: achats.length > 0 ? 1 : 0, total: 1 }
  if (slug === 'architecte') return { current: Math.min(nbEtfDifferents, 3), total: 3 }
  if (slug === 'main-de-fer') {
    const ventes = transactions.filter(t => t.type === 'Vente')
    if (ventes.length === 0 && transactions.length > 0) {
      const firstTx = new Date(transactions[0].date)
      const now = new Date()
      const mois = Math.floor((now - firstTx) / (1000 * 60 * 60 * 24 * 30))
      return { current: Math.min(mois, 6), total: 6 }
    }
    return { current: 0, total: 6 }
  }
  if (slug.startsWith('cap-')) {
    const paliers = { 'cap-bronze': 100, 'cap-argent': 500, 'cap-or': 1000, 'cap-platine': 2000, 'cap-epique': 5000, 'cap-legendaire': 10000 }
    return { current: Math.round(totalInvesti), total: paliers[slug], currency: true }
  }
  if (slug.startsWith('metronome-')) {
    const moisRequisMap = { 'metronome-bronze': 3, 'metronome-argent': 6, 'metronome-or': 12, 'metronome-platine': 18 }
    const moisRequis = moisRequisMap[slug]
    const moisInvestis = new Set(achats.map(t => t.date.substring(0, 7))).size
    return { current: Math.min(moisInvestis, moisRequis), total: moisRequis }
  }
  return null
}

export default function Challenge() {
  const t = useTheme()
  const [onglet, setOnglet] = useState('obtenus')
  const { data, isLoading } = useQuery({ queryKey: ['challenge'], queryFn: fetchChallengeData })

  const user = data?.user || null
  const accomplissements = data?.accomplissements || []
  const investissements = data?.investissements || []
  const transactions = data?.transactions || []

  const slugsObtenus = new Set(accomplissements.map(a => a.slug))
  const obtenus = ACCOMPLISSEMENTS.filter(a => slugsObtenus.has(a.slug))
  const aDebloquer = ACCOMPLISSEMENTS.filter(a => !slugsObtenus.has(a.slug))

  const bleu = t.dark ? '#3B82F6' : '#1B2E4B'

  if (isLoading) return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Challenge" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: 13 }}>Chargement...</div>
    </div>
  )

  const BadgeCard = ({ acc, obtenu }) => {
    const prog = !obtenu ? getProgression(acc.slug, investissements, transactions) : null
    const pct = prog ? Math.min(Math.round((prog.current / prog.total) * 100), 100) : 0
    return (
      <div style={{ background: obtenu ? (t.dark ? '#0F1F0F' : '#F6FFF3') : t.bgCard, border: `0.5px solid ${obtenu ? '#4CAF2E' : t.border}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: obtenu ? '#EAF6E4' : t.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: obtenu ? 28 : 26, border: obtenu ? '2px solid #4CAF2E' : `1.5px dashed ${t.border}` }}>
          {obtenu ? acc.emoji : <span style={{ fontSize: 22, color: t.textMuted }}>?</span>}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: obtenu ? t.text : t.textMuted, lineHeight: 1.3 }}>{acc.nom}</div>
        {acc.niveau && (
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: acc.niveauBg, color: acc.niveauColor }}>{acc.niveau}</span>
        )}
        {obtenu && <div style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.4 }}>{acc.message}</div>}
        {!obtenu && prog && (
          <>
            <div style={{ fontSize: 10, color: t.textMuted }}>{acc.quete}</div>
            <div style={{ width: '100%', background: t.bgSecondary, borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: '#4CAF2E', width: `${pct}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 10, color: t.textMuted }}>
              {prog.currency ? `${prog.current.toLocaleString('fr-FR')} / ${prog.total.toLocaleString('fr-FR')} €` : `${prog.current} / ${prog.total}`}
            </div>
          </>
        )}
        {!obtenu && !prog && (
          <div style={{ fontSize: 10, color: t.textMuted }}>{acc.quete}</div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar page="Challenge" />
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* HEADER LIVRET */}
        <div style={{ background: bleu, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 2 }}>Livret d'accomplissements</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{obtenus.length} / {ACCOMPLISSEMENTS.length} débloqués</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px' }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{obtenus.length}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>badges</div>
          </div>
        </div>

        {/* BARRE PROGRESSION GLOBALE */}
        <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: t.textMuted }}>
            <span>Progression globale</span>
            <span style={{ fontWeight: 500, color: '#4CAF2E' }}>{Math.round((obtenus.length / ACCOMPLISSEMENTS.length) * 100)}%</span>
          </div>
          <div style={{ background: t.bgSecondary, borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: '#4CAF2E', width: `${Math.round((obtenus.length / ACCOMPLISSEMENTS.length) * 100)}%`, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* ONGLETS */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['obtenus', `Mes badges (${obtenus.length})`], ['avenirs', `À débloquer (${aDebloquer.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setOnglet(key)} style={{ flex: 1, padding: '9px', borderRadius: 9, border: `0.5px solid ${onglet === key ? bleu : t.border}`, background: onglet === key ? bleu : t.bgCard, color: onglet === key ? '#fff' : t.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* BADGES OBTENUS */}
        {onglet === 'obtenus' && (
          obtenus.length === 0 ? (
            <div style={{ background: t.bgCard, border: `0.5px solid ${t.border}`, borderRadius: 12, padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
              Aucun badge obtenu pour l'instant. Commencez votre parcours !
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {obtenus.map(acc => <BadgeCard key={acc.slug} acc={acc} obtenu={true} />)}
            </div>
          )
        )}

        {/* BADGES À DÉBLOQUER */}
        {onglet === 'avenirs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {aDebloquer.map(acc => <BadgeCard key={acc.slug} acc={acc} obtenu={false} />)}
          </div>
        )}

      </div>
    </div>
  )
}