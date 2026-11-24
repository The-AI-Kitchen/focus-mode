/** URL paths for every page in the app. */
export const PATHS = {
  home: '/',
  confirmed: '/confirmed',
  timer: '/timer',
  productivity: '/productivity',
} as const

/** Pages that use the teal page background instead of the default one. */
export const TEAL_BACKGROUND_PATHS: string[] = [PATHS.timer, PATHS.productivity]