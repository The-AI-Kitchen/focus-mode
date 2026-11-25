import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../app/navigation/paths'
import { PillButton } from '../../shared/components/PillButton'
import { MenuSide } from '../../shared/components/menuside'
import keepGrowing from '../../features/motivation/assets/keep-growing.png'
import './ProductivityPage.css'

/** Sidebar entries. Items without `path` do nothing when clicked. `activePath` highlights the item. */
const DASHBOARD_TABS: { label: string; path?: string; activePath?: string }[] = [
  { label: 'Weekly Overview', path: PATHS.productivityWeekly },
  { label: 'Daily Overview', path: PATHS.productivityDaily },
  { label: 'My Study Habits', path: PATHS.productivityHabits },
  { label: 'more' },
]

/** Dashboard shell for the productivity pages: sidebar and top menu around the routed child page. */
export function ProductivityPage() {
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
            aria-label="Close dashboard menu"
            onClick={() => setMenuOpen(false)}
          />
          <h2 className="productivity-page__sidebar-title">Dashboard</h2>
          <hr className="productivity-page__sidebar-divider" />
          <nav className="productivity-page__sidebar-nav">
            {DASHBOARD_TABS.map((tab) => (
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
          <img className="productivity-page__sidebar-image" src={keepGrowing} alt="Keep going, keep growing" />
        </MenuSide>
      )}

      <div className="productivity-page__main">
        <div className="productivity-page__toolbar-container">
          {!menuOpen && (
            <div className="productivity-page__sidebar-open-container">
              <button 
                type="button"
                className="productivity-page__sidebar-open"
                aria-label="Open dashboard menu"
                onClick={()=>setMenuOpen(true)}
              >
                <p>{">>"}</p>
                </button>
            </div>
          )} 
          <div className="productivity-page__toolbar">
            <PillButton className="productivity-page__toolbar-button">Choose date</PillButton>
            <PillButton className="productivity-page__toolbar-button">View by V</PillButton>
          </div>
        </div>
        <div className="productivity-page__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}