import { useState, useEffect, useRef } from 'react'
import homePage from './assets/home-page.png'
import confirmBtn from './assets/btn-confirm.png'
import confirmBtnHover from './assets/btn-confirm-hover.png'
import nextBtn from './assets/btn-next.png'
import nextBtnHover from './assets/btn-next-hover.png'
import Computer from './assets/Computer.png'
import donutImg from './assets/donut-stop-trying.png'
import breakWindow from './assets/break-window.png'
import breakYes from './assets/break-yes.png'
import breakYesHover from './assets/break-yes-hover.png'
import breakNo from './assets/break-no.png'
import breakNoHover from './assets/break-no-hover.png'
import breakSetTime from './assets/break-set-time.png'
import breakCountdown from './assets/break-countdown.png'
import warningWindow from './assets/warning-window.png'
import reminderImg from './assets/reminder.png'
import relaxImg from './assets/relax.png'
import timeIsUpImg from './assets/time-is-up.png'
import breakSetter from './assets/break-setter.png'
import breakConfirm from './assets/break-confirm.png'
import breakConfirmHover from './assets/break-confirm-hover.png'
import butterflyImg from './assets/butterfly.png'
import keepGrowingImg from './assets/keep-growing.png'
import youCanDoItImg from './assets/you-can-do-it.png'
import timerImg from './assets/timer.png'
import exitBtn from './assets/exit-button.png'
import finishBtn from './assets/finish-work.png'
import finishBtnHover from './assets/finish-work-hover.png'
import takeABreak from './assets/take-a-break.png'
import takeABreakHover from './assets/take-a-break-hover.png'
import youDidGreat from './assets/you-did-great-job.png'
import productivityTrackerBtn from './assets/productivity-tracker-button.png'
import productivityTrackerBtnHover from './assets/productvity-tracker-button-hover.png'
import statsWeekTableBg from './assets/stats-week-table-bg.png'
import tableLine from './assets/table-line.png'
import miniClock from './assets/mini-clock.png'
import hoursTotalBtn from './assets/hours-total-button.png'
import statWindow from './assets/stat-window.png'
import piButton from './assets/pi-button.png'
import piChartPlaceholder from './assets/pi-chart-placeholder.png'
import listButton from './assets/list-button.png'
import yellowHighlight from './assets/yellow-highlight.png'
import arrowDropdown from './assets/arrow-dropdown.png'
import confettiGif from './assets/confetti.gif'
import alarmSound from './assets/alarm-sound.mp3'
import lofiBeat from './assets/lofi-beat-1.mp3'
import countdownSound from './assets/timer-countdown.mp3'
import partyHorn from './assets/party-horn-short.mp3'
import './App.css'
import { addLink, getLinks, removeLink, saveTimer, loadTimer, type LinkEntry } from './db'

function App() {
  const [timerDigits, setTimerDigits] = useState(loadTimer)
  const [linkInput, setLinkInput] = useState('')
  const [linkError, setLinkError] = useState('')
  const [links, setLinks] = useState<LinkEntry[]>([])
  const [showLinks, setShowLinks] = useState(false)
  const [confirmError, setConfirmError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [onNextPage, setOnNextPage] = useState(false)
  const [showProductivity, setShowProductivity] = useState(false)
  const [statView, setStatView] = useState<'list' | 'chart'>('list')
  const [statViewKey, setStatViewKey] = useState(0)
  const [arrowFlipped, setArrowFlipped] = useState<boolean[]>(Array(7).fill(false))
  const [openStatDay, setOpenStatDay] = useState<number | null>(null)
  const [statVisible, setStatVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
  const [statPos, setStatPos] = useState({ left: 0, bottom: 0 })
  const statDragRef = useRef<{ startMouseX: number; startMouseY: number; startLeft: number; startBottom: number } | null>(null)
  const statWindowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    getLinks().then((loaded) => setLinks(loaded)).catch(() => setLinks([]))
  }, [])
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [showDonut, setShowDonut] = useState(false)
  const [motivationalImg, setMotivationalImg] = useState(donutImg)
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null)
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioEnabledRef = useRef(false)

  function stopSession() {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause()
      countdownAudioRef.current.currentTime = 0
      countdownAudioRef.current = null
    }
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause()
      alarmAudioRef.current.currentTime = 0
      alarmAudioRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    audioEnabledRef.current = false
  }
  const [finishUsed, setFinishUsed] = useState(false)
  const [donutFading, setDonutFading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)
  const [showBreak, setShowBreak] = useState(false)
  const [showBreakSetter, setShowBreakSetter] = useState(false)
  const [breakSetterVisible, setBreakSetterVisible] = useState(false)
  const [breakTimerDigits, setBreakTimerDigits] = useState('')
  const [showBreakCountdown, setShowBreakCountdown] = useState(false)
  const [breakCountdownVisible, setBreakCountdownVisible] = useState(false)
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(0)
  const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [warningVisible, setWarningVisible] = useState(false)
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showReminder, setShowReminder] = useState(false)
  const [reminderVisible, setReminderVisible] = useState(false)
  const reminderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const breakAlarmRef = useRef<HTMLAudioElement | null>(null)
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null)
  const remainingRef = useRef(0)
  const isPausedRef = useRef(false)
  const countdownWasPlayingRef = useRef(false)

  function resumeCountdown() {
    if (countdownAudioRef.current) {
      // Resync audio position to match actual remaining time before resuming
      const syncedTime = Math.max(0, 10 - remainingRef.current)
      if (syncedTime < countdownAudioRef.current.duration) {
        countdownAudioRef.current.currentTime = syncedTime
      }
      countdownAudioRef.current.play()
    }
    countdownWasPlayingRef.current = false
  }

  function digitsToSeconds(digits: string): number {
    const padded = digits.padStart(6, '0')
    return parseInt(padded.slice(0, 2)) * 3600
      + parseInt(padded.slice(2, 4)) * 60
      + parseInt(padded.slice(4, 6))
  }

  function secondsToFormatted(total: number): string {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function formatTimerDigits(digits: string): string {
    const padded = digits.padStart(6, '0')
    return `${padded.slice(0, 2)}:${padded.slice(2, 4)}:${padded.slice(4, 6)}`
  }

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

  function normalizeUrl(value: string): string {
    try {
      const withProtocol = value.includes('://') ? value : `https://${value}`
      const hostname = new URL(withProtocol).hostname
      return hostname.replace(/^www\./, '')
    } catch {
      return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    }
  }

  function isValidUrl(value: string): boolean {
    const trimmed = value.trim()
    if (!trimmed) return false
    try {
      const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
      const labels = url.hostname.split('.')

      // Must have at least two parts (e.g. "google" + "com")
      if (labels.length < 2) return false

      // TLD must be 2+ letters only (e.g. "com", "org", "io")
      const tld = labels[labels.length - 1]
      if (!/^[a-zA-Z]{2,}$/.test(tld)) return false

      // Every label must be non-empty, alphanumeric/hyphens, not start/end with hyphen
      for (const label of labels) {
        if (!label) return false
        if (!/^[a-zA-Z0-9-]+$/.test(label)) return false
        if (label.startsWith('-') || label.endsWith('-')) return false
      }

      return true
    } catch {
      return false
    }
  }

  async function handleAddLink() {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      setLinkError('Please enter a valid URL (e.g. youtube.com)')
      return
    }
    if (links.some(l => normalizeUrl(l.url) === normalizeUrl(trimmed))) {
      setLinkError('This link has already been added')
      return
    }
    setLinkError('')
    await addLink(trimmed, normalizeUrl(trimmed))
    setLinks(await getLinks())
    setLinkInput('')
  }

  async function handleRemoveLink(id: string) {
    await removeLink(id)
    setLinks(await getLinks())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddLink()
  }

  useEffect(() => {
    document.body.style.backgroundColor = (onNextPage || showProductivity) ? '#0097b2' : ''
  }, [onNextPage, showProductivity])

  useEffect(() => {
    if (!linkError) return
    const t = setTimeout(() => setLinkError(''), 3000)
    return () => clearTimeout(t)
  }, [linkError])

  useEffect(() => {
    if (!confirmError) return
    const t = setTimeout(() => setConfirmError(''), 3000)
    return () => clearTimeout(t)
  }, [confirmError])

  useEffect(() => {
    if (!showCelebration) return
    const t1 = setTimeout(() => setCelebrationFading(true), 10400)
    const t2 = setTimeout(() => { setShowCelebration(false); setCelebrationFading(false) }, 11200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [showCelebration])

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

useEffect(() => {
    if (!onNextPage) return
    const total = digitsToSeconds(timerDigits || '000000')
    setRemainingSeconds(total)
    setShowDonut(false)
    audioEnabledRef.current = true

    // Pre-create audio so ref is always valid for stopSession()
    const cdAudio = new Audio(countdownSound)
    cdAudio.currentTime = 0
    countdownAudioRef.current = cdAudio

    const motivationalImages = [donutImg, butterflyImg, keepGrowingImg, youCanDoItImg]
    let lastMotivationalImg: string | null = null
    const pickMotivational = () => {
      const choices = motivationalImages.filter(img => img !== lastMotivationalImg)
      const picked = choices[Math.floor(Math.random() * choices.length)]
      lastMotivationalImg = picked
      return picked
    }
    const showMotivational = () => {
      setMotivationalImg(pickMotivational())
      setShowDonut(true)
      setTimeout(() => setDonutFading(true), 3300)
      setTimeout(() => { setShowDonut(false); setDonutFading(false) }, 4000)
    }

    let oneThirdTriggered = false
    let twoThirdsTriggered = false
    let countdownStarted = false

    let remaining = total
    remainingRef.current = remaining
    isPausedRef.current = false

    const interval = setInterval(() => {
      if (isPausedRef.current) return
      if (!twoThirdsTriggered && remaining <= total * (2 / 3)) {
        twoThirdsTriggered = true
        showMotivational()
      }

      if (!oneThirdTriggered && remaining <= total * (1 / 3)) {
        oneThirdTriggered = true
        showMotivational()
      }
      if (remaining === 10 && !countdownStarted && audioEnabledRef.current) {
        countdownStarted = true
        cdAudio.currentTime = 0
        cdAudio.play()
        isPausedRef.current = true
        cdAudio.pause()
        countdownWasPlayingRef.current = true
        setShowWarning(true)
        setTimeout(() => setWarningVisible(true), 20)
        warningTimeoutRef.current = setTimeout(() => {
          setWarningVisible(false)
          isPausedRef.current = false
          resumeCountdown()
          setTimeout(() => setShowWarning(false), 400)
        }, 3000)
        return // prevent decrement so display stays at 10 while warning is up
      }
      // For timers shorter than 10s, start the countdown audio immediately at the
      // matching offset so the ticks line up with the remaining seconds
      if (!countdownStarted && remaining < 10 && remaining >= 1 && audioEnabledRef.current) {
        countdownStarted = true
        cdAudio.currentTime = Math.max(0, 10 - remaining)
        cdAudio.play()
      }
      if (remaining <= 1) {
        clearInterval(interval)
        intervalRef.current = null
        setRemainingSeconds(0)
        if (audioEnabledRef.current) {
          const alarm = new Audio(alarmSound)
          alarmAudioRef.current = alarm
          alarm.play()
        }
        return
      }
      remaining -= 1
      remainingRef.current = remaining
      setRemainingSeconds(remaining)
    }, 1000)
    intervalRef.current = interval
    return () => { clearInterval(interval); intervalRef.current = null }
  }, [onNextPage])

  if (onNextPage) {
    return (
      <div key="timer-page" className="page-fade-in" style={{ height: '100vh', backgroundColor: '#0097b2', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxHeight: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <img src={Computer} alt="Computer" style={{ display: 'block', width: '100%', maxHeight: '100vh', objectFit: 'contain', objectPosition: 'bottom' }} />
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '15%',
            width: '10%',
            transform: 'translateX(-50%)',
          }}>
            <img src={timerImg} alt="Timer" style={{ width: '100%', display: 'block' }} />
            <span style={{
              position: 'absolute',
              top: '58%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.2vw',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: '#000',
              whiteSpace: 'nowrap',
            }}>
              {secondsToFormatted(remainingSeconds)}
            </span>
          </div>
          {showCelebration && (
            <div style={{
              animation: celebrationFading ? 'fadeOut 0.8s ease-out forwards' : undefined,
              pointerEvents: 'none',
            }}>
              <img
                src={confettiGif}
                alt=""
                style={{
                  position: 'absolute',
                  left: '8%',
                  top: '2.3%',
                  width: '84%',
                  height: '52.8%',
                }}
              />
              <img
                src={youDidGreat}
                alt="You did a great job!"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '47%',
                  width: '12%',
                  animation: 'badgePop 0.5s ease-out 0.2s both',
                }}
              />
            </div>
          )}
          {showDonut && !finishUsed && (
            <img
              src={motivationalImg}
              alt="Motivational Character"
              style={{
                position: 'absolute',
                left: '50%',
                top: '47%',
                width: '12%',
                animation: donutFading
                  ? 'donutPopOut 0.7s ease-in forwards'
                  : 'donutPopIn 0.4s ease-out forwards',
              }}
            />
          )}
          <img
            src={exitBtn}
            alt="Exit"
            onClick={() => { stopSession(); setOnNextPage(false); setConfirmed(false); setShowCelebration(false); setFinishUsed(false) }}
            style={{
              position: 'absolute',
              left: '43%',
              top: '15%',
              width: '2%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
            }}
          />
          <img
            src={finishBtn}
            alt="Finish Work"
            onClick={() => { if (!finishUsed) { stopSession(); setFinishUsed(true); setShowCelebration(true); new Audio(partyHorn).play() } }}
            onMouseEnter={(e) => { if (!finishUsed) e.currentTarget.src = finishBtnHover }}
            onMouseLeave={(e) => { if (!finishUsed) e.currentTarget.src = finishBtn }}
            style={{
              position: 'absolute',
              left: '55%',
              top: '15%',
              width: '13%',
              cursor: finishUsed ? 'not-allowed' : 'pointer',
              opacity: finishUsed ? 0.5 : 1,
            }}
          />
          <img
            src={takeABreak}
            alt="Take a Break"
            onMouseEnter={(e) => { if (remainingSeconds > 0 && !finishUsed) e.currentTarget.src = takeABreakHover }}
            onMouseLeave={(e) => (e.currentTarget.src = takeABreak)}
            onClick={() => {
              if (!finishUsed && remainingSeconds > 0) {
                isPausedRef.current = true
                if (countdownAudioRef.current && !countdownAudioRef.current.paused) {
                  countdownAudioRef.current.pause()
                  countdownWasPlayingRef.current = true
                } else {
                  countdownWasPlayingRef.current = false
                }
                setShowBreak(true)
              }
            }}
            style={{
              position: 'absolute',
              left: '55.6%',
              top: '22%',
              width: '11.5%',
              cursor: remainingSeconds > 0 && !finishUsed ? 'pointer' : 'not-allowed',
              opacity: remainingSeconds > 0 && !finishUsed ? 1 : 0.5,
            }}
          />
        </div>
        {showWarning && (
          <div className="page-fade-in" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0097b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}>
            <div style={{
              position: 'relative',
              width: '55%',
              opacity: warningVisible ? 1 : 0,
              transform: warningVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <img src={warningWindow} alt="Warning" style={{ width: '100%', display: 'block' }} />
              {/* X button */}
              <div
                onClick={() => {
                  if (warningTimeoutRef.current) {
                    clearTimeout(warningTimeoutRef.current)
                    warningTimeoutRef.current = null
                  }
                  setWarningVisible(false)
                  isPausedRef.current = false
                  resumeCountdown()
                  setTimeout(() => setShowWarning(false), 400)
                }}
                style={{
                  position: 'absolute',
                  left: '87%',
                  top: '1%',
                  width: '12%',
                  height: '9%',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        )}
        {showBreak && (
          <div className="page-fade-in" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0097b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}>
            <div style={{ position: 'relative', width: '55%' }}>
              <img src={breakWindow} alt="Break window" style={{ width: '100%', display: 'block' }} />
              {/* Clickable hit area over the X in the top-right corner of the window image */}
              <div
                onClick={() => {
                  setShowBreak(false)
                  isPausedRef.current = false
                  if (countdownWasPlayingRef.current) resumeCountdown()
                }}
                style={{
                  position: 'absolute',
                  left: '87%',
                  top: '1%',
                  width: '12%',
                  height: '11%',
                  cursor: 'pointer',
                }}
              />
              <img
                src={breakYes}
                alt="Yes"
                onMouseEnter={(e) => (e.currentTarget.src = breakYesHover)}
                onMouseLeave={(e) => (e.currentTarget.src = breakYes)}
                onClick={() => {
                  setBreakTimerDigits('')
                  setShowBreak(false)
                  setShowBreakSetter(true)
                  setTimeout(() => setBreakSetterVisible(true), 20)
                }}
                style={{
                  position: 'absolute',
                  left: '10%',
                  bottom: '9%',
                  width: '36%',
                  cursor: 'pointer',
                }}
              />
              <img
                src={breakNo}
                alt="No"
                onMouseEnter={(e) => (e.currentTarget.src = breakNoHover)}
                onMouseLeave={(e) => (e.currentTarget.src = breakNo)}
                onClick={() => {
                  setShowBreak(false)
                  isPausedRef.current = false
                  if (countdownWasPlayingRef.current) resumeCountdown()
                }}
                style={{
                  position: 'absolute',
                  right: '10%',
                  bottom: '9%',
                  width: '36%',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        )}
        {showBreakSetter && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0097b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}>
            <div style={{
              position: 'relative',
              width: '55%',
              opacity: breakSetterVisible ? 1 : 0,
              transform: breakSetterVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <img src={breakSetTime} alt="How long do you want to take a break?" style={{ width: '100%', display: 'block' }} />
              {/* X button hit area */}
              <div
                onClick={() => {
                  setBreakSetterVisible(false)
                  isPausedRef.current = false
                  if (countdownWasPlayingRef.current) resumeCountdown()
                  setTimeout(() => setShowBreakSetter(false), 350)
                }}
                style={{
                  position: 'absolute',
                  left: '87%',
                  top: '1%',
                  width: '12%',
                  height: '9%',
                  cursor: 'pointer',
                }}
              />
              {/* Input overlaid on break-setter image */}
              <div style={{
                position: 'absolute',
                top: '58%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70%',
              }}>
                <img src={breakSetter} alt="" style={{ width: '100%', display: 'block' }} />
                <input
                  type="text"
                  value={breakTimerDigits ? (() => { const p = breakTimerDigits.padStart(6, '0'); return `${p.slice(0,2)}:${p.slice(2,4)}:${p.slice(4,6)}` })() : ''}
                  placeholder="00:00:00"
                  onChange={() => {}}
                  onKeyDown={(e) => {
                    if (e.key >= '0' && e.key <= '9' && breakTimerDigits.length < 6) {
                      setBreakTimerDigits(prev => prev + e.key)
                    } else if (e.key === 'Backspace') {
                      setBreakTimerDigits(prev => prev.slice(0, -1))
                    }
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    textAlign: 'center',
                    fontSize: '2.5vw',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: '600',
                    color: '#444',
                    boxSizing: 'border-box',
                    cursor: 'text',
                  }}
                />
              </div>
              {/* Confirm button */}
              <img
                src={breakConfirm}
                alt="Confirm"
                onMouseEnter={(e) => (e.currentTarget.src = breakConfirmHover)}
                onMouseLeave={(e) => (e.currentTarget.src = breakConfirm)}
                onClick={() => {
                  const secs = digitsToSeconds(breakTimerDigits)
                  setBreakRemainingSeconds(secs)
                  setBreakSetterVisible(false)
                  setShowBreakCountdown(true)
                  setTimeout(() => setBreakCountdownVisible(true), 20)
                  setTimeout(() => setShowBreakSetter(false), 350)
                  // Start break countdown only if time was entered
                  if (secs <= 0) return
                  // Start lofi
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
                      // Fade lofi out over 800ms, then play alarm
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
                }}
                style={{
                  position: 'absolute',
                  top: '74%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        )}
        {showBreakCountdown && (
          <div className="page-fade-in" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0097b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 101,
          }}>
            <div style={{
              position: 'relative',
              width: '55%',
              opacity: breakCountdownVisible ? 1 : 0,
              transform: breakCountdownVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <img src={breakCountdown} alt="Break countdown" style={{ width: '100%', display: 'block' }} />
              {/* X button hit area */}
              <div
                onClick={() => {
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
                  isPausedRef.current = false
                  if (countdownWasPlayingRef.current) resumeCountdown()
                  setTimeout(() => setShowBreakCountdown(false), 350)
                }}
                style={{
                  position: 'absolute',
                  left: '87%',
                  top: '1%',
                  width: '12%',
                  height: '9%',
                  cursor: 'pointer',
                }}
              />
              {/* Break countdown timer display */}
              <div style={{
                position: 'absolute',
                top: '57%',
                left: '52%',
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '5vw',
                fontWeight: '400',
                color: '#222',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>
                {secondsToFormatted(breakRemainingSeconds)}
              </div>
              {/* relax */}
              <img
                src={relaxImg}
                alt="Relax"
                style={{
                  position: 'absolute',
                  top: '56%',
                  left: '51%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  pointerEvents: 'none',
                  opacity: breakRemainingSeconds > 0 ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
              {/* time is up */}
              <img
                src={timeIsUpImg}
                alt="Time is up"
                onClick={() => {
                  if (breakRemainingSeconds !== 0) return
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
                  isPausedRef.current = false
                  if (countdownWasPlayingRef.current) resumeCountdown()
                  setTimeout(() => setShowBreakCountdown(false), 350)
                }}
                style={{
                  position: 'absolute',
                  top: '60%',
                  left: '51%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  pointerEvents: breakRemainingSeconds === 0 ? 'auto' : 'none',
                  cursor: breakRemainingSeconds === 0 ? 'pointer' : 'default',
                  opacity: breakRemainingSeconds === 0 ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (confirmed) {
    return (
      <div key="confirmed-page" className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>timer inputted</p>
          <div style={{
            padding: '18px 28px',
            borderRadius: '999px',
            backgroundColor: '#c8c8c8',
            fontSize: '20px',
            minWidth: '200px',
            textAlign: 'center',
          }}>
            {timerDigits ? formatTimerDigits(timerDigits) : '00:00:00'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>links inputted</p>
          {links.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#888' }}>no links saved</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.map((entry) => (
                <li key={entry.id} style={{
                  width: '420px',
                  padding: '18px 28px',
                  borderRadius: '999px',
                  backgroundColor: '#c8c8c8',
                  fontSize: '20px',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {entry.siteName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setConfirmed(false)}
            style={{
              padding: '12px 32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#4a4a4a',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
          <img
            src={nextBtn}
            alt="Next"
            onClick={() => {
              setShowReminder(true)
              setTimeout(() => setReminderVisible(true), 20)
              reminderTimeoutRef.current = setTimeout(() => {
                setReminderVisible(false)
                setTimeout(() => {
                  setShowReminder(false)
                  setOnNextPage(true)
                }, 400)
              }, 3000)
            }}
            onMouseEnter={(e) => (e.currentTarget.src = nextBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.src = nextBtn)}
            style={{ cursor: 'pointer', height: '44px', width: 'auto' }}
          />
        </div>
        {showReminder && (
          <div className="page-fade-in" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0097b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}>
            <div style={{
              position: 'relative',
              width: '55%',
              opacity: reminderVisible ? 1 : 0,
              transform: reminderVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <img src={reminderImg} alt="Reminder" style={{ width: '100%', display: 'block' }} />
              <div
                onClick={() => {
                  if (reminderTimeoutRef.current) {
                    clearTimeout(reminderTimeoutRef.current)
                    reminderTimeoutRef.current = null
                  }
                  setReminderVisible(false)
                  setTimeout(() => {
                    setShowReminder(false)
                    setOnNextPage(true)
                  }, 400)
                }}
                style={{
                  position: 'absolute',
                  left: '87%',
                  top: '1%',
                  width: '12%',
                  height: '9%',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

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

  if (showProductivity) {
    const today = new Date()
    const todayIndex = today.getDay()
    const sunday = new Date(today)
    sunday.setDate(today.getDate() - todayIndex)
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      return { name: dayNames[i], date: `${fullMonthNames[d.getMonth()]} ${d.getDate()}` }
    })
    const rangeStart = `Sun, ${fullMonthNames[sunday.getMonth()]} ${sunday.getDate()}`
    const rangeEnd = `Sat, ${fullMonthNames[saturday.getMonth()]} ${saturday.getDate()}`
    const year = sunday.getFullYear()

    return (
      <div key="productivity-page" className="page-fade-in" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#0097b2', position: 'relative', boxSizing: 'border-box' }}>
        {statView === 'list' ? (
        <div key={`list-${statViewKey}`} className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', paddingTop: '6vh', boxSizing: 'border-box' }}>
        <div style={{ width: 'calc(100% - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6%', marginBottom: '6px', boxSizing: 'border-box' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
            {rangeStart} – {rangeEnd}
          </span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
            {year}
          </span>
        </div>
        <div style={{ position: 'relative', display: 'inline-block', width: 'calc(100% - 80px)', margin: '0 40px' }}>
          <img src={statsWeekTableBg} alt="Weekly Stats" style={{ width: '100%', height: 'auto', display: 'block' }} />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={tableLine}
              alt=""
              style={{
                position: 'absolute',
                top: '0',
                left: `${(i / 7) * 100}%`,
                height: '100%',
                width: 'auto',
              }}
            />
          ))}
          {weekDays.map((day, i) => {
            const isSelected = i === selectedDay
            return (
              <div
                key={i}
                onClick={() => handleSelectDay(i)}
                style={{
                  position: 'absolute',
                  top: isSelected ? '0%' : '3%',
                  left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                  transform: 'translateX(-50%)',
                  width: `${(1 / 7) * 85}%`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2% 0',
                  cursor: 'pointer',
                  transition: 'top 0.3s ease',
                }}
              >
                <img
                  src={yellowHighlight}
                  alt=""
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '70%',
                    objectFit: 'fill',
                    zIndex: 0,
                    opacity: isSelected ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '800', fontSize: '2vw', color: '#222', lineHeight: 1.2, position: 'relative', zIndex: 1 }}>{day.name}</span>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '400', fontSize: '1.4vw', color: '#222', lineHeight: 1.2, position: 'relative', zIndex: 1 }}>{day.date}</span>
              </div>
            )
          })}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={miniClock}
              alt="clock"
              style={{
                position: 'absolute',
                top: '39%',
                left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                transform: 'translateX(-50%)',
                height: '15%',
                width: 'auto',
              }}
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              onClick={() => {
                if (openStatDay === i) {
                  setArrowFlipped((prev) => prev.map((v, j) => j === i ? false : v))
                  setStatVisible(false)
                  setTimeout(() => setOpenStatDay(null), 300)
                } else {
                  handleSelectDay(i)
                }
              }}
              style={{
                position: 'absolute',
                top: '62%',
                left: `${(i / 7) * 100 + (1 / 7) * 50}%`,
                transform: 'translateX(-50%)',
                height: '25%',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <img src={hoursTotalBtn} alt="hours total" style={{ height: '100%', width: 'auto' }} />
              <img
                src={arrowDropdown}
                alt="arrow"
                style={{
                  position: 'absolute',
                  right: '6%',
                  bottom: '32.5%',
                  height: '20%',
                  width: 'auto',
                  transform: arrowFlipped[i] ? 'scaleY(-1)' : 'scaleY(1)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>
          ))}
        </div>
        </div>) : (
          <div key="chart" className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', paddingTop: '6vh', boxSizing: 'border-box' }}>
            <div style={{ width: 'calc(100% - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6%', marginBottom: '6px', boxSizing: 'border-box' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
                {fullDayNames[selectedDay]}, {weekDays[selectedDay].date}
              </span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: '700', fontSize: '2vw', color: '#fff' }}>
                {year}
              </span>
            </div>
            <img
              src={piChartPlaceholder}
              alt="Pie chart"
              onClick={() => { if (openStatDay === null) handleSelectDay(selectedDay) }}
              style={{ maxHeight: '70vh', maxWidth: '70vw', width: 'auto', height: 'auto', marginTop: '3vh', cursor: openStatDay === null ? 'pointer' : 'default' }}
            />
          </div>
        )}
        {openStatDay !== null && (
          <div
            ref={statWindowRef}
            onMouseDown={(e) => {
              statDragRef.current = { startMouseX: e.clientX, startMouseY: e.clientY, startLeft: statPos.left, startBottom: statPos.bottom }
              e.preventDefault()
            }}
            style={{
              position: 'fixed',
              left: statPos.left,
              bottom: statPos.bottom,
              opacity: statVisible ? 1 : 0,
              transform: statVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <img src={statWindow} alt="Stats" style={{ width: 'clamp(220px, 25vw, 400px)', display: 'block' }} />
            <img
              src={piButton}
              alt="Chart view"
              onClick={(e) => { e.stopPropagation(); setStatView('chart'); setStatViewKey(k => k + 1) }}
              style={{ position: 'absolute', top: '2%', right: '33%', width: '14%', cursor: 'pointer', userSelect: 'none' }}
            />
            <img
              src={listButton}
              alt="List view"
              onClick={(e) => { e.stopPropagation(); setStatView('list'); setStatViewKey(k => k + 1) }}
              style={{ position: 'absolute', top: '2%', right: '16%', width: '14%', cursor: 'pointer', userSelect: 'none' }}
            />
            <div
              onClick={(e) => {
                e.stopPropagation()
                setArrowFlipped((prev) => prev.map((v, j) => j === openStatDay ? false : v))
                setStatVisible(false)
                setTimeout(() => setOpenStatDay(null), 300)
              }}
              style={{
                position: 'absolute',
                top: '2%',
                right: '2%',
                width: '12%',
                height: '8%',
                cursor: 'pointer',
              }}
            />
          </div>
        )}
        <button
          onClick={() => setShowProductivity(false)}
          style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '10px 28px', borderRadius: '999px', border: 'none', backgroundColor: '#4a4a4a', color: '#fff', fontSize: '16px', cursor: 'pointer', zIndex: 10 }}
        >
          Back
        </button>
      </div>
    )
  }

  return (
    <div key="home-page" className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', minHeight: '100vh', paddingTop: '4vh' }}>
      <img src={homePage} alt="Home Page" style={{ maxWidth: '100%', maxHeight: '50vh', width: 'auto', height: 'auto' }} />
      <img
        src={productivityTrackerBtn}
        alt="Productivity Tracker"
        onMouseEnter={(e) => (e.currentTarget.src = productivityTrackerBtnHover)}
        onMouseLeave={(e) => (e.currentTarget.src = productivityTrackerBtn)}
        onClick={() => setShowProductivity(true)}
        style={{ position: 'fixed', top: '16px', right: '16px', height: '44px', width: 'auto', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
        <input
          type="text"
          placeholder="00:00:00"
          value={timerDigits ? formatTimerDigits(timerDigits) : ''}
          onKeyDown={handleTimerKeyDown}
          onChange={() => {}}
          style={{
            width: '420px',
            padding: '18px 28px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: '#c8c8c8',
            fontSize: '20px',
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Enter link(s)"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '420px',
            padding: '18px 28px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: '#c8c8c8',
            fontSize: '20px',
            outline: 'none',
          }}
        />
        {linkError && (
          <span style={{ color: '#c0392b', fontSize: '14px', alignSelf: 'flex-start', paddingLeft: '28px' }}>
            {linkError}
          </span>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddLink}
            style={{
              padding: '12px 32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#4a4a4a',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Add Link
          </button>
          <button
            onClick={() => setShowLinks((prev) => !prev)}
            style={{
              padding: '12px 32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#4a4a4a',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {showLinks ? 'Hide Links' : 'Show Links'}
          </button>
        </div>

        <img
          src={confirmBtn}
          alt="Confirm"
          onClick={() => {
            const hasTime = timerDigits.length > 0 && timerDigits.replace(/0/g, '') !== ''
            const hasLink = links.length > 0
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
          }}
          onMouseEnter={(e) => (e.currentTarget.src = confirmBtnHover)}
          onMouseLeave={(e) => (e.currentTarget.src = confirmBtn)}
          style={{ cursor: 'pointer', maxWidth: '200px' }}
        />
        {confirmError && (
          <span style={{ color: '#c0392b', fontSize: '14px' }}>
            {confirmError}
          </span>
        )}

        {showLinks && links.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '420px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {links.map((entry) => (
              <li
                key={entry.id}
                style={{
                  width: '420px',
                  padding: '18px 28px',
                  borderRadius: '999px',
                  backgroundColor: '#c8c8c8',
                  fontSize: '20px',
                  wordBreak: 'break-all',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.siteName}</span>
                <button
                  onClick={() => handleRemoveLink(entry.id)}
                  style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: 1,
                    color: '#4a4a4a',
                    padding: '0 2px',
                  }}
                  aria-label="Remove link"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
