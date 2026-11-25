import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '../utils/classNames'
import './menudropdown.css'

interface MenuDropdownProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
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
export function MenuDropdown({ className, style, text, children, ...rest }: MenuDropdownProps) {
  return (
    <div {...rest} className={cx('dropdown', className)} style={{ ...style }}>
      {children ?? text}
    </div>
  )
}

