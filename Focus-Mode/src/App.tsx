import { useState } from 'react'
import homePage from './assets/home-page.png'
import confirmBtn from './assets/btn-confirm.png'
import confirmBtnHover from './assets/btn-confirm-hover.png'
import nextBtn from './assets/btn-next.png'
import nextBtnHover from './assets/btn-next-hover.png'
import './App.css'
import { addLink, getLinks, removeLink, saveTimer, loadTimer, type LinkEntry } from './db'

function App() {
  const [timerDigits, setTimerDigits] = useState(loadTimer)
  const [linkInput, setLinkInput] = useState('')
  const [linkError, setLinkError] = useState('')
  const [links, setLinks] = useState<LinkEntry[]>(getLinks)
  const [showLinks, setShowLinks] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [onNextPage, setOnNextPage] = useState(false)

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

  function isValidUrl(value: string): boolean {
    try {
      const url = new URL(value.includes('://') ? value : `https://${value}`)
      return url.hostname.includes('.')
    } catch {
      return false
    }
  }

  function handleAddLink() {
    const trimmed = linkInput.trim()
    if (!trimmed) return
    if (!isValidUrl(trimmed)) {
      setLinkError('Please enter a valid URL (e.g. youtube.com)')
      return
    }
    setLinkError('')
    addLink(trimmed)
    setLinks(getLinks())
    setLinkInput('')
  }

  function handleRemoveLink(id: string) {
    removeLink(id)
    setLinks(getLinks())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddLink()
  }

  if (onNextPage) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0097b2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px'  }} />
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
                  {entry.url}
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <img src={homePage} alt="Home Page" style={{ maxWidth: '100%' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
        <input
          type="text"
          placeholder="00:00:00"
          value={timerDigits ? formatTimerDigits(timerDigits) : ''}
          onKeyDown={handleTimerKeyDown}
          readOnly
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
          onClick={() => setConfirmed(true)}
          onMouseEnter={(e) => (e.currentTarget.src = confirmBtnHover)}
          onMouseLeave={(e) => (e.currentTarget.src = confirmBtn)}
          style={{ cursor: 'pointer', maxWidth: '200px' }}
        />

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
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.url}</span>
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
