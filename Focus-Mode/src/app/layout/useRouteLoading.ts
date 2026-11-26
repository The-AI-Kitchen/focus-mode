import { useEffect, useState } from 'react'
import { PATHS } from '../navigation/paths'

/** Deliberate delay so the loading page can be tested. Set to 0 to disable. */
export const ROUTE_LOADING_MS = 1000

const isThemePath = (path: string | null) => path === PATHS.darkMode || path === PATHS.lightMode

/** True for ROUTE_LOADING_MS after the app opens and after every route change. */
export function useRouteLoading(pathname: string) {
  const [readyPath, setReadyPath] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setReadyPath(pathname), ROUTE_LOADING_MS)
    return () => clearTimeout(t)
  }, [pathname])

  // No loading page when going to or from the theme pages; they act as the loading page for theme changes.
  const skip = isThemePath(pathname) || isThemePath(readyPath)
  return readyPath !== pathname && !skip
}


