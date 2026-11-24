import { useLinkManager } from '../features/links/hooks/useLinkManager'
import { useTimerDigits } from '../features/timer/hooks/useTimerDigits'
import { AppRoutes } from './routes'
import './app.css'

/**
 * Application composition: owns the session setup shared between pages
 * (timer length and links) and renders the routes.
 * Everything page-specific lives with the page.
 */
function App() {
  const { timerDigits, handleTimerKeyDown } = useTimerDigits()
  const linkManager = useLinkManager()

  return <AppRoutes timerDigits={timerDigits} onTimerKeyDown={handleTimerKeyDown} linkManager={linkManager} />
}

export default App