import type { LinkEntry } from '../types'
import './LinkSummaryList.css'

interface LinkSummaryListProps {
  links: LinkEntry[]
}

/** Read-only list of link names. */
export function LinkSummaryList({ links }: LinkSummaryListProps) {
  if (links.length === 0) {
    return <p className="link-summary-list__empty">no links saved</p>
  }

  return (
    <ul className="link-summary-list">
      {links.map((entry) => (
        <li key={entry.id} className="link-summary-list__item">
          {entry.siteName}
        </li>
      ))}
    </ul>
  )
}