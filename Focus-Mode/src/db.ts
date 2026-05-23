const LINKS_KEY = 'focus_mode_links'
const TIMER_KEY = 'focus_mode_timer'

export interface LinkEntry {
  id: string
  url: string
  addedAt: number
}

function loadLinks(): LinkEntry[] {
  try {
    const raw = localStorage.getItem(LINKS_KEY)
    return raw ? (JSON.parse(raw) as LinkEntry[]) : []
  } catch {
    return []
  }
}

function saveLinks(links: LinkEntry[]): void {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

export function addLink(url: string): LinkEntry {
  const entry: LinkEntry = {
    id: crypto.randomUUID(),
    url: url.trim(),
    addedAt: Date.now(),
  }
  const links = loadLinks()
  links.push(entry)
  saveLinks(links)
  return entry
}

export function getLinks(): LinkEntry[] {
  return loadLinks()
}

export function removeLink(id: string): void {
  const links = loadLinks().filter((l) => l.id !== id)
  saveLinks(links)
}

export function saveTimer(digits: string): void {
  localStorage.setItem(TIMER_KEY, digits)
}

export function loadTimer(): string {
  return localStorage.getItem(TIMER_KEY) ?? ''
}
