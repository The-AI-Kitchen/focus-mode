import { useNavigate } from 'react-router-dom'
import { ProductivityHeader } from '../../../features/productivity/components/ProductivityHeader'
import { WeekTable } from '../../../features/productivity/components/WeekTable'
import { getWeekInfo } from '../../../features/productivity/utils/week'
import { PATHS } from '../../../app/navigation/paths'
import './WeeklyOverview.css'

const NO_ARROWS_FLIPPED = Array<boolean>(7).fill(false)

/** Week table. Clicking a day (or its hours button) opens the Daily Overview. The clicked day is not saved yet. */
export function WeeklyOverview() {
  const navigate = useNavigate()
  const { weekDays, rangeStart, rangeEnd, year } = getWeekInfo()
  const openDailyOverview = () => navigate(PATHS.productivityDaily)

  return (
    <div className="productivity-page__view page-fade-in">
      <ProductivityHeader label={`${rangeStart} – ${rangeEnd}`} year={year} />
      <WeekTable
        weekDays={weekDays}
        selectedDay={new Date().getDay()}
        arrowFlipped={NO_ARROWS_FLIPPED}
        onSelectDay={openDailyOverview}
        onToggleDayDropdown={openDailyOverview}
      />
    </div>
  )
}
