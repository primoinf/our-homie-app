import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_DATA, MOCK_DATA, CLEAN_DATA } from '../data/initialData'
import { syncWithGitHub, testGitHubConnection } from '../services/githubSync'

const STORAGE_KEY = 'our_homie_state_v2'
const AUTH_KEY = 'our_homie_auth_v1'
const GITHUB_SETTINGS_KEY = 'our_homie_github_settings_v1'

const DEFAULT_GH_SETTINGS = {
  username: 'primoinf',
  repo: 'aura-workout-economy',
  branch: 'main',
  filePath: 'homie-data.json',
  token: '',
  autoSync: true,
  lastSynced: null
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Load state from localStorage or fallback to clean initial data
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to parse saved state:', e)
    }
    return CLEAN_DATA
  })

  // GitHub Sync settings state
  const [githubSettings, setGithubSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(GITHUB_SETTINGS_KEY)
      if (saved) {
        return { ...DEFAULT_GH_SETTINGS, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.warn('Failed to parse saved github settings:', e)
    }
    return DEFAULT_GH_SETTINGS
  })
  const [syncStatus, setSyncStatus] = useState('idle') // 'idle' | 'syncing' | 'synced' | 'error'
  const [syncError, setSyncError] = useState(null)

  // Auth state: default to true for direct previewing, can toggle to view AuthView
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_KEY)
      return savedAuth !== null ? JSON.parse(savedAuth) : true
    } catch (e) {
      return true
    }
  })

  const [activeTab, setActiveTab] = useState('home')
  const [toastMessage, setToastMessage] = useState(null)

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [state])

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated))
    } catch (e) {
      console.error('Failed to save auth to localStorage:', e)
    }
  }, [isAuthenticated])

  // Save GitHub settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(githubSettings))
    } catch (e) {
      console.error('Failed to save github settings:', e)
    }
  }, [githubSettings])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // GitHub Cloud Sync Actions
  const updateGitHubSettings = (newSettings) => {
    setGithubSettings(prev => ({ ...prev, ...newSettings }))
    showToast('บันทึกการตั้งค่า GitHub แล้ว ⚙️')
  }

  const triggerGitHubSync = async (mode = 'sync', isSilent = false) => {
    if (!githubSettings.token || !githubSettings.username || !githubSettings.repo) {
      if (!isSilent) {
        showToast('กรุณากรอก Token และชื่อ Repo ในหน้า Profile ก่อนครับ ⚠️')
      }
      return false
    }

    setSyncStatus('syncing')
    setSyncError(null)
    if (!isSilent) showToast('กำลังเชื่อมต่อ GitHub Cloud... ⏳')

    try {
      const result = await syncWithGitHub({
        localState: state,
        settings: githubSettings,
        mode
      })

      if (result.success) {
        if (result.state) {
          setState(result.state)
        }
        setSyncStatus('synced')
        const now = new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
        setGithubSettings(prev => ({ ...prev, lastSynced: now }))
        if (!isSilent) {
          showToast(mode === 'pull' ? 'ดึงข้อมูลจาก GitHub สำเร็จ! ⬇️' : 'ซิงค์ข้อมูลกับ GitHub เรียบร้อยแล้ว! ☁️')
        }
        setTimeout(() => setSyncStatus('idle'), 3500)
        return true
      } else {
        setSyncStatus('error')
        setSyncError(result.error)
        if (!isSilent) {
          showToast(`ซิงค์ล้มเหลว: ${result.error || 'Network error'} ❌`)
        }
        setTimeout(() => setSyncStatus('idle'), 4000)
        return false
      }
    } catch (err) {
      setSyncStatus('error')
      setSyncError(err.message)
      if (!isSilent) showToast('เกิดข้อผิดพลาดในการซิงค์ ❌')
      setTimeout(() => setSyncStatus('idle'), 4000)
      return false
    }
  }

  const testGitHubConnectionAction = async () => {
    showToast('กำลังทดสอบการเชื่อมต่อ GitHub... 🔍')
    const result = await testGitHubConnection(githubSettings)
    if (result.ok) {
      showToast(`เชื่อมต่อสำเร็จกับ ${result.repoName} (${result.isPrivate ? 'Private' : 'Public'}) ✅`)
      return true
    } else {
      showToast(`${result.error} ❌`)
      return false
    }
  }

  // Initial background sync if GitHub Token is already set
  useEffect(() => {
    if (githubSettings.token && githubSettings.username && githubSettings.repo && githubSettings.autoSync) {
      triggerGitHubSync('sync', true)
    }
  }, [])

  // Switch between Cartune and Gun
  const switchUser = (userId) => {
    const target = userId || (state.currentUser === 'cartune' ? 'gun' : 'cartune')
    setState(prev => ({ ...prev, currentUser: target }))
    showToast(`Switched active profile to ${state.users[target]?.name || target}`)
  }

  // Auth actions
  const login = (user = 'cartune') => {
    setState(prev => ({ ...prev, currentUser: user }))
    setIsAuthenticated(true)
    showToast(`Welcome back, ${state.users[user]?.name || user}!`)
  }

  const logout = () => {
    setIsAuthenticated(false)
    showToast('Logged out successfully')
  }

  // Profile & Couple Goal actions
  const updateUserProfile = (userId, updatedFields) => {
    setState(prev => {
      const currentUserObj = prev.users[userId] || {}
      const updatedUser = {
        ...currentUserObj,
        ...updatedFields
      }
      return {
        ...prev,
        users: {
          ...prev.users,
          [userId]: updatedUser
        }
      }
    })
    showToast('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว ✨')
  }

  const updateCoupleGoal = ({ nextReward, targetPoints, bonusPoints, reason }) => {
    setState(prev => {
      const currentPts = prev.awards.points
      const newPts = bonusPoints ? Math.max(0, currentPts + Number(bonusPoints)) : currentPts
      const targetPts = targetPoints ? Number(targetPoints) : prev.awards.targetPoints
      const reward = nextReward !== undefined ? nextReward.trim() : prev.awards.nextReward

      const newHistory = (bonusPoints && Number(bonusPoints) > 0) ? [
        {
          id: 'a_' + Date.now(),
          title: reason?.trim() || 'คะแนนพิเศษจากคู่รัก ✨',
          points: Number(bonusPoints),
          by: prev.users[prev.currentUser]?.name || 'Partner',
          date: 'Today'
        },
        ...prev.awards.history
      ] : prev.awards.history

      return {
        ...prev,
        awards: {
          ...prev.awards,
          points: newPts,
          targetPoints: targetPts,
          nextReward: reward,
          history: newHistory
        }
      }
    })
    showToast('อัปเดตเป้าหมายของคู่รักแล้ว 🎯')
  }

  // Shopping list actions
  const toggleShoppingItem = (id) => {
    setState(prev => {
      const updated = prev.shopping.map(item => {
        if (item.id === id) {
          const nextCompleted = !item.completed
          return { ...item, completed: nextCompleted }
        }
        return item
      })
      return { ...prev, shopping: updated }
    })
  }

  const addShoppingItem = (text, category = 'Home') => {
    if (!text.trim()) return
    const newItem = {
      id: 's_' + Date.now(),
      text: text.trim(),
      category: category || 'Home',
      completed: false,
      addedBy: state.users[state.currentUser]?.name || 'Cartune'
    }
    setState(prev => ({
      ...prev,
      shopping: [newItem, ...prev.shopping]
    }))
    showToast(`Added "${newItem.text}" to shopping list`)
  }

  const deleteShoppingItem = (itemId) => {
    setState(prev => ({
      ...prev,
      shopping: prev.shopping.filter(i => i.id !== itemId)
    }))
    showToast('ลบรายการซื้อของแล้ว 🗑️')
  }

  // Pet actions
  const markPetRoutineDone = (petId, taskName) => {
    setState(prev => {
      const currentPts = prev.awards.points
      const newPts = Math.min(prev.awards.targetPoints, currentPts + 15)
      const currentUserName = prev.users[prev.currentUser]?.name || 'Partner'
      const targetPet = prev.pets.find(p => p.id === petId) || prev.pets[0]
      const petName = targetPet ? targetPet.name : 'Pet'
      
      const newHistoryItem = {
        id: 'a_' + Date.now(),
        title: `${taskName} for ${petName}`,
        points: 15,
        by: currentUserName,
        date: 'Today'
      }

      return {
        ...prev,
        awards: {
          ...prev.awards,
          points: newPts,
          history: [newHistoryItem, ...prev.awards.history]
        }
      }
    })
    showToast(`ทำภารกิจ ${taskName} สำเร็จ! +15 pts 🎉`)
  }

  const addPet = (petData) => {
    const newPet = {
      id: 'pet_' + Date.now(),
      name: petData.name.trim(),
      gender: petData.gender || 'Male',
      breed: petData.breed?.trim() || 'Pet',
      age: petData.age?.trim() || '1 yr',
      weight: petData.weight?.trim() || '5 Kg',
      lastVaccine: petData.lastVaccine?.trim() || 'Recently',
      photo: petData.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      todayTask: petData.todayTask?.trim() || 'Check Food & Water',
      isFavorite: false,
      notes: petData.notes?.trim() || ''
    }
    setState(prev => ({
      ...prev,
      pets: [...prev.pets, newPet]
    }))
    showToast(`เพิ่มน้อง ${newPet.name} เรียบร้อยแล้ว 🐾`)
  }

  const updatePet = (petId, updatedFields) => {
    setState(prev => ({
      ...prev,
      pets: prev.pets.map(p => (p.id === petId ? { ...p, ...updatedFields } : p))
    }))
    showToast('อัปเดตข้อมูลสัตว์เลี้ยงแล้ว ✨')
  }

  const deletePet = (petId) => {
    setState(prev => {
      const pet = prev.pets.find(p => p.id === petId)
      const name = pet ? pet.name : 'สัตว์เลี้ยง'
      return {
        ...prev,
        pets: prev.pets.filter(p => p.id !== petId)
      }
    })
    showToast('ลบข้อมูลสัตว์เลี้ยงแล้ว 🗑️')
  }

  const togglePetFavorite = (petId) => {
    setState(prev => ({
      ...prev,
      pets: prev.pets.map(p => (p.id === petId ? { ...p, isFavorite: !p.isFavorite } : p))
    }))
  }

  // Finance actions
  const addExpense = ({ title, amount, payer, category }) => {
    const numAmount = parseFloat(amount) || 0
    if (!title || numAmount <= 0) return

    const newTx = {
      id: 't_' + Date.now(),
      title,
      amount: numAmount,
      payer: payer || state.users[state.currentUser]?.name,
      date: 'Today',
      verified: true,
      category: category || 'Home Supplies',
      icon: category === 'Food' ? 'Utensils' : category === 'Pets' ? 'PawPrint' : category === 'Utilities' ? 'Receipt' : 'Home'
    }

    setState(prev => {
      const isCartune = newTx.payer.toLowerCase().includes('cartune')
      const newTotal = prev.finance.totalSpending + numAmount
      const newCartunePaid = isCartune ? prev.finance.cartunePaid + numAmount : prev.finance.cartunePaid
      const newGunPaid = !isCartune ? prev.finance.gunPaid + numAmount : prev.finance.gunPaid

      // Update category budget spent
      const updatedBudgets = prev.finance.budgets.map(b => {
        if (b.name === category) {
          return { ...b, spent: b.spent + numAmount }
        }
        return b
      })

      return {
        ...prev,
        finance: {
          ...prev.finance,
          totalSpending: newTotal,
          cartunePaid: newCartunePaid,
          gunPaid: newGunPaid,
          budgets: updatedBudgets,
          transactions: [newTx, ...prev.finance.transactions]
        }
      }
    })
    showToast(`Expense ฿${numAmount.toLocaleString()} logged!`)
  }

  const deleteExpense = (txId) => {
    setState(prev => {
      const targetTx = prev.finance.transactions.find(t => t.id === txId)
      if (!targetTx) return prev

      const numAmount = targetTx.amount || 0
      const isCartune = targetTx.payer.toLowerCase().includes('cartune')
      const newTotal = Math.max(0, prev.finance.totalSpending - numAmount)
      const newCartunePaid = isCartune ? Math.max(0, prev.finance.cartunePaid - numAmount) : prev.finance.cartunePaid
      const newGunPaid = !isCartune ? Math.max(0, prev.finance.gunPaid - numAmount) : prev.finance.gunPaid

      const updatedBudgets = prev.finance.budgets.map(b => {
        if (b.name === targetTx.category) {
          return { ...b, spent: Math.max(0, b.spent - numAmount) }
        }
        return b
      })

      const updatedTransactions = prev.finance.transactions.filter(t => t.id !== txId)

      return {
        ...prev,
        finance: {
          ...prev.finance,
          totalSpending: newTotal,
          cartunePaid: newCartunePaid,
          gunPaid: newGunPaid,
          budgets: updatedBudgets,
          transactions: updatedTransactions
        }
      }
    })
    showToast('ลบรายการค่าใช้จ่ายแล้ว 🗑️')
  }

  // Calendar & Mood actions
  const logMood = (dateStr, moodKey) => {
    const moodMap = {
      happy: { label: 'Happy', icon: '😊', color: '#f472b6', hex: '#f472b6' },
      calm: { label: 'Calm', icon: '😌', color: '#a78bfa', hex: '#a78bfa' },
      sad: { label: 'Sad', icon: '🥺', color: '#38bdf8', hex: '#38bdf8' },
      angry: { label: 'Angry', icon: '😡', color: '#fb923c', hex: '#fb923c' },
      tired: { label: 'Tired', icon: '😑', color: '#f59e0b', hex: '#f59e0b' }
    }

    const info = moodMap[moodKey] || moodMap.happy
    const currentUserId = state.currentUser || 'cartune'
    const currentUserName = state.users[currentUserId]?.name || 'Partner'

    setState(prev => {
      const existing = prev.calendar.moods[dateStr] || {}
      let dayData = {}
      if (existing.user) {
        dayData[existing.user] = existing
      } else {
        dayData = { ...existing }
      }

      dayData[currentUserId] = {
        mood: moodKey,
        label: info.label,
        user: currentUserId,
        userName: currentUserName,
        date: dateStr,
        icon: info.icon,
        color: info.color,
        hex: info.hex
      }

      return {
        ...prev,
        calendar: {
          ...prev.calendar,
          moods: {
            ...prev.calendar.moods,
            [dateStr]: dayData
          }
        }
      }
    })
    showToast(`${currentUserName} is feeling ${info.label} today`)
  }

  const addCalendarEvent = ({ title, date, time = '', type = 'shared', kind = 'event' }) => {
    if (!title.trim()) return
    const day = parseInt(date.split('-')[2], 10) || 5
    const newEv = {
      id: (kind === 'task' ? 'tk_' : 'e_') + Date.now(),
      title: title.trim(),
      date,
      day,
      time: time ? time.trim() : '',
      type,
      kind: kind || 'event',
      completed: false,
      color: type === 'shared' ? '#8e1c24' : '#38bdf8',
      user: state.currentUser
    }

    setState(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: [...prev.calendar.events, newEv]
      }
    }))
    showToast(`${kind === 'task' ? 'Task' : 'Event'} "${title}" added`)
  }

  const toggleCalendarItem = (itemId) => {
    setState(prev => {
      let toggledTitle = ''
      let willBeDone = false
      const updated = prev.calendar.events.map(ev => {
        if (ev.id === itemId) {
          toggledTitle = ev.title
          willBeDone = !ev.completed
          return { ...ev, completed: willBeDone }
        }
        return ev
      })
      if (toggledTitle) {
        showToast(willBeDone ? `✓ ทำแล้ว: "${toggledTitle}"` : `ยกเลิก: "${toggledTitle}"`)
      }
      return {
        ...prev,
        calendar: {
          ...prev.calendar,
          events: updated
        }
      }
    })
  }

  const deleteCalendarItem = (itemId) => {
    setState(prev => {
      const item = prev.calendar.events.find(e => e.id === itemId)
      const title = item ? item.title : 'รายการ'
      const updated = prev.calendar.events.filter(e => e.id !== itemId)
      return {
        ...prev,
        calendar: {
          ...prev.calendar,
          events: updated
        }
      }
    })
    showToast('ลบรายการแล้ว 🗑️')
  }

  const clearToClean = () => {
    setState(CLEAN_DATA)
    showToast('Cleared all data to clean slate 🧹')
  }

  const loadSampleData = () => {
    setState(MOCK_DATA)
    showToast('Loaded demo sample data 📦')
  }

  const resetAllData = () => {
    setState(CLEAN_DATA)
    showToast('Reset to clean state 🧹')
  }

  const activeUser = state.users[state.currentUser] || state.users.cartune
  const partnerUser = state.users[state.currentUser === 'cartune' ? 'gun' : 'cartune']

  return (
    <AppContext.Provider value={{
      state,
      activeUser,
      partnerUser,
      activeTab,
      setActiveTab,
      isAuthenticated,
      login,
      logout,
      switchUser,
      updateUserProfile,
      updateCoupleGoal,
      toggleShoppingItem,
      addShoppingItem,
      deleteShoppingItem,
      markPetRoutineDone,
      addPet,
      updatePet,
      deletePet,
      togglePetFavorite,
      addExpense,
      deleteExpense,
      logMood,
      addCalendarEvent,
      toggleCalendarItem,
      deleteCalendarItem,
      resetAllData,
      clearToClean,
      loadSampleData,
      toastMessage,
      githubSettings,
      syncStatus,
      syncError,
      updateGitHubSettings,
      triggerGitHubSync,
      testGitHubConnectionAction
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
