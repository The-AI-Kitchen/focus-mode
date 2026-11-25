import { DayPieChart } from '../../../features/productivity/components/DayPieChart'
import { ProductivityHeader } from '../../../features/productivity/components/ProductivityHeader'
import { StatsWindow } from '../../../features/productivity/components/StatsWindow'
import { useStatWindowDrag } from '../../../features/productivity/hooks/useStatWindowDrag'
import { FULL_DAY_NAMES, getWeekInfo } from '../../../features/productivity/utils/week'
import './DailyOverview.css'

/** Pie chart and stats window. Shows today until the clicked day is saved. */
export function DailyOverview() {
  const { weekDays, year } = getWeekInfo()
  const today = new Date().getDay()
  const drag = useStatWindowDrag()

  return (
    <div className="productivity-page__view page-fade-in">
      <ProductivityHeader label={`${FULL_DAY_NAMES[today]}, ${weekDays[today].date}`} year={year} />
      <DayPieChart clickable={false} onClick={() => {}} />
      <StatsWindow
        visible
        position={drag.statPos}
        windowRef={drag.statWindowRef}
        onMouseDown={drag.handleMouseDown}
        onViewChange={() => {}}
        onClose={() => {}}
      />
    </div>
  )
}
