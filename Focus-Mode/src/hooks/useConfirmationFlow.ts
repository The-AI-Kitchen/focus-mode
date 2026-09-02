import { useState, useRef, useEffect } from 'react'

export function useConfirmationFlow() {
  const [confirmError, setConfirmError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [reminderVisible, setReminderVisible] = useState(false)
  const reminderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear confirmation error after timeout
  useEffect(() => {
    if (!confirmError) return
    const t = setTimeout(() => setConfirmError(''), 3000)
    return () => clearTimeout(t)
  }, [confirmError])

  return {
    confirmError,
    setConfirmError,
    confirmed,
    setConfirmed,
    showReminder,
    setShowReminder,
    reminderVisible,
    setReminderVisible,
    reminderTimeoutRef,
  }
}
