import Computer from '../../assets/Computer.png'
import { BreakOverlays } from '../../features/break/components/BreakOverlays'
import { MotivationalPopup } from '../../features/motivation/components/MotivationalPopup'
import { CelebrationOverlay } from '../../features/timer/components/CelebrationOverlay'
import { TimerControls } from '../../features/timer/components/TimerControls'
import { TimerDisplay } from '../../features/timer/components/TimerDisplay'
import { WarningOverlay } from '../../features/timer/components/WarningOverlay'
import { useTimerPage } from '../../features/timer/hooks/useTimerPage'
import './TimerPage.css'

interface TimerPageProps {
  timerDigits: string
  onExit: () => void
}

export function TimerPage({ timerDigits, onExit }: TimerPageProps) {
  const page = useTimerPage({ timerDigits, onExit })

  return (
    <div className="timer-page page-fade-in">
      <div className="timer-page__stage">
        <img className="timer-page__computer" src={Computer} alt="Computer" />
        <TimerDisplay remainingSeconds={page.remainingSeconds} />
        {page.celebration.isShowing && <CelebrationOverlay fading={page.celebration.isFading} />}
        {page.motivation.isShowing && (
          <MotivationalPopup image={page.motivation.image} fading={page.motivation.isFading} />
        )}
        <TimerControls
          finishUsed={page.finishUsed}
          canTakeBreak={page.canTakeBreak}
          onExit={page.handleExit}
          onFinish={page.handleFinish}
          onTakeBreak={page.handleTakeBreak}
        />
      </div>

      {page.warning.isMounted && (
        <WarningOverlay visible={page.warning.isVisible} onDismiss={page.warning.dismiss} />
      )}
      <BreakOverlays controller={page.breakController} />
    </div>
  )
}