import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const [nightShift, setNightShift] = useState(() => {
    return localStorage.getItem('nightShift') === 'true'
  })

  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('fontSize')) || 14
  })

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    document.body.style.background = dark ? '#0C0F14' : '#fff'
  }, [dark])

  useEffect(() => {
    localStorage.setItem('nightShift', nightShift ? 'true' : 'false')
    if (nightShift) {
      document.body.style.filter = 'sepia(0.3) brightness(0.95)'
      document.body.style.transition = 'filter 0.5s ease'
    } else {
      document.body.style.filter = 'none'
      document.body.style.transition = 'filter 0.5s ease'
    }
  }, [nightShift])

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize)
    document.body.style.fontSize = `${fontSize}px`
  }, [fontSize])

  const toggle = () => setDark(d => !d)
  const toggleNightShift = () => setNightShift(n => !n)
  const toggleFontSize = (size) => setFontSize(size)
  const resetFontSize = () => setFontSize(14)

  const t = {
    dark,
    toggle,
    nightShift,
    toggleNightShift,
    fontSize,
    toggleFontSize,
    resetFontSize,
    bg: dark ? '#0C0F14' : '#F4F7F5',
    bgCard: dark ? '#131820' : '#fff',
    bgSecondary: dark ? '#0F1319' : '#F4F7F5',
    border: dark ? '#1E2535' : '#E0EAE3',
    text: dark ? '#E8E8E8' : '#1B2E4B',
    textSecondary: dark ? '#A0A0A0' : '#6B7280',
    textMuted: dark ? '#505A6A' : '#9CA3AF',
    nav: dark ? '#0C0F14' : '#fff',
    navBorder: dark ? '#1A2030' : '#E0EAE3',
  }

  return (
    <ThemeContext.Provider value={t}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)