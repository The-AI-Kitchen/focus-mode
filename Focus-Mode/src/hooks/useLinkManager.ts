import { useState, useEffect } from 'react'
import { addLink, getLinks, removeLink, type LinkEntry } from '../db'
import { isValidUrl, normalizeUrl } from '../utils/urlUtils'

export function useLinkManager() {
  const [linkInput, setLinkInput] = useState('')
  const [linkError, setLinkError] = useState('')
  const [links, setLinks] = useState<LinkEntry[]>([])
  const [showLinks, setShowLinks] = useState(false)

  useEffect(() => {
    getLinks().then((loaded) => setLinks(loaded)).catch(() => setLinks([]))
  }, [])

  useEffect(() => {
    if (!linkError) return
    const t = setTimeout(() => setLinkError(''), 3000)
    return () => clearTimeout(t)
  }, [linkError])

  async function handleAddLink() {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      setLinkError('Please enter a valid URL (e.g. youtube.com)')
      return
    }
    if (links.some(l => normalizeUrl(l.url) === normalizeUrl(trimmed))) {
      setLinkError('This link has already been added')
      return
    }
    setLinkError('')
    await addLink(trimmed, normalizeUrl(trimmed))
    setLinks(await getLinks())
    setLinkInput('')
  }

  async function handleRemoveLink(id: string) {
    await removeLink(id)
    setLinks(await getLinks())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddLink()
  }

  return {
    linkInput,
    setLinkInput,
    linkError,
    setLinkError,
    links,
    setLinks,
    showLinks,
    setShowLinks,
    handleAddLink,
    handleRemoveLink,
    handleKeyDown,
  }
}
