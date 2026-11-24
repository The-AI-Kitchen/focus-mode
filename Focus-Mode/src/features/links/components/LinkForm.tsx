import { PillButton } from '../../../shared/components/PillButton'
import './LinkForm.css'

interface LinkFormProps {
  linkInput: string
  linkError: string
  showLinks: boolean
  onLinkInputChange: (value: string) => void
  onLinkKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onAddLink: () => void
  onToggleShowLinks: () => void
}

/** Text field and buttons for adding links and toggling the saved list. */
export function LinkForm({
  linkInput,
  linkError,
  showLinks,
  onLinkInputChange,
  onLinkKeyDown,
  onAddLink,
  onToggleShowLinks,
}: LinkFormProps) {
  return (
    <div className="link-form">
      <input
        className="link-form__input"
        type="text"
        placeholder="Enter link(s)"
        value={linkInput}
        onChange={(e) => onLinkInputChange(e.target.value)}
        onKeyDown={onLinkKeyDown}
      />
      {linkError && <span className="link-form__error">{linkError}</span>}
      <div className="link-form__actions">
        <PillButton onClick={onAddLink}>Add Link</PillButton>
        <PillButton onClick={onToggleShowLinks}>{showLinks ? 'Hide Links' : 'Show Links'}</PillButton>
      </div>
    </div>
  )
}