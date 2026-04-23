import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPremium = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Récupérer l'id du profil
      const { data: profil } = await supabase
        .from('profils')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profil) { setLoading(false); return }

      // Vérifier l'abonnement
      const { data: abonnement } = await supabase
        .from('abonnements')
        .select('statut, date_fin')
        .eq('user_id', profil.id)
        .maybeSingle()

    const estActif =
  (abonnement?.statut === 'actif' || abonnement?.statut === 'trialing') &&
        abonnement?.date_fin &&
        new Date(abonnement.date_fin) > new Date()

      setIsPremium(!!estActif)
      setLoading(false)
    }

    checkPremium()
  }, [])

  return { isPremium, loading }
}