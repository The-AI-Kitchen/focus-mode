import { useEffect, useRef } from 'react'

/**
 * Returns a ref that always holds the latest value.
 * Lets long-lived callbacks (timers, intervals) call the newest handler
 * without having to be re-created when it changes.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}
