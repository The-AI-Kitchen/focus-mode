import { useState, useEffect, useRef } from 'react'
import { saveTimer, loadTimer } from './db'
import { digitsToSeconds } from './utils/timerUtils'
import { useLinkManager } from './hooks/useLinkManager'
import { useTimer, useTimerInterval } from './hooks/useTimer'
import { HomePage } from './components/HomePage'
import { ConfirmedPage } from './components/ConfirmedPage'
import { TimerPage } from './components/TimerPage'
import { ProductivityPage } from './components/ProductivityPage'
import partyHorn from './assets/party-horn-short.mp3'
import lofiBeat from './assets/lofi-beat-1.mp3'
import alarmSound from './assets/alarm-sound.mp3'
import donutImg from './assets/donut-stop-trying.png'
import butterflyImg from './assets/butterfly.png'
import keepGrowingImg from './assets/keep-growing.png'
import youCanDoItImg from './assets/you-can-do-it.png'
import './App.css'

function App() {
  // Page navigation
  const [onNextPage, setOnNextPage] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [showProductivity, setShowProductivity] = useState(false)

  // Timer and Links state
  const [timerDigits, setTimerDigits] = useState(loadTimer)
  const [confirmError, setConfirmError] = useState('')
  const linkManager = useLinkManager()

  // Timer page state
  const timerState = useTimer(onNextPage)
  const [showDonut, setShowDonut] = useState(false)
  const [motivationalImg, setMotivationalImg] = useState(donutImg)
  const [donutFading, setDonutFading] = useState(false)
  const [finishUsed, setFinishUsed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)

  // Break timer state
  const [showBreak, setShowBreak] = useState(false)
  const [showBreakSetter, setShowBreakSetter] = useState(false)
  const [breakSetterVisible, setBreakSetterVisible] = useState(false)
  const [breakTimerDigits, setBreakTimerDigits] = useState('')
  const [showBreakCountdown, setShowBreakCountdown] = useState(false)
  const [breakCountdownVisible, setBreakCountdownVisible] = useState(false)
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(0)
  const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const breakAlarmRef = useRef<HTMLAudioElement | null>(null)
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null)

  // Reminder state
  const [showReminder, setShowReminder] = useState(false)
  const [reminderVisible, setReminderVisible] = useState(false)
  const reminderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Productivity page state
  const [statView, setStatView] = useState<'list' | 'chart'>('list')
  const [arrowFlipped, setArrowFlipped] = useState<boolean[]>(Array(7).fill(false))
  const [openStatDay, setOpenStatDay] = useState<number | null>(null)
  const [statVisible, setStatVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
  const [statPos, setStatPos] = useState({ left: 0, bottom: 0 })
  const statDragRef = useRef<{ startMouseX: number; startMouseY: number; startLeft: number; startBottom: number } | null>(null)
  const statWindowRef = useRef<HTMLDivElement>(null)

  // Set page background colors
  useEffect(() => {
    document.body.style.backgroundColor = (onNextPage || showProductivity) ? '#0097b2' : ''
  }, [onNextPage, showProductivity])

  // Clear confirmation error after timeout
  useEffect(() => {
    if (!confirmError) return
    const t = setTimeout(() => setConfirmError(''), 3000)
    return () => clearTimeout(t)
  }, [confirmError])

  // Celebration animation
  useEffect(() => {
    if (!showCelebration) return
    const t1 = setTimeout(() => setCelebrationFading(true), 10400)
    const t2 = setTimeout(() => { setShowCelebration(false); setCelebrationFading(false) }, 11200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [showCelebration])

  // Stats window drag handling
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!statDragRef.current) return
      const dx = e.clientX - statDragRef.current.startMouseX
      const dy = e.clientY - statDragRef.current.startMouseY
      const w = statWindowRef.current?.offsetWidth ?? 300
      const h = statWindowRef.current?.offsetHeight ?? 400
      setStatPos({
        left: Math.max(0, Math.min(statDragRef.current.startLeft + dx, window.innerWidth - w)),
        bottom: Math.max(0, Math.min(statDragRef.current.startBottom - dy, window.innerHeight - h)),
      })
    }
    function onMouseUp() { statDragRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  // Timer countdown logic
  const motivationalImages = [donutImg, butterflyImg, keepGrowingImg, youCanDoItImg]
  const showMotivationalCallback = () => {
    setMotivationalImg(motivationalImages[Math.floor(Math.random() * motivationalImages.length)])
    setShowDonut(true)
    setTimeout(() => setDonutFading(true), 3300)
    setTimeout(() => { setShowDonut(false); setDonutFading(false) }, 4000)
  }
  useTimerInterval(timerDigits, onNextPage, timerState, motivationalImages, showMotivationalCallback)

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
      setConfirmError('Please enter a time and at least one link before continuing')
    } else if (!hasTime) {
      setConfirmError('Please enter a time before continuing')
    } else if (!hasLink) {
      setConfirmError('Please add at least one link before continuing')
    } else {
      setConfirmError('')
      setConfirmed(true)
    }
  }

  // Timer page handlers
  function handleExit() {
    timerState.stopSession()
    setOnNextPage(false)
    setConfirmed(false)
    setShowCelebration(false)
    setFinishUsed(false)
  }

  function handleFinish() {
    if (!finishUsed) {
      timerState.stopSession()
      setFinishUsed(true)
      setShowCelebration(true)
      new Audio(partyHorn).play()
    }
  }

  function handleTakeBreak() {
    if (!finishUsed && timerState.remainingSeconds > 0) {
      timerState.isPausedRef.current = true
      if (timerState.countdownAudioRef.current && !timerState.countdownAudioRef.current.paused) {
        timerState.countdownAudioRef.current.pause()
        timerState.countdownWasPlayingRef.current = true
      } else {
        timerState.countdownWasPlayingRef.current = false
      }
      setShowBreak(true)
    }
  }

  function handleBreakWindowClose() {
    setShowBreak(false)
    timerState.isPausedRef.current = false
    if (timerState.countdownWasPlayingRef.current) timerState.resumeCountdown()
  }

  function handleBreakYes() {
    setBreakTimerDigits('')
    setShowBreak(false)
    setShowBreakSetter(true)
    setTimeout(() => setBreakSetterVisible(true), 20)
  }

  function handleBreakSetterClose() {
    setBreakSetterVisible(false)
    timerState.isPausedRef.current = false
    if (timerState.countdownWasPlayingRef.current) timerState.resumeCountdown()
    setTimeout(() => setShowBreakSetter(false), 350)
  }

  function handleBreakTimerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9' && breakTimerDigits.length < 6) {
      setBreakTimerDigits(prev => prev + e.key)
    } else if (e.key === 'Backspace') {
      setBreakTimerDigits(prev => prev.slice(0, -1))
    }
  }

  function handleBreakSetterConfirm() {
    const secs = digitsToSeconds(breakTimerDigits)
    setBreakRemainingSeconds(secs)
    setBreakSetterVisible(false)
    setShowBreakCountdown(true)
    setTimeout(() => setBreakCountdownVisible(true), 20)
    setTimeout(() => setShowBreakSetter(false), 350)
    if (secs <= 0) return

    const lofi = new Audio(lofiBeat)
    lofi.loop = true
    lofi.volume = 1
    lofi.play()
    lofiAudioRef.current = lofi

    let remaining = secs
    const iv = setInterval(() => {
      remaining -= 1
      setBreakRemainingSeconds(remaining)
      if (remaining <= 0) {
        clearInterval(iv)
        breakIntervalRef.current = null
        const fadeSteps = 20
        const fadeInterval = 800 / fadeSteps
        let step = 0
        const fade = setInterval(() => {
          step++
          if (lofiAudioRef.current) {
            lofiAudioRef.current.volume = Math.max(0, 1 - step / fadeSteps)
          }
          if (step >= fadeSteps) {
            clearInterval(fade)
            if (lofiAudioRef.current) {
              lofiAudioRef.current.pause()
              lofiAudioRef.current = null
            }
            const alarm = new Audio(alarmSound)
            breakAlarmRef.current = alarm
            alarm.play()
          }
        }, fadeInterval)
      }
    }, 1000)
    breakIntervalRef.current = iv
  }

  function handleBreakCountdownClose() {
    setBreakCountdownVisible(false)
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current)
      breakIntervalRef.current = null
    }
    if (lofiAudioRef.current) {
      lofiAudioRef.current.pause()
      lofiAudioRef.current.currentTime = 0
      lofiAudioRef.current = null
    }
    if (breakAlarmRef.current) {
      breakAlarmRef.current.pause()
      breakAlarmRef.current.currentTime = 0
      breakAlarmRef.current = null
    }
    timerState.isPausedRef.current = false
    if (timerState.countdownWasPlayingRef.current) timerState.resumeCountdown()
    setTimeout(() => setShowBreakCountdown(false), 350)
  }

  function handleBreakTimeUp() {
    if (breakRemainingSeconds !== 0) return
    handleBreakCountdownClose()
  }

  // Confirmed page handlers
  function handleNext() {
    setShowReminder(true)
    setTimeout(() => setReminderVisible(true), 20)
    reminderTimeoutRef.current = setTimeout(() => {
      setReminderVisible(false)
      setTimeout(() => {
        setShowReminder(false)
        setOnNextPage(true)
      }, 400)
    }, 3000)
  }

  function handleReminderDismiss() {
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current)
      reminderTimeoutRef.current = null
    }
    setReminderVisible(false)
    setTimeout(() => {
      setShowReminder(false)
      setOnNextPage(true)
    }, 400)
  }

  // Productivity page handlers
  function handleSelectDay(i: number) {
    setSelectedDay(i)
    setArrowFlipped((prev) => prev.map((v, j) => j === i ? true : j === openStatDay ? false : v))
    if (openStatDay === i) return
    if (openStatDay !== null) {
      setStatVisible(false)
      setTimeout(() => { setOpenStatDay(i); setTimeout(() => setStatVisible(true), 30) }, 250)
    } else {
      setOpenStatDay(i)
      setTimeout(() => setStatVisible(true), 20)
    }
  }

  function handleToggleDayDropdown(i: number) {
    if (openStatDay === i) {
      setArrowFlipped((prev) => prev.map((v, j) => j === i ? false : v))
      setStatVisible(false)
      setTimeout(() => setOpenStatDay(null), 300)
    } else {
      handleSelectDay(i)
    }
  }

  function handleStatWindowMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    statDragRef.current = { startMouseX: e.clientX, startMouseY: e.clientY, startLeft: statPos.left, startBottom: statPos.bottom }
    e.preventDefault()
  }

  function handleStatViewChange(view: 'list' | 'chart') {
    setStatView(view)
  }

  function handleCloseStatWindow() {
    setArrowFlipped((prev) => prev.map((v, j) => j === openStatDay ? false : v))
    setStatVisible(false)
    setTimeout(() => setOpenStatDay(null), 300)
  }

  // Render the appropriate page based on state
  if (onNextPage) {
    return (
      <TimerPage
        remainingSeconds={timerState.remainingSeconds}
        showCelebration={showCelebration}
        celebrationFading={celebrationFading}
        showDonut={showDonut}
        donutFading={donutFading}
        motivationalImg={motivationalImg}
        finishUsed={finishUsed}
        showWarning={timerState.showWarning}
        warningVisible={timerState.warningVisible}
        showBreak={showBreak}
        showBreakSetter={showBreakSetter}
        breakSetterVisible={breakSetterVisible}
        breakTimerDigits={breakTimerDigits}
        showBreakCountdown={showBreakCountdown}
        breakCountdownVisible={breakCountdownVisible}
        breakRemainingSeconds={breakRemainingSeconds}
        isPausedRef={timerState.isPausedRef}
        countdownWasPlayingRef={timerState.countdownWasPlayingRef}
        onExit={handleExit}
        onFinish={handleFinish}
        onTakeBreak={handleTakeBreak}
        onWarningDismiss={() => {
          if (timerState.warningTimeoutRef.current) {
            clearTimeout(timerState.warningTimeoutRef.current)
            timerState.warningTimeoutRef.current = null
          }
          timerState.setWarningVisible(false)
          timerState.isPausedRef.current = false
          timerState.resumeCountdown()
          setTimeout(() => timerState.setShowWarning(false), 400)
        }}
        onBreakWindowClose={handleBreakWindowClose}
        onBreakYes={handleBreakYes}
        onBreakNo={handleBreakWindowClose}
        onBreakSetterClose={handleBreakSetterClose}
        onBreakTimerKeyDown={handleBreakTimerKeyDown}
        onBreakSetterConfirm={handleBreakSetterConfirm}
        onBreakCountdownClose={handleBreakCountdownClose}
        onBreakTimeUp={handleBreakTimeUp}
      />
    )
  }

  if (confirmed) {
    return (
      <ConfirmedPage
        timerDigits={timerDigits}
        links={linkManager.links}
        showReminder={showReminder}
        reminderVisible={reminderVisible}
        onGoBack={() => setConfirmed(false)}
        onNext={handleNext}
        onReminderDismiss={handleReminderDismiss}
      />
    )
  }

  if (showProductivity) {
    return (
      <ProductivityPage
        statView={statView}
        selectedDay={selectedDay}
        openStatDay={openStatDay}
        statVisible={statVisible}
        arrowFlipped={arrowFlipped}
        statPos={statPos}
        statWindowRef={statWindowRef}
        onSelectDay={handleSelectDay}
        onToggleDayDropdown={handleToggleDayDropdown}
        onStatWindowMouseDown={handleStatWindowMouseDown}
        onStatViewChange={handleStatViewChange}
        onCloseStatWindow={handleCloseStatWindow}
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
      confirmError={confirmError}
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
