import type { BreakController } from '../types'
import { BreakCountdownModal } from './BreakCountdownModal'
import { BreakPromptModal } from './BreakPromptModal'
import { BreakSetterModal } from './BreakSetterModal'

interface BreakOverlaysProps {
  controller: BreakController
}

/** Renders whichever break window is currently open. */
export function BreakOverlays({ controller }: BreakOverlaysProps) {
  return (
    <>
      {controller.isPromptOpen && (
        <BreakPromptModal onYes={controller.acceptBreak} onNo={controller.declineBreak} />
      )}
      {controller.isSetterMounted && (
        <BreakSetterModal
          visible={controller.isSetterVisible}
          digits={controller.digits}
          onKeyDown={controller.handleDigitsKeyDown}
          onConfirm={controller.confirmSetter}
          onClose={controller.closeSetter}
        />
      )}
      {controller.isCountdownMounted && (
        <BreakCountdownModal
          visible={controller.isCountdownVisible}
          remainingSeconds={controller.remainingSeconds}
          onClose={controller.closeCountdown}
          onTimeUp={controller.finishBreak}
        />
      )}
    </>
  )
}