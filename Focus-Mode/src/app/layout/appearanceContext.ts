import { createContext, useContext } from 'react'

export type AppearanceMode = 'light' | 'dark'

interface AppearanceContextValue {
  mode: AppearanceMode
  setMode: (mode: AppearanceMode) => void
}

export const AppearanceContext = createContext<AppearanceContextValue>({
  mode: 'light',
  setMode: () => {},
})

/** Reads and updates the user's light/dark preference held in AppLayout. */
export function useAppearance() {
  return useContext(AppearanceContext)
}
