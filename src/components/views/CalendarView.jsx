import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Calendar as CalendarIcon, LayoutGrid, List, Smile, ChevronLeft, ChevronRight, Plus, Check, Clock, CheckSquare, Trash2 } from 'lucide-react'

export default function CalendarView() {
  const { state, activeUser, partnerUser, logMood, addCalendarEvent, toggleCalendarItem, deleteCalendarItem } = useApp()
  const cartuneUser = state?.users?.cartune || { name: 'Cartune', avatar: '👩🏻' }
  const gunUser = state?.users?.gun || { name: 'Gun', avatar: '👦🏻' }
  const [activeSubTab, setActiveSubTab] = useState('mood') // default to 'mood' or 'month'
  const [filterType, setFilterType] = useState('all') // 'all', 'shared', 'personal'
  const [selectedDay, setSelectedDay] = useState(10)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventTime, setNewEventTime] = useState('')
  const [newEventType, setNewEventType] = useState('shared')
  const [newEventKind, setNewEventKind] = useState('event') // 'event' | 'task'

  const moodsList = [
    { key: 'happy', label: 'Happy', emoji: '😊', color: 'bg-pink-400', border: 'border-pink-300', text: 'text-pink-600', pillBg: 'bg-pink-50' },
    { key: 'calm', label: 'Calm', emoji: '😌', color: 'bg-purple-400', border: 'border-purple-300', text: 'text-purple-600', pillBg: 'bg-purple-50' },
    { key: 'sad', label: 'Sad', emoji: '🥺', color: 'bg-sky-400', border: 'border-sky-300', text: 'text-sky-600', pillBg: 'bg-sky-50' },
    { key: 'angry', label: 'Angry', emoji: '😡', color: 'bg-orange-400', border: 'border-orange-300', text: 'text-orange-600', pillBg: 'bg-orange-50' },
    { key: 'tired', label: 'Tired', emoji: '😑', color: 'bg-amber-400', border: 'border-amber-300', text: 'text-amber-600', pillBg: 'bg-amber-50' }
  ]

  const moodColors = {
    happy: '#f472b6',
    calm: '#a78bfa',
    sad: '#38bdf8',
    angry: '#fb923c',
    tired: '#f59e0b'
  }

  const formatDateKey = (day) => {
    const d = String(day).padStart(2, '0')
    return `2026-09-${d}`
  }

  const selectedDateStr = formatDateKey(selectedDay)
  
  // Extract both Cartune and Gun's mood for selected date
  const dayMoodEntry = state.calendar.moods[selectedDateStr] || 
                       state.calendar.moods[`2026-09-0${selectedDay}`] || 
                       state.calendar.moods[`2026-9-${selectedDay}`] || {}

  let cartuneMood = null
  let gunMood = null

  if (dayMoodEntry.cartune) {
    cartuneMood = dayMoodEntry.cartune
  } else if (dayMoodEntry.user === 'cartune') {
    cartuneMood = dayMoodEntry
  }

  if (dayMoodEntry.gun) {
    gunMood = dayMoodEntry.gun
  } else if (dayMoodEntry.user === 'gun') {
    gunMood = dayMoodEntry
  }

  // Active user's current mood for highlighting the 5 buttons
  const activeUserMood = state.currentUser === 'cartune' ? cartuneMood : gunMood

  // Collect recent mood entries for the RECENT feed
  const recentMoodsList = Object.entries(state.calendar.moods || {})
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .slice(0, 6)
    .map(([dateKey, entry]) => {
      const parts = dateKey.split('-')
      const dayNum = parseInt(parts[2] || parts[1] || '1', 10)
      const c = entry.cartune || (entry.user === 'cartune' ? entry : null)
      const g = entry.gun || (entry.user === 'gun' ? entry : null)
      return { dateKey, dayNum, cartune: c, gun: g }
    })
    .filter(item => item.cartune || item.gun)

  const eventsForSelectedDay = state.calendar.events
    .filter(e => {
      if (e.day !== selectedDay) return false
      if (filterType === 'shared') return e.type === 'shared'
      if (filterType === 'personal') return e.type === 'personal'
      return true
    })
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))

  // Sort events by closest date first (ascending order), then by time
  const sortedEvents = [...state.calendar.events]
    .filter(ev => {
      if (filterType === 'shared') return ev.type === 'shared'
      if (filterType === 'personal') return ev.type === 'personal'
      return true
    })
    .sort((a, b) => {
      const dateA = a.date || `2026-09-${String(a.day || 0).padStart(2, '0')}`
      const dateB = b.date || `2026-09-${String(b.day || 0).padStart(2, '0')}`
      if (dateA !== dateB) return dateA.localeCompare(dateB)
      return (a.time || '99:99').localeCompare(b.time || '99:99')
    })

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!newEventTitle.trim()) return
    addCalendarEvent({
      title: newEventTitle,
      date: `2026-09-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`,
      time: newEventTime.trim(),
      type: newEventType,
      kind: newEventKind
    })
    setNewEventTitle('')
    setNewEventTime('')
    setNewEventKind('event')
    setShowAddEventModal(false)
  }

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      
      {/* Top Header & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-[#8e1c24]" size={24} strokeWidth={2.4} />
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-display">
            Calendar
          </h1>
        </div>

        {/* Filter Pills: Shared / Personal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType(filterType === 'shared' ? 'all' : 'shared')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filterType === 'shared'
                ? 'bg-rose-100 text-[#8e1c24] border border-rose-300'
                : 'bg-rose-50/70 text-[#8e1c24] border border-transparent hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#8e1c24]"></span>
            <span>Shared</span>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'personal' ? 'all' : 'personal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filterType === 'personal'
                ? 'bg-blue-100 text-blue-600 border border-blue-300'
                : 'bg-blue-50/70 text-blue-600 border border-transparent hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Personal</span>
          </button>
        </div>
      </div>

      {/* Sub-view Switcher Tabs */}
      <div className="bg-stone-100/90 p-1 rounded-full flex items-center max-w-xs mx-auto border border-stone-200/70">
        <button
          onClick={() => setActiveSubTab('month')}
          className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'month'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <LayoutGrid size={14} />
          <span>Month</span>
        </button>

        <button
          onClick={() => setActiveSubTab('list')}
          className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'list'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <List size={14} />
          <span>List</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mood')}
          className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'mood'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Smile size={14} className="text-[#8e1c24]" />
          <span>Mood</span>
        </button>
      </div>

      {/* SUB-VIEW 1: MOOD VIEW (Image 4) */}
      {activeSubTab === 'mood' && (
        <div className="space-y-4">
          
          {/* Daily Mood Check-in Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
                <Smile size={18} className="text-[#8e1c24]" />
                <span>How are you feeling today?</span>
              </div>
              <span className="text-xs text-stone-400 font-medium">Sep {selectedDay}, 2026</span>
            </div>

            {/* Current Logger Perspective Bar */}
            <div className="flex items-center justify-between bg-stone-50/80 px-3.5 py-2 rounded-2xl border border-stone-200/60 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium">บันทึกสำหรับ:</span>
                <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
                  <span className="text-base">{activeUser.avatar}</span>
                  <span>{activeUser.name}</span>
                  <span className="text-[10px] text-[#8e1c24] font-bold bg-[#8e1c24]/10 px-2 py-0.5 rounded-full">ฉัน</span>
                </span>
              </div>

              <span className="text-[11px] text-stone-400 font-medium">
                {activeUserMood ? 'บันทึกแล้ว ✨' : 'ยังไม่ได้บันทึก'}
              </span>
            </div>

            {/* 5 Mood Emoji Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {moodsList.map(m => {
                const isSelected = activeUserMood?.mood === m.key
                return (
                  <button
                    key={m.key}
                    onClick={() => logMood(selectedDateStr, m.key)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#fff5f5] border-2 border-[#8e1c24] scale-105 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center text-lg shadow-xs`}>
                      {m.emoji}
                    </div>
                    <span className={`text-[11px] font-bold mt-1.5 ${isSelected ? 'text-[#8e1c24]' : 'text-stone-600'}`}>
                      {m.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* DUAL PARTNER MOOD CARDS (Cartune & Gun) */}
            <div className="mt-4 pt-3.5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                  สถานะอารมณ์ทั้งสองคน (Sep {selectedDay})
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  {cartuneMood && gunMood ? 'บันทึกครบทั้งคู่แล้ว 💕' : 'อารมณ์ประจำวัน'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Cartune Card */}
                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    state.currentUser === 'cartune'
                      ? 'bg-[#fffcfc] border-rose-200 shadow-2xs ring-1 ring-[#8e1c24]/20'
                      : 'bg-white border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base">{cartuneUser.avatar || '👩🏻'}</span>
                      <span className="text-xs font-bold text-stone-900 truncate">{cartuneUser.name}</span>
                    </div>
                    {state.currentUser === 'cartune' ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#8e1c24] text-white shrink-0">
                        ฉัน
                      </span>
                    ) : (
                      <span className="text-[9px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded-full shrink-0">
                        แฟน
                      </span>
                    )}
                  </div>

                  {cartuneMood ? (
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0"
                        style={{ backgroundColor: moodColors[cartuneMood.mood] || '#f472b6' }}
                      >
                        {cartuneMood.icon || moodsList.find(m => m.key === cartuneMood.mood)?.emoji || '😊'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-stone-900 capitalize truncate">
                          {cartuneMood.label || cartuneMood.mood}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium truncate">
                          รู้สึก{cartuneMood.label || cartuneMood.mood}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5 px-2 bg-stone-50 rounded-xl text-center border border-dashed border-stone-200">
                      <p className="text-[11px] text-stone-400 font-medium">ยังไม่บันทึก</p>
                      {state.currentUser === 'cartune' ? (
                        <p className="text-[10px] text-[#8e1c24] font-bold mt-0.5">เลือก emoji ด้านบน</p>
                      ) : (
                        <p className="text-[10px] text-stone-400 mt-0.5">รอ{cartuneUser.name}บันทึก</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Gun Card */}
                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    state.currentUser === 'gun'
                      ? 'bg-[#f8fafc] border-slate-300 shadow-2xs ring-1 ring-slate-700/20'
                      : 'bg-white border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base">{gunUser.avatar || '👦🏻'}</span>
                      <span className="text-xs font-bold text-stone-900 truncate">{gunUser.name}</span>
                    </div>
                    {state.currentUser === 'gun' ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-800 text-white shrink-0">
                        ฉัน
                      </span>
                    ) : (
                      <span className="text-[9px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded-full shrink-0">
                        แฟน
                      </span>
                    )}
                  </div>

                  {gunMood ? (
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0"
                        style={{ backgroundColor: moodColors[gunMood.mood] || '#a78bfa' }}
                      >
                        {gunMood.icon || moodsList.find(m => m.key === gunMood.mood)?.emoji || '😊'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-stone-900 capitalize truncate">
                          {gunMood.label || gunMood.mood}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium truncate">
                          รู้สึก{gunMood.label || gunMood.mood}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5 px-2 bg-stone-50 rounded-xl text-center border border-dashed border-stone-200">
                      <p className="text-[11px] text-stone-400 font-medium">ยังไม่บันทึก</p>
                      {state.currentUser === 'gun' ? (
                        <p className="text-[10px] text-[#8e1c24] font-bold mt-0.5">เลือก emoji ด้านบน</p>
                      ) : (
                        <p className="text-[10px] text-stone-400 mt-0.5">รอ{gunUser.name}บันทึก</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sweet Couple Mood Insight */}
              {cartuneMood && gunMood && (
                <div className="mt-2.5 p-2.5 bg-gradient-to-r from-rose-50/80 to-purple-50/80 rounded-2xl border border-rose-100 flex items-center gap-2 animate-fade-in">
                  <span className="text-base">✨</span>
                  <span className="text-xs font-medium text-stone-700">
                    {cartuneMood.mood === 'happy' && gunMood.mood === 'happy'
                      ? 'วันนี้ทั้ง Cartune และ Gun แฮปปี้สุดๆ ไปเลย! 🎉'
                      : cartuneMood.mood === 'tired' || gunMood.mood === 'tired'
                      ? 'มีคนเหนื่อยล้าในวันนี้ อย่าลืมกอดหรือส่งกำลังใจให้กันนะ 🤍'
                      : cartuneMood.mood === 'sad' || gunMood.mood === 'sad'
                      ? 'มีคนต้องการการดูแลเป็นพิเศษ ชวนคุยหรือหาของอร่อยกินด้วยกันนะ 🍰'
                      : 'เชื่อมต่อความรู้สึกกันและกันเรียบร้อยในวันนี้ 🌿'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Month Mood Heatmap Grid */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-stone-400 tracking-wider">THIS MONTH</span>
              <div className="flex items-center gap-2 text-xs font-extrabold text-stone-800">
                <ChevronLeft size={16} className="text-stone-400 cursor-pointer" />
                <span>Sep 2026</span>
                <ChevronRight size={16} className="text-stone-400 cursor-pointer" />
              </div>
            </div>

            {/* Day Header */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-stone-400 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Days Grid with Dynamic Dual Partner Mood Colors */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold">
              {/* Dummy padding days for September 2026 (Starts on Tuesday) */}
              <span></span><span></span>
              
              {/* Day 1 to 30 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => {
                const dateKey = formatDateKey(day)
                const dayEntry = state.calendar.moods[dateKey] || 
                                state.calendar.moods[`2026-09-0${day}`] || 
                                state.calendar.moods[`2026-9-${day}`] || {}
                
                const c = dayEntry.cartune || (dayEntry.user === 'cartune' ? dayEntry : null)
                const g = dayEntry.gun || (dayEntry.user === 'gun' ? dayEntry : null)
                const isSelected = selectedDay === day

                let cellStyle = {}
                let cellClasses = 'h-11 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all cursor-pointer relative overflow-hidden shadow-2xs '

                if (c && g) {
                  // Both logged: Split diagonal gradient! Top-left Cartune, Bottom-right Gun
                  const cColor = moodColors[c.mood] || '#f472b6'
                  const gColor = moodColors[g.mood] || '#a78bfa'
                  cellStyle = {
                    background: `linear-gradient(135deg, ${cColor} 0%, ${cColor} 50%, ${gColor} 50%, ${gColor} 100%)`
                  }
                  cellClasses += 'text-white font-extrabold '
                } else if (c) {
                  // Only Cartune logged
                  const cColor = moodColors[c.mood] || '#f472b6'
                  cellStyle = { backgroundColor: cColor }
                  cellClasses += 'text-white font-extrabold '
                } else if (g) {
                  // Only Gun logged
                  const gColor = moodColors[g.mood] || '#a78bfa'
                  cellStyle = { backgroundColor: gColor }
                  cellClasses += 'text-white font-extrabold '
                } else {
                  // Neither logged
                  cellClasses += 'bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-600 border border-stone-100 '
                }

                if (isSelected) {
                  cellClasses += 'ring-2 ring-stone-900 ring-offset-2 scale-105 z-10 '
                }

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={cellStyle}
                    className={cellClasses}
                    title={
                      c && g ? `Sep ${day}: Cartune (${c.mood}), Gun (${g.mood})` :
                      c ? `Sep ${day}: Cartune (${c.mood})` :
                      g ? `Sep ${day}: Gun (${g.mood})` :
                      `Sep ${day}`
                    }
                  >
                    <span className={c || g ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : ''}>
                      {day}
                    </span>
                    {/* Dual partner micro dots */}
                    {c && g && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-white/90"></span>
                        <span className="w-1 h-1 rounded-full bg-white/90"></span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-3.5 h-3.5 rounded-md border border-stone-200" style={{ background: 'linear-gradient(135deg, #f472b6 50%, #a78bfa 50%)' }}></span>
                <span>2 สี = บันทึกทั้ง {cartuneUser.avatar || '👩🏻'} {cartuneUser.name} & {gunUser.avatar || '👦🏻'} {gunUser.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {moodsList.map(m => (
                  <span key={m.key} className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: moodColors[m.key] }}></span>
                    <span className="text-[10px] text-stone-400">{m.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT MOOD TIMELINE (Matching Image 4) */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">RECENT</span>
              <span className="text-xs text-stone-400 font-medium">ประวัติอารมณ์ล่าสุด</span>
            </div>

            {recentMoodsList.length === 0 ? (
              <div className="text-center py-4 text-xs text-stone-400">
                ยังไม่มีประวัติอารมณ์ที่บันทึก
              </div>
            ) : (
              <div className="space-y-2">
                {recentMoodsList.map(({ dateKey, dayNum, cartune, gun }) => (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDay === dayNum ? 'bg-rose-50/50 border-rose-200 ring-1 ring-[#8e1c24]/20' : 'bg-stone-50/70 border-stone-200/60 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex flex-col items-center justify-center font-bold text-stone-800 shadow-2xs">
                        <span className="text-[9px] text-[#8e1c24] leading-none font-extrabold">SEP</span>
                        <span className="text-xs leading-none mt-0.5 font-extrabold">{dayNum}</span>
                      </div>
                      
                      {/* Show both partners' mood on this day */}
                      <div className="flex items-center gap-2 text-xs">
                        {cartune && (
                          <div className="flex items-center gap-1">
                            <span>{cartuneUser.avatar || '👩🏻'}</span>
                            <span className="font-bold text-stone-800">{cartuneUser.name}:</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs" style={{ backgroundColor: moodColors[cartune.mood] || '#f472b6' }}>
                              {cartune.icon || moodsList.find(m => m.key === cartune.mood)?.emoji} {cartune.label || cartune.mood}
                            </span>
                          </div>
                        )}
                        {cartune && gun && <span className="text-stone-300">•</span>}
                        {gun && (
                          <div className="flex items-center gap-1">
                            <span>{gunUser.avatar || '👦🏻'}</span>
                            <span className="font-bold text-stone-800">{gunUser.name}:</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs" style={{ backgroundColor: moodColors[gun.mood] || '#a78bfa' }}>
                              {gun.icon || moodsList.find(m => m.key === gun.mood)?.emoji} {gun.label || gun.mood}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-stone-400 font-medium">
                      {dateKey}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: MONTH VIEW (Image 5) */}
      {activeSubTab === 'month' && (
        <div className="space-y-4">
          
          {/* Calendar Month Grid Card */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-stone-900 font-display">September 2026</h2>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day of Week Labels */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-stone-400 mb-2">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold">
              {/* August overflow */}
              <span className="text-stone-300 py-1.5">30</span>
              <span className="text-stone-300 py-1.5">31</span>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => {
                const isSelected = selectedDay === day
                const dayEvents = state.calendar.events.filter(e => e.day === day)
                const hasEvent = dayEvents.length > 0
                const isShared = dayEvents.some(e => e.type === 'shared')
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#8e1c24] bg-rose-50/50 text-[#8e1c24] font-extrabold'
                        : 'text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span>{day}</span>
                    {hasEvent ? (
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${isShared ? 'bg-[#8e1c24]' : 'bg-blue-500'}`}></span>
                    ) : (
                      <span className="w-1 h-1 mt-0.5"></span>
                    )}
                  </button>
                )
              })}

              {/* October overflow */}
              <span className="text-stone-300 py-1.5">1</span>
              <span className="text-stone-300 py-1.5">2</span>
              <span className="text-stone-300 py-1.5">3</span>
            </div>
          </div>

          {/* Selected Date Card & Events */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#8e1c24]" />
                <h3 className="text-base font-extrabold text-[#8e1c24]">
                  {selectedDay} September
                </h3>
              </div>

              <button
                onClick={() => setShowAddEventModal(true)}
                className="w-8 h-8 rounded-full bg-[#8e1c24] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 text-center shadow-2xs">
              {eventsForSelectedDay.length === 0 ? (
                <div>
                  <p className="text-stone-400 text-sm font-medium">No events today</p>
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="mt-2 text-xs font-bold text-[#8e1c24] hover:underline cursor-pointer"
                  >
                    + Add Event
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-left">
                  {eventsForSelectedDay.map(ev => {
                    const isTask = ev.kind === 'task'
                    return (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                          isTask && ev.completed
                            ? 'bg-stone-50/70 border-stone-200/60 opacity-75'
                            : 'bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isTask ? (
                            <button
                              type="button"
                              onClick={() => toggleCalendarItem(ev.id)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                ev.completed
                                  ? 'bg-teal-600 border-teal-600 text-white shadow-2xs'
                                  : 'border-stone-300 bg-stone-50 hover:border-teal-500 hover:bg-teal-50/40'
                              }`}
                              title={ev.completed ? 'ทำแล้ว (คลิกเพื่อยกเลิก)' : 'คลิกเพื่อระบุว่าทำแล้ว'}
                            >
                              {ev.completed && <Check size={14} strokeWidth={3} />}
                            </button>
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center shadow-2xs shrink-0">
                              <Clock size={15} className={ev.type === 'shared' ? 'text-[#8e1c24]' : 'text-blue-500'} />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                                isTask ? 'bg-teal-50 text-teal-700 border border-teal-200/60' : 'bg-rose-50 text-[#8e1c24] border border-rose-200/60'
                              }`}>
                                {isTask ? 'Task' : 'Event'}
                              </span>
                              <span className={`text-sm font-extrabold ${isTask && ev.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                                {ev.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
                              {ev.time ? (
                                <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                                  <Clock size={11} className="text-stone-400" />
                                  <span>{ev.time} น.</span>
                                </span>
                              ) : (
                                <span className="text-stone-400">{isTask ? 'Due today' : 'All day'}</span>
                              )}
                              <span className="capitalize text-stone-400">• {ev.type}</span>
                              {isTask && ev.completed && (
                                <span className="text-teal-600 font-bold text-[10px] bg-teal-50 px-1.5 py-0.5 rounded">✓ ทำแล้ว</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`w-2.5 h-2.5 rounded-full ${ev.type === 'shared' ? 'bg-[#8e1c24]' : 'bg-blue-500'}`}></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCalendarItem(ev.id)
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="ลบรายการนี้"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 3: LIST VIEW */}
      {activeSubTab === 'list' && (
        <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Upcoming Schedule</h3>
            <span className="text-xs text-stone-400 font-medium">Sorted by nearest date & time</span>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              No events found
            </div>
          ) : (
            sortedEvents.map(ev => {
              const isTask = ev.kind === 'task'
              return (
                <div key={ev.id} className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between border border-stone-100 hover:border-stone-200 transition-all">
                  <div className="flex items-center gap-3">
                    {isTask ? (
                      <button
                        type="button"
                        onClick={() => toggleCalendarItem(ev.id)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 ${
                          ev.completed
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'bg-white border-stone-200 hover:border-teal-500 hover:bg-teal-50/40 text-stone-300'
                        }`}
                        title={ev.completed ? 'ทำแล้ว (คลิกเพื่อยกเลิก)' : 'คลิกเพื่อระบุว่าทำแล้ว'}
                      >
                        <Check size={18} strokeWidth={ev.completed ? 3 : 2} className={ev.completed ? 'text-white' : 'text-stone-300'} />
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex flex-col items-center justify-center font-bold text-stone-800 shadow-2xs shrink-0">
                        <span className="text-[10px] text-[#8e1c24] leading-none font-extrabold">SEP</span>
                        <span className="text-sm leading-none mt-0.5 font-extrabold">{ev.day}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                          isTask ? 'bg-teal-50 text-teal-700 border border-teal-200/60' : 'bg-rose-50 text-[#8e1c24] border border-rose-200/60'
                        }`}>
                          {isTask ? 'Task' : 'Event'}
                        </span>
                        <span className={`text-sm font-extrabold ${isTask && ev.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {ev.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="font-semibold text-stone-600">Sep {ev.day}</span>
                        {ev.time && (
                          <span className="font-bold text-stone-700 bg-stone-200/70 px-1.5 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                            <Clock size={11} className="text-stone-500" />
                            <span>{ev.time} น.</span>
                          </span>
                        )}
                        <span className="capitalize">{ev.type}</span>
                        {isTask && ev.completed && (
                          <span className="text-teal-600 font-bold text-[10px] bg-teal-50 px-1.5 py-0.5 rounded">✓ ทำแล้ว</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.type === 'shared' ? 'bg-rose-50 text-[#8e1c24]' : 'bg-blue-50 text-blue-600'}`}>
                      {ev.type}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCalendarItem(ev.id)
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Add Event & Task Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl animate-fade-in border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-stone-900 font-display">
                {newEventKind === 'task' ? 'Add Task' : 'Add Event'}
              </h3>
              <span className="text-xs font-bold text-[#8e1c24] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                {selectedDay} September
              </span>
            </div>

            {/* Segmented Switch: Event vs Task */}
            <div className="flex bg-stone-100 p-1 rounded-2xl mb-3.5 border border-stone-200/70">
              <button
                type="button"
                onClick={() => setNewEventKind('event')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  newEventKind === 'event'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <CalendarIcon size={14} className={newEventKind === 'event' ? 'text-[#8e1c24]' : ''} />
                <span>Event (นัดหมาย)</span>
              </button>
              <button
                type="button"
                onClick={() => setNewEventKind('task')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  newEventKind === 'task'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <CheckSquare size={14} className={newEventKind === 'task' ? 'text-teal-600' : ''} />
                <span>Task (สิ่งที่ต้องทำ)</span>
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700">
                  {newEventKind === 'task' ? 'ชื่องานที่ต้องทำ (Task Title)' : 'ชื่อกิจกรรม (Event Title)'}
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder={newEventKind === 'task' ? 'เช่น จ่ายค่าไฟ, สั่งทรายแมว, เปลี่ยนไส้กรอง' : 'เช่น ไปในเมือง, ทานข้าวกับครอบครัว'}
                  autoFocus
                  className="w-full mt-1.5 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Time Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <Clock size={13} className="text-[#8e1c24]" />
                    <span>{newEventKind === 'task' ? 'กำหนดเวลา (Due Time - ถ้ามี)' : 'เวลา (Time)'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewEventTime('')}
                    className={`text-[11px] font-bold cursor-pointer ${
                      !newEventTime ? 'text-[#8e1c24]' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {newEventKind === 'task' ? 'ไม่ระบุเวลา' : 'ทั้งวัน (All day)'}
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24] focus:bg-white font-medium cursor-pointer"
                  />

                  {/* Quick Time Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-stone-400 font-medium mr-0.5 shrink-0">ทางลัด:</span>
                    {['09:00', '12:00', '14:30', '18:00', '20:00'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewEventTime(t)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          newEventTime === t
                            ? 'bg-[#8e1c24] text-white border-[#8e1c24]'
                            : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:bg-stone-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">ประเภท (Type)</label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setNewEventType('shared')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newEventType === 'shared'
                        ? 'bg-[#8e1c24] text-white border-[#8e1c24] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${newEventType === 'shared' ? 'bg-white' : 'bg-[#8e1c24]'}`}></span>
                    <span>Shared (ร่วมกัน)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEventType('personal')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newEventType === 'personal'
                        ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${newEventType === 'personal' ? 'bg-white' : 'bg-blue-500'}`}></span>
                    <span>Personal (ส่วนตัว)</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {newEventKind === 'task' ? 'Save Task' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
