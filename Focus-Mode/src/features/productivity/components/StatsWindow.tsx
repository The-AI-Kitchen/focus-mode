import statWindow from '../../../assets/stat-window.png'
import piButton from '../../../assets/pi-button.png'
import listButton from '../../../assets/list-button.png'
import { cx } from '../../../shared/utils/classNames'
import type { StatView } from '../hooks/useProductivityPage'
import './StatsWindow.css'

interface StatsWindowProps {
  visible: boolean
  position: { left: number; bottom: number }
  windowRef: React.RefObject<HTMLDivElement | null>
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onViewChange: (view: StatView) => void
  onClose: () => void
}

/** Draggable window with the stats for the open day. */
export function StatsWindow({ visible, position, windowRef, onMouseDown, onViewChange, onClose }: StatsWindowProps) {
  return (
    <div
      ref={windowRef as React.RefObject<HTMLDivElement>}
      className={cx('stats-window', visible && 'is-visible')}
      // Runtime position while dragging
      style={{ left: position.left, bottom: position.bottom }}
      onMouseDown={onMouseDown}
    >
      <img className="stats-window__image" src={statWindow} alt="Stats" />
      <img
        className="stats-window__view-button stats-window__view-button--chart"
        src={piButton}
        alt="Chart view"
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('chart')
        }}
      />
      <img
        className="stats-window__view-button stats-window__view-button--list"
        src={listButton}
        alt="List view"
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('list')
        }}
      />
      <div
        className="stats-window__close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />
    </div>
  )
}