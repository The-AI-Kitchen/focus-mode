import { ConfirmButton } from '../../features/confirmation/components/ConfirmButton'
import { useConfirmValidation } from '../../features/confirmation/hooks/useConfirmValidation'
import { LinkForm } from '../../features/links/components/LinkForm'
import { LinkList } from '../../features/links/components/LinkList'
import type { LinkManager } from '../../features/links/hooks/useLinkManager'
import { TimerInput } from '../../features/timer/components/TimerInput'
import './ConfirmationPage.css'

interface ConfirmationPageProps {
  timerDigits: string
  onTimerKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  linkManager: LinkManager
  /** Called when the entered time and links pass validation. */
  onConfirmed: () => void
}

/** Session setup: timer length and links, validated on "Confirm". */
export function ConfirmationPage({ timerDigits, onTimerKeyDown, linkManager, onConfirmed }: ConfirmationPageProps) {
  const { confirmError, handleConfirm } = useConfirmValidation({
    timerDigits,
    linkCount: linkManager.links.length,
    onValid: onConfirmed,
  })

  return (
    <div className="confirmation-page page-fade-in">
      <TimerInput timerDigits={timerDigits} onKeyDown={onTimerKeyDown} />
      <LinkForm
        linkInput={linkManager.linkInput}
        linkError={linkManager.linkError}
        showLinks={linkManager.showLinks}
        onLinkInputChange={linkManager.setLinkInput}
        onLinkKeyDown={linkManager.handleKeyDown}
        onAddLink={linkManager.handleAddLink}
        onToggleShowLinks={linkManager.toggleShowLinks}
      />
      <ConfirmButton error={confirmError} onConfirm={handleConfirm} />
      {linkManager.showLinks && <LinkList links={linkManager.links} onRemove={linkManager.handleRemoveLink} />}
    </div>
  )
}
