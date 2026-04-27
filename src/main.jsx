import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './lib/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import Accueil from './pages/Accueil'
import Dashboard from './pages/Dashboard'
import Portefeuille from './pages/Portefeuille'
import Investissement from './pages/Investissement'
import Croissance from './pages/Croissance'
import Challenge from './pages/Challenge'
import Guide from './pages/Guide'
import Abonnement from './pages/Abonnement'
import Compte from './pages/Compte'
import Parametres from './pages/Parametres'
import Onboarding from './pages/Onboarding'
import Fonctionnalites from './pages/Fonctionnalites'
import ChallengePublic from './pages/ChallengePublic'
import AbonnementPublic from './pages/AbonnementPublic'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'
import CGV from './pages/CGV'
import './index.css'
import CGU from './pages/CGU'
import Reclamation from './pages/Reclamation'
import Cookies from './pages/Cookies'
import ResetPassword from './pages/ResetPassword'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/fonctionnalites" element={<Fonctionnalites />} />
            <Route path="/challenge-public" element={<ChallengePublic />} />
            <Route path="/abonnement-public" element={<AbonnementPublic />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/reclamation" element={<Reclamation />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* ROUTES PROTÉGÉES */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/portefeuille" element={<ProtectedRoute><Portefeuille /></ProtectedRoute>} />
            <Route path="/investissement" element={<ProtectedRoute><Investissement /></ProtectedRoute>} />
            <Route path="/croissance" element={<ProtectedRoute><Croissance /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
            <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
            <Route path="/abonnement" element={<ProtectedRoute><Abonnement /></ProtectedRoute>} />
            <Route path="/compte" element={<ProtectedRoute><Compte /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Parametres /></ProtectedRoute>} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)