import { useState, useEffect } from 'react'

export function useTimerPage() {
  const [finishUsed, setFinishUsed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)

  // Celebration animation effect
  useEffect(() => {
    if (!showCelebration) return
    const t1 = setTimeout(() => setCelebrationFading(true), 10400)
    const t2 = setTimeout(() => { setShowCelebration(false); setCelebrationFading(false) }, 11200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [showCelebration])

  return {
    finishUsed,
    setFinishUsed,
    showCelebration,
    setShowCelebration,
    celebrationFading,
  }
}
