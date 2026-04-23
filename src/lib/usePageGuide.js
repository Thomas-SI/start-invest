import { useState } from 'react'

export function usePageGuide() {
  const [showGuide, setShowGuide] = useState(false)

  const ouvrirGuide = () => setShowGuide(true)
  const fermerGuide = () => setShowGuide(false)

  return { showGuide, ouvrirGuide, fermerGuide }
}