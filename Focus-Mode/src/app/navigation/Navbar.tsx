import { NavLink } from 'react-router-dom'
import { HamburgerButton } from './HamburgerButton'
import { PATHS } from './paths'
import './Navbar.css'

/** Site-wide navigation bar. */
export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__links">
        <NavLink className="navbar__link" to={PATHS.home} end>
          Home
        </NavLink>
        {/* Placeholder: intentionally goes nowhere yet */}
        <button type="button" className="navbar__link navbar__link--inactive">
          AI Agent
        </button>
        <NavLink className="navbar__link" to={PATHS.productivity}>
          Site tracker
        </NavLink>
        <NavLink className="navbar__link" to={PATHS.confirmed}>
          Lock in sesh
        </NavLink>
      </div>
      <HamburgerButton />
    </nav>
  )
}