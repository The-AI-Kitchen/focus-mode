import exitBtn from '../../../assets/exit-button.png'
import finishBtn from '../../../assets/finish-work.png'
import finishBtnHover from '../../../assets/finish-work-hover.png'
import takeABreak from '../../../assets/take-a-break.png'
import takeABreakHover from '../../../assets/take-a-break-hover.png'
import { HoverImage } from '../../../shared/components/HoverImage'
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
      <HoverImage
        className={cx('timer-controls__finish', finishUsed && 'is-disabled')}
        src={finishBtn}
        hoverSrc={finishBtnHover}
        hoverDisabled={finishUsed}
        alt="Finish Work"
        onClick={onFinish}
      />
      <HoverImage
        className={cx('timer-controls__break', !canTakeBreak && 'is-disabled')}
        src={takeABreak}
        hoverSrc={takeABreakHover}
        hoverDisabled={!canTakeBreak}
        alt="Take a Break"
        onClick={onTakeBreak}
      />
    </>
  )
}
