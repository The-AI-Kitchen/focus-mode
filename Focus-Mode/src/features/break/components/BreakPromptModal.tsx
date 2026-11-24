import breakWindow from '../../../assets/break-window.png'
import { ImageModal } from '../../../shared/components/ImageModal'
import { PillButton } from '../../../shared/components/PillButton'
import './BreakPromptModal.css'

interface BreakPromptModalProps {
  onYes: () => void
  onNo: () => void
}

/** Asks whether the user wants to take a break. */
export function BreakPromptModal({ onYes, onNo }: BreakPromptModalProps) {
  return (
    <ImageModal image={breakWindow} alt="Break window" fadeBackdropIn tallCloseArea onClose={onNo}>
      <PillButton
        className="break-prompt__yes"
        text="Yes"
        style={{ background: 'var(--btn-gradient-green)', border: 'none', color: '#000', fontWeight: '400', fontSize: '1em'}}
        onClick={onYes}
      />
      <PillButton
        className="break-prompt__no"
        text="No"
        style={{ background: 'none', border: '4px solid #000', color: '#000', fontWeight: '400', fontSize: '1em'}}
        onClick={onNo}
      />
    </ImageModal>
  )
}

