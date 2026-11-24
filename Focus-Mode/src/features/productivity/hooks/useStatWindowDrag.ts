import { useEffect, useRef, useState } from 'react'

interface DragStart {
  startMouseX: number
  startMouseY: number
  startLeft: number
  startBottom: number
}

/** Owns the position of the draggable stats window and the mouse handling that moves it. */
export function useStatWindowDrag() {
  const [statPos, setStatPos] = useState({ left: 0, bottom: 0 })
  const dragRef = useRef<DragStart | null>(null)
  const statWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.startMouseX
      const dy = e.clientY - drag.startMouseY
      const w = statWindowRef.current?.offsetWidth ?? 300
      const h = statWindowRef.current?.offsetHeight ?? 400
      setStatPos({
        left: Math.max(0, Math.min(drag.startLeft + dx, window.innerWidth - w)),
        bottom: Math.max(0, Math.min(drag.startBottom - dy, window.innerHeight - h)),
      })
    }
    function onMouseUp() {
      dragRef.current = null
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startLeft: statPos.left,
      startBottom: statPos.bottom,
    }
    e.preventDefault()
  }

  return { statPos, statWindowRef, handleMouseDown }
}