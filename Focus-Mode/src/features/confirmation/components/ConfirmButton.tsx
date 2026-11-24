import confirmBtn from '../../../assets/btn-confirm.png'
import confirmBtnHover from '../../../assets/btn-confirm-hover.png'
import { HoverImage } from '../../../shared/components/HoverImage'
import './ConfirmButton.css'

interface ConfirmButtonProps {
  error: string
  onConfirm: () => void
}

/** Confirm button with the validation message that appears beneath it. */
export function ConfirmButton({ error, onConfirm }: ConfirmButtonProps) {
  return (
    <div className="confirm-button">
      <HoverImage
        className="confirm-button__image"
        src={confirmBtn}
        hoverSrc={confirmBtnHover}
        alt="Confirm"
        onClick={onConfirm}
      />
      {error && <span className="confirm-button__error">{error}</span>}
    </div>
  )
}