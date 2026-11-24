import { useEffect, useState } from 'react'
import { getConfirmError } from '../utils/getConfirmError'

const ERROR_VISIBLE_MS = 3000

interface UseConfirmValidationOptions {
  timerDigits: string
  linkCount: number
  /** Called when the entered session setup is valid. */
  onValid: () => void
}

/** Owns the home page's "Confirm" check and its temporary error message. */
export function useConfirmValidation({ timerDigits, linkCount, onValid }: UseConfirmValidationOptions) {
  const [confirmError, setConfirmError] = useState('')

  // Clear the error after a short delay
  useEffect(() => {
    if (!confirmError) return
    const t = setTimeout(() => setConfirmError(''), ERROR_VISIBLE_MS)
    return () => clearTimeout(t)
  }, [confirmError])

  function handleConfirm() {
    const error = getConfirmError(timerDigits, linkCount)
    setConfirmError(error)
    if (!error) onValid()
  }

  return { confirmError, handleConfirm }
}