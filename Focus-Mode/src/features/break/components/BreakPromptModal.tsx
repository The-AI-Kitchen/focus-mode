import breakWindow from '../../../assets/break-window.png'
import breakYes from '../../../assets/break-yes.png'
import breakYesHover from '../../../assets/break-yes-hover.png'
import breakNo from '../../../assets/break-no.png'
import breakNoHover from '../../../assets/break-no-hover.png'
import { HoverImage } from '../../../shared/components/HoverImage'
import { ImageModal } from '../../../shared/components/ImageModal'
import './BreakPromptModal.css'

interface BreakPromptModalProps {
  onYes: () => void
  onNo: () => void
}

/** Asks whether the user wants to take a break. */
export function BreakPromptModal({ onYes, onNo }: BreakPromptModalProps) {
  return (
    <ImageModal image={breakWindow} alt="Break window" fadeBackdropIn tallCloseArea onClose={onNo}>
      <HoverImage
        className="break-prompt__yes"
        src={breakYes}
        hoverSrc={breakYesHover}
        alt="Yes"
        onClick={onYes}
      />
      <HoverImage
        className="break-prompt__no"
        src={breakNo}
        hoverSrc={breakNoHover}
        alt="No"
        onClick={onNo}
      />
    </ImageModal>
  )
}