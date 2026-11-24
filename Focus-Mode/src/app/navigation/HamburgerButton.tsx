import './HamburgerButton.css'

/** Hamburger menu icon. Does not open anything yet. */
export function HamburgerButton() {
  return (
    <div className="nav_button_container">
      <button type="button" id="navbar-hamburger-button" aria-label="Menu">
        <span className="hamburger-button__bar" />
        <span className="hamburger-button__bar" />
        <span className="hamburger-button__bar" />
      </button>
    </div>
  )
}