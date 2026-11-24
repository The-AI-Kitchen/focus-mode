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
      <div className="home-page__hero">
        <div className="logoandbtns">
          <img className="logo" src={homePage} alt="Focus Mode Logo" />
          <div className="home-page__actions">
            <PillButton
              text="Start lock in sesh!"
              style={{ background: 'var(--btn-gradient-green)', 
                border: '4px solid transparent', color: '#fff', 
                fontWeight: '650', fontSize: '1em'}}
              onClick={onStartSession}
            />
            <PillButton
              text="My Study AI Helper"
              style={{ background: 'none', 
                border: '4px solid #fff', color: '#fff', 
                fontWeight: '650', fontSize: '1em', width: 'fit-content', height: 'fit-content'}}
              onClick={onOpenProductivity}
            />
          </div>
        </div>
        <div className="quoteofday">
          <div className="quoteContainer">
            <h2 className="title">Quote of the Day</h2>
            <p className="quote">"The secret of getting ahead is getting started."</p>
            {/*<img className="fancyLine" src={homePage} alt="Line graphic" />*/}
            <p className="author">- Mark Twain</p>
          </div>
          {/*<img className="quoteImage" src={homePage} alt="Study Graphics" />*/}
        </div>

      
        {/*<img src={homePage} alt="Home Page" />*/}
        {/*<div className="home-page__content">
          <PillButton onClick={onStartSession}>Get Started</PillButton>
        </div>*/}
      </div>
      <div className = "samplesection">
        <div className="samplecontainer">
              <p> hi </p>
        </div>
        
      </div>
    </div>
  )
}


