import { useState, useEffect, useRef } from 'react'
import homePage from './assets/home-page.png'
import confirmBtn from './assets/btn-confirm.png'
import confirmBtnHover from './assets/btn-confirm-hover.png'
import nextBtn from './assets/btn-next.png'
import nextBtnHover from './assets/btn-next-hover.png'
import Computer from './assets/Computer.png'
import donutImg from './assets/donut-stop-trying.png'
import timerImg from './assets/timer.png'
import exitBtn from './assets/exit-button.png'
import finishBtn from './assets/finish-work.png'
import finishBtnHover from './assets/finish-work-hover.png'
import takeABreak from './assets/take-a-break.png'
import takeABreakHover from './assets/take-a-break-hover.png'
import youDidGreat from './assets/you-did-great-job.png'
import confettiGif from './assets/confetti.gif'
import alarmSound from './assets/ios_17_radial.mp3'
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

  useEffect(() => {
    getLinks().then((loaded) => setLinks(loaded)).catch(() => setLinks([]))
  }, [])
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [showDonut, setShowDonut] = useState(false)
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioEnabledRef = useRef(false)

  function stopSession() {
    // Stop countdown sound immediately
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause()
      countdownAudioRef.current.currentTime = 0
      countdownAudioRef.current = null
    }
    // Kill the interval so alarm can't fire
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    // Disable audio for this session
    audioEnabledRef.current = false
  }
  const [finishUsed, setFinishUsed] = useState(false)
  const [donutFading, setDonutFading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)

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
    document.body.style.backgroundColor = onNextPage ? '#0097b2' : ''
  }, [onNextPage])

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
    if (!onNextPage) return
    const total = digitsToSeconds(timerDigits || '000000')
    setRemainingSeconds(total)
    setShowDonut(false)
    audioEnabledRef.current = true

    // Pre-create audio so ref is always valid for stopSession()
    const cdAudio = new Audio(countdownSound)
    cdAudio.currentTime = 0
    countdownAudioRef.current = cdAudio

    let halfTriggered = false
    let countdownStarted = false

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (!halfTriggered && prev <= total / 2) {
          halfTriggered = true
          setShowDonut(true)
          setTimeout(() => setDonutFading(true), 3300)
          setTimeout(() => { setShowDonut(false); setDonutFading(false) }, 4000)
        }
        if (prev === 10 && !countdownStarted && audioEnabledRef.current) {
          countdownStarted = true
          cdAudio.currentTime = 0
          cdAudio.play()
        }
        if (prev <= 1) {
          clearInterval(interval)
          intervalRef.current = null
          if (audioEnabledRef.current) {
            cdAudio.pause()
            cdAudio.currentTime = 0
            new Audio(alarmSound).play()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    intervalRef.current = interval
    return () => { clearInterval(interval); intervalRef.current = null }
  }, [onNextPage])

  if (onNextPage) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0097b2', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '100%' }}>
          <img src={Computer} alt="Computer" style={{ display: 'block', width: '100%' }} />
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
              src={donutImg}
              alt="Donut Stop Trying"
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
            onMouseEnter={(e) => (e.currentTarget.src = takeABreakHover)}
            onMouseLeave={(e) => (e.currentTarget.src = takeABreak)}
            style={{
              position: 'absolute',
              left: '55.6%',
              top: '22%',
              width: '11.5%',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '24px' }}>

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
            onClick={() => setOnNextPage(true)}
            onMouseEnter={(e) => (e.currentTarget.src = nextBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.src = nextBtn)}
            style={{ cursor: 'pointer', height: '44px', width: 'auto' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', minHeight: '100vh', paddingTop: '4vh' }}>
      <img src={homePage} alt="Home Page" style={{ maxWidth: '100%', maxHeight: '50vh', width: 'auto', height: 'auto' }} />

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
