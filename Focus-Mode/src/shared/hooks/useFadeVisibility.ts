import { useCallback, useEffect, useRef, useState } from 'react'

const ENTER_DELAY_MS = 20

type Timeout = ReturnType<typeof setTimeout>

/**
 * Manages a mounted/visible pair so an element can fade in after mounting
 * and stay mounted until its fade-out has finished.
 *
 * - `show()` mounts, then flips `visible` on the next tick so the CSS transition runs.
 * - `hide()` flips `visible` off, then unmounts after `exitMs`.
 */
export function useFadeVisibility(exitMs: number) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const enterTimeoutRef = useRef<Timeout | null>(null)
  const exitTimeoutRef = useRef<Timeout | null>(null)

  const clearTimers = useCallback(() => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current)
    enterTimeoutRef.current = null
    exitTimeoutRef.current = null
  }, [])

  const show = useCallback(() => {
    clearTimers()
    setMounted(true)
    enterTimeoutRef.current = setTimeout(() => setVisible(true), ENTER_DELAY_MS)
  }, [clearTimers])

  const hide = useCallback(
    (onHidden?: () => void) => {
      clearTimers()
      setVisible(false)
      exitTimeoutRef.current = setTimeout(() => {
        setMounted(false)
        onHidden?.()
      }, exitMs)
    },
    [clearTimers, exitMs],
  )

  useEffect(() => clearTimers, [clearTimers])

  return { mounted, visible, show, hide }
}
