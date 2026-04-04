import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Portefeuille from './pages/Portefeuille'
import Investissement from './pages/Investissement'
import Croissance from './pages/Croissance'
import Concentration from './pages/Concentration'
import Abonnement from './pages/Abonnement'
import Compte from './pages/Compte'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portefeuille" element={<Portefeuille />} />
        <Route path="/investissement" element={<Investissement />} />
        <Route path="/croissance" element={<Croissance />} />
        <Route path="/concentration" element={<Concentration />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/compte" element={<Compte />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)