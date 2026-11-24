import { NavLink } from 'react-router-dom'
import HamburgerButton from './assets/hamburgerbtn.png'
import { PATHS } from './paths'
import './Navbar.css'

/** Site-wide navigation bar. */
export function Navbar() {
  

  return (
    <nav className="navbar">
      <div className="navbar__links">
        <NavLink className={({ isActive }) => isActive ? "navbar__link active" : "navbar__link"} to={PATHS.home} end>
          Home
        </NavLink>
        {/* Placeholder: intentionally goes nowhere yet */}
        <button type="button" className="navbar__link navbar__link--inactive">
          AI Agent
        </button>
        <NavLink className={({ isActive }) => isActive ? "navbar__link active" : "navbar__link"} to={PATHS.productivity}>
          Site tracker
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? "navbar__link active" : "navbar__link"} to={PATHS.confirmed}>
          Lock in sesh
        </NavLink>
      </div>
      <div className="nav_button_container">  
        <button type="button" className="navbar-hamburger-button" aria-label="Menu">
            <img id = "hamburgerbtn"src={HamburgerButton} alt="Navigation button" />
        </button>
      </div>
    </nav>
  )
}