/**
 * Thin wrapper around `chrome.storage.local`.
 * Every function degrades to a no-op when the app runs outside a Chrome extension.
 */

interface ChromeStorageArea {
  get: (key: string, callback: (result: Record<string, unknown>) => void) => void
  set: (items: Record<string, unknown>, callback: () => void) => void
}

function getChromeStorage(): ChromeStorageArea | undefined {
  if (typeof window === 'undefined') return undefined
  const chromeApi = (window as unknown as { chrome?: { storage?: { local?: ChromeStorageArea } } }).chrome
  return chromeApi?.storage?.local
}

export function isChromeStorageAvailable(): boolean {
  return Boolean(getChromeStorage())
}

export function chromeStorageGet<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    const storage = getChromeStorage()
    if (!storage) return resolve(undefined)
    storage.get(key, (result) => {
      resolve(result?.[key] as T | undefined)
    })
  })
}

export function chromeStorageSet<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    const storage = getChromeStorage()
    if (!storage) return resolve()
    storage.set({ [key]: value }, () => {
      resolve()
    })
  })
}
