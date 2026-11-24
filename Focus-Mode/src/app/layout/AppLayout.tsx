import { Outlet, useLocation } from 'react-router-dom'
import { LoadingPage } from '../../pages/Loading/LoadingPage'
import { Navbar } from '../navigation/Navbar'
import { usePageBackground } from './usePageBackground'
import { useRouteLoading } from './useRouteLoading'
import './AppLayout.css'

/** Shell shared by every page: the navbar above the routed page (or the loading page). */
export function AppLayout() {
  usePageBackground()
  const { pathname } = useLocation()
  const isLoading = useRouteLoading(pathname)

  return (
    <>
      {isLoading ? <LoadingPage /> : <>
        <Navbar /> 
          <main className="app-layout__content"> 
            <Outlet/>
          </main>
        </>}
      {/*<Navbar />
      <main className="app-layout__content">{isLoading ? <LoadingPage /> : <Outlet />}</main>*/}
    </>
  )
}
