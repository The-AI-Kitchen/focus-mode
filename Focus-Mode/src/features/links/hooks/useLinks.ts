import { useEffect, useState } from 'react'
import { normalizeUrl } from '../../../shared/utils/url'
import { addLink, getLinks, removeLink } from '../services/linkStorage'
import type { LinkEntry } from '../types'

/** Owns the saved list of links and keeps it in sync with storage. */
export function useLinks() {
  const [links, setLinks] = useState<LinkEntry[]>([])

  useEffect(() => {
    getLinks()
      .then((loaded) => setLinks(loaded))
      .catch(() => setLinks([]))
  }, [])

  async function add(url: string) {
    await addLink(url, normalizeUrl(url))
    setLinks(await getLinks())
  }

  async function remove(id: string) {
    await removeLink(id)
    setLinks(await getLinks())
  }

  return { links, add, remove }
}