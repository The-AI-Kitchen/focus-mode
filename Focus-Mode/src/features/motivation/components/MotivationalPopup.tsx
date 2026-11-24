import { cx } from '../../../shared/utils/classNames'
import './MotivationalPopup.css'

interface MotivationalPopupProps {
  image: string
  fading: boolean
}

/** Pop-up character that appears over the computer screen during a session. */
export function MotivationalPopup({ image, fading }: MotivationalPopupProps) {
  return (
    <img
      className={cx('motivational-popup', fading ? 'motivational-popup--out' : 'motivational-popup--in')}
      src={image}
      alt="Motivational Character"
    />
  )
}
