import statsWeekTableBg from '../../../assets/stats-week-table-bg.png'
import tableLine from '../../../assets/table-line.png'
import miniClock from '../../../assets/mini-clock.png'
import hoursTotalBtn from '../../../assets/hours-total-button.png'
import arrowDropdown from '../../../assets/arrow-dropdown.png'
import yellowHighlight from '../../../assets/yellow-highlight.png'
import { cx } from '../../../shared/utils/classNames'
import type { WeekDay } from '../utils/week'
import './WeekTable.css'

interface WeekTableProps {
  weekDays: WeekDay[]
  selectedDay: number
  arrowFlipped: boolean[]
  onSelectDay: (i: number) => void
  onToggleDayDropdown: (i: number) => void
}

const COLUMN_DIVIDERS = [1, 2, 3, 4, 5, 6]
const COLUMNS = [0, 1, 2, 3, 4, 5, 6]

/** Weekly table with one column per day. */
export function WeekTable({ weekDays, selectedDay, arrowFlipped, onSelectDay, onToggleDayDropdown }: WeekTableProps) {
  return (
    <div className="week-table">
      <img className="week-table__background" src={statsWeekTableBg} alt="Weekly Stats" />
      {COLUMN_DIVIDERS.map((i) => (
        <img key={i} className={cx('week-table__line', `week-col-${i}`)} src={tableLine} alt="" />
      ))}
      {weekDays.map((day, i) => (
        <div
          key={i}
          className={cx('week-table__day', `week-col-${i}`, i === selectedDay && 'is-selected')}
          onClick={() => onSelectDay(i)}
        >
          <img className="week-table__highlight" src={yellowHighlight} alt="" />
          <span className="week-table__day-name">{day.name}</span>
          <span className="week-table__day-date">{day.date}</span>
        </div>
      ))}
      {COLUMNS.map((i) => (
        <img key={i} className={cx('week-table__clock', `week-col-${i}`)} src={miniClock} alt="clock" />
      ))}
      {COLUMNS.map((i) => (
        <div
          key={i}
          className={cx('week-table__hours', `week-col-${i}`)}
          onClick={() => onToggleDayDropdown(i)}
        >
          <img className="week-table__hours-image" src={hoursTotalBtn} alt="hours total" />
          <img
            className={cx('week-table__arrow', arrowFlipped[i] && 'is-flipped')}
            src={arrowDropdown}
            alt="arrow"
          />
        </div>
      ))}
    </div>
  )
}