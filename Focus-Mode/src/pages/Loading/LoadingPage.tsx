import './LoadingPage.css'

/** Shown while a route is loading. */
export function LoadingPage() {
  return (
    <div className="loading-page" role="status" aria-live="polite">
      <div className="loading-page__spinner" />
      <span className="loading-page__text">Loading...</span>
    </div>
  )
}
