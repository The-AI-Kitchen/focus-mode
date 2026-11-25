/** URL paths for every page in the app. */
export const PATHS = {
  home: '/',
  confirmation: '/confirmation',
  confirmed: '/confirmed',
  timer: '/timer',
  productivity: '/productivity',
  productivityWeekly: '/productivity/weekly',
  productivityDaily: '/productivity/daily',
  productivityHabits: '/productivity/habits',
} as const

/** Pages that use the teal page background instead of the default one. */
export const TEAL_BACKGROUND_PATHS: string[] = [
  PATHS.timer,
  PATHS.productivity,
  PATHS.productivityWeekly,
  PATHS.productivityDaily,
  PATHS.productivityHabits,
]
