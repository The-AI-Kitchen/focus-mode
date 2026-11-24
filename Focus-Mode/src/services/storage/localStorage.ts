/**
 * Thin wrapper around the browser's `localStorage`.
 */

export function readLocal(key: string): string | null {
  return localStorage.getItem(key)
}

export function writeLocal(key: string, value: string): void {
  localStorage.setItem(key, value)
}

/** Reads and parses a JSON value. Returns `fallback` if missing or unparsable. */
export function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeLocalJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
