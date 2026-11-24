import { useCallback, useEffect, useRef, useState } from 'react'
import { useLatest } from '../../../shared/hooks/useLatest'
import type { TimerHandlers } from '../types'

const TICK_MS = 1000

/**
 * Owns the countdown: the remaining time, the one-second interval, and the paused flag.
 *
 * It knows nothing about audio, warnings or breaks. Those features react to the
 * `onStart` / `onTick` / `onComplete` handlers and use `pause` / `resume` to control it.
 * The session starts when the hook mounts and restarts if `totalSeconds` changes.
 */
export function useTimer(totalSeconds: number, handlers: TimerHandlers = {}) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds)
  const remainingRef = useRef(totalSeconds)
  const isPausedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Handlers are read through a ref so the interval is not recreated on every render.
  const handlersRef = useLatest(handlers)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const pause = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resume = useCallback(() => {
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    let remaining = totalSeconds
    remainingRef.current = remaining
    isPausedRef.current = false
    handlersRef.current.onStart?.(totalSeconds)

    const interval = setInterval(() => {
      if (isPausedRef.current) return

      handlersRef.current.onTick?.(remaining, totalSeconds)
      // A tick handler may pause the timer (e.g. the 10 second warning). That tick is not consumed.
      if (isPausedRef.current) return

      if (remaining <= 1) {
        clearInterval(interval)
        intervalRef.current = null
        remainingRef.current = 0
        setRemainingSeconds(0)
        handlersRef.current.onComplete?.()
        return
      }

      remaining -= 1
      remainingRef.current = remaining
      setRemainingSeconds(remaining)
    }, TICK_MS)
    intervalRef.current = interval

    return () => {
      clearInterval(interval)
      intervalRef.current = null
    }
  }, [totalSeconds, handlersRef])

  return { remainingSeconds, remainingRef, pause, resume, stop }
}
