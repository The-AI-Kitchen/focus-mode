import warningWindow from '../../../assets/warning-window.png'
import { ImageModal } from '../../../shared/components/ImageModal'

interface WarningOverlayProps {
  visible: boolean
  onDismiss: () => void
}

/** Full-screen "10 seconds left" warning. */
export function WarningOverlay({ visible, onDismiss }: WarningOverlayProps) {
  return <ImageModal image={warningWindow} alt="Warning" visible={visible} fadeBackdropIn onClose={onDismiss} />
}
