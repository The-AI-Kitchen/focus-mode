import type { LinkEntry } from '../../links/types'
import { LinkSummaryList } from '../../links/components/LinkSummaryList'
import { formatTimerDigits } from '../../../shared/utils/timer'
import './ConfirmedSummary.css'

interface ConfirmedSummaryProps {
  timerDigits: string
  links: LinkEntry[]
}

/** Read-only recap of the timer length and links the user entered. */
export function ConfirmedSummary({ timerDigits, links }: ConfirmedSummaryProps) {
  return (
    <>
      <div className="confirmed-summary__section">
        <p className="confirmed-summary__heading">timer inputted</p>
        <div className="confirmed-summary__time">
          {timerDigits ? formatTimerDigits(timerDigits) : '00:00:00'}
        </div>
      </div>

      <div className="confirmed-summary__section">
        <p className="confirmed-summary__heading">links inputted</p>
        <LinkSummaryList links={links} />
      </div>
    </>
  )
}