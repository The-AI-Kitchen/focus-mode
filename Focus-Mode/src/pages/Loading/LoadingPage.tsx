import { StripedBg } from '../../shared/components/stripedbg'
import { Card } from '../../shared/components/card'
import { useAppearance } from '../../app/layout/appearanceContext'
import './LoadingPage.css'
import { FancyDivider } from '../../shared/components/fancydivider';

/** Shown while a route is loading. */
export function LoadingPage() {
  const { mode } = useAppearance()
  const isDark = mode === 'dark'
  const LoadingPercent = 50; /*Not yet implemented*/

  return (
    <div className="loading-page" role="status" aria-live="polite">
      <div className="loading-page__left">
        <div className="loading-page__percent-container">
          <StripedBg className = "percent__bg" color={isDark ? '--light-blue' : '--focusmode-blue'} transparency="85">
            <h2>Loading...</h2>
            <h3>{`${LoadingPercent}%`}</h3>
          </StripedBg>
        </div>
        <Card className = "loading-page__study-tip" color = {isDark ? 'var(--all-nighter-blue)' : 'var(--focusmode-blue)'} borderColor= "var(--light-blue)" insetX="2.5%" insetY="1.25%">
          <h2>Study Tip:</h2>
          {/*<img></img> divider here*/}
          <FancyDivider size={24} color='var(--light-blue)' lineWeight='4px'/>
          <p>If you are in ECEN 50 you are in the trenches 
            and must fight your way out.
          </p>
        </Card>
      </div>
      <div className="loading-page__right">
        {/*<img>put studying gif here</img>*/}
      </div>
      {/*<div className="loading-page__spinner" />
      <span className="loading-page__text">Loading...</span>*/}
    </div>
  )
}
