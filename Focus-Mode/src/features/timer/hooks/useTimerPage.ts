import { digitsToSeconds } from '../../../shared/utils/timer'
import { useBreak } from '../../break/hooks/useBreak'
import { useMotivational } from '../../motivation/hooks/useMotivational'
import { useCountdownAudio } from './useCountdownAudio'
import { useFinishWork } from './useFinishWork'
import { useTimer } from './useTimer'
import { useTimerWarning } from './useTimerWarning'

interface UseTimerPageOptions {
  /** Raw HHMMSS digits chosen on the home page. */
  timerDigits: string
  /** Called after the session has been torn down and the user wants to leave. */
  onExit: () => void
}

/**
 * Controller for the timer page. It owns no state of its own: it creates the feature hooks
 * (timer, countdown audio, warning, break, motivation, finish) and wires them together.
 */
export function useTimerPage({ timerDigits, onExit }: UseTimerPageOptions) {
  const totalSeconds = digitsToSeconds(timerDigits || '000000')

  const motivational = useMotivational()
  const finishWork = useFinishWork()
  const countdownAudio = useCountdownAudio()
  const warning = useTimerWarning(resumeAfterWarning)
  const timer = useTimer(totalSeconds, {
    onStart: handleStart,
    onTick: handleTick,
    onComplete: handleComplete,
  })
  const breakController = useBreak({ onResumeTimer: resumeAfterBreak })

  // --- Timer events ---

  function handleStart() {
    countdownAudio.prepare()
    motivational.resetTriggers()
  }

  function handleTick(remainingSeconds: number, total: number) {
    motivational.handleTick(remainingSeconds, total)
    // At 10 seconds the timer holds still while the warning is shown.
    if (countdownAudio.handleTick(remainingSeconds)) {
      timer.pause()
      warning.show()
    }
  }

  function handleComplete() {
    countdownAudio.playAlarm()
  }

  // --- Resuming ---

  function resumeAfterWarning() {
    timer.resume()
    countdownAudio.resume(timer.remainingRef.current)
  }

  function resumeAfterBreak() {
    timer.resume()
    countdownAudio.resumeIfWasPlaying(timer.remainingRef.current)
  }

  // --- User actions ---

  function endSession() {
    timer.stop()
    countdownAudio.stop()
  }

  function handleExit() {
    endSession()
    onExit()
  }

  function handleFinish() {
    if (finishWork.finishUsed) return
    endSession()
    finishWork.finish()
  }

  const canTakeBreak = timer.remainingSeconds > 0 && !finishWork.finishUsed

  function handleTakeBreak() {
    if (!canTakeBreak) return
    timer.pause()
    countdownAudio.pauseIfPlaying()
    breakController.open()
  }

  return {
    remainingSeconds: timer.remainingSeconds,
    finishUsed: finishWork.finishUsed,
    canTakeBreak,
    celebration: {
      isShowing: finishWork.showCelebration,
      isFading: finishWork.celebrationFading,
    },
    motivation: {
      isShowing: motivational.showDonut && !finishWork.finishUsed,
      image: motivational.motivationalImg,
      isFading: motivational.donutFading,
    },
    warning: {
      isMounted: warning.isMounted,
      isVisible: warning.isVisible,
      dismiss: warning.dismiss,
    },
    breakController,
    handleExit,
    handleFinish,
    handleTakeBreak,
  }
}
