import React from 'react'
import statsWeekTableBg from '../assets/stats-week-table-bg.png'
import tableLine from '../assets/table-line.png'
import miniClock from '../assets/mini-clock.png'
import hoursTotalBtn from '../assets/hours-total-button.png'
import statWindow from '../assets/stat-window.png'
import piButton from '../assets/pi-button.png'
import piChartPlaceholder from '../assets/pi-chart-placeholder.png'
import listButton from '../assets/list-button.png'
import yellowHighlight from '../assets/yellow-highlight.png'
import arrowDropdown from '../assets/arrow-dropdown.png'

interface ProductivityPageProps {
  statView: 'list' | 'chart'
  selectedDay: number
  openStatDay: number | null
  statVisible: boolean
  arrowFlipped: boolean[]
  statPos: { left: number; bottom: number }
  statWindowRef: React.RefObject<HTMLDivElement | null>
  onSelectDay: (i: number) => void
  onToggleDayDropdown: (i: number) => void
  onStatWindowMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onStatViewChange: (view: 'list' | 'chart') => void
  onCloseStatWindow: () => void
  onBack: () => void
}

export function ProductivityPage({
  statView,
  selectedDay,
  openStatDay,
  statVisible,
  arrowFlipped,
  statPos,
  statWindowRef,
  onSelectDay,
  onToggleDayDropdown,
  onStatWindowMouseDown,
  onStatViewChange,
  onCloseStatWindow,
  onBack,
}: ProductivityPageProps) {
  const today = new Date()
  const todayIndex = today.getDay()
  const sunday = new Date(today)
  sunday.setDate(today.getDate() - todayIndex)
  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return { name: dayNames[i], date: `${fullMonthNames[d.getMonth()]} ${d.getDate()}` }
  })
  const rangeStart = `Sun, ${fullMonthNames[sunday.getMonth()]} ${sunday.getDate()}`
  const rangeEnd = `Sat, ${fullMonthNames[saturday.getMonth()]} ${saturday.getDate()}`
  const year = sunday.getFullYear()

  return (
    <div key="productivity-page" className="page-fade-in" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#0097b2', position: 'relative', boxSizing: 'border-box' }}>
      {statView === 'list' ? (
        <div key={`list-view`} className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', paddingTop: '6vh', boxSizing: 'border-box' }}>
          <div style={{ width: 'calc(100% - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6%', marginBottom: '6px', boxSizing: 'border-box' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
              {rangeStart} – {rangeEnd}
            </span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
              {year}
            </span>
          </div>
          <div style={{ position: 'relative', display: 'inline-block', width: 'calc(100% - 80px)', margin: '0 40px' }}>
            <img src={statsWeekTableBg} alt="Weekly Stats" style={{ width: '100%', height: 'auto', display: 'block' }} />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <img
                key={i}
                src={tableLine}
                alt=""
                style={{
                  position: 'absolute',
                  top: '0',
                  left: `${(i / 7) * 100}%`,
                  height: '100%',
                  width: 'auto',
                }}
              />
            ))}
            {weekDays.map((day, i) => {
              const isSelected = i === selectedDay
              return (
                <div
                  key={i}
                  onClick={() => onSelectDay(i)}
                  style={{
                    position: 'absolute',
                    top: isSelected ? '0%' : '3%',
                    left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                    transform: 'translateX(-50%)',
                    width: `${(1 / 7) * 85}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2% 0',
                    cursor: 'pointer',
                    transition: 'top 0.3s ease',
                  }}
                >
                  <img
                    src={yellowHighlight}
                    alt=""
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '90%',
                      height: '70%',
                      objectFit: 'fill',
                      zIndex: 0,
                      opacity: isSelected ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '800', fontSize: '2vw', color: '#222', lineHeight: 1.2, position: 'relative', zIndex: 1 }}>{day.name}</span>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '400', fontSize: '1.4vw', color: '#222', lineHeight: 1.2, position: 'relative', zIndex: 1 }}>{day.date}</span>
                </div>
              )
            })}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <img
                key={i}
                src={miniClock}
                alt="clock"
                style={{
                  position: 'absolute',
                  top: '39%',
                  left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                  transform: 'translateX(-50%)',
                  height: '15%',
                  width: 'auto',
                }}
              />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                onClick={() => onToggleDayDropdown(i)}
                style={{
                  position: 'absolute',
                  top: '62%',
                  left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                  transform: 'translateX(-50%)',
                  height: '25%',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <img src={hoursTotalBtn} alt="hours total" style={{ height: '100%', width: 'auto' }} />
                <img
                  src={arrowDropdown}
                  alt="arrow"
                  style={{
                    position: 'absolute',
                    right: '6%',
                    bottom: '32.5%',
                    height: '20%',
                    width: 'auto',
                    transform: arrowFlipped[i] ? 'scaleY(-1)' : 'scaleY(1)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div key="chart-view" className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', paddingTop: '6vh', boxSizing: 'border-box' }}>
          <div style={{ width: 'calc(100% - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6%', marginBottom: '6px', boxSizing: 'border-box' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
              {fullDayNames[selectedDay]}, {weekDays[selectedDay].date}
            </span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
              {year}
            </span>
          </div>
          <img
            src={piChartPlaceholder}
            alt="Pie chart"
            onClick={() => { if (openStatDay === null) onSelectDay(selectedDay) }}
            style={{ maxHeight: '70vh', maxWidth: '70vw', width: 'auto', height: 'auto', marginTop: '3vh', cursor: openStatDay === null ? 'pointer' : 'default' }}
          />
        </div>
      )}

      {/* Stats Window */}
      {openStatDay !== null && (
        <div
          ref={statWindowRef as React.RefObject<HTMLDivElement>}
          onMouseDown={onStatWindowMouseDown}
          style={{
            position: 'fixed',
            left: statPos.left,
            bottom: statPos.bottom,
            opacity: statVisible ? 1 : 0,
            transform: statVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <img src={statWindow} alt="Stats" style={{ width: 'clamp(220px, 25vw, 400px)', display: 'block' }} />
          <img
            src={piButton}
            alt="Chart view"
            onClick={(e) => { e.stopPropagation(); onStatViewChange('chart') }}
            style={{ position: 'absolute', top: '2%', right: '33%', width: '14%', cursor: 'pointer', userSelect: 'none' }}
          />
          <img
            src={listButton}
            alt="List view"
            onClick={(e) => { e.stopPropagation(); onStatViewChange('list') }}
            style={{ position: 'absolute', top: '2%', right: '16%', width: '14%', cursor: 'pointer', userSelect: 'none' }}
          />
          <div
            onClick={(e) => {
              e.stopPropagation()
              onCloseStatWindow()
            }}
            style={{
              position: 'absolute',
              top: '2%',
              right: '2%',
              width: '12%',
              height: '8%',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

      <button
        onClick={onBack}
        style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '10px 28px', borderRadius: '999px', border: 'none', backgroundColor: '#4a4a4a', color: '#fff', fontSize: '16px', cursor: 'pointer', zIndex: 10 }}
      >
        Back
      </button>
    </div>
  )
}
