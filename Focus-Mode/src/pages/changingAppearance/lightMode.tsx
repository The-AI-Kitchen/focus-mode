import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import './lightMode.css'

export function LightMode() {
    const navigate = useNavigate()

    // Show this page for one second, then return to the appearance settings.
    useEffect(() => {
        const t = setTimeout(() => navigate(PATHS.settingsAppearance, { replace: true }), 1000)
        return () => clearTimeout(t)
    }, [navigate])
    return (
        <div className="light-mode-page">
            <div className="light-mode-main">
                <div className="light-mode-page-text">
                    <h2 className="light-mode-title">Good morning!</h2>
                    <h3 className="light-mode-text">Entering Daytime Mode...</h3>
                </div>
            </div>
        </div>
    )
}
