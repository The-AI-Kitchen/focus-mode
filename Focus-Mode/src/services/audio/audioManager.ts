import alarmSound from '../assets/alarm-sound.mp3'
import lofiBeat from '../assets/lofi-beat-1.mp3'
import countdownSound from '../assets/timer-countdown.mp3'
import partyHorn from '../assets/party-horn-short.mp3'

export const AUDIO_PATHS = {
  alarm: alarmSound,
  lofi: lofiBeat,
  countdown: countdownSound,
  partyHorn: partyHorn,
}

export type AudioType = keyof typeof AUDIO_PATHS

/**
 * Safely play an audio file with optional looping and volume
 */
export function playAudio(
  path: string,
  options?: { loop?: boolean; volume?: number }
): HTMLAudioElement {
  const audio = new Audio(path)
  if (options?.loop) audio.loop = true
  if (options?.volume !== undefined) audio.volume = options.volume
  audio.play().catch(err => console.error('Audio play error:', err))
  return audio
}

/**
 * Stop an audio element gracefully
 */
export function stopAudio(audio: HTMLAudioElement | null | undefined): void {
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
}

/**
 * Fade out audio over a duration and stop it
 */
export function fadeOutAudio(
  audio: HTMLAudioElement | null | undefined,
  durationMs: number = 800
): Promise<void> {
  return new Promise((resolve) => {
    if (!audio) {
      resolve()
      return
    }

    const fadeSteps = 20
    const fadeInterval = durationMs / fadeSteps
    let step = 0

    const fade = setInterval(() => {
      step++
      audio.volume = Math.max(0, 1 - step / fadeSteps)
      if (step >= fadeSteps) {
        clearInterval(fade)
        audio.pause()
        audio.currentTime = 0
        resolve()
      }
    }, fadeInterval)
  })
}
