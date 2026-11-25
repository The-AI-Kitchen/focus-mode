import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '../utils/classNames'
import './menuside.css'

interface MenuSideProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
  /** Label shown on the button. `children` is used instead when given. */
  children?: ReactNode
  /**
   * Plain object describing the look. All fields optional; unset ones use the defaults in PillButton.css.
   * width/height/fontSize/padding are the size attributes (any CSS length).
   */
  style?: {
    background?: string
  }
}

/** Fully rounded text button used across the app. Brightens 10% on hover. */
export function MenuSide({ className, style, children, ...rest }: MenuSideProps) {
  return (
    <div {...rest} className={cx('sidemenu', className)} style={{ ...style }}>
      {children}
    </div>
  )
}

