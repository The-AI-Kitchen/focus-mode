import homePage from '../../assets/home-page.png'
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
      {/*<PillButton
        className="home-page__productivity-button"
        text="Productivity Tracker"
        style={{ background: 'var(--btn-gradient-green)', border: 'none', color: '#fff', fontSize: '16px', padding: '10px 20px' }}
        onClick={onOpenProductivity}
      />*/}
      <div className="home-page__content">
        <PillButton onClick={onStartSession}>Get Started</PillButton>
      </div>
    </div>
  )
}


