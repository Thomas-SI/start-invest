import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const CACHE_KEY = 'premium_status'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function usePremium() {
  const [isPremium, setIsPremium] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.value
      }
    } catch {}
    return false
  })
  const [loading, setLoading] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return false
    } catch {}
    return true
  })

  useEffect(() => {
    const checkPremium = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profil } = await supabase
        .from('profils')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profil) { setLoading(false); return }

      const { data: abonnement } = await supabase
        .from('abonnements')
        .select('statut, date_fin')
        .eq('user_id', profil.id)
        .maybeSingle()

      const estActif =
        (abonnement?.statut === 'actif' || abonnement?.statut === 'trialing') &&
        abonnement?.date_fin &&
        new Date(abonnement.date_fin) > new Date()

      const value = !!estActif
      setIsPremium(value)
      setLoading(false)

      // Sauvegarder en cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({ value, timestamp: Date.now() }))
    }

    checkPremium()
  }, [])

  return { isPremium, loading }
}