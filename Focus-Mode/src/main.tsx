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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Comic+Relief:wght@400;700&family=Lilita+One&display=swap" rel="stylesheet" />
  
      <App />
    </HashRouter>
  </StrictMode>,
)