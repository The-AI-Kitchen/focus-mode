
import logo from '../../assets/logo.png'
import { PillButton } from '../../shared/components/PillButton'
import { StripedBg } from '../../shared/components/stripedbg'
import { FancyDivider } from '../../shared/components/fancydivider'
import { useAppearance } from '../../app/layout/appearanceContext'
import './HomePage.css'

interface HomePageProps {
  onStartSession: () => void
  onOpenProductivity: () => void
}

export function HomePage({ onStartSession, onOpenProductivity }: HomePageProps) {
  const { mode } = useAppearance()
  const stripeColor = mode === 'dark' ? '--all-nighter-blue' : '--focusmode-blue'
  return (
    <div className="home-page page-fade-in">
      <div className="home-page__hero">
        <StripedBg className = "logoandbtns" color = {stripeColor} transparency = "95">
          
            <img className="logo" src={logo} alt="Focus Mode Logo" />
            <div className="home-page__actions">
              <PillButton
                text="Start lock in sesh!"
                style={{ background: 'var(--btn-gradient-green)', 
                  border: '4px solid transparent', color: '#fff', 
                  fontWeight: '650', fontSize: 'clamp(0.5em, 5vh, 1.33em)'}}
                onClick={onStartSession}
              />
              <PillButton
                text="My Study AI Helper"
                style={{ background: 'none', 
                  border: '4px solid #fff', color: '#fff', 
                  fontWeight: '650', fontSize: 'clamp(0.5em, 5vh, 1.33em)', width: 'fit-content', height: 'fit-content'}}
                onClick={onOpenProductivity}
              />
              
            </div>
        
          </StripedBg>

        <div className="quoteofday">
          <div className="quoteContainer">
            <h2 className="title">Quote of the Day</h2>
            <p className="quote">"If you're reading this, I hope you 
              become tomorrow what you LARP today."</p>
            <FancyDivider id = "divider" size={30} color = "var(--bright-yellow)" lineWeight = "4px"></FancyDivider>
            <p className="author">- Mahatama Gandhi, 1867</p>
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


