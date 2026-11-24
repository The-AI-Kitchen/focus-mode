import { useState } from 'react'
import { loadTimer, saveTimer } from '../services/timerStorage'

const MAX_DIGITS = 6

/**
 * Owns the timer length the user types on the home page (as raw HHMMSS digits)
 * and persists it between sessions.
 */
export function useTimerDigits() {
  const [timerDigits, setTimerDigits] = useState(loadTimer)

  function handleTimerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9' && timerDigits.length < MAX_DIGITS) {
      const next = timerDigits + e.key
      setTimerDigits(next)
      saveTimer(next)
    } else if (e.key === 'Backspace') {
      const next = timerDigits.slice(0, -1)
      setTimerDigits(next)
      saveTimer(next)
    }
  }

  return { timerDigits, handleTimerKeyDown }
}
