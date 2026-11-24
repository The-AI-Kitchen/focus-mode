import { formatTimerDigits } from '../../../shared/utils/timer'
import './TimerInput.css'

interface TimerInputProps {
  timerDigits: string
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

/** Pill-shaped input that shows the typed digits as HH:MM:SS. */
export function TimerInput({ timerDigits, onKeyDown }: TimerInputProps) {
  return (
    <input
      className="timer-input"
      type="text"
      placeholder="00:00:00"
      value={timerDigits ? formatTimerDigits(timerDigits) : ''}
      onKeyDown={onKeyDown}
      onChange={() => {}}
    />
  )
}
