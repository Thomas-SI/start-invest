import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './lib/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Accueil from './pages/Accueil'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
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
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portefeuille" element={<Portefeuille />} />
            <Route path="/investissement" element={<Investissement />} />
            <Route path="/croissance" element={<Croissance />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/fonctionnalites" element={<Fonctionnalites />} />
            <Route path="/challenge-public" element={<ChallengePublic />} />
            <Route path="/abonnement-public" element={<AbonnementPublic />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cgv" element={<CGV />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)