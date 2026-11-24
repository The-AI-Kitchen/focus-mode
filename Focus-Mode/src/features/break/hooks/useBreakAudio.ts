import { useCallback, useEffect, useRef } from 'react'
import { AUDIO_PATHS, fadeOutAudio, playAudio, stopAudio } from '../../../services/audio/audioManager'

/** Owns the audio for a break: looping lo-fi music while it runs and an alarm when it ends. */
export function useBreakAudio() {
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null)
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null)

  const startLofi = useCallback(() => {
    lofiAudioRef.current = playAudio(AUDIO_PATHS.lofi, { loop: true, volume: 1 })
  }, [])

  /** Fades the music out, then sounds the alarm. */
  const endWithAlarm = useCallback(() => {
    fadeOutAudio(lofiAudioRef.current).then(() => {
      lofiAudioRef.current = null
      alarmAudioRef.current = playAudio(AUDIO_PATHS.alarm)
    })
  }, [])

  const stopAll = useCallback(() => {
    stopAudio(lofiAudioRef.current)
    lofiAudioRef.current = null
    stopAudio(alarmAudioRef.current)
    alarmAudioRef.current = null
  }, [])

  useEffect(() => stopAll, [stopAll])

  return { startLofi, endWithAlarm, stopAll }
}
