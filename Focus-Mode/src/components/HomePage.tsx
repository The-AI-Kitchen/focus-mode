import React from 'react'
import homePage from '../assets/home-page.png'
import productivityTrackerBtn from '../assets/productivity-tracker-button.png'
import productivityTrackerBtnHover from '../assets/productvity-tracker-button-hover.png'
import confirmBtn from '../assets/btn-confirm.png'
import confirmBtnHover from '../assets/btn-confirm-hover.png'
import { formatTimerDigits } from '../utils/timerUtils'
import type { LinkEntry } from '../db'

interface HomePageProps {
  timerDigits: string
  linkInput: string
  linkError: string
  links: LinkEntry[]
  showLinks: boolean
  confirmError: string
  onTimerKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onLinkInputChange: (value: string) => void
  onLinkKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onAddLink: () => void
  onToggleShowLinks: () => void
  onRemoveLink: (id: string) => void
  onConfirm: () => void
  onProductivityClick: () => void
}

export function HomePage({
  timerDigits,
  linkInput,
  linkError,
  links,
  showLinks,
  confirmError,
  onTimerKeyDown,
  onLinkInputChange,
  onLinkKeyDown,
  onAddLink,
  onToggleShowLinks,
  onRemoveLink,
  onConfirm,
  onProductivityClick,
}: HomePageProps) {
  return (
    <div key="home-page" className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', minHeight: '100vh', paddingTop: '4vh' }}>
      <img src={homePage} alt="Home Page" style={{ maxWidth: '100%', maxHeight: '50vh', width: 'auto', height: 'auto' }} />
      <img
        src={productivityTrackerBtn}
        alt="Productivity Tracker"
        onMouseEnter={(e) => (e.currentTarget.src = productivityTrackerBtnHover)}
        onMouseLeave={(e) => (e.currentTarget.src = productivityTrackerBtn)}
        onClick={onProductivityClick}
        style={{ position: 'fixed', top: '16px', right: '16px', height: '44px', width: 'auto', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
        <input
          type="text"
          placeholder="00:00:00"
          value={timerDigits ? formatTimerDigits(timerDigits) : ''}
          onKeyDown={onTimerKeyDown}
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
          onChange={(e) => onLinkInputChange(e.target.value)}
          onKeyDown={onLinkKeyDown}
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
            onClick={onAddLink}
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
            onClick={onToggleShowLinks}
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
          onClick={onConfirm}
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
                  onClick={() => onRemoveLink(entry.id)}
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
