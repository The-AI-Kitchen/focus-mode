import { useEffect, useState } from 'react'
import { AUDIO_PATHS, playAudio } from '../../../services/audio/audioManager'

const CELEBRATION_FADE_START_MS = 10400
const CELEBRATION_END_MS = 11200

/**
 * Owns the "Finish Work" state: whether it was used and the celebration
 * (confetti + party horn) that plays afterwards.
 */
export function useFinishWork() {
  const [finishUsed, setFinishUsed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)

  useEffect(() => {
    if (!showCelebration) return
    const fadeTimeout = setTimeout(() => setCelebrationFading(true), CELEBRATION_FADE_START_MS)
    const endTimeout = setTimeout(() => {
      setShowCelebration(false)
      setCelebrationFading(false)
    }, CELEBRATION_END_MS)
    return () => {
      clearTimeout(fadeTimeout)
      clearTimeout(endTimeout)
    }
  }, [showCelebration])

  /** Marks work as finished and starts the celebration. Does nothing if already finished. */
  function finish() {
    if (finishUsed) return
    setFinishUsed(true)
    setShowCelebration(true)
    playAudio(AUDIO_PATHS.partyHorn)
  }

  return { finishUsed, showCelebration, celebrationFading, finish }
}
