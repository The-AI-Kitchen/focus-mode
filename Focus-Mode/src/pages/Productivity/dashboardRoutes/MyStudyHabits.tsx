import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../../app/navigation/paths'
import { PillButton } from '../../../shared/components/PillButton'
import './MyStudyHabits.css'

/** Blank page for now. */
export function MyStudyHabits() {
  const navigate = useNavigate()

  return (
    <div className="productivity-page__view page-fade-in">
      <PillButton className="productivity-page__back" onClick={() => navigate(PATHS.home)}>
        Back
      </PillButton>
    </div>
  )
}
