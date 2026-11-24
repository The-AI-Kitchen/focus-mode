import './ProductivityHeader.css'

interface ProductivityHeaderProps {
  label: string
  year: number
}

/** Heading row showing a date range or day, and the year. */
export function ProductivityHeader({ label, year }: ProductivityHeaderProps) {
  return (
    <div className="productivity-header">
      <span className="productivity-header__text">{label}</span>
      <span className="productivity-header__text">{year}</span>
    </div>
  )
}