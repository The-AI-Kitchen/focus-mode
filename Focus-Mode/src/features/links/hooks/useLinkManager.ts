import { useState } from 'react'
import { useLinkForm } from './useLinkForm'
import { useLinks } from './useLinks'

/**
 * Link management for the session setup: the saved links, the add-link form,
 * and whether the list is expanded on the home page.
 */
export function useLinkManager() {
  const { links, add, remove } = useLinks()
  const form = useLinkForm({ links, addLink: add })
  const [showLinks, setShowLinks] = useState(false)

  return {
    links,
    linkInput: form.linkInput,
    linkError: form.linkError,
    showLinks,
    setLinkInput: form.setLinkInput,
    handleAddLink: form.handleAddLink,
    handleKeyDown: form.handleKeyDown,
    handleRemoveLink: remove,
    toggleShowLinks: () => setShowLinks((prev) => !prev),
  }
}

export type LinkManager = ReturnType<typeof useLinkManager>