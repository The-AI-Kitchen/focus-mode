import { secondsToFormatted } from '../../../shared/utils/timer'
import timerImg from '../../../assets/timer.png'
import './TimerDisplay.css'

interface TimerDisplayProps {
  remainingSeconds: number
}

/** The timer badge on the computer screen showing the time left as HH:MM:SS. */
export function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
  return (
    <div className="timer-display">
      <img className="timer-display__image" src={timerImg} alt="Timer" />
      <span className="timer-display__time">{secondsToFormatted(remainingSeconds)}</span>
    </div>
  )
}
