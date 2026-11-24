import type { ReactNode } from 'react'
import { cx } from '../utils/classNames'
import './ImageModal.css'

interface ImageModalProps {
  /** Artwork that forms the modal window. */
  image: string
  alt: string
  /** Controls the frame's fade/scale transition. Omit to render without a transition. */
  visible?: boolean
  /** Fade the teal backdrop in when it mounts. */
  fadeBackdropIn?: boolean
  /** Use the taller close hotspot (needed by artwork with a larger title bar). */
  tallCloseArea?: boolean
  /** Extra class on the backdrop, e.g. to change its z-index. */
  className?: string
  /** Renders an invisible close hotspot over the artwork's X button. */
  onClose?: () => void
  /** Extra controls positioned over the artwork. */
  children?: ReactNode
}

/** Full-screen teal backdrop with an image "window" centered in it. */
export function ImageModal({
  image,
  alt,
  visible,
  fadeBackdropIn = false,
  tallCloseArea = false,
  className,
  onClose,
  children,
}: ImageModalProps) {
  const fades = visible !== undefined

  return (
    <div className={cx('image-modal', fadeBackdropIn && 'page-fade-in', className)}>
      <div className={cx('image-modal__frame', fades && 'image-modal__frame--fade', visible && 'is-visible')}>
        <img className="image-modal__image" src={image} alt={alt} />
        {onClose && (
          <div
            className={cx('image-modal__close', tallCloseArea && 'image-modal__close--tall')}
            onClick={onClose}
          />
        )}
        {children}
      </div>
    </div>
  )
}
