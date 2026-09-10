import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { 
  User, 
  Award, 
  ArrowLeftRight, 
  CheckCircle2, 
  LogOut, 
  Heart, 
  Sparkles, 
  Trash2, 
  Database, 
  Pencil, 
  X, 
  Check, 
  Palette,
  Target,
  Plus,
  Cloud,
  RefreshCw,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  DownloadCloud,
  UploadCloud,
  Settings
} from 'lucide-react'

const COLOR_PRESETS = [
  { name: 'Maroon', hex: '#8e1c24' },
  { name: 'Slate', hex: '#1e293b' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Teal', hex: '#0d9488' }
]

const EMOJI_PRESETS = [
  '👩🏻', '👧🏻', '👱🏻‍♀️', '👩🏼‍🦰', '👩🏻‍💻', '👸🏻',
  '👦🏻', '👨🏻', '👱🏻‍♂️', '🧔🏻', '👨🏻‍💻', '🤴🏻',
  '🐱', '🐶', '🦊', '🐻', '🐰', '🐼',
  '🌸', '⚡', '✨', '☕', '🍓', '🥑'
]

const ROLE_PRESETS = ['Partner', 'แฟน', 'ที่รัก', 'ภรรยา', 'สามี', 'Wife', 'Husband']

export default function ProfileView() {
  const { 
    state, 
    activeUser, 
    partnerUser, 
    switchUser, 
    updateUserProfile, 
    updateCoupleGoal, 
    clearToClean, 
    loadSampleData, 
    logout,
    githubSettings,
    syncStatus,
    syncError,
    updateGitHubSettings,
    triggerGitHubSync,
    testGitHubConnectionAction
  } = useApp()

  // Modals state
  const [editingUserId, setEditingUserId] = useState(null) // 'cartune' | 'gun' | null
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showGitHubModal, setShowGitHubModal] = useState(false)

  // Profile Edit Form state
  const [profileName, setProfileName] = useState('')
  const [profileRole, setProfileRole] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileAvatar, setProfileAvatar] = useState('')
  const [profileColor, setProfileColor] = useState('#8e1c24')

  // Couple Goal Form state
  const [goalReward, setGoalReward] = useState('')
  const [goalTargetPoints, setGoalTargetPoints] = useState(100)
  const [bonusPoints, setBonusPoints] = useState('')
  const [bonusReason, setBonusReason] = useState('')

  // GitHub Settings Form state
  const [ghUsername, setGhUsername] = useState(githubSettings.username || 'primoinf')
  const [ghRepo, setGhRepo] = useState(githubSettings.repo || 'our-homie-app')
  const [ghBranch, setGhBranch] = useState(githubSettings.branch || 'main')
  const [ghFilePath, setGhFilePath] = useState(githubSettings.filePath || 'homie-data.json')
  const [ghToken, setGhToken] = useState(githubSettings.token || '')
  const [ghAutoSync, setGhAutoSync] = useState(githubSettings.autoSync !== false)
  const [showToken, setShowToken] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const openProfileModal = (userId) => {
    const userObj = state.users[userId] || {}
    setEditingUserId(userId)
    setProfileName(userObj.name || '')
    setProfileRole(userObj.role || 'Partner')
    setProfileEmail(userObj.email || '')
    setProfileAvatar(userObj.avatar || (userId === 'cartune' ? '👩🏻' : '👦🏻'))
    setProfileColor(userObj.accentColor || (userId === 'cartune' ? '#8e1c24' : '#1e293b'))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (!profileName.trim() || !editingUserId) return

    updateUserProfile(editingUserId, {
      name: profileName.trim(),
      role: profileRole.trim() || 'Partner',
      email: profileEmail.trim(),
      avatar: profileAvatar.trim() || '👤',
      accentColor: profileColor,
      badgeText: profileColor
    })

    setEditingUserId(null)
  }

  const openGoalModal = () => {
    setGoalReward(state.awards.nextReward || '')
    setGoalTargetPoints(state.awards.targetPoints || 100)
    setBonusPoints('')
    setBonusReason('')
    setShowGoalModal(true)
  }

  const handleSaveGoal = (e) => {
    e.preventDefault()
    updateCoupleGoal({
      nextReward: goalReward,
      targetPoints: Number(goalTargetPoints) || 100,
      bonusPoints: bonusPoints ? Number(bonusPoints) : 0,
      reason: bonusReason
    })
    setShowGoalModal(false)
  }

  const openGitHubSettingsModal = () => {
    setGhUsername(githubSettings.username || 'primoinf')
    setGhRepo(githubSettings.repo || 'aura-workout-economy')
    setGhBranch(githubSettings.branch || 'main')
    setGhFilePath(githubSettings.filePath || 'homie-data.json')
    setGhToken(githubSettings.token || '')
    setGhAutoSync(githubSettings.autoSync !== false)
    setShowToken(false)
    setShowGitHubModal(true)
  }

  const handleSaveGitHubSettings = (e) => {
    e.preventDefault()
    updateGitHubSettings({
      username: ghUsername.trim(),
      repo: ghRepo.trim(),
      branch: ghBranch.trim() || 'main',
      filePath: ghFilePath.trim() || 'homie-data.json',
      token: ghToken.trim(),
      autoSync: ghAutoSync
    })
    setShowGitHubModal(false)
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    // Temporarily apply current inputs for testing
    updateGitHubSettings({
      username: ghUsername.trim(),
      repo: ghRepo.trim(),
      token: ghToken.trim(),
      branch: ghBranch.trim() || 'main',
      filePath: ghFilePath.trim() || 'homie-data.json',
      autoSync: ghAutoSync
    })
    await testGitHubConnectionAction()
    setIsTestingConnection(false)
  }

  const cartuneUser = state.users.cartune || {}
  const gunUser = state.users.gun || {}

  const isConfigured = !!(githubSettings.username && githubSettings.repo && githubSettings.token)

  return (
    <div className="space-y-4 pt-1 animate-fade-in pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="text-[#8e1c24]" size={24} strokeWidth={2.4} />
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-display">
            Profile & Space
          </h1>
        </div>
      </div>

      {/* Active User Hero Profile Card */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border"
              style={{ 
                backgroundColor: `${activeUser.accentColor || '#8e1c24'}15`,
                borderColor: `${activeUser.accentColor || '#8e1c24'}30`
              }}
            >
              {activeUser.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900 font-display">
                  {activeUser.name}
                </h2>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${activeUser.accentColor || '#8e1c24'}15`,
                    color: activeUser.accentColor || '#8e1c24'
                  }}
                >
                  {activeUser.role || 'Partner'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium mt-0.5">
                {activeUser.email || 'partner@homie.app'}
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => openProfileModal(state.currentUser)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            title="แก้ไขโปรไฟล์ของฉัน"
          >
            <Pencil size={13} strokeWidth={2.2} />
            <span>แก้ไขโปรไฟล์</span>
          </button>
        </div>
      </div>

      {/* Household Members (Couple Space) */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#8e1c24]" fill="#8e1c24" />
            <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
              Household Members
            </span>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 size={11} />
            <span>Synced</span>
          </span>
        </div>

        {/* 2 Partner Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Cartune Card */}
          <div
            className={`p-3 rounded-2xl border transition-all relative ${
              state.currentUser === 'cartune'
                ? 'bg-[#fff5f6] border-[#8e1c24] ring-2 ring-[#8e1c24]/20 shadow-xs'
                : 'bg-stone-50 border-stone-200/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{cartuneUser.avatar || '👩🏻'}</span>
              
              <div className="flex items-center gap-1">
                {state.currentUser === 'cartune' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#8e1c24] text-white rounded-full">
                    ฉัน
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-stone-200/90 text-stone-600 rounded-full">
                    แฟน
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openProfileModal('cartune')}
                  className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="แก้ไขข้อมูล Cartune"
                >
                  <Pencil size={11} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-sm font-extrabold text-stone-900 truncate">
                {cartuneUser.name || 'Cartune'}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                {cartuneUser.role || 'Partner'}
              </div>
            </div>
          </div>

          {/* Gun Card */}
          <div
            className={`p-3 rounded-2xl border transition-all relative ${
              state.currentUser === 'gun'
                ? 'bg-stone-100 border-stone-900 ring-2 ring-stone-900/20 shadow-xs'
                : 'bg-stone-50 border-stone-200/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{gunUser.avatar || '👦🏻'}</span>

              <div className="flex items-center gap-1">
                {state.currentUser === 'gun' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-900 text-white rounded-full">
                    ฉัน
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-stone-200/90 text-stone-600 rounded-full">
                    แฟน
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openProfileModal('gun')}
                  className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="แก้ไขข้อมูล Gun"
                >
                  <Pencil size={11} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-sm font-extrabold text-stone-900 truncate">
                {gunUser.name || 'Gun'}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                {gunUser.role || 'Partner'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GITHUB CLOUD DATA VAULT (AURA-STYLE SYNC) */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs space-y-3 relative overflow-hidden">
        {/* Top Title & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-stone-900 flex items-center justify-center text-white">
              <Cloud size={15} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900 font-display flex items-center gap-1.5">
                <span>GitHub Cloud Sync</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-md">
                  Aura Style
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                ซิงค์ข้อมูลผ่าน GitHub Repository ฟรี 100%
              </div>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div>
            {syncStatus === 'syncing' ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <RefreshCw size={10} className="animate-spin" />
                <span>กำลังซิงค์...</span>
              </span>
            ) : syncStatus === 'synced' ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={10} />
                <span>ซิงค์แล้ว</span>
              </span>
            ) : syncStatus === 'error' ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <AlertCircle size={10} />
                <span>เกิดข้อผิดพลาด</span>
              </span>
            ) : isConfigured ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>พร้อมซิงค์</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span>ยังไม่ตั้งค่า</span>
              </span>
            )}
          </div>
        </div>

        {/* Repository & Last Sync Details */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 font-medium">คลังข้อมูล (Repo):</span>
            <span className="font-bold text-stone-800 font-mono text-[11px]">
              {githubSettings.username || 'username'} / {githubSettings.repo || 'repo'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400 font-medium">ไฟล์ข้อมูล (Data File):</span>
            <span className="font-bold text-stone-700 font-mono text-[11px]">
              {githubSettings.filePath || 'homie-data.json'} ({githubSettings.branch || 'main'})
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
            <span className="text-stone-400">ซิงค์ล่าสุด:</span>
            <span className="font-semibold text-stone-600">
              {githubSettings.lastSynced ? `${githubSettings.lastSynced} น.` : 'ยังไม่ได้ซิงค์'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Main Sync Button */}
          <button
            onClick={() => triggerGitHubSync('sync')}
            disabled={syncStatus === 'syncing'}
            className="w-full py-2.5 bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            <span>ซิงค์ข้อมูลกับ GitHub ตอนนี้ (Sync & Merge)</span>
          </button>

          {/* Pull and Push Secondary Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => triggerGitHubSync('pull')}
              disabled={syncStatus === 'syncing'}
              className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              title="ดึงข้อมูลล่าสุดจาก GitHub มาแทนที่เครื่องนี้"
            >
              <DownloadCloud size={13} />
              <span>ดึงข้อมูล (Pull)</span>
            </button>
            <button
              onClick={() => triggerGitHubSync('push')}
              disabled={syncStatus === 'syncing'}
              className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              title="อัปโหลดข้อมูลเครื่องนี้ขึ้นไปทับบน GitHub"
            >
              <UploadCloud size={13} />
              <span>อัปโหลด (Push)</span>
            </button>
          </div>

          {/* Config Settings Trigger Button */}
          <button
            onClick={openGitHubSettingsModal}
            className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-stone-200/80 transition-all active:scale-98"
          >
            <Settings size={13} />
            <span>⚙️ ตั้งค่า Token & Repository ({isConfigured ? 'พร้อมใช้งาน' : 'ต้องใส่ Token'})</span>
          </button>
        </div>
      </div>

      {/* Awards & Points Hub (Aura Economy) */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#8e1c24]" />
            <span className="text-sm font-extrabold text-stone-900 font-display">
              Awards & Points Economy
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#8e1c24]">
            {state.awards.points} / {state.awards.targetPoints} pts
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-[#8e1c24] to-rose-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((state.awards.points / (state.awards.targetPoints || 100)) * 100))}%` }}
          ></div>
        </div>

        {/* Current Couple Goal Box with Edit Button */}
        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold text-stone-500">Current Couple Goal</div>
            <div className="text-sm font-extrabold text-[#8e1c24]">
              {state.awards.nextReward}
            </div>
          </div>
          
          <button
            onClick={openGoalModal}
            className="px-2.5 py-1 bg-white hover:bg-rose-100/50 text-[#8e1c24] text-xs font-bold rounded-lg border border-rose-200 shadow-2xs flex items-center gap-1 transition-all active:scale-95"
            title="แก้ไขเป้าหมายรางวัล"
          >
            <Pencil size={11} strokeWidth={2.2} />
            <span>แก้ไขเป้าหมาย</span>
          </button>
        </div>

        {/* Milestone list */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Recent Completed Milestones
          </div>
          {state.awards.history.slice(0, 4).map(item => (
            <div key={item.id} className="text-xs p-2 bg-stone-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-stone-800">{item.title}</span>
              <span className="font-bold text-emerald-600">+{item.points} pts ({item.by})</span>
            </div>
          ))}
        </div>
      </div>

      {/* App & Deployment Info */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs space-y-2">
        <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
          Deployment & System
        </h3>

        <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-stone-800">Deployment Platform</div>
            <div className="text-[11px] text-stone-400">GitHub + Vercel Ready</div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">
            Ready
          </span>
        </div>

        {/* Action: Clear to Clean Slate */}
        <button
          onClick={clearToClean}
          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-[#8e1c24] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer border border-rose-200"
        >
          <Trash2 size={13} />
          <span>ล้างข้อมูลทั้งหมด (เริ่มใช้แบบ Clean)</span>
        </button>

        {/* Action: Load Demo Mock Data */}
        <button
          onClick={loadSampleData}
          className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
        >
          <Database size={13} />
          <span>โหลดข้อมูลตัวอย่างกลับมา (Demo Data)</span>
        </button>

        <button
          onClick={logout}
          className="w-full py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
        >
          <LogOut size={13} />
          <span>Log Out (ดูหน้าล็อกอิน)</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <User className="text-[#8e1c24]" size={20} />
                <h3 className="text-lg font-black text-stone-900 font-display">
                  แก้ไขโปรไฟล์ ({state.users[editingUserId]?.name || editingUserId})
                </h3>
              </div>
              <button
                onClick={() => setEditingUserId(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ชื่อแสดงผล (Display Name) *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="เช่น Cartune, Gun, ปลาทูน่า..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  บทบาท / สถานะ
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  placeholder="เช่น Partner, ที่รัก, ภรรยา, สามี..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {ROLE_PRESETS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setProfileRole(r)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                        profileRole === r 
                          ? 'bg-rose-50 text-[#8e1c24] border-rose-200' 
                          : 'bg-stone-100 text-stone-500 border-transparent hover:bg-stone-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="name@homie.app"
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Avatar Emoji */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    เลือก Emoji โปรไฟล์
                  </label>
                  <span className="text-lg">{profileAvatar}</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {EMOJI_PRESETS.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(emoji)}
                      className={`h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        profileAvatar === emoji 
                          ? 'bg-white shadow-xs scale-110 border border-stone-300 ring-2 ring-[#8e1c24]/20' 
                          : 'hover:bg-stone-200/60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  สีประจำตัว (Accent Color)
                </label>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 overflow-x-auto no-scrollbar">
                  {COLOR_PRESETS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setProfileColor(col.hex)}
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-transform ${
                        profileColor === col.hex ? 'scale-115 ring-2 ring-stone-900' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {profileColor === col.hex && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  บันทึกโปรไฟล์ ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Couple Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-stone-200">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Target className="text-[#8e1c24]" size={20} />
                <h3 className="text-lg font-black text-stone-900 font-display">
                  แก้ไขเป้าหมายของคู่รัก 🎯
                </h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  เป้าหมายรางวัล (Next Reward) *
                </label>
                <input
                  type="text"
                  required
                  value={goalReward}
                  onChange={(e) => setGoalReward(e.target.value)}
                  placeholder="เช่น ย้อมผมที่ enrich, ไปกินโอมากาเสะ, ทริปญี่ปุ่น..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  เป้าหมายคะแนนที่ต้องการ (Target Points)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={goalTargetPoints}
                  onChange={(e) => setGoalTargetPoints(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[50, 100, 150, 200, 300].map(pts => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setGoalTargetPoints(pts)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                        Number(goalTargetPoints) === pts
                          ? 'bg-rose-50 text-[#8e1c24] border-rose-200'
                          : 'bg-stone-100 text-stone-500 border-transparent hover:bg-stone-200'
                      }`}
                    >
                      {pts} pts
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Bonus points */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>ให้คะแนนพิเศษเพิ่มทันที (Bonus Points)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={bonusPoints}
                    onChange={(e) => setBonusPoints(e.target.value)}
                    placeholder="เช่น +20 pts"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={bonusReason}
                    onChange={(e) => setBonusReason(e.target.value)}
                    placeholder="เหตุผล (เช่น เลี้ยงข้าว)"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  บันทึกเป้าหมาย 🎯
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Cloud Settings Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Cloud className="text-[#8e1c24]" size={20} />
                <h3 className="text-lg font-black text-stone-900 font-display">
                  ตั้งค่า GitHub Cloud Sync ☁️
                </h3>
              </div>
              <button
                onClick={() => setShowGitHubModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGitHubSettings} className="space-y-3.5">
              {/* Security Banner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-900 leading-tight">
                  <span className="font-bold">ปลอดภัย 100%:</span> Token ถูกเก็บไว้ในเครื่องของคุณเท่านั้น และจะไม่ถูกนำไป Commit ลงใน Repository เด็ดขาด
                </div>
              </div>

              {/* GitHub Username */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  GitHub Username / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={ghUsername}
                  onChange={(e) => setGhUsername(e.target.value)}
                  placeholder="เช่น primoinf"
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Repository Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ชื่อคลังข้อมูล (Repository Name) *
                </label>
                <input
                  type="text"
                  required
                  value={ghRepo}
                  onChange={(e) => setGhRepo(e.target.value)}
                  placeholder="เช่น aura-workout-economy หรือ our-homie-data"
                  className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Personal Access Token */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    GitHub Personal Access Token (PAT) *
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#8e1c24] hover:underline flex items-center gap-0.5"
                  >
                    <span>สร้าง Token</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                  <input
                    type={showToken ? 'text' : 'password'}
                    required
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx หรือ github_pat_xxxx"
                    className="w-full pl-9 pr-9 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#8e1c24]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  💡 เลือก Token สิทธิ์ <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">repo</code> เพื่อให้อ่าน/เขียนไฟล์ข้อมูลได้
                </p>
              </div>

              {/* Advanced: File Path and Branch */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    File Path
                  </label>
                  <input
                    type="text"
                    value={ghFilePath}
                    onChange={(e) => setGhFilePath(e.target.value)}
                    placeholder="homie-data.json"
                    className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-700 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={ghBranch}
                    onChange={(e) => setGhBranch(e.target.value)}
                    placeholder="main"
                    className="w-full px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-700 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto Sync Toggle */}
              <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ghAutoSync}
                  onChange={(e) => setGhAutoSync(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8e1c24] focus:ring-[#8e1c24]"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">เปิดซิงค์อัตโนมัติ (Auto-Sync)</div>
                  <div className="text-[10px] text-stone-400">ดึงข้อมูลล่าสุดอัตโนมัติเมื่อเปิดแอปบนมือถือ</div>
                </div>
              </label>

              {/* Test Connection Button */}
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !ghToken.trim()}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isTestingConnection ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                <span>ทดสอบการเชื่อมต่อ GitHub (Test Connection)</span>
              </button>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowGitHubModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  บันทึกการตั้งค่า ☁️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
