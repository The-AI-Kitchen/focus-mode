import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import './darkMode.css'

export function DarkMode() {
    const navigate = useNavigate()

    // Show this page for one second, then return to the appearance settings.
    useEffect(() => {
        const t = setTimeout(() => navigate(PATHS.settingsAppearance, { replace: true }), 1000)
        return () => clearTimeout(t)
    }, [navigate])
    const STRIPE_DELAYS:number[] = [];
    for(let i:number = 0; i < 8; i++) {
        STRIPE_DELAYS.push(i*(-0.4))
    }
    
    return (
        <div className="dark-mode-page">
            <div className="dark-mode-main">
                <svg className="retro-sunset" viewBox="0 0 100 100" role="img" aria-label="Retro sunset">
                    <defs>
                        <linearGradient id="retro-sunset-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" className="sunset-stop-top" />
                            <stop offset="50%" className="sunset-stop-center" />
                            <stop offset="100%" className="sunset-stop-bottom" />
                        </linearGradient>
                        <mask id="retro-sunset-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                            {STRIPE_DELAYS.map((delay) => (
                                <rect
                                    key={delay}
                                    className="stripe"
                                    x="0"
                                    y="40"
                                    width="100"
                                    height="5.5"
                                    fill="black"
                                    style={{ animationDelay: `${delay}s` }}
                                />
                            ))}
                        </mask>
                    </defs>
                    <circle cx="50" cy="50" r="50" fill="url(#retro-sunset-gradient)" mask="url(#retro-sunset-mask)" />
                </svg>
                <div className="dark-mode-page-text">
                    <h2 className="dark-mode-title">Entering all-nighter mode...</h2>
                    <h3 className="dark-mode-text">Good luck on your lock-in sesh!</h3>
                    
                </div>
                <button type="button" onClick={() => navigate(PATHS.settingsAppearance)}>Back</button>
        
            </div>
            <div className="japanese">
                <h2 className="japanese_text">しゅうちゅうする</h2>
            </div>
            
            
        </div>
        

    )
}

