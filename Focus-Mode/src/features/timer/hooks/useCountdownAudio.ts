import { useCallback, useEffect, useRef } from 'react'
import { AUDIO_PATHS, playAudio, stopAudio } from '../../../services/audio/audioManager'
import { COUNTDOWN_WARNING_SECONDS } from '../types'

/**
 * Owns the audio for the end of a timer session: the 10 second countdown cue and the final alarm.
 */
export function useCountdownAudio() {
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null)
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null)
  const countdownStartedRef = useRef(false)
  const wasPlayingRef = useRef(false)

  /** Creates a fresh countdown cue for a new session. */
  const prepare = useCallback(() => {
    const audio = new Audio(AUDIO_PATHS.countdown)
    audio.currentTime = 0
    countdownAudioRef.current = audio
    countdownStartedRef.current = false
    wasPlayingRef.current = false
  }, [])

  /**
   * Starts the countdown cue when the timer reaches the final seconds.
   * Returns true when the cue was started at exactly 10 seconds. The cue is held paused
   * in that case so the caller can show its warning before resuming it with `resume`.
   */
  const handleTick = useCallback((remainingSeconds: number): boolean => {
    const audio = countdownAudioRef.current
    if (!audio || countdownStartedRef.current) return false

    if (remainingSeconds === COUNTDOWN_WARNING_SECONDS) {
      countdownStartedRef.current = true
      audio.currentTime = 0
      audio.play()
      audio.pause()
      wasPlayingRef.current = true
      return true
    }

    if (remainingSeconds < COUNTDOWN_WARNING_SECONDS && remainingSeconds >= 1) {
      countdownStartedRef.current = true
      audio.currentTime = Math.max(0, COUNTDOWN_WARNING_SECONDS - remainingSeconds)
      audio.play()
    }
    return false
  }, [])

  /** Pauses the cue (if it is playing) and remembers whether to resume it later. */
  const pauseIfPlaying = useCallback(() => {
    const audio = countdownAudioRef.current
    if (audio && !audio.paused) {
      audio.pause()
      wasPlayingRef.current = true
    } else {
      wasPlayingRef.current = false
    }
  }, [])

  /** Resumes the cue, re-synced to the time left on the timer. */
  const resume = useCallback((remainingSeconds: number) => {
    const audio = countdownAudioRef.current
    if (audio) {
      const syncedTime = Math.max(0, COUNTDOWN_WARNING_SECONDS - remainingSeconds)
      if (syncedTime < audio.duration) {
        audio.currentTime = syncedTime
      }
      audio.play()
    }
    wasPlayingRef.current = false
  }, [])

  /** Resumes the cue only if it was playing when it was paused. */
  const resumeIfWasPlaying = useCallback(
    (remainingSeconds: number) => {
      if (wasPlayingRef.current) resume(remainingSeconds)
    },
    [resume],
  )

  const playAlarm = useCallback(() => {
    alarmAudioRef.current = playAudio(AUDIO_PATHS.alarm)
  }, [])

  const stop = useCallback(() => {
    stopAudio(countdownAudioRef.current)
    countdownAudioRef.current = null
    stopAudio(alarmAudioRef.current)
    alarmAudioRef.current = null
  }, [])

  useEffect(() => stop, [stop])

  return { prepare, handleTick, pauseIfPlaying, resume, resumeIfWasPlaying, playAlarm, stop }
}
