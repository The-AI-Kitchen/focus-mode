import confettiGif from '../../../assets/confetti.gif'
import youDidGreat from '../../../assets/you-did-great-job.png'
import { cx } from '../../../shared/utils/classNames'
import './CelebrationOverlay.css'

interface CelebrationOverlayProps {
  fading: boolean
}

/** Confetti and "You did a great job!" badge shown after finishing work. */
export function CelebrationOverlay({ fading }: CelebrationOverlayProps) {
  return (
    <div className={cx('celebration', fading && 'celebration--fading')}>
      <img className="celebration__confetti" src={confettiGif} alt="" />
      <img className="celebration__badge" src={youDidGreat} alt="You did a great job!" />
    </div>
  )
}
