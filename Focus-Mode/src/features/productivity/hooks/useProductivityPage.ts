import { useState } from 'react'
import { useDaySelection } from './useDaySelection'
import { useStatWindowDrag } from './useStatWindowDrag'

export type StatView = 'list' | 'chart'

/** Controller for the productivity page: combines the view mode, day selection and stats window dragging. */
export function useProductivityPage() {
  const [statView, setStatView] = useState<StatView>('list')
  const daySelection = useDaySelection()
  const drag = useStatWindowDrag()

  return {
    statView,
    handleStatViewChange: setStatView,
    ...daySelection,
    statPos: drag.statPos,
    statWindowRef: drag.statWindowRef,
    handleStatWindowMouseDown: drag.handleMouseDown,
  }
}