import { useState, useEffect } from 'react'

export function usePageNavigation() {
  const [onNextPage, setOnNextPage] = useState(false)
  const [showProductivity, setShowProductivity] = useState(false)

  // Set page background colors based on navigation state
  useEffect(() => {
    document.body.style.backgroundColor = (onNextPage || showProductivity) ? '#0097b2' : ''
  }, [onNextPage, showProductivity])

  return {
    onNextPage,
    setOnNextPage,
    showProductivity,
    setShowProductivity,
  }
}
