import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/ThemeContext'

const QUESTIONS = [
  {
    id: 1,
    question: "Quelle est votre situation professionnelle ?",
    type: 'choice',
    options: ['Salarié(e)', 'Indépendant(e) / Freelance', 'Étudiant(e)', 'Sans emploi', 'Retraité(e)'],
    field: 'situation_pro',
  },
  {
    id: 2,
    question: "Quels sont vos revenus ?",
    type: 'amount',
    periodicite: true,
    placeholder: 'ex: 2500',
    field: 'revenus',
  },
  {
    id: 3,
    question: "Combien estimez-vous payer en charges fixes ?",
    subtitle: 'Loyer, électricité, abonnements, assurances...',
    type: 'amount',
    periodicite: true,
    placeholder: 'ex: 1200',
    field: 'depenses_fixes',
  },
  {
    id: 4,
    question: "Combien dépensez-vous en charges variables ?",
    subtitle: 'Loisirs, restaurants, shopping, sorties...',
    type: 'amount',
    periodicite: true,
    placeholder: 'ex: 400',
    field: 'depenses_variables',
  },
  {
    id: 5,
    question: "Quel est votre objectif principal ?",
    type: 'choice',
    options: [
      'Constituer un matelas de sécurité',
      'Préparer ma retraite',
      'Construire mon avenir financier',
      'Acheter un bien immobilier',
      'Mieux gérer mon budget',
    ],
    field: 'objectif_principal',
  },
]

export default function QuestionnaireFinances({ onComplete }) {
  const t = useTheme()
  const [step, setStep] = useState(0)
  const [reponses, setReponses] = useState({})
  const [periodicite, setPeriodicite] = useState({})
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
  const charger = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const [profilRes, financesRes, revenusRes] = await Promise.all([
      supabase.from('profils').select('questionnaire_step, situation_pro, objectif_principal').eq('user_id', user.id).single(),
      supabase.from('finances').select('*').eq('user_id', user.id).single(),
      supabase.from('revenus').select('*').eq('user_id', user.id),
    ])

    const profil = profilRes.data
    const finances = financesRes.data
    const revenus = revenusRes.data || []

    const totalRevenus = revenus.length > 0
      ? revenus.reduce((acc, r) => acc + (parseFloat(r.montant) || 0), 0)
      : (finances?.revenus || 0)

    const preRempli = {}
    if (profil?.situation_pro) preRempli.situation_pro = profil.situation_pro
    if (profil?.objectif_principal) preRempli.objectif_principal = profil.objectif_principal
    if (totalRevenus > 0) preRempli.revenus = totalRevenus.toString()
    if (finances?.depenses_fixes > 0) preRempli.depenses_fixes = finances.depenses_fixes.toString()
    if (finances?.depenses_variables > 0) preRempli.depenses_variables = finances.depenses_variables.toString()

    setReponses(preRempli)

    if (profil?.questionnaire_step > 0 && profil?.questionnaire_step < 5) {
      setStep(profil.questionnaire_step)
    }
  }
  charger()
}, [])

  const sauvegarderEtape = async (newReponses, newStep) => {
    if (!userId) return
    await supabase.from('profils').update({
      questionnaire_step: newStep,
      situation_pro: newReponses.situation_pro || null,
      objectif_principal: newReponses.objectif_principal || null,
    }).eq('user_id', userId)
  }

  const handleChoice = async (value) => {
    const question = QUESTIONS[step]
    const newReponses = { ...reponses, [question.field]: value }
    setReponses(newReponses)

    if (step < QUESTIONS.length - 1) {
      const newStep = step + 1
      setStep(newStep)
      await sauvegarderEtape(newReponses, newStep)
    } else {
      await valider(newReponses)
    }
  }

  const handleAmount = async () => {
    const question = QUESTIONS[step]
    const valeur = reponses[question.field]
    if (!valeur) return

    if (step < QUESTIONS.length - 1) {
      const newStep = step + 1
      setStep(newStep)
      await sauvegarderEtape(reponses, newStep)
    } else {
      await valider(reponses)
    }
  }

  const convertirMontant = (field, value, periode) => {
    const montant = parseFloat(value) || 0
    if (periode === 'annuel') return Math.round(montant / 12)
    return montant
  }

  const valider = async (finalReponses) => {
    setLoading(true)
    try {
      const revenus = convertirMontant('revenus', finalReponses.revenus, periodicite.revenus)
      const depensesFixes = convertirMontant('depenses_fixes', finalReponses.depenses_fixes, periodicite.depenses_fixes)
      const depensesVariables = convertirMontant('depenses_variables', finalReponses.depenses_variables, periodicite.depenses_variables)

      // Mettre à jour finances
      const { data: existing } = await supabase.from('finances').select('*').eq('user_id', userId).single()
      const payload = {
        user_id: userId,
        revenus,
        autre_revenu: 0,
        depenses_fixes: depensesFixes,
        depenses_variables: depensesVariables,
      }
      if (existing) await supabase.from('finances').update(payload).eq('user_id', userId)
      else await supabase.from('finances').insert(payload)
      
      // Mettre à jour la table depenses
if (depensesFixes > 0 || depensesVariables > 0) {
  await supabase.from('depenses').delete().eq('user_id', userId)
  const toInsert = []
  if (depensesFixes > 0) {
    toInsert.push({ user_id: userId, type: 'fixes', categorie: 'Loyer / Prêt', montant: depensesFixes })
  }
  if (depensesVariables > 0) {
    toInsert.push({ user_id: userId, type: 'variables', categorie: 'Sorties', montant: depensesVariables })
  }
  if (toInsert.length > 0) {
    await supabase.from('depenses').insert(toInsert)
  }
}
      // Mettre à jour profil
      await supabase.from('profils').update({
        questionnaire_step: 5,
        questionnaire_done: true,
        situation_pro: finalReponses.situation_pro,
        objectif_principal: finalReponses.objectif_principal,
      }).eq('user_id', userId)

      // Débloquer badge
      const { data: existing_badge } = await supabase
        .from('accomplissements')
        .select('id')
        .eq('user_id', userId)
        .eq('slug', 'premier-bilan')
        .maybeSingle()

      if (!existing_badge) {
        await supabase.from('accomplissements').insert({ user_id: userId, slug: 'premier-bilan' })
        await supabase.from('profils').update({
          badges_non_vus: supabase.rpc('array_append_unique', { arr: [], val: 'premier-bilan' })
        }).eq('user_id', userId)
      }

      if (onComplete) onComplete({ revenus, depensesFixes, depensesVariables, objectif: finalReponses.objectif_principal, situation: finalReponses.situation_pro })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const question = QUESTIONS[step]
  const bleu = '#034065'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
      <div style={{ background: t.bgCard, borderRadius: 20, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* BARRE PROGRESSION */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? '#4CAF2E' : t.border, transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: t.textMuted }}>Question {step + 1} sur {QUESTIONS.length}</div>
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          {/* INTRO première question */}
          {step === 0 && (
            <div style={{ background: '#EAF6E4', border: '0.5px solid #4CAF2E40', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#2E7D1E', lineHeight: 1.6 }}>
              💡 Plus tu renseignes d'informations, plus l'analyse de ton profil financier sera précise et personnalisée.
            </div>
          )}

          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 6 }}>{question.question}</div>
          {question.subtitle && <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>{question.subtitle}</div>}

          {/* CHOIX MULTIPLES */}
          {question.type === 'choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {question.options.map(opt => (
                <div
                  key={opt}
                  onClick={() => handleChoice(opt)}
                  style={{ padding: '14px 16px', borderRadius: 10, border: `0.5px solid ${reponses[question.field] === opt ? bleu : t.border}`, background: reponses[question.field] === opt ? bleu + '10' : t.bgSecondary, cursor: 'pointer', fontSize: 14, color: reponses[question.field] === opt ? bleu : t.text, fontWeight: reponses[question.field] === opt ? 500 : 400, transition: 'all 0.15s' }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}

          {/* MONTANT */}
          {question.type === 'amount' && (
            <div style={{ marginTop: 16 }}>
              {question.periodicite && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {['mensuel', 'annuel'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriodicite(prev => ({ ...prev, [question.field]: p }))}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: `0.5px solid ${(periodicite[question.field] || 'mensuel') === p ? bleu : t.border}`, background: (periodicite[question.field] || 'mensuel') === p ? bleu : t.bgSecondary, color: (periodicite[question.field] || 'mensuel') === p ? '#fff' : t.text, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {p === 'mensuel' ? 'Par mois' : 'Par an'}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number"
                  min="0"
                  placeholder={question.placeholder}
                  value={reponses[question.field] || ''}
                  onChange={e => setReponses(prev => ({ ...prev, [question.field]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAmount()}
                  style={{ flex: 1, padding: '14px 16px', borderRadius: 10, border: `0.5px solid ${t.border}`, fontSize: 16, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text }}
                />
                <span style={{ fontSize: 16, color: t.textMuted }}>€</span>
              </div>
              <button
                onClick={handleAmount}
                disabled={!reponses[question.field] || loading}
                style={{ width: '100%', marginTop: 12, padding: '13px', borderRadius: 10, border: 'none', background: !reponses[question.field] ? '#9CA3AF' : bleu, color: '#fff', fontSize: 14, fontWeight: 600, cursor: !reponses[question.field] ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* NAVIGATION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, color: t.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Retour
              </button>
            ) : <div />}
            <button onClick={() => { if (onComplete) onComplete(null) }} style={{ fontSize: 12, color: t.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Passer pour l'instant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}