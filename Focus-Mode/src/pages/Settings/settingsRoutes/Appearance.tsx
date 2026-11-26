import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../../app/navigation/paths'
import { useAppearance } from '../../../app/layout/appearanceContext'

export function Appearance() {
  const navigate = useNavigate()
  const { mode, setMode } = useAppearance()
  const isDark = mode === 'dark'

  const handleToggle = () => {
    
    navigate(isDark ? PATHS.lightMode : PATHS.darkMode)
    setTimeout(() => {setMode(isDark ? 'light' : 'dark')}, 100)
    /* The setTimeout feature is a temporary fix for a bug where the button changes before the page changes. */
  }

  return <div className="productivity-page__visew page-fade-in" style={{marginTop: "50px"}}>
    <button
    type="button"
    className="dark__mode-btn"
    onClick={handleToggle}
    >
      <h2>{isDark ? 'Light Mode' : 'Dark Mode'} (coming soon!)</h2>
    </button>

    {/*Nice to have feature of a blue light filter - gives all colors a warmer tone. */}
    <button
    type="button"
    className='dark__mode-btn'
    style={{marginLeft: "10px"}}>
      <h2>Blue light filter</h2>
    </button>
  </div>
}
