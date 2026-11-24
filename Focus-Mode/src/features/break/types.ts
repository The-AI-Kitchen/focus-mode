/** Everything the break overlays need to render and respond to the user. */
export interface BreakController {
  /** "Do you want to take a break?" prompt. */
  isPromptOpen: boolean
  /** "How long do you want to take a break?" window. */
  isSetterMounted: boolean
  isSetterVisible: boolean
  /** Break countdown window. */
  isCountdownMounted: boolean
  isCountdownVisible: boolean
  /** Raw HHMMSS digits typed in the setter. */
  digits: string
  remainingSeconds: number

  /** Opens the prompt. */
  open: () => void
  /** Dismisses the prompt without taking a break. */
  declineBreak: () => void
  /** Accepts the prompt and moves on to the setter. */
  acceptBreak: () => void
  handleDigitsKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  closeSetter: () => void
  /** Starts the break countdown with the typed duration. */
  confirmSetter: () => void
  /** Ends the break early (or after the countdown finished). */
  closeCountdown: () => void
  /** Ends the break once the countdown has reached zero. */
  finishBreak: () => void
}
