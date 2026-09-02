//Libraries
import React from 'react'
import { secondsToFormatted } from '../utils/timerUtils'
// import partyHorn from '../assets/party-horn-short.mp3'
// import lofiBeat from '../assets/lofi-beat-1.mp3'
// import alarmSound from '../assets/alarm-sound.mp3'

//Assets
import Computer from '../assets/Computer.png'
import timerImg from '../assets/timer.png'
import confettiGif from '../assets/confetti.gif'
import youDidGreat from '../assets/you-did-great-job.png'
import exitBtn from '../assets/exit-button.png'
import finishBtn from '../assets/finish-work.png'
import finishBtnHover from '../assets/finish-work-hover.png'
import takeABreak from '../assets/take-a-break.png'
import takeABreakHover from '../assets/take-a-break-hover.png'
import warningWindow from '../assets/warning-window.png'
import breakWindow from '../assets/break-window.png'
import breakYes from '../assets/break-yes.png'
import breakYesHover from '../assets/break-yes-hover.png'
import breakNo from '../assets/break-no.png'
import breakNoHover from '../assets/break-no-hover.png'
import breakSetTime from '../assets/break-set-time.png'
import breakSetter from '../assets/break-setter.png'
import breakConfirm from '../assets/break-confirm.png'
import breakConfirmHover from '../assets/break-confirm-hover.png'
import breakCountdown from '../assets/break-countdown.png'
import relaxImg from '../assets/relax.png'
import timeIsUpImg from '../assets/time-is-up.png'

//Typescript interface for props
interface TimerPageProps {
  remainingSeconds: number
  showCelebration: boolean
  celebrationFading: boolean
  showDonut: boolean
  donutFading: boolean
  motivationalImg: string
  finishUsed: boolean
  showWarning: boolean
  warningVisible: boolean
  showBreak: boolean
  showBreakSetter: boolean
  breakSetterVisible: boolean
  breakTimerDigits: string
  showBreakCountdown: boolean
  breakCountdownVisible: boolean
  breakRemainingSeconds: number
  onExit: () => void
  onFinish: () => void
  onTakeBreak: () => void
  onWarningDismiss: () => void
  onBreakWindowClose: () => void
  onBreakYes: () => void
  onBreakNo: () => void
  onBreakSetterClose: () => void
  onBreakTimerKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onBreakSetterConfirm: () => void
  onBreakCountdownClose: () => void
  onBreakTimeUp: () => void
}

export function TimerPage({
  remainingSeconds,
  showCelebration,
  celebrationFading,
  showDonut,
  donutFading,
  motivationalImg,
  finishUsed,
  showWarning,
  warningVisible,
  showBreak,
  showBreakSetter,
  breakSetterVisible,
  breakTimerDigits,
  showBreakCountdown,
  breakCountdownVisible,
  breakRemainingSeconds,
  onExit,
  onFinish,
  onTakeBreak,
  onWarningDismiss,
  onBreakWindowClose,
  onBreakYes,
  onBreakNo,
  onBreakSetterClose,
  onBreakTimerKeyDown,
  onBreakSetterConfirm,
  onBreakCountdownClose,
  onBreakTimeUp,
}: TimerPageProps) {
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
          onClick={onExit}
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
          onClick={onFinish}
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
          onClick={onTakeBreak}
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

      {/* Warning Modal */}
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
            <div
              onClick={onWarningDismiss}
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

      {/* Break Window Modal */}
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
            <div
              onClick={onBreakWindowClose}
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
              onClick={onBreakYes}
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
              onClick={onBreakNo}
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

      {/* Break Setter Modal */}
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
            <div
              onClick={onBreakSetterClose}
              style={{
                position: 'absolute',
                left: '87%',
                top: '1%',
                width: '12%',
                height: '9%',
                cursor: 'pointer',
              }}
            />
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
                onKeyDown={onBreakTimerKeyDown}
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
            <img
              src={breakConfirm}
              alt="Confirm"
              onMouseEnter={(e) => (e.currentTarget.src = breakConfirmHover)}
              onMouseLeave={(e) => (e.currentTarget.src = breakConfirm)}
              onClick={onBreakSetterConfirm}
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

      {/* Break Countdown Modal */}
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
            <div
              onClick={onBreakCountdownClose}
              style={{
                position: 'absolute',
                left: '87%',
                top: '1%',
                width: '12%',
                height: '9%',
                cursor: 'pointer',
              }}
            />
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
            <img
              src={timeIsUpImg}
              alt="Time is up"
              onClick={onBreakTimeUp}
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
