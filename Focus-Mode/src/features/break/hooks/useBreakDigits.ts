import { useState } from 'react'

const MAX_DIGITS = 6

/** Owns the HHMMSS digits the user types to choose a break length. */
export function useBreakDigits() {
  const [digits, setDigits] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9' && digits.length < MAX_DIGITS) {
      setDigits((prev) => prev + e.key)
    } else if (e.key === 'Backspace') {
      setDigits((prev) => prev.slice(0, -1))
    }
  }

  function reset() {
    setDigits('')
  }

  return { digits, handleKeyDown, reset }
}
