import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useBadgesNonVus() {
  const [nbNonVus, setNbNonVus] = useState(0)

  const fetchNonVus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profil } = await supabase
      .from('profils')
      .select('badges_non_vus')
      .eq('user_id', user.id)
      .maybeSingle()

    const badges = profil?.badges_non_vus ?? []
    setNbNonVus(badges.length)
  }

  useEffect(() => {
    fetchNonVus()

    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(fetchNonVus, 5000)
    return () => clearInterval(interval)
  }, [])

  return { nbNonVus, refetch: fetchNonVus }
}