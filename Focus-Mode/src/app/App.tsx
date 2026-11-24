import { useLinkManager } from '../features/links/hooks/useLinkManager'
import { useTimerDigits } from '../features/timer/hooks/useTimerDigits'
import { ConfirmedPage } from '../pages/Confirmed/ConfirmedPage'
import { HomePage } from '../pages/Home/HomePage'
import { ProductivityPage } from '../pages/Productivity/ProductivityPage'
import { TimerPage } from '../pages/Timer/TimerPage'
import { usePageNavigation } from './navigation/usePageNavigation'
import './app.css'

/**
 * Application composition: owns the session setup shared between pages
 * (timer length and links) and decides which page to render.
 * Everything page-specific lives with the page.
 */
function App() {
  const navigation = usePageNavigation()
  const { timerDigits, handleTimerKeyDown } = useTimerDigits()
  const linkManager = useLinkManager()

  switch (navigation.page) {
    case 'timer':
      return <TimerPage timerDigits={timerDigits} onExit={navigation.goHome} />
    case 'confirmed':
      return (
        <ConfirmedPage
          timerDigits={timerDigits}
          links={linkManager.links}
          onGoBack={navigation.goHome}
          onStart={navigation.goToTimer}
        />
      )
    case 'productivity':
      return <ProductivityPage onBack={navigation.goHome} />
    case 'home':
      return (
        <HomePage
          timerDigits={timerDigits}
          onTimerKeyDown={handleTimerKeyDown}
          linkManager={linkManager}
          onConfirmed={navigation.goToConfirmed}
          onOpenProductivity={navigation.goToProductivity}
        />
      )
  }
}

export default App