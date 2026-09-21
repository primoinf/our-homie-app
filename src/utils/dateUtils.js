export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export const MONTH_NAMES_TH_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
]

/**
 * Returns today's ISO date string YYYY-MM-DD in local time
 */
export function getTodayDateStr() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns current year and 1-indexed month
 */
export function getCurrentYearMonth() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  }
}

/**
 * Formats year and 1-indexed month to English name (e.g. "September 2026")
 */
export function formatMonthYear(year, month) {
  const mIndex = Math.max(0, Math.min(11, (month || 1) - 1))
  return `${MONTH_NAMES_EN[mIndex]} ${year}`
}

/**
 * Formats year and 1-indexed month to Thai name (e.g. "กันยายน 2026")
 */
export function formatMonthYearTh(year, month) {
  const mIndex = Math.max(0, Math.min(11, (month || 1) - 1))
  return `${MONTH_NAMES_TH[mIndex]} ${year}`
}

/**
 * Safe previous/next month navigation
 */
export function getAdjacentMonth(year, month, delta) {
  let newMonth = month + delta
  let newYear = year
  while (newMonth > 12) {
    newMonth -= 12
    newYear += 1
  }
  while (newMonth < 1) {
    newMonth += 12
    newYear -= 1
  }
  return { year: newYear, month: newMonth }
}

/**
 * Extracts year and 1-indexed month from a transaction object
 */
export function getTxYearMonth(tx, fallbackYear = 2026, fallbackMonth = 9) {
  if (!tx) return { year: fallbackYear, month: fallbackMonth }

  // 1. If tx.date is in YYYY-MM-DD format
  if (typeof tx.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(tx.date)) {
    const parts = tx.date.split('-')
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
      return { year: y, month: m }
    }
  }

  // 2. If tx.createdAt or tx.updatedAt is a valid timestamp
  const ts = typeof tx.createdAt === 'number' ? tx.createdAt : typeof tx.updatedAt === 'number' ? tx.updatedAt : null
  if (ts && !isNaN(ts)) {
    const d = new Date(ts)
    if (!isNaN(d.getTime())) {
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1
      }
    }
  }

  // 3. Fallback
  return { year: fallbackYear, month: fallbackMonth }
}

/**
 * Formats transaction date for clean, human-readable display
 */
export function formatTxDisplayDate(tx) {
  if (!tx) return ''

  const todayStr = getTodayDateStr()
  const todayParts = todayStr.split('-').map(Number)
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2])

  let txDateObj = null
  let dateRaw = tx.date

  // Check if date is YYYY-MM-DD
  if (typeof dateRaw === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateRaw)) {
    const [y, m, d] = dateRaw.split('-').map(Number)
    txDateObj = new Date(y, m - 1, d)
  } else if (typeof tx.createdAt === 'number' && !isNaN(tx.createdAt)) {
    txDateObj = new Date(tx.createdAt)
  }

  if (txDateObj && !isNaN(txDateObj.getTime())) {
    const dayDiff = Math.round((todayDate - new Date(txDateObj.getFullYear(), txDateObj.getMonth(), txDateObj.getDate())) / (1000 * 60 * 60 * 24))
    
    if (dayDiff === 0) return 'Today'
    if (dayDiff === 1) return 'Yesterday'

    const d = txDateObj.getDate()
    const mStr = MONTH_NAMES_EN[txDateObj.getMonth()].slice(0, 3)
    const y = txDateObj.getFullYear()

    if (y === todayParts[0]) {
      return `${d} ${mStr}`
    }
    return `${d} ${mStr} ${y}`
  }

  // Fallback to whatever string tx.date has, e.g. "Today"
  return tx.date || 'Today'
}
