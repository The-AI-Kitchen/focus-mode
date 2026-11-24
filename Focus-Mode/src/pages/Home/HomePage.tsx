import homePage from '../../assets/home-page.png'
import productivityTrackerBtn from '../../assets/productivity-tracker-button.png'
import productivityTrackerBtnHover from '../../assets/productvity-tracker-button-hover.png'
import { HoverImage } from '../../shared/components/HoverImage'
import { PillButton } from '../../shared/components/PillButton'
import './HomePage.css'

interface HomePageProps {
  onStartSession: () => void
  onOpenProductivity: () => void
}

export function HomePage({ onStartSession, onOpenProductivity }: HomePageProps) {
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
        <PillButton onClick={onStartSession}>Get Started</PillButton>
      </div>
    </div>
  )
}
