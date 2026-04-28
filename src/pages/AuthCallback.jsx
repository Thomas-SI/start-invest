import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        // Pas de session → redirige vers accueil avec popup login ouvert
        navigate('/?login=true', { replace: true })
      }
    }
    handleCallback()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7F5', fontSize: 14, color: '#9CA3AF' }}>
      Vérification en cours...
    </div>
  )
}