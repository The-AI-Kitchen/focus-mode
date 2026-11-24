/**
 * Convert time digits string to total seconds
 * @example digitsToSeconds('010530') => 3630 (1h 30s 30s)
 */
export function digitsToSeconds(digits: string): number {
  const padded = digits.padStart(6, '0')
  return parseInt(padded.slice(0, 2)) * 3600
    + parseInt(padded.slice(2, 4)) * 60
    + parseInt(padded.slice(4, 6))
}

/**
 * Convert seconds to formatted HH:MM:SS string
 */
export function secondsToFormatted(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Format raw digits string as HH:MM:SS
 * @example formatTimerDigits('10530') => '00:10:30'
 */
export function formatTimerDigits(digits: string): string {
  const padded = digits.padStart(6, '0')
  return `${padded.slice(0, 2)}:${padded.slice(2, 4)}:${padded.slice(4, 6)}`
}
