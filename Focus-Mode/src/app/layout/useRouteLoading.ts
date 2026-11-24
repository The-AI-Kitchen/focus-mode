import { useEffect, useState } from 'react'

/** Deliberate delay so the loading page can be tested. Set to 0 to disable. */
export const ROUTE_LOADING_MS = 1000

/** True for ROUTE_LOADING_MS after the app opens and after every route change. */
export function useRouteLoading(pathname: string) {
  const [readyPath, setReadyPath] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setReadyPath(pathname), ROUTE_LOADING_MS)
    return () => clearTimeout(t)
  }, [pathname])

  return readyPath !== pathname
}
