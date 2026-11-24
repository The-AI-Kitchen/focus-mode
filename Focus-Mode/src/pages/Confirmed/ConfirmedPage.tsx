import nextBtn from '../../assets/btn-next.png'
import nextBtnHover from '../../assets/btn-next-hover.png'
import { ConfirmedSummary } from '../../features/confirmation/components/ConfirmedSummary'
import { ReminderOverlay } from '../../features/confirmation/components/ReminderOverlay'
import { useReminder } from '../../features/confirmation/hooks/useReminder'
import type { LinkEntry } from '../../features/links/types'
import { HoverImage } from '../../shared/components/HoverImage'
import { PillButton } from '../../shared/components/PillButton'
import './ConfirmedPage.css'

interface ConfirmedPageProps {
  timerDigits: string
  links: LinkEntry[]
  onGoBack: () => void
  /** Called once the reminder has been shown and the timer should start. */
  onStart: () => void
}

export function ConfirmedPage({ timerDigits, links, onGoBack, onStart }: ConfirmedPageProps) {
  const reminder = useReminder(onStart)

  return (
    <div className="confirmed-page page-fade-in">
      <ConfirmedSummary timerDigits={timerDigits} links={links} />

      <div className="confirmed-page__actions">
        <PillButton onClick={onGoBack}>Go Back</PillButton>
        <HoverImage
          className="confirmed-page__next"
          src={nextBtn}
          hoverSrc={nextBtnHover}
          alt="Next"
          onClick={reminder.start}
        />
      </div>

      {reminder.isMounted && <ReminderOverlay visible={reminder.isVisible} onDismiss={reminder.dismiss} />}
    </div>
  )
}