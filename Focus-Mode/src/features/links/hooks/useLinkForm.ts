import { useEffect, useState } from 'react'
import { isValidUrl, normalizeUrl } from '../../../shared/utils/url'
import type { LinkEntry } from '../types'

const ERROR_VISIBLE_MS = 3000

interface UseLinkFormOptions {
  links: LinkEntry[]
  addLink: (url: string) => Promise<void>
}

/** Owns the "add a link" text field: its value, validation and temporary error message. */
export function useLinkForm({ links, addLink }: UseLinkFormOptions) {
  const [linkInput, setLinkInput] = useState('')
  const [linkError, setLinkError] = useState('')

  // Clear the error after a short delay
  useEffect(() => {
    if (!linkError) return
    const t = setTimeout(() => setLinkError(''), ERROR_VISIBLE_MS)
    return () => clearTimeout(t)
  }, [linkError])

  async function handleAddLink() {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      setLinkError('Please enter a valid URL (e.g. youtube.com)')
      return
    }
    if (links.some((l) => normalizeUrl(l.url) === normalizeUrl(trimmed))) {
      setLinkError('This link has already been added')
      return
    }
    setLinkError('')
    await addLink(trimmed)
    setLinkInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddLink()
  }

  return { linkInput, setLinkInput, linkError, handleAddLink, handleKeyDown }
}