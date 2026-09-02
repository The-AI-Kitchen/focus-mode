import React from 'react'
import nextBtn from '../assets/btn-next.png'
import nextBtnHover from '../assets/btn-next-hover.png'
import reminderImg from '../assets/reminder.png'
import { formatTimerDigits } from '../utils/timerUtils'
import type { LinkEntry } from '../db'

interface ConfirmedPageProps {
  timerDigits: string
  links: LinkEntry[]
  showReminder: boolean
  reminderVisible: boolean
  onGoBack: () => void
  onNext: () => void
  onReminderDismiss: () => void
}

export function ConfirmedPage({
  timerDigits,
  links,
  showReminder,
  reminderVisible,
  onGoBack,
  onNext,
  onReminderDismiss,
}: ConfirmedPageProps) {
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
          onClick={onGoBack}
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
          onClick={onNext}
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
              onClick={onReminderDismiss}
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
