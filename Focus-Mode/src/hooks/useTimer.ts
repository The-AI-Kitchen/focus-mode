import { useState, useRef, useEffect } from 'react'
import { digitsToSeconds } from '../utils/timerUtils'
import { AUDIO_PATHS, stopAudio } from '../audio/audioManager'

export function useTimer(onNextPage: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [showWarning, setShowWarning] = useState(false)
  const [warningVisible, setWarningVisible] = useState(false)
  
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null)
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioEnabledRef = useRef(false)
  const remainingRef = useRef(0)
  const isPausedRef = useRef(false)
  const countdownWasPlayingRef = useRef(false)
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stopSession() {
    stopAudio(countdownAudioRef.current)
    countdownAudioRef.current = null
    stopAudio(alarmAudioRef.current)
    alarmAudioRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    audioEnabledRef.current = false
  }

  function resumeCountdown() {
    if (countdownAudioRef.current) {
      const syncedTime = Math.max(0, 10 - remainingRef.current)
      if (syncedTime < countdownAudioRef.current.duration) {
        countdownAudioRef.current.currentTime = syncedTime
      }
      countdownAudioRef.current.play()
    }
    countdownWasPlayingRef.current = false
  }

  return {
    remainingSeconds,
    setRemainingSeconds,
    showWarning,
    setShowWarning,
    warningVisible,
    setWarningVisible,
    countdownAudioRef,
    alarmAudioRef,
    intervalRef,
    audioEnabledRef,
    remainingRef,
    isPausedRef,
    countdownWasPlayingRef,
    warningTimeoutRef,
    stopSession,
    resumeCountdown,
  }
}

export function useTimerInterval(timerDigits: string, onNextPage: boolean, timerState: ReturnType<typeof useTimer>, motivationalImages: string[], showMotivationalCallback: () => void) {
  const {
    remainingSeconds,
    setRemainingSeconds,
    setShowWarning,
    setWarningVisible,
    countdownAudioRef,
    alarmAudioRef,
    intervalRef,
    audioEnabledRef,
    remainingRef,
    isPausedRef,
    countdownWasPlayingRef,
    warningTimeoutRef,
    resumeCountdown,
  } = timerState

  useEffect(() => {
    if (!onNextPage) return
    const total = digitsToSeconds(timerDigits || '000000')
    setRemainingSeconds(total)
    audioEnabledRef.current = true

    const cdAudio = new Audio(AUDIO_PATHS.countdown)
    cdAudio.currentTime = 0
    countdownAudioRef.current = cdAudio

    let lastMotivationalImg: string | null = null
    const pickMotivational = () => {
      const choices = motivationalImages.filter(img => img !== lastMotivationalImg)
      const picked = choices[Math.floor(Math.random() * choices.length)]
      lastMotivationalImg = picked
      return picked
    }

    let oneThirdTriggered = false
    let twoThirdsTriggered = false
    let countdownStarted = false

    let remaining = total
    remainingRef.current = remaining
    isPausedRef.current = false

    const interval = setInterval(() => {
      if (isPausedRef.current) return
      if (!twoThirdsTriggered && remaining <= total * (2 / 3)) {
        twoThirdsTriggered = true
        showMotivationalCallback()
      }

      if (!oneThirdTriggered && remaining <= total * (1 / 3)) {
        oneThirdTriggered = true
        showMotivationalCallback()
      }
      if (remaining === 10 && !countdownStarted && audioEnabledRef.current) {
        countdownStarted = true
        cdAudio.currentTime = 0
        cdAudio.play()
        isPausedRef.current = true
        cdAudio.pause()
        countdownWasPlayingRef.current = true
        setShowWarning(true)
        setTimeout(() => setWarningVisible(true), 20)
        warningTimeoutRef.current = setTimeout(() => {
          setWarningVisible(false)
          isPausedRef.current = false
          resumeCountdown()
          setTimeout(() => setShowWarning(false), 400)
        }, 3000)
        return
      }
      if (!countdownStarted && remaining < 10 && remaining >= 1 && audioEnabledRef.current) {
        countdownStarted = true
        cdAudio.currentTime = Math.max(0, 10 - remaining)
        cdAudio.play()
      }
      if (remaining <= 1) {
        clearInterval(interval)
        intervalRef.current = null
        setRemainingSeconds(0)
        if (audioEnabledRef.current) {
          const alarm = new Audio(AUDIO_PATHS.alarm)
          alarmAudioRef.current = alarm
          alarm.play()
        }
        return
      }
      remaining -= 1
      remainingRef.current = remaining
      setRemainingSeconds(remaining)
    }, 1000)
    intervalRef.current = interval
    return () => { clearInterval(interval); intervalRef.current = null }
  }, [onNextPage, timerDigits, setRemainingSeconds, setShowWarning, setWarningVisible, countdownAudioRef, alarmAudioRef, intervalRef, audioEnabledRef, remainingRef, isPausedRef, countdownWasPlayingRef, warningTimeoutRef, resumeCountdown, motivationalImages, showMotivationalCallback])
}
