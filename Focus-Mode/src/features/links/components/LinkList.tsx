import type { LinkEntry } from '../types'
import './LinkList.css'

interface LinkListProps {
  links: LinkEntry[]
  onRemove: (id: string) => void
}

/** Saved links, each with a remove button. */
export function LinkList({ links, onRemove }: LinkListProps) {
  if (links.length === 0) return null

  return (
    <ul className="link-list">
      {links.map((entry) => (
        <li key={entry.id} className="link-list__item">
          <span className="link-list__name">{entry.siteName}</span>
          <button className="link-list__remove" onClick={() => onRemove(entry.id)} aria-label="Remove link">
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}