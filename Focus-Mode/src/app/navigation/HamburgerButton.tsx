import './HamburgerButton.css'

/** Hamburger menu icon. Does not open anything yet. */
export function HamburgerButton() {
  return (
    <button type="button" className="hamburger-button" aria-label="Menu">
      <span className="hamburger-button__bar" />
      <span className="hamburger-button__bar" />
      <span className="hamburger-button__bar" />
    </button>
  )
}