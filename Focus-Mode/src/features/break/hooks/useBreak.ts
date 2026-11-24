import { useState } from 'react'
import { useFadeVisibility } from '../../../shared/hooks/useFadeVisibility'
import { digitsToSeconds } from '../../../shared/utils/timer'
import type { BreakController } from '../types'
import { useBreakAudio } from './useBreakAudio'
import { useBreakDigits } from './useBreakDigits'
import { useBreakTimer } from './useBreakTimer'

const WINDOW_FADE_OUT_MS = 350

interface UseBreakOptions {
  /** Called whenever the break flow ends and the focus timer should carry on. */
  onResumeTimer: () => void
}

/**
 * Coordinates the break flow: prompt -> choose a length -> countdown.
 * Window visibility lives here; the countdown, digits and audio are delegated to their own hooks.
 */
export function useBreak({ onResumeTimer }: UseBreakOptions): BreakController {
  const [isPromptOpen, setPromptOpen] = useState(false)
  const setter = useFadeVisibility(WINDOW_FADE_OUT_MS)
  const countdown = useFadeVisibility(WINDOW_FADE_OUT_MS)
  const digits = useBreakDigits()
  const audio = useBreakAudio()
  const timer = useBreakTimer(audio.endWithAlarm)

  function open() {
    setPromptOpen(true)
  }

  function declineBreak() {
    setPromptOpen(false)
    onResumeTimer()
  }

  function acceptBreak() {
    digits.reset()
    setPromptOpen(false)
    setter.show()
  }

  function closeSetter() {
    setter.hide()
    onResumeTimer()
  }

  function confirmSetter() {
    const seconds = digitsToSeconds(digits.digits)
    setter.hide()
    countdown.show()
    timer.start(seconds)
    if (seconds > 0) audio.startLofi()
  }

  function closeCountdown() {
    countdown.hide()
    timer.stop()
    audio.stopAll()
    onResumeTimer()
  }

  function finishBreak() {
    if (timer.remainingSeconds !== 0) return
    closeCountdown()
  }

  return {
    isPromptOpen,
    isSetterMounted: setter.mounted,
    isSetterVisible: setter.visible,
    isCountdownMounted: countdown.mounted,
    isCountdownVisible: countdown.visible,
    digits: digits.digits,
    remainingSeconds: timer.remainingSeconds,
    open,
    declineBreak,
    acceptBreak,
    handleDigitsKeyDown: digits.handleKeyDown,
    closeSetter,
    confirmSetter,
    closeCountdown,
    finishBreak,
  }
}
