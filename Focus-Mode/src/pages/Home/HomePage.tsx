import homePage from '../../assets/home-page.png'
import productivityTrackerBtn from '../../assets/productivity-tracker-button.png'
import productivityTrackerBtnHover from '../../assets/productvity-tracker-button-hover.png'
import { ConfirmButton } from '../../features/confirmation/components/ConfirmButton'
import { useConfirmValidation } from '../../features/confirmation/hooks/useConfirmValidation'
import { LinkForm } from '../../features/links/components/LinkForm'
import { LinkList } from '../../features/links/components/LinkList'
import type { LinkManager } from '../../features/links/hooks/useLinkManager'
import { TimerInput } from '../../features/timer/components/TimerInput'
import { HoverImage } from '../../shared/components/HoverImage'
import './HomePage.css'

interface HomePageProps {
  timerDigits: string
  onTimerKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  linkManager: LinkManager
  /** Called when the entered time and links pass validation. */
  onConfirmed: () => void
  onOpenProductivity: () => void
}

export function HomePage({ timerDigits, onTimerKeyDown, linkManager, onConfirmed, onOpenProductivity }: HomePageProps) {
  const { confirmError, handleConfirm } = useConfirmValidation({
    timerDigits,
    linkCount: linkManager.links.length,
    onValid: onConfirmed,
  })

  return (
    <div className="home-page page-fade-in">
      <img className="home-page__hero" src={homePage} alt="Home Page" />
      <HoverImage
        className="home-page__productivity-button"
        src={productivityTrackerBtn}
        hoverSrc={productivityTrackerBtnHover}
        alt="Productivity Tracker"
        onClick={onOpenProductivity}
      />
      <div className="home-page__content">
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
        {linkManager.showLinks && (
          <LinkList links={linkManager.links} onRemove={linkManager.handleRemoveLink} />
        )}
      </div>
    </div>
  )
}