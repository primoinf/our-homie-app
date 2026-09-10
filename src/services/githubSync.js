// GitHub Cloud Sync Service for Our Homie
// Enables full data sync via GitHub REST API without external backend servers

const DEFAULT_FILE_PATH = 'homie-data.json'
const DEFAULT_BRANCH = 'main'

// Safe UTF-8 Base64 encoding/decoding supporting Thai characters and Emojis
export function encodeUtf8Base64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    console.error('Base64 encode error:', e)
    return btoa(str)
  }
}

export function decodeUtf8Base64(base64Str) {
  try {
    const cleanStr = base64Str.replace(/\s/g, '')
    return decodeURIComponent(escape(atob(cleanStr)))
  } catch (e) {
    console.error('Base64 decode error:', e)
    return atob(base64Str)
  }
}

// Test connection to GitHub repository
export async function testGitHubConnection({ username, repo, token }) {
  if (!username || !repo || !token) {
    return { ok: false, error: 'กรุณากรอกข้อมูล Username, Repository และ Token ให้ครบถ้วน' }
  }

  const url = `https://api.github.com/repos/${username.trim()}/${repo.trim()}`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (res.ok) {
      const data = await res.json()
      return { 
        ok: true, 
        repoName: data.full_name,
        isPrivate: data.private,
        defaultBranch: data.default_branch || 'main'
      }
    }

    if (res.status === 401) {
      return { ok: false, error: 'Token ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง (Unauthorized)' }
    }
    if (res.status === 404) {
      return { ok: false, error: 'ไม่พบคลังข้อมูล (Repository not found) ตรวจสอบชื่อ Username และ Repo' }
    }

    return { ok: false, error: `GitHub API error (HTTP ${res.status})` }
  } catch (err) {
    console.error('GitHub Connection Test Error:', err)
    return { ok: false, error: 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตหรือ GitHub ได้' }
  }
}

// Fetch remote homie-data.json from GitHub
export async function fetchRemoteData({ username, repo, token, branch = DEFAULT_BRANCH, filePath = DEFAULT_FILE_PATH }) {
  const url = `https://api.github.com/repos/${username.trim()}/${repo.trim()}/contents/${filePath}?ref=${branch}`
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (res.ok) {
      const fileData = await res.json()
      const jsonStr = decodeUtf8Base64(fileData.content)
      const parsedData = JSON.parse(jsonStr)
      return { ok: true, data: parsedData, sha: fileData.sha, exists: true }
    }

    if (res.status === 404) {
      // File does not exist yet; can be created on first sync
      return { ok: true, data: null, sha: null, exists: false }
    }

    return { ok: false, error: `Failed to fetch file (HTTP ${res.status})` }
  } catch (err) {
    console.error('GitHub Fetch Error:', err)
    return { ok: false, error: err.message || 'Fetch error' }
  }
}

// Commit and upload state to GitHub
export async function commitDataToGitHub({ username, repo, token, branch = DEFAULT_BRANCH, filePath = DEFAULT_FILE_PATH, state, sha }) {
  const url = `https://api.github.com/repos/${username.trim()}/${repo.trim()}/contents/${filePath}`

  // Security: clone state and wipe personal token before uploading to repo
  const cleanState = JSON.parse(JSON.stringify(state))
  if (cleanState.githubSettings) {
    cleanState.githubSettings.token = ''
  }

  const jsonStr = JSON.stringify(cleanState, null, 2)
  const contentBase64 = encodeUtf8Base64(jsonStr)

  const dateStr = new Date().toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
  const commitMsg = `sync: update our-homie data vault (${dateStr})`

  const payload = {
    message: commitMsg,
    content: contentBase64,
    branch
  }
  if (sha) {
    payload.sha = sha
  }

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      const result = await res.json()
      return { ok: true, sha: result.content?.sha }
    }

    const errBody = await res.json().catch(() => ({}))
    return { ok: false, error: errBody.message || `HTTP ${res.status}` }
  } catch (err) {
    console.error('GitHub Commit Error:', err)
    return { ok: false, error: err.message || 'Commit error' }
  }
}

// Helper: Union two arrays by id
function unionById(arr1 = [], arr2 = []) {
  const map = new Map()
  // Add first array items
  arr1.forEach(item => {
    if (item && item.id) map.set(item.id, item)
  })
  // Merge or override with second array items
  arr2.forEach(item => {
    if (item && item.id) {
      if (map.has(item.id)) {
        // Merge objects, preferring item with completed = true or updated props
        const existing = map.get(item.id)
        map.set(item.id, { ...existing, ...item, completed: existing.completed || item.completed })
      } else {
        map.set(item.id, item)
      }
    }
  })
  return Array.from(map.values())
}

// Conflict-free union merge of local and remote states
export function mergeStates(local, remote) {
  if (!remote) return local

  const merged = { ...local }

  // 1. Shopping: Union by item.id
  merged.shopping = unionById(local.shopping || [], remote.shopping || [])

  // 2. Calendar Events: Union by event.id
  const mergedEvents = unionById(local.calendar?.events || [], remote.calendar?.events || [])
  
  // 3. Calendar Moods: Deep merge date keys
  const localMoods = local.calendar?.moods || {}
  const remoteMoods = remote.calendar?.moods || {}
  const allDateKeys = Array.from(new Set([...Object.keys(localMoods), ...Object.keys(remoteMoods)]))
  const mergedMoods = {}

  allDateKeys.forEach(dateKey => {
    const l = localMoods[dateKey] || {}
    const r = remoteMoods[dateKey] || {}
    mergedMoods[dateKey] = {
      ...l,
      ...r,
      ...(l.cartune ? { cartune: l.cartune } : {}),
      ...(r.cartune ? { cartune: r.cartune } : {}),
      ...(l.gun ? { gun: l.gun } : {}),
      ...(r.gun ? { gun: r.gun } : {})
    }
  })

  merged.calendar = {
    ...local.calendar,
    ...remote.calendar,
    events: mergedEvents,
    moods: mergedMoods
  }

  // 4. Pets: Union by pet.id
  merged.pets = unionById(local.pets || [], remote.pets || [])

  // 5. Finance Transactions & Auto-recalculation of totals
  const mergedTransactions = unionById(local.finance?.transactions || [], remote.finance?.transactions || [])
    .sort((a, b) => (b.id || '').localeCompare(a.id || ''))

  // Recalculate spending math accurately from merged transactions
  let totalSpending = 0
  let cartunePaid = 0
  let gunPaid = 0
  const categorySpentMap = {}

  mergedTransactions.forEach(tx => {
    const amt = Number(tx.amount) || 0
    totalSpending += amt
    const payer = (tx.payer || '').toLowerCase()
    if (payer.includes('cartune')) {
      cartunePaid += amt
    } else {
      gunPaid += amt
    }
    const cat = tx.category || 'Other'
    categorySpentMap[cat] = (categorySpentMap[cat] || 0) + amt
  })

  const baseBudgets = (local.finance?.budgets || remote.finance?.budgets || [])
  const mergedBudgets = baseBudgets.map(b => ({
    ...b,
    spent: categorySpentMap[b.name] || 0
  }))

  merged.finance = {
    ...local.finance,
    ...remote.finance,
    totalSpending,
    cartunePaid,
    gunPaid,
    budgets: mergedBudgets,
    transactions: mergedTransactions
  }

  // 6. Awards & Points
  const localHistory = local.awards?.history || []
  const remoteHistory = remote.awards?.history || []
  const mergedHistory = unionById(localHistory, remoteHistory)
    .sort((a, b) => (b.id || '').localeCompare(a.id || ''))

  merged.awards = {
    ...local.awards,
    points: Math.max(local.awards?.points || 0, remote.awards?.points || 0),
    targetPoints: remote.awards?.targetPoints || local.awards?.targetPoints || 100,
    nextReward: remote.awards?.nextReward || local.awards?.nextReward || 'Gift',
    history: mergedHistory
  }

  // 7. Users: Merge profiles
  merged.users = {
    cartune: {
      ...(local.users?.cartune || {}),
      ...(remote.users?.cartune || {})
    },
    gun: {
      ...(local.users?.gun || {}),
      ...(remote.users?.gun || {})
    }
  }

  // 8. Always preserve local device identity and local GitHub credentials
  merged.currentUser = local.currentUser
  merged.githubSettings = local.githubSettings

  return merged
}

// Master Sync function supporting 3 modes:
// - 'sync': Fetch, merge, and upload merged state back
// - 'pull': Overwrite local with remote
// - 'push': Force upload local to remote
export async function syncWithGitHub({ localState, settings, mode = 'sync' }) {
  if (!settings.username || !settings.repo || !settings.token) {
    return { success: false, error: 'กรุณากรอกการตั้งค่า GitHub Token และ Repo ให้เรียบร้อยก่อน' }
  }

  const { username, repo, token, branch, filePath } = settings

  // 1. Fetch remote data
  const fetchRes = await fetchRemoteData({ username, repo, token, branch, filePath })
  if (!fetchRes.ok) {
    return { success: false, error: fetchRes.error }
  }

  const remoteState = fetchRes.data
  const sha = fetchRes.sha

  let stateToSave = localState

  if (mode === 'pull') {
    if (!remoteState) {
      return { success: false, error: 'ไม่พบข้อมูลบน GitHub สำหรับดึงลงมา (File does not exist yet)' }
    }
    stateToSave = {
      ...remoteState,
      currentUser: localState.currentUser,
      githubSettings: settings
    }
    return { 
      success: true, 
      state: stateToSave, 
      mode: 'pull', 
      lastSynced: new Date().toISOString() 
    }
  }

  if (mode === 'sync') {
    if (remoteState) {
      stateToSave = mergeStates(localState, remoteState)
    }
  }

  // Upload to GitHub
  const commitRes = await commitDataToGitHub({
    username,
    repo,
    token,
    branch,
    filePath,
    state: stateToSave,
    sha
  })

  if (!commitRes.ok) {
    return { success: false, error: commitRes.error, state: stateToSave }
  }

  return {
    success: true,
    state: stateToSave,
    sha: commitRes.sha,
    mode,
    lastSynced: new Date().toISOString()
  }
}
