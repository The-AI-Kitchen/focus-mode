import reminderImg from '../../../assets/reminder.png'
import { ImageModal } from '../../../shared/components/ImageModal'
import './ReminderOverlay.css'

interface ReminderOverlayProps {
  visible: boolean
  onDismiss: () => void
}

/** Full-screen reminder shown before the timer starts. */
export function ReminderOverlay({ visible, onDismiss }: ReminderOverlayProps) {
  return (
    <ImageModal
      className="reminder-overlay"
      image={reminderImg}
      alt="Reminder"
      visible={visible}
      fadeBackdropIn
      onClose={onDismiss}
    />
  )
}