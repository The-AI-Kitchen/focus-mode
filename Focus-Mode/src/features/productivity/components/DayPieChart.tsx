import piChartPlaceholder from '../../../assets/pi-chart-placeholder.png'
import { cx } from '../../../shared/utils/classNames'
import './DayPieChart.css'

interface DayPieChartProps {
  clickable: boolean
  onClick: () => void
}

/** Pie chart for the selected day (currently a placeholder image). */
export function DayPieChart({ clickable, onClick }: DayPieChartProps) {
  return (
    <img
      className={cx('day-pie-chart', clickable && 'is-clickable')}
      src={piChartPlaceholder}
      alt="Pie chart"
      onClick={onClick}
    />
  )
}