import { useState, type ImgHTMLAttributes } from 'react'

interface HoverImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  hoverSrc: string
  /** When true the hover image is never shown (e.g. a disabled button). */
  hoverDisabled?: boolean
}

/** An <img> that swaps to `hoverSrc` while the pointer is over it. */
export function HoverImage({ src, hoverSrc, hoverDisabled = false, alt, ...rest }: HoverImageProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <img
      {...rest}
      src={hovered && !hoverDisabled ? hoverSrc : src}
      alt={alt}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}
