const LINKS_KEY = 'focus_mode_links'
const TIMER_KEY = 'focus_mode_timer'

export interface LinkEntry {
  id: string
  url: string
  siteName: string
  accessedAt: number
}

function isChromeStorageAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean((window as any).chrome?.storage?.local)
}

function chromeStorageGet<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    if (!isChromeStorageAvailable()) return resolve(undefined)
    ;(window as any).chrome.storage.local.get(key, (result: any) => {
      resolve(result?.[key])
    })
  })
}

function chromeStorageSet<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    if (!isChromeStorageAvailable()) return resolve()
    ;(window as any).chrome.storage.local.set({ [key]: value }, () => {
      resolve()
    })
  })
}

async function loadLinks(): Promise<LinkEntry[]> {
  const chromeStored = await chromeStorageGet<LinkEntry[]>(LINKS_KEY)
  if (chromeStored !== undefined) return chromeStored

  try {
    const raw = localStorage.getItem(LINKS_KEY)
    return raw ? (JSON.parse(raw) as LinkEntry[]) : []
  } catch {
    return []
  }
}

async function saveLinks(links: LinkEntry[]): Promise<void> {
  await chromeStorageSet(LINKS_KEY, links)
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

export async function addLink(url: string, siteName: string): Promise<LinkEntry> {
  const entry: LinkEntry = {
    id: crypto.randomUUID(),
    url: url.trim(),
    siteName: siteName.trim(),
    accessedAt: Date.now(),
  }
  const links = await loadLinks()
  links.push(entry)
  await saveLinks(links)
  return entry
}

export async function getLinks(): Promise<LinkEntry[]> {
  return loadLinks()
}

export async function removeLink(id: string): Promise<void> {
  const links = (await loadLinks()).filter((l) => l.id !== id)
  await saveLinks(links)
}

export function saveTimer(digits: string): void {
  localStorage.setItem(TIMER_KEY, digits)
}

export function loadTimer(): string {
  return localStorage.getItem(TIMER_KEY) ?? ''
}
