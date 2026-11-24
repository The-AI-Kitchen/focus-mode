import breakSetTime from '../../../assets/break-set-time.png'
import breakSetter from '../../../assets/break-setter.png'
import { PillButton } from '../../../shared/components/PillButton'
import { ImageModal } from '../../../shared/components/ImageModal'
import { formatTimerDigits } from '../../../shared/utils/timer'
import './BreakSetterModal.css'

interface BreakSetterModalProps {
  visible: boolean
  digits: string
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onConfirm: () => void
  onClose: () => void
}

/** Lets the user type how long the break should last. */
export function BreakSetterModal({ visible, digits, onKeyDown, onConfirm, onClose }: BreakSetterModalProps) {
  return (
    <ImageModal image={breakSetTime} alt="How long do you want to take a break?" visible={visible} onClose={onClose}>
      <div className="break-setter__field">
        <img className="break-setter__field-image" src={breakSetter} alt="" />
        <input
          className="break-setter__input"
          type="text"
          value={digits ? formatTimerDigits(digits) : ''}
          placeholder="00:00:00"
          onChange={() => {}}
          onKeyDown={onKeyDown}
        />
      </div>
      <PillButton
        className="break-setter__confirm"
        text="Confirm"
        style={{ background: 'var(--btn-gradient-green)', border: 'none', color: '#000', fontWeight: '400', fontSize: '2vw', padding: '0.5em 0' }}
        onClick={onConfirm}
      />
    </ImageModal>
  )
}

