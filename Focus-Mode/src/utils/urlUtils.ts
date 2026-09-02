/**
 * Normalize a URL by removing protocol and www prefix
 */
export function normalizeUrl(value: string): string {
  try {
    const withProtocol = value.includes('://') ? value : `https://${value}`
    const hostname = new URL(withProtocol).hostname
    return hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
    const labels = url.hostname.split('.')

    // Must have at least two parts (e.g. "google" + "com")
    if (labels.length < 2) return false

    // TLD must be 2+ letters only (e.g. "com", "org", "io")
    const tld = labels[labels.length - 1]
    if (!/^[a-zA-Z]{2,}$/.test(tld)) return false

    // Every label must be non-empty, alphanumeric/hyphens, not start/end with hyphen
    for (const label of labels) {
      if (!label) return false
      if (!/^[a-zA-Z0-9-]+$/.test(label)) return false
      if (label.startsWith('-') || label.endsWith('-')) return false
    }

    return true
  } catch {
    return false
  }
}
