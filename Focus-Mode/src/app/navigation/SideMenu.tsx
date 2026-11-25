import { NavLink } from 'react-router-dom'
import { MenuSide } from '../../shared/components/menuside'
import { PATHS } from './paths'
import './SideMenu.css'

/** Menu entries. Items without `path` do nothing when clicked. */
const SIDE_MENU_TABS: { label: string; path?: string }[] = [
  { label: 'Log In' },
  { label: 'Sign Up' },
  { label: 'Settings', path: PATHS.settings },
]

/** Right-hand menu opened by the navbar's hamburger button. */
export function SideMenu({ onClose }: { onClose: () => void }) {
  return (
    <MenuSide className="side-menu" style={{ background: 'var(--light-yellow)' }}>
      <button type="button" className="side-menu__close" aria-label="Close side menu" onClick={onClose} />
      <h2 className="side-menu__title">Menu</h2>
      <hr className="side-menu__divider" />
      <nav className="side-menu__nav">
        {SIDE_MENU_TABS.map((tab) =>
          tab.path ? (
            <NavLink
              key={tab.label}
              to={tab.path}
              className={({ isActive }) => (isActive ? 'side-menu__item is-active' : 'side-menu__item')}
            >
              {tab.label}
            </NavLink>
          ) : (
            <button key={tab.label} type="button" className="side-menu__item">
              {tab.label}
            </button>
          ),
        )}
      </nav>
    </MenuSide>
  )
}
