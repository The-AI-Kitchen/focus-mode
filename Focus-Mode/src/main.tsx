import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './shared/styles/index.css'
import './shared/styles/animations.css'
import App from './app/App.tsx'

// HashRouter: the app is served from a Chrome extension page, where path-based routing would not resolve.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)