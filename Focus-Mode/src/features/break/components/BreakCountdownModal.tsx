import breakCountdown from '../../../assets/break-countdown.png'
import relaxImg from '../../../assets/relax.png'
import timeIsUpImg from '../../../assets/time-is-up.png'
import { ImageModal } from '../../../shared/components/ImageModal'
import { cx } from '../../../shared/utils/classNames'
import { secondsToFormatted } from '../../../shared/utils/timer'
import './BreakCountdownModal.css'

interface BreakCountdownModalProps {
  visible: boolean
  remainingSeconds: number
  onClose: () => void
  onTimeUp: () => void
}

/** Shows the break countdown, then a "time is up" button once it reaches zero. */
export function BreakCountdownModal({ visible, remainingSeconds, onClose, onTimeUp }: BreakCountdownModalProps) {
  const isFinished = remainingSeconds === 0

  return (
    <ImageModal
      className="break-countdown"
      image={breakCountdown}
      alt="Break countdown"
      visible={visible}
      fadeBackdropIn
      onClose={onClose}
    >
      <div className="break-countdown__time">{secondsToFormatted(remainingSeconds)}</div>
      <img
        className={cx('break-countdown__relax', isFinished && 'is-hidden')}
        src={relaxImg}
        alt="Relax"
      />
      <img
        className={cx('break-countdown__time-up', isFinished && 'is-active')}
        src={timeIsUpImg}
        alt="Time is up"
        onClick={onTimeUp}
      />
    </ImageModal>
  )
}