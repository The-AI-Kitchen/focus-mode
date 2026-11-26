import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import './lightMode.css'

export function LightMode() {
    const navigate = useNavigate()
    return (
        <div className="light-mode-page">
            <div className="light-mode-main">
                <h2>Good morning!</h2>
                <h3>Entering Daytime Mode...</h3>
            </div>
            <button type="button" onClick={() => navigate(PATHS.settingsAppearance)}>Back</button>
        </div>
        

    )
}

