const DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface WeekDay {
  name: string
  /** e.g. "March 4" */
  date: string
}

export interface WeekInfo {
  /** Sunday through Saturday of the week containing the reference date. */
  weekDays: WeekDay[]
  /** e.g. "Sun, March 1" */
  rangeStart: string
  /** e.g. "Sat, March 7" */
  rangeEnd: string
  year: number
}

/** Describes the Sunday-to-Saturday week containing `today`. */
export function getWeekInfo(today: Date = new Date()): WeekInfo {
  const sunday = new Date(today)
  sunday.setDate(today.getDate() - today.getDay())
  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return { name: DAY_NAMES[i], date: `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}` }
  })

  return {
    weekDays,
    rangeStart: `Sun, ${MONTH_NAMES[sunday.getMonth()]} ${sunday.getDate()}`,
    rangeEnd: `Sat, ${MONTH_NAMES[saturday.getMonth()]} ${saturday.getDate()}`,
    year: sunday.getFullYear(),
  }
}