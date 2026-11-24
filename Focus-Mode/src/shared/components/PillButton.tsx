import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../utils/classNames'
import './PillButton.css'

/** Dark, fully rounded text button used across pages. */
export function PillButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className={cx('pill-button', className)} />
}
