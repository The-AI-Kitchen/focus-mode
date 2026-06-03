import { getLinks, removeLink, loadLinks, saveLinks, type LinkEntry } from './db'

// Sorts an array of links by website name in alphabetical order
export function sortLinksByDomain(links: LinkEntry[]): LinkEntry[] {
  return links.sort((a, b) => a.siteName.localeCompare(b.siteName))
}

// Gets all links accessed on a specific day
// date: Date object or date string (e.g., "September 2, 2026" or new Date(2026, 8, 2))
export async function getLinksByDay(date: Date | string): Promise<LinkEntry[]> {
  const links = await getLinks()    
  const targetDate = new Date(date)
  
  // Normalize to YYYY-MM-DD for comparison
  const targetDay = targetDate.toDateString()
  
  return links.filter((link) => {
    const linkDay = new Date(link.accessedAt).toDateString()
    return linkDay === targetDay
  })
}

/*Condenses the list of links accessed on a specific day to only show website name and
time spent on it. E.g. if the user spends an hour watching 300 TikTok videos, it will simply
show "TikTok - 1 hour" instead of 300 entries for each video. */
//Understanding promises: fetching data, we define how data is organized and [] = array type.

export async function condenseLinksByDay(date: Date | string): Promise<{ siteName: string; timeSpent: number }[]> {
    let links = await getLinksByDay(date)
    links = sortLinksByDomain(links)

    let condensed: { siteName: string; timeSpent: number }[] = []

    let previousSite = ''
    for (let i = 0; i < links.length; i++) {
        const link = links[i]

        if (link.siteName === previousSite && condensed.length > 0) {
            // If it's the same site as the previous one, add the time spent
            condensed[condensed.length - 1].timeSpent += link.accessDuration ?? 0
        } else {
            // Otherwise, create a new entry for this site. The condensed array is dynamically sized.
            condensed.push({
                siteName: link.siteName,
                timeSpent: link.accessDuration ?? 0,
            })
            previousSite = link.siteName
        }
    }

    // Save condensed summary to localStorage with date key
    // const targetDate = new Date(date)
    // const dateKey = targetDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
    // const storageKey = `condensed_${dateKey}`
    // localStorage.setItem(storageKey, JSON.stringify(condensed))

    return condensed

}

export async function deleteLinksByDay(date: Date | string): Promise<void> {
  const linksToDelete = await getLinksByDay(date)
  const allLinks = await loadLinks()
  
  // Batch delete: create a set of IDs to delete for O(1) lookup
  const idsToDelete = new Set(linksToDelete.map(l => l.id))
  const filteredLinks = allLinks.filter(l => !idsToDelete.has(l.id))
  
  // Save once with all deletions applied
  await saveLinks(filteredLinks)
}

// Performs daily archive: creates condensed summary and removes full history from chrome storage
export async function performDailyArchive(date: Date | string): Promise<void> {
  // Create and save condensed summary to localStorage
  await condenseLinksByDay(date)
  // Delete full history from chrome storage to free up space
  await deleteLinksByDay(date)
}

// Gets the day of the week as a string (e.g., "Monday", "Tuesday")
// format: 'long' | 'short' | 'narrow'
export function getDayOfWeek(date: Date | string, format: 'long' | 'short' | 'narrow' = 'long'): string {
  const targetDate = new Date(date)
  return targetDate.toLocaleDateString('en-US', { weekday: format })
}
