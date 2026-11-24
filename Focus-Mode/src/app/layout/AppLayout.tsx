import { Outlet } from 'react-router-dom'
import { Navbar } from '../navigation/Navbar'
import { usePageBackground } from './usePageBackground'
import './AppLayout.css'

/** Shell shared by every page: the navbar above the routed page. */
export function AppLayout() {
  usePageBackground()

  return (
    <>
      <Navbar />
      <main className="app-layout__content">
        <Outlet />
      </main>
    </>
  )
}