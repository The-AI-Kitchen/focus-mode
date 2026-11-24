import { useState, useRef, useEffect } from 'react'

export function useProductivityPage() {
  // View state
  const [statView, setStatView] = useState<'list' | 'chart'>('list')
  const [arrowFlipped, setArrowFlipped] = useState<boolean[]>(Array(7).fill(false))
  const [openStatDay, setOpenStatDay] = useState<number | null>(null)
  const [statVisible, setStatVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
  const [statPos, setStatPos] = useState({ left: 0, bottom: 0 })

  // References
  const statDragRef = useRef<{ startMouseX: number; startMouseY: number; startLeft: number; startBottom: number } | null>(null)
  const statWindowRef = useRef<HTMLDivElement>(null)

  // Drag handling effect
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!statDragRef.current) return
      const dx = e.clientX - statDragRef.current.startMouseX
      const dy = e.clientY - statDragRef.current.startMouseY
      const w = statWindowRef.current?.offsetWidth ?? 300
      const h = statWindowRef.current?.offsetHeight ?? 400
      setStatPos({
        left: Math.max(0, Math.min(statDragRef.current.startLeft + dx, window.innerWidth - w)),
        bottom: Math.max(0, Math.min(statDragRef.current.startBottom - dy, window.innerHeight - h)),
      })
    }
    function onMouseUp() { statDragRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  function handleSelectDay(i: number) {
    setSelectedDay(i)
    setArrowFlipped((prev) => prev.map((v, j) => j === i ? true : j === openStatDay ? false : v))
    if (openStatDay === i) return
    if (openStatDay !== null) {
      setStatVisible(false)
      setTimeout(() => { setOpenStatDay(i); setTimeout(() => setStatVisible(true), 30) }, 250)
    } else {
      setOpenStatDay(i)
      setTimeout(() => setStatVisible(true), 20)
    }
  }

  function handleToggleDayDropdown(i: number) {
    if (openStatDay === i) {
      setArrowFlipped((prev) => prev.map((v, j) => j === i ? false : v))
      setStatVisible(false)
      setTimeout(() => setOpenStatDay(null), 300)
    } else {
      handleSelectDay(i)
    }
  }

  function handleStatWindowMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    statDragRef.current = { startMouseX: e.clientX, startMouseY: e.clientY, startLeft: statPos.left, startBottom: statPos.bottom }
    e.preventDefault()
  }

  function handleStatViewChange(view: 'list' | 'chart') {
    setStatView(view)
  }

  function handleCloseStatWindow() {
    setArrowFlipped((prev) => prev.map((v, j) => j === openStatDay ? false : v))
    setStatVisible(false)
    setTimeout(() => setOpenStatDay(null), 300)
  }

  return {
    // State
    statView,
    arrowFlipped,
    openStatDay,
    statVisible,
    selectedDay,
    statPos,
    // References
    statWindowRef,
    // Handlers
    handleSelectDay,
    handleToggleDayDropdown,
    handleStatWindowMouseDown,
    handleStatViewChange,
    handleCloseStatWindow,
  }
}
