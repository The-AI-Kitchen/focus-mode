import { useState } from 'react'

const DAYS_IN_WEEK = 7

/**
 * Owns which day is selected and which day's stats window is open,
 * including the fade timing and dropdown-arrow state that go with them.
 */
export function useDaySelection() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
  const [openStatDay, setOpenStatDay] = useState<number | null>(null)
  const [statVisible, setStatVisible] = useState(false)
  const [arrowFlipped, setArrowFlipped] = useState<boolean[]>(Array(DAYS_IN_WEEK).fill(false))

  function handleSelectDay(i: number) {
    setSelectedDay(i)
    setArrowFlipped((prev) => prev.map((v, j) => (j === i ? true : j === openStatDay ? false : v)))
    if (openStatDay === i) return
    if (openStatDay !== null) {
      setStatVisible(false)
      setTimeout(() => {
        setOpenStatDay(i)
        setTimeout(() => setStatVisible(true), 30)
      }, 250)
    } else {
      setOpenStatDay(i)
      setTimeout(() => setStatVisible(true), 20)
    }
  }

  function handleToggleDayDropdown(i: number) {
    if (openStatDay === i) {
      setArrowFlipped((prev) => prev.map((v, j) => (j === i ? false : v)))
      setStatVisible(false)
      setTimeout(() => setOpenStatDay(null), 300)
    } else {
      handleSelectDay(i)
    }
  }

  function handleCloseStatWindow() {
    setArrowFlipped((prev) => prev.map((v, j) => (j === openStatDay ? false : v)))
    setStatVisible(false)
    setTimeout(() => setOpenStatDay(null), 300)
  }

  return {
    selectedDay,
    openStatDay,
    statVisible,
    arrowFlipped,
    handleSelectDay,
    handleToggleDayDropdown,
    handleCloseStatWindow,
  }
}