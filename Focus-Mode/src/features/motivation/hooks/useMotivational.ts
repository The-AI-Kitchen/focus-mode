import { useCallback, useEffect, useRef, useState } from 'react'
import donutImg from '../assets/donut-stop-trying.png'
import butterflyImg from '../assets/butterfly.png'
import keepGrowingImg from '../assets/keep-growing.png'
import youCanDoItImg from '../assets/you-can-do-it.png'

const MOTIVATIONAL_IMAGES = [donutImg, butterflyImg, keepGrowingImg, youCanDoItImg]

const FADE_START_MS = 3300
const HIDE_MS = 4000

type Timeout = ReturnType<typeof setTimeout>

/**
 * Owns the motivational pop-up: which image is shown, its fade, and the
 * moments during a session (two thirds and one third elapsed) when it appears.
 */
export function useMotivational() {
  const [showDonut, setShowDonut] = useState(false)
  const [motivationalImg, setMotivationalImg] = useState(donutImg)
  const [donutFading, setDonutFading] = useState(false)

  const lastImgRef = useRef(donutImg)
  const twoThirdsTriggeredRef = useRef(false)
  const oneThirdTriggeredRef = useRef(false)
  const timeoutsRef = useRef<Timeout[]>([])

  const showMotivational = useCallback(() => {
    // Pick a random image, excluding the one shown last
    const choices = MOTIVATIONAL_IMAGES.filter((img) => img !== lastImgRef.current)
    const picked = choices[Math.floor(Math.random() * choices.length)]
    lastImgRef.current = picked
    setMotivationalImg(picked)
    setShowDonut(true)
    timeoutsRef.current.push(
      setTimeout(() => setDonutFading(true), FADE_START_MS),
      setTimeout(() => {
        setShowDonut(false)
        setDonutFading(false)
      }, HIDE_MS),
    )
  }, [])

  /** Re-arms the two-thirds and one-third triggers for a new session. */
  const resetTriggers = useCallback(() => {
    twoThirdsTriggeredRef.current = false
    oneThirdTriggeredRef.current = false
  }, [])

  /** Shows the pop-up the first time each trigger point is passed. */
  const handleTick = useCallback(
    (remainingSeconds: number, totalSeconds: number) => {
      if (!twoThirdsTriggeredRef.current && remainingSeconds <= totalSeconds * (2 / 3)) {
        twoThirdsTriggeredRef.current = true
        showMotivational()
      }
      if (!oneThirdTriggeredRef.current && remainingSeconds <= totalSeconds * (1 / 3)) {
        oneThirdTriggeredRef.current = true
        showMotivational()
      }
    },
    [showMotivational],
  )

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return { showDonut, motivationalImg, donutFading, showMotivational, resetTriggers, handleTick }
}
