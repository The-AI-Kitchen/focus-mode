import { NavLink } from 'react-router-dom'
import HamburgerButton from './assets/hamburgerbtn.png'
import { PATHS } from './paths'
import './Navbar.css'

interface NavbarProps {
  /** Whether the side menu is open. */
  menuOpen: boolean
  /** Called when the hamburger button is pressed. */
  onMenuToggle: () => void
}

/** Site-wide navigation bar. */
export function Navbar({ menuOpen, onMenuToggle }: NavbarProps) {
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
        <NavLink className={({ isActive }) => isActive ? "navbar__link active" : "navbar__link"} to={PATHS.confirmation}>
          Lock in sesh
        </NavLink>
      </div>
      <div className="nav_button_container">
        <button
          type="button"
          className="navbar-hamburger-button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <img id="hamburgerbtn" src={HamburgerButton} alt="Navigation button" />
        </button>
      </div>
    </nav>
  )
}
