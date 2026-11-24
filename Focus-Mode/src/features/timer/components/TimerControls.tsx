import exitBtn from '../../../assets/exit-button.png'
import { PillButton } from '../../../shared/components/PillButton'
import { cx } from '../../../shared/utils/classNames'
import './TimerControls.css'

interface TimerControlsProps {
  finishUsed: boolean
  canTakeBreak: boolean
  onExit: () => void
  onFinish: () => void
  onTakeBreak: () => void
}

/** Exit, Finish Work and Take a Break buttons on the computer screen. */
export function TimerControls({ finishUsed, canTakeBreak, onExit, onFinish, onTakeBreak }: TimerControlsProps) {
  return (
    <>
      <img className="timer-controls__exit" src={exitBtn} alt="Exit" onClick={onExit} />
      <PillButton
        className={cx('timer-controls__finish', finishUsed && 'is-disabled')}
        text="Finish Work"
        style={{ background: 'var(--btn-gradient-green)', border: 'none', color: '#000', fontWeight: '400', fontSize: '1em' }}
        onClick={onFinish}
      />
      <PillButton
        className={cx('timer-controls__break', !canTakeBreak && 'is-disabled')}
        text="Take a Break"
        style={{ background: 'var(--btn-gradient-orange)', border: 'none', color: '#000', fontWeight: '400', fontSize: '1em'}}
        onClick={onTakeBreak}
      />
    </>
  )
}

