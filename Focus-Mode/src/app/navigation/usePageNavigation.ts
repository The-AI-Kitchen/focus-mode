import { useEffect, useState } from 'react'

export type Page = 'home' | 'confirmed' | 'timer' | 'productivity'

const TEAL_BACKGROUND_PAGES: Page[] = ['timer', 'productivity']

/** Owns which page is showing and keeps the document background in step with it. */
export function usePageNavigation() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    document.body.style.backgroundColor = TEAL_BACKGROUND_PAGES.includes(page) ? '#0097b2' : ''
  }, [page])

  return {
    page,
    goHome: () => setPage('home'),
    goToConfirmed: () => setPage('confirmed'),
    goToTimer: () => setPage('timer'),
    goToProductivity: () => setPage('productivity'),
  }
}