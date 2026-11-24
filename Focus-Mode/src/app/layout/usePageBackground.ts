import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { TEAL_BACKGROUND_PATHS } from '../navigation/paths'

/** Keeps the document background in step with the current route. */
export function usePageBackground() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.backgroundColor = TEAL_BACKGROUND_PATHS.includes(pathname) ? '#0097b2' : ''
  }, [pathname])
}