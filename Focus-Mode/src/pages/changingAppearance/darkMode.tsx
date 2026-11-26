import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import './darkMode.css'

export function DarkMode() {
    const navigate = useNavigate()
    return (
        <div className="dark-mode-page">
            <div className="dark-mode-main">
                <div className="retro-sunset"></div>
                <h2>Entering all-nighter mode...</h2>
                <h3>Good luck on your lock-in sesh!</h3>
            </div>
            <footer>
              <p>Gif by </p>
            </footer>
            <button type="button" onClick={() => navigate(PATHS.settingsAppearance)}>Back</button>
        </div>
        

    )
}

