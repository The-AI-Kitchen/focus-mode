// ─── Focus Mode Content Script ────────────────────────────────────────────
// Fallback blocker for sites (like YouTube) that use a service worker cache,
// which can bypass declarativeNetRequest. Runs on every page load.

;(function () {
  try {
    const hostname = location.hostname.replace(/^www\./, '')
    if (!hostname) return

    chrome.storage.local.get(['focusBlocking', 'blockedDomains'], (result) => {
      if (!result.focusBlocking) return
      const domains = result.blockedDomains || []
      const isBlocked = domains.some(d => hostname === d || hostname.endsWith(`.${d}`))
      if (isBlocked) {
        location.replace('chrome://newtab')
      }
    })
  } catch {}
})()
