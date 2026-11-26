import { useLayoutEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'
import './card.css'

interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
  /** Label shown on the button. `children` is used instead when given. */
  
  children?: ReactNode
  /** Background color of the card. Any CSS color. */
  color?: string
  borderColor?: string
  /** Horizontal inset of the border's corner centers, as a share of card width (e.g. '2.5%'). */
  insetX?: string
  /** Vertical inset of the border's corner centers, as a share of card height (e.g. '1.25%'). */
  insetY?: string
  /**
   * Plain object describing the look. All fields optional; unset ones use the defaults in PillButton.css.
   * width/height/fontSize/padding are the size attributes (any CSS length).
   */
  
}

/** Fully rounded text button used across the app. Brightens 10% on hover. */
/** Inner content takes up 95% of the card, so each side gets 2.5% padding. */

const CORNER_RADIUS_RATIO = 0.1

/** Scooped outer corner: one radial gradient per corner. */
const corner = (color: string, radius: number, at: string) =>
  `radial-gradient(circle at ${at}, transparent ${radius}px, ${color} ${radius + 0.5}px)`

export function Card({ color = '#2bb3f6', borderColor = '#ffffff', insetX = '2.5%', insetY = '1.25%', children, ...rest }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cornerRadius, setCornerRadius] = useState(15)
  const offset = cornerRadius * 0.25
  const innerRadius = cornerRadius

  // Corner radius is 10% of the card's total height, so it is re-measured on resize.
  /*useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const update = () => {
      const h = el.getBoundingClientRect().height
      if (h > 0) {
        setCornerRadius(h * CORNER_RADIUS_RATIO)
      }
      else {setCornerRadius(15)}
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])*/

  return (
    <div
      
      ref={cardRef}
      className='card'
      style={{
        '--card-bg': color,
        '--corner-radius': `${cornerRadius}px`,
        '--inner-radius': `${innerRadius}px`,
        '--border-color': borderColor,
        '--inset-x': insetX,
        '--inset-y': insetY,
        position: 'relative',
        isolation: 'isolate',
        maxWidth: '600px',
        margin: '2rem auto',
        padding: `${offset}px`,
        boxSizing: 'border-box',
        backgroundImage: [
          corner(color, cornerRadius, '0 0'),
          corner(color, cornerRadius, '100% 0'),
          corner(color, cornerRadius, '100% 100%'),
          corner(color, cornerRadius, '0 100%'),
        ].join(', '),
        backgroundPosition: 'top left, top right, bottom right, bottom left',
        backgroundSize: '51% 51%',
        backgroundRepeat: 'no-repeat',
      } as CSSProperties}
      {...rest}
    >
      <div
        className='card__container'
        style={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 1,
          
        }}
      >
        {children}
      </div>
    </div>
  )
}