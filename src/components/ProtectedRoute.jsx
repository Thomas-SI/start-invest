import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7F5', fontFamily: 'inherit', fontSize: 13, color: '#9CA3AF' }}>
        Chargement...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  // Redirection vers onboarding si pas encore fait
  const onboardingDone = user?.user_metadata?.onboarding_done
  if (!onboardingDone && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}