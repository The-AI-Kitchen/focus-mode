import { useCallback, useEffect, useRef, useState } from 'react'
import { useLatest } from '../../../shared/hooks/useLatest'

const TICK_MS = 1000

/**
 * Owns the break countdown: the remaining time and its one-second interval.
 * `onFinished` runs once when the countdown reaches zero.
 */
export function useBreakTimer(onFinished: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onFinishedRef = useLatest(onFinished)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /** Starts counting down from `seconds`. A duration of zero shows 00:00:00 without counting. */
  const start = useCallback(
    (seconds: number) => {
      stop()
      setRemainingSeconds(seconds)
      if (seconds <= 0) return

      let remaining = seconds
      intervalRef.current = setInterval(() => {
        remaining -= 1
        setRemainingSeconds(remaining)
        if (remaining <= 0) {
          stop()
          onFinishedRef.current()
        }
      }, TICK_MS)
    },
    [stop, onFinishedRef],
  )

  useEffect(() => stop, [stop])

  return { remainingSeconds, start, stop }
}
