import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../utils/classNames'
import './PillButton.css'

interface PillButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Label shown on the button. `children` is used instead when given. */
  text?: string
  children?: ReactNode
  /**
   * Plain object describing the look. All fields optional; unset ones use the defaults in PillButton.css.
   * width/height/fontSize/padding are the size attributes (any CSS length).
   */
  style?: {
    background?: string
    border?: string
    color?: string
    width?: string
    height?: string
    fontSize?: string
    fontWeight?: string
    padding?: string
  }
}

/** Fully rounded text button used across the app. Brightens 10% on hover. */
export function PillButton({ className, style, text, children, type = 'button', ...rest }: PillButtonProps) {
  return (
    <button {...rest} type={type} className={cx('pill-button', className)} style={{ ...style }}>
      {children ?? text}
    </button>
  )
}

