import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import { MenuSide } from '../../shared/components/menuside'

// Reuses the dashboard shell styles from the productivity page.
import '../Productivity/ProductivityPage.css'
import './settings.css'

/** Sidebar entries. Items without `path` do nothing when clicked. `activePath` highlights the item. */
const SETTINGS_TABS: { label: string; path?: string; activePath?: string }[] = [
  { label: 'My Profile' , path: PATHS.settings },
  { label: 'Appearance', path: PATHS.settingsAppearance },
  { label: 'Study Goals' },
]

/** Settings shell: sidebar menu around the routed child page. */
export function SettingsPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <div className="productivity-page page-fade-in">
      {menuOpen && (
        <MenuSide className="productivity-page__sidebar" style={{ background: 'var(--light-yellow)' }}>
          <button
            type="button"
            className="productivity-page__sidebar-close"
            aria-label="Close settings menu"
            onClick={() => setMenuOpen(false)}
          />
          <h2 className="productivity-page__sidebar-title">Settings</h2>
          <hr className="productivity-page__sidebar-divider" />
          <nav className="productivity-page__sidebar-nav">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={
                  pathname === (tab.path ?? tab.activePath)
                    ? 'productivity-page__sidebar-item is-active'
                    : 'productivity-page__sidebar-item'
                }
                onClick={tab.path ? () => navigate(tab.path!) : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
        </MenuSide>
      )}

      <div className="productivity-page__main">
        {!menuOpen && (
          <div className="productivity-page__toolbar-container">
            <div className="productivity-page__sidebar-open-container">
              <button
                type="button"
                className="productivity-page__sidebar-open"
                aria-label="Open settings menu"
                onClick={() => setMenuOpen(true)}
              >
                <p>{'>>'}</p>
              </button>
            </div>
          </div>
        )}
        <div className="productivity-page__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
