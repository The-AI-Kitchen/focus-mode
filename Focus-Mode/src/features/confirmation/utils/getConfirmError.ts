/**
 * Checks that a session can start. Returns an error message for the user,
 * or an empty string when both a time and at least one link were provided.
 */
export function getConfirmError(timerDigits: string, linkCount: number): string {
  const hasTime = timerDigits.length > 0 && timerDigits.replace(/0/g, '') !== ''
  const hasLink = linkCount > 0

  if (!hasTime && !hasLink) return 'Please enter a time and at least one link before continuing'
  if (!hasTime) return 'Please enter a time before continuing'
  if (!hasLink) return 'Please add at least one link before continuing'
  return ''
}