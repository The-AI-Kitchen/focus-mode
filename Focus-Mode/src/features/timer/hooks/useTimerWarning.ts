import { useCallback, useEffect, useRef } from 'react'
import { useFadeVisibility } from '../../../shared/hooks/useFadeVisibility'
import { useLatest } from '../../../shared/hooks/useLatest'

const AUTO_DISMISS_MS = 3000
const FADE_OUT_MS = 400

/**
 * Owns the "10 seconds left" warning overlay: it fades in, then dismisses itself
 * after a few seconds or when the user closes it. `onDismiss` runs either way.
 */
export function useTimerWarning(onDismiss: () => void) {
  const { mounted, visible, show: showFade, hide: hideFade } = useFadeVisibility(FADE_OUT_MS)
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onDismissRef = useLatest(onDismiss)

  const clearAutoDismiss = useCallback(() => {
    if (autoDismissRef.current) {
      clearTimeout(autoDismissRef.current)
      autoDismissRef.current = null
    }
  }, [])

  const dismiss = useCallback(() => {
    clearAutoDismiss()
    hideFade()
    onDismissRef.current()
  }, [clearAutoDismiss, hideFade, onDismissRef])

  const show = useCallback(() => {
    showFade()
    clearAutoDismiss()
    autoDismissRef.current = setTimeout(dismiss, AUTO_DISMISS_MS)
  }, [clearAutoDismiss, dismiss, showFade])

  useEffect(() => clearAutoDismiss, [clearAutoDismiss])

  return { isMounted: mounted, isVisible: visible, show, dismiss }
}
