import { readLocal, writeLocal } from '../../services/storage/localStorage'
import type { AppearanceMode } from './appearanceContext'

const APPEARANCE_KEY = 'focus_mode_appearance'

/** Saved light/dark preference. Defaults to light when nothing valid is saved (e.g. first visit). */
export function loadAppearance(): AppearanceMode {
  try {
    return readLocal(APPEARANCE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveAppearance(mode: AppearanceMode): void {
  try {
    writeLocal(APPEARANCE_KEY, mode)
  } catch {
    // Storage unavailable: the preference just won't persist.
  }
}
