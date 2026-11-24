import { useCallback, useEffect, useRef } from 'react'
import { useFadeVisibility } from '../../../shared/hooks/useFadeVisibility'
import { useLatest } from '../../../shared/hooks/useLatest'

const AUTO_DISMISS_MS = 3000
const FADE_OUT_MS = 400

/**
 * Owns the reminder overlay shown before the timer starts. It dismisses itself
 * after a few seconds or when the user closes it. `onDone` runs once it has faded out.
 */
export function useReminder(onDone: () => void) {
  const { mounted, visible, show, hide } = useFadeVisibility(FADE_OUT_MS)
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onDoneRef = useLatest(onDone)

  const clearAutoDismiss = useCallback(() => {
    if (autoDismissRef.current) {
      clearTimeout(autoDismissRef.current)
      autoDismissRef.current = null
    }
  }, [])

  const dismiss = useCallback(() => {
    clearAutoDismiss()
    hide(() => onDoneRef.current())
  }, [clearAutoDismiss, hide, onDoneRef])

  const start = useCallback(() => {
    clearAutoDismiss()
    show()
    autoDismissRef.current = setTimeout(dismiss, AUTO_DISMISS_MS)
  }, [clearAutoDismiss, dismiss, show])

  useEffect(() => clearAutoDismiss, [clearAutoDismiss])

  return { isMounted: mounted, isVisible: visible, start, dismiss }
}