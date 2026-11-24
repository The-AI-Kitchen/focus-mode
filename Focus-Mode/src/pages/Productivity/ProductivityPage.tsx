import { DayPieChart } from '../../features/productivity/components/DayPieChart'
import { ProductivityHeader } from '../../features/productivity/components/ProductivityHeader'
import { StatsWindow } from '../../features/productivity/components/StatsWindow'
import { WeekTable } from '../../features/productivity/components/WeekTable'
import { useProductivityPage } from '../../features/productivity/hooks/useProductivityPage'
import { FULL_DAY_NAMES, getWeekInfo } from '../../features/productivity/utils/week'
import { PillButton } from '../../shared/components/PillButton'
import './ProductivityPage.css'

interface ProductivityPageProps {
  onBack: () => void
}

export function ProductivityPage({ onBack }: ProductivityPageProps) {
  const page = useProductivityPage()
  const { weekDays, rangeStart, rangeEnd, year } = getWeekInfo()

  return (
    <div className="productivity-page page-fade-in">
      {page.statView === 'list' ? (
        <div key="list-view" className="productivity-page__view page-fade-in">
          <ProductivityHeader label={`${rangeStart} – ${rangeEnd}`} year={year} />
          <WeekTable
            weekDays={weekDays}
            selectedDay={page.selectedDay}
            arrowFlipped={page.arrowFlipped}
            onSelectDay={page.handleSelectDay}
            onToggleDayDropdown={page.handleToggleDayDropdown}
          />
        </div>
      ) : (
        <div key="chart-view" className="productivity-page__view page-fade-in">
          <ProductivityHeader
            label={`${FULL_DAY_NAMES[page.selectedDay]}, ${weekDays[page.selectedDay].date}`}
            year={year}
          />
          <DayPieChart
            clickable={page.openStatDay === null}
            onClick={() => {
              if (page.openStatDay === null) page.handleSelectDay(page.selectedDay)
            }}
          />
        </div>
      )}

      {page.openStatDay !== null && (
        <StatsWindow
          visible={page.statVisible}
          position={page.statPos}
          windowRef={page.statWindowRef}
          onMouseDown={page.handleStatWindowMouseDown}
          onViewChange={page.handleStatViewChange}
          onClose={page.handleCloseStatWindow}
        />
      )}

      <PillButton className="productivity-page__back" onClick={onBack}>
        Back
      </PillButton>
    </div>
  )
}