import { useState } from 'react'
import { saveTimer, loadTimer } from './db'
import { useLinkManager } from './hooks/useLinkManager'
import { useTimer, useTimerInterval } from './hooks/useTimer'
import { useBreakTimer } from './hooks/useBreakTimer'
import { useMotivational } from './hooks/useMotivational'
import { useConfirmationFlow } from './hooks/useConfirmationFlow'
import { useTimerPage } from './hooks/useTimerPage'
import { usePageNavigation } from './hooks/usePageNavigation'
import { useProductivityPage } from './hooks/useProductivityPage'
import { HomePage } from './components/HomePage'
import { ConfirmedPage } from './components/ConfirmedPage'
import { TimerPage } from './components/TimerPage'
import { ProductivityPage } from './components/ProductivityPage'
import { playAudio } from './audio/audioManager'
import { AUDIO_PATHS } from './audio/audioManager'
import './App.css'

function App() {
  // Page navigation
  const { onNextPage, setOnNextPage, showProductivity, setShowProductivity } = usePageNavigation()

  // Timer and Links state
  const [timerDigits, setTimerDigits] = useState(loadTimer)
  const linkManager = useLinkManager()

  // Hooks for different features
  const timerState = useTimer(onNextPage)
  const breakTimer = useBreakTimer(timerState.isPausedRef, timerState.countdownWasPlayingRef, timerState.resumeCountdown)
  const motivational = useMotivational()
  const confirmationFlow = useConfirmationFlow()
  const timerPageState = useTimerPage()
  const productivityPage = useProductivityPage()

  // Timer interval effect with motivational images
  useTimerInterval(timerDigits, onNextPage, timerState, motivational.MOTIVATIONAL_IMAGES, motivational.showMotivational)

  // Timer input handling
  function handleTimerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9' && timerDigits.length < 6) {
      const next = timerDigits + e.key
      setTimerDigits(next)
      saveTimer(next)
    } else if (e.key === 'Backspace') {
      const next = timerDigits.slice(0, -1)
      setTimerDigits(next)
      saveTimer(next)
    }
  }

  // Confirmation logic
  function handleConfirm() {
    const hasTime = timerDigits.length > 0 && timerDigits.replace(/0/g, '') !== ''
    const hasLink = linkManager.links.length > 0
    if (!hasTime && !hasLink) {
      confirmationFlow.setConfirmError('Please enter a time and at least one link before continuing')
    } else if (!hasTime) {
      confirmationFlow.setConfirmError('Please enter a time before continuing')
    } else if (!hasLink) {
      confirmationFlow.setConfirmError('Please add at least one link before continuing')
    } else {
      confirmationFlow.setConfirmError('')
      confirmationFlow.setConfirmed(true)
    }
  }

  // Timer page handlers
  function handleExit() {
    timerState.stopSession()
    setOnNextPage(false)
    confirmationFlow.setConfirmed(false)
    timerPageState.setShowCelebration(false)
    timerPageState.setFinishUsed(false)
  }

  function handleFinish() {
    if (!timerPageState.finishUsed) {
      timerState.stopSession()
      timerPageState.setFinishUsed(true)
      timerPageState.setShowCelebration(true)
      playAudio(AUDIO_PATHS.partyHorn)
    }
  }

  function handleTakeBreak() {
    if (!timerPageState.finishUsed && timerState.remainingSeconds > 0) {
      timerState.isPausedRef.current = true
      if (timerState.countdownAudioRef.current && !timerState.countdownAudioRef.current.paused) {
        timerState.countdownAudioRef.current.pause()
        timerState.countdownWasPlayingRef.current = true
      } else {
        timerState.countdownWasPlayingRef.current = false
      }
      breakTimer.setShowBreak(true)
    }
  }

  // Confirmed page handlers
  function handleNext() {
    confirmationFlow.setShowReminder(true)
    setTimeout(() => confirmationFlow.setReminderVisible(true), 20)
    confirmationFlow.reminderTimeoutRef.current = setTimeout(() => {
      confirmationFlow.setReminderVisible(false)
      setTimeout(() => {
        confirmationFlow.setShowReminder(false)
        setOnNextPage(true)
      }, 400)
    }, 3000)
  }

  function handleReminderDismiss() {
    if (confirmationFlow.reminderTimeoutRef.current) {
      clearTimeout(confirmationFlow.reminderTimeoutRef.current)
      confirmationFlow.reminderTimeoutRef.current = null
    }
    confirmationFlow.setReminderVisible(false)
    setTimeout(() => {
      confirmationFlow.setShowReminder(false)
      setOnNextPage(true)
    }, 400)
  }

  // Handle warning dismissal
  function handleWarningDismiss() {
    if (timerState.warningTimeoutRef.current) {
      clearTimeout(timerState.warningTimeoutRef.current)
      timerState.warningTimeoutRef.current = null
    }
    timerState.setWarningVisible(false)
    timerState.isPausedRef.current = false
    timerState.resumeCountdown()
    setTimeout(() => timerState.setShowWarning(false), 400)
  }

  // Render the appropriate page based on state
  if (onNextPage) {
    return (
      <TimerPage
        remainingSeconds={timerState.remainingSeconds}
        showCelebration={timerPageState.showCelebration}
        celebrationFading={timerPageState.celebrationFading}
        showDonut={motivational.showDonut}
        donutFading={motivational.donutFading}
        motivationalImg={motivational.motivationalImg}
        finishUsed={timerPageState.finishUsed}
        showWarning={timerState.showWarning}
        warningVisible={timerState.warningVisible}
        showBreak={breakTimer.showBreak}
        showBreakSetter={breakTimer.showBreakSetter}
        breakSetterVisible={breakTimer.breakSetterVisible}
        breakTimerDigits={breakTimer.breakTimerDigits}
        showBreakCountdown={breakTimer.showBreakCountdown}
        breakCountdownVisible={breakTimer.breakCountdownVisible}
        breakRemainingSeconds={breakTimer.breakRemainingSeconds}
        isPausedRef={timerState.isPausedRef}
        countdownWasPlayingRef={timerState.countdownWasPlayingRef}
        onExit={handleExit}
        onFinish={handleFinish}
        onTakeBreak={handleTakeBreak}
        onWarningDismiss={handleWarningDismiss}
        onBreakWindowClose={breakTimer.handleBreakWindowClose}
        onBreakYes={breakTimer.handleBreakYes}
        onBreakNo={breakTimer.handleBreakWindowClose}
        onBreakSetterClose={breakTimer.handleBreakSetterClose}
        onBreakTimerKeyDown={breakTimer.handleBreakTimerKeyDown}
        onBreakSetterConfirm={breakTimer.handleBreakSetterConfirm}
        onBreakCountdownClose={breakTimer.handleBreakCountdownClose}
        onBreakTimeUp={breakTimer.handleBreakTimeUp}
      />
    )
  }

  if (confirmationFlow.confirmed) {
    return (
      <ConfirmedPage
        timerDigits={timerDigits}
        links={linkManager.links}
        showReminder={confirmationFlow.showReminder}
        reminderVisible={confirmationFlow.reminderVisible}
        onGoBack={() => confirmationFlow.setConfirmed(false)}
        onNext={handleNext}
        onReminderDismiss={handleReminderDismiss}
      />
    )
  }

  if (showProductivity) {
    return (
      <ProductivityPage
        statView={productivityPage.statView}
        selectedDay={productivityPage.selectedDay}
        openStatDay={productivityPage.openStatDay}
        statVisible={productivityPage.statVisible}
        arrowFlipped={productivityPage.arrowFlipped}
        statPos={productivityPage.statPos}
        statWindowRef={productivityPage.statWindowRef}
        onSelectDay={productivityPage.handleSelectDay}
        onToggleDayDropdown={productivityPage.handleToggleDayDropdown}
        onStatWindowMouseDown={productivityPage.handleStatWindowMouseDown}
        onStatViewChange={productivityPage.handleStatViewChange}
        onCloseStatWindow={productivityPage.handleCloseStatWindow}
        onBack={() => setShowProductivity(false)}
      />
    )
  }

  // Home page
  return (
    <HomePage
      timerDigits={timerDigits}
      linkInput={linkManager.linkInput}
      linkError={linkManager.linkError}
      links={linkManager.links}
      showLinks={linkManager.showLinks}
      confirmError={confirmationFlow.confirmError}
      onTimerKeyDown={handleTimerKeyDown}
      onLinkInputChange={linkManager.setLinkInput}
      onLinkKeyDown={linkManager.handleKeyDown}
      onAddLink={linkManager.handleAddLink}
      onToggleShowLinks={() => linkManager.setShowLinks(!linkManager.showLinks)}
      onRemoveLink={linkManager.handleRemoveLink}
      onConfirm={handleConfirm}
      onProductivityClick={() => setShowProductivity(true)}
    />
  )
}

export default App
