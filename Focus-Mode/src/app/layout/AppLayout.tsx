import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LoadingPage } from '../../pages/Loading/LoadingPage'
import { Navbar } from '../navigation/Navbar'
import { SideMenu } from '../navigation/SideMenu'
import { usePageBackground } from './usePageBackground'
import { useRouteLoading } from './useRouteLoading'
import './AppLayout.css'

/** Shell shared by every page: the navbar above the routed page (or the loading page) and the side menu. */
export function AppLayout() {
  usePageBackground()
  const { pathname } = useLocation()
  const isLoading = useRouteLoading(pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  return isLoading ? (
    <LoadingPage />
  ) : (
    <>
      <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
      <div className="app-layout__body">
        <main className="app-layout__content">
          <Outlet />
        </main>
        {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </>
  )
}
