import { chromeStorageGet, chromeStorageSet } from '../../../services/storage/chromeStorage'
import { readLocalJson, writeLocalJson } from '../../../services/storage/localStorage'
import type { LinkEntry } from '../types'

const LINKS_KEY = 'focus_mode_links'

async function loadLinks(): Promise<LinkEntry[]> {
  const chromeStored = await chromeStorageGet<LinkEntry[]>(LINKS_KEY)
  if (chromeStored !== undefined) return chromeStored

  return readLocalJson<LinkEntry[]>(LINKS_KEY, [])
}

async function saveLinks(links: LinkEntry[]): Promise<void> {
  await chromeStorageSet(LINKS_KEY, links)
  writeLocalJson(LINKS_KEY, links)
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
