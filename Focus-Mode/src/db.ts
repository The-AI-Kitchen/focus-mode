const LINKS_KEY = 'focus_mode_links'
const TIMER_KEY = 'focus_mode_timer'

/**Note: this file is now the data storage layer. All work on the database will be done here. */
export interface LinkEntry {
  id: string
  url: string
  siteName: string
  accessedAt: number
  accessDuration?: number // Optional: duration in milliseconds spent on the site
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

//The following function gets the name of the site from the URL. It does this by creating a new URL object and extracting the hostname, then removing any "www." prefix and suffixes.
function extractSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, '').split('.')[0] // Get the first part of the hostname
  } catch {
    return url // If URL parsing fails, return the original URL
  }
}
//When a new link is accessed, update the duration of the previous link (O(1) operation)
async function updatePreviousLinkDuration(links: LinkEntry[]): Promise<void> {
  if (links.length < 2) return // Need at least 2 links
  
  const lastIndex = links.length - 1
  const currentLink = links[lastIndex]
  const previousLink = links[lastIndex - 1]
  
  // Duration of previous link = time until next link was accessed
  previousLink.accessDuration = currentLink.accessedAt - previousLink.accessedAt
  
  await saveLinks(links)
}

export async function addLink(url: string, siteName: string): Promise<LinkEntry> {
  const entry: LinkEntry = {
    id: crypto.randomUUID(),
    url: url.trim(),
    siteName: extractSiteName(siteName.trim() || url.trim()), //site name is extracted from url if not provided.
    accessedAt: Date.now(),
  }
  let links = await loadLinks()
  links.push(entry)
  // Update duration of the previous link (O(1))
  await updatePreviousLinkDuration(links)
  return entry
}

export async function getLinks(): Promise<LinkEntry[]> {
  const links = await loadLinks()
  
  // Calculate duration for the current (last) link if it doesn't have one
  if (links.length > 0) {
    const lastLink = links[links.length - 1]
    if (!lastLink.accessDuration) {
      lastLink.accessDuration = Date.now() - lastLink.accessedAt
    }
  }
  
  return links
}

export async function removeLink(id: string): Promise<void> {
  let links = (await loadLinks()).filter((l) => l.id !== id)
  // Recalculate duration of the second-to-last link (if it exists)
  if (links.length >= 2) {
    const lastIndex = links.length - 1
    const previousLink = links[lastIndex - 1]
    const currentLink = links[lastIndex]
    previousLink.accessDuration = currentLink.accessedAt - previousLink.accessedAt
  }
  await saveLinks(links)
}

export function saveTimer(digits: string): void {
  localStorage.setItem(TIMER_KEY, digits)
}

export function loadTimer(): string {
  return localStorage.getItem(TIMER_KEY) ?? ''
}
