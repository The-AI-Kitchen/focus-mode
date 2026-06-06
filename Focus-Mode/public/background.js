// ─── Site Blocking ────────────────────────────────────────────────────────

const BLOCK_RULE_ID_START = 1000

async function applyBlockRules(domains) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
  const removeIds = existingRules
    .filter(r => r.id >= BLOCK_RULE_ID_START)
    .map(r => r.id)

  const addRules = domains.map((domain, i) => ({
    id: BLOCK_RULE_ID_START + i,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ['main_frame', 'sub_frame'],
    },
  }))

  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds, addRules })

  // Persist blocking state so the content script can read it
  await chrome.storage.local.set({ focusBlocking: true, blockedDomains: domains })

  // Redirect already-open tabs that match a blocked domain
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    if (!tab.url || !tab.id) continue
    try {
      const hostname = new URL(tab.url).hostname.replace(/^www\./, '')
      if (domains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
        chrome.tabs.update(tab.id, { url: 'chrome://newtab' })
      }
    } catch {}
  }
}

async function clearBlockRules() {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
  const removeIds = existingRules
    .filter(r => r.id >= BLOCK_RULE_ID_START)
    .map(r => r.id)
  if (removeIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds, addRules: [] })
  }
  // Clear blocking state so the content script stops redirecting
  await chrome.storage.local.set({ focusBlocking: false, blockedDomains: [] })
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'START_BLOCKING') {
    applyBlockRules(message.domains).then(() => sendResponse({ ok: true }))
    return true
  }
  if (message.type === 'STOP_BLOCKING') {
    clearBlockRules().then(() => sendResponse({ ok: true }))
    return true
  }
})

// ─── Focus Mode – Background Service Worker ───────────────────────────────
// Tracks real-time time spent per domain and saves it to chrome.storage.local.
// Storage key format: "tracked_<dateString>"  e.g. "tracked_Wed Jun 04 2026"
// Value format: { "youtube.com": 123456, "twitter.com": 45678, ... }  (ms)

let currentDomain = null
let sessionStart = null

function getDomain(url) {
  try {
    if (!url) return null
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) return null
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, '') || null
  } catch {
    return null
  }
}

function getTodayKey() {
  return `tracked_${new Date().toDateString()}`
}

async function flushCurrentSession() {
  if (!currentDomain || !sessionStart) return
  const durationMs = Date.now() - sessionStart
  if (durationMs < 500) return // ignore sub-half-second blips

  const key = getTodayKey()
  try {
    const result = await chrome.storage.local.get(key)
    const existing = result[key] || {}
    existing[currentDomain] = (existing[currentDomain] || 0) + durationMs
    await chrome.storage.local.set({ [key]: existing })
  } catch (e) {
    console.warn('[Focus Mode] Failed to save tracked time:', e)
  }

  currentDomain = null
  sessionStart = null
}

async function startTracking(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId)
    if (!tab || !tab.active) return
    const domain = getDomain(tab.url)
    if (domain === currentDomain) return // same site, no change
    await flushCurrentSession()
    if (domain) {
      currentDomain = domain
      sessionStart = Date.now()
    }
  } catch {
    await flushCurrentSession()
  }
}

// User switches tabs
chrome.tabs.onActivated.addListener(({ tabId }) => {
  startTracking(tabId)
})

// Page finishes loading (navigation within a tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    const domain = getDomain(tab.url)
    if (domain !== currentDomain) {
      flushCurrentSession().then(() => {
        if (domain) {
          currentDomain = domain
          sessionStart = Date.now()
        }
      })
    }
  }
})

// Chrome window loses / gains focus (e.g. user switches to another app)
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    flushCurrentSession()
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs && tabs[0]) startTracking(tabs[0].id)
    })
  }
})
