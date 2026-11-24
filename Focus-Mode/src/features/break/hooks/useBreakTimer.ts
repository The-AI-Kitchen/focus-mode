import { useState, useRef } from 'react'
import { digitsToSeconds } from '../utils/timerUtils'
import { AUDIO_PATHS, playAudio, stopAudio, fadeOutAudio } from '../audio/audioManager'

export function useBreakTimer(isPausedRef: React.MutableRefObject<boolean>, countdownWasPlayingRef: React.MutableRefObject<boolean>, resumeCountdown: () => void) {
  // UI state
  const [showBreak, setShowBreak] = useState(false)
  const [showBreakSetter, setShowBreakSetter] = useState(false)
  const [breakSetterVisible, setBreakSetterVisible] = useState(false)
  const [breakTimerDigits, setBreakTimerDigits] = useState('')
  const [showBreakCountdown, setShowBreakCountdown] = useState(false)
  const [breakCountdownVisible, setBreakCountdownVisible] = useState(false)
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(0)

  // Audio and interval management
  const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const breakAlarmRef = useRef<HTMLAudioElement | null>(null)
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null)

  function handleBreakTimerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9' && breakTimerDigits.length < 6) {
      setBreakTimerDigits(prev => prev + e.key)
    } else if (e.key === 'Backspace') {
      setBreakTimerDigits(prev => prev.slice(0, -1))
    }
  }

  function handleBreakWindowClose() {
    setShowBreak(false)
    isPausedRef.current = false
    if (countdownWasPlayingRef.current) resumeCountdown()
  }

  function handleBreakYes() {
    setBreakTimerDigits('')
    setShowBreak(false)
    setShowBreakSetter(true)
    setTimeout(() => setBreakSetterVisible(true), 20)
  }

  function handleBreakSetterClose() {
    setBreakSetterVisible(false)
    isPausedRef.current = false
    if (countdownWasPlayingRef.current) resumeCountdown()
    setTimeout(() => setShowBreakSetter(false), 350)
  }

  async function handleBreakSetterConfirm() {
    const secs = digitsToSeconds(breakTimerDigits)
    setBreakRemainingSeconds(secs)
    setBreakSetterVisible(false)
    setShowBreakCountdown(true)
    setTimeout(() => setBreakCountdownVisible(true), 20)
    setTimeout(() => setShowBreakSetter(false), 350)
    if (secs <= 0) return

    // Start lofi music
    const lofi = playAudio(AUDIO_PATHS.lofi, { loop: true, volume: 1 })
    lofiAudioRef.current = lofi

    let remaining = secs
    const iv = setInterval(() => {
      remaining -= 1
      setBreakRemainingSeconds(remaining)
      if (remaining <= 0) {
        clearInterval(iv)
        breakIntervalRef.current = null
        
        // Fade out lofi and play alarm
        fadeOutAudio(lofiAudioRef.current).then(() => {
          lofiAudioRef.current = null
          const alarm = playAudio(AUDIO_PATHS.alarm)
          breakAlarmRef.current = alarm
        })
      }
    }, 1000)
    breakIntervalRef.current = iv
  }

  function handleBreakCountdownClose() {
    setBreakCountdownVisible(false)
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current)
      breakIntervalRef.current = null
    }
    stopAudio(lofiAudioRef.current)
    lofiAudioRef.current = null
    stopAudio(breakAlarmRef.current)
    breakAlarmRef.current = null
    isPausedRef.current = false
    if (countdownWasPlayingRef.current) resumeCountdown()
    setTimeout(() => setShowBreakCountdown(false), 350)
  }

  function handleBreakTimeUp() {
    if (breakRemainingSeconds !== 0) return
    handleBreakCountdownClose()
  }

  return {
    // State
    showBreak,
    setShowBreak,
    showBreakSetter,
    breakSetterVisible,
    breakTimerDigits,
    showBreakCountdown,
    breakCountdownVisible,
    breakRemainingSeconds,
    // Handlers
    handleBreakTimerKeyDown,
    handleBreakWindowClose,
    handleBreakYes,
    handleBreakSetterClose,
    handleBreakSetterConfirm,
    handleBreakCountdownClose,
    handleBreakTimeUp,
  }
}
