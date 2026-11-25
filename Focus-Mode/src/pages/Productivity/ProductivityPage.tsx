import { useState } from 'react'
import { DayPieChart } from '../../features/productivity/components/DayPieChart'
import { ProductivityHeader } from '../../features/productivity/components/ProductivityHeader'
import { StatsWindow } from '../../features/productivity/components/StatsWindow'
import { WeekTable } from '../../features/productivity/components/WeekTable'
import { useProductivityPage } from '../../features/productivity/hooks/useProductivityPage'
import { FULL_DAY_NAMES, getWeekInfo } from '../../features/productivity/utils/week'
import { PillButton } from '../../shared/components/PillButton'
import { MenuSide } from '../../shared/components/menuside'
import keepGrowing from '../../features/motivation/assets/keep-growing.png'
import './ProductivityPage.css'

const DASHBOARD_TABS = ['Weekly Overview', 'Daily Overview', 'My Study Habits', 'more']

interface ProductivityPageProps {
  onBack: () => void
}

export function ProductivityPage({ onBack }: ProductivityPageProps) {
  const page = useProductivityPage()
  const { weekDays, rangeStart, rangeEnd, year } = getWeekInfo()
  const [menuOpen, setMenuOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS[0])

  return (
    <div className="productivity-page page-fade-in">
      {menuOpen && (
        <MenuSide className="productivity-page__sidebar" style={{ background: 'var(--light-yellow)' }}>
          <button
            type="button"
            className="productivity-page__sidebar-close"
            aria-label="Close dashboard menu"
            onClick={() => setMenuOpen(false)}
          />
          <h2 className="productivity-page__sidebar-title">Dashboard</h2>
          <hr className="productivity-page__sidebar-divider" />
          <nav className="productivity-page__sidebar-nav">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={
                  tab === activeTab
                    ? 'productivity-page__sidebar-item is-active'
                    : 'productivity-page__sidebar-item'
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <img className="productivity-page__sidebar-image" src={keepGrowing} alt="Keep going, keep growing" />
        </MenuSide>
      )}

      <div className="productivity-page__main">
        <div className="productivity-page__toolbar-container">
          {!menuOpen && (
            <div className="productivity-page__sidebar-open-container">
              <button 
                type="button"
                className="productivity-page__sidebar-open"
                aria-label="Open dashboard menu"
                onClick={()=>setMenuOpen(true)}
              />
            </div>
          )} 
          <div className="productivity-page__toolbar">
            <PillButton className="productivity-page__toolbar-button">Choose date</PillButton>
            <PillButton className="productivity-page__toolbar-button">View by V</PillButton>
          </div>
        </div>
        <div className="productivity-page__content">
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
        </div>
      </div>


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