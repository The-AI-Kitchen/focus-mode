import { readLocal, writeLocal } from '../../../services/storage/localStorage'

const TIMER_KEY = 'focus_mode_timer'

export function saveTimer(digits: string): void {
  writeLocal(TIMER_KEY, digits)
}

export function loadTimer(): string {
  return readLocal(TIMER_KEY) ?? ''
}
