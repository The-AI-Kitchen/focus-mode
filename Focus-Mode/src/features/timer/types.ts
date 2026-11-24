/** Callbacks the countdown engine invokes during a session. */
export interface TimerHandlers {
  /** Called once when a session starts. */
  onStart?: (totalSeconds: number) => void
  /**
   * Called every second, before the displayed time is decremented.
   * `remainingSeconds` is the value that was displayed during the elapsed second.
   * The handler may pause the timer; a paused tick skips the decrement.
   */
  onTick?: (remainingSeconds: number, totalSeconds: number) => void
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void
}

/** Seconds remaining at which the "10 second" warning and countdown audio begin. */
export const COUNTDOWN_WARNING_SECONDS = 10
