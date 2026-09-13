import React from 'react'
import { useApp } from '../../context/AppContext'
import { ShoppingCart, Calendar, PawPrint, PiggyBank, Award, ChevronRight, ArrowRight, Check, Droplets, Clock } from 'lucide-react'

export default function HomeView() {
  const { state, setActiveTab, toggleShoppingItem, markPetRoutineDone } = useApp()

  const pendingShopping = state.shopping.filter(item => !item.completed).length
  const todayPet = (state.pets && state.pets.length > 0) ? (state.pets.find(p => p.id === 'leah') || state.pets[0]) : null

  const allEvents = state?.calendar?.events || []

  // Current local date & time
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const currentDay = String(now.getDate()).padStart(2, '0')
  const todayDateStr = `${currentYear}-${currentMonth}-${currentDay}`

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowYear = tomorrow.getFullYear()
  const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0')
  const tomorrowDateStr = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`

  const currentHours = String(now.getHours()).padStart(2, '0')
  const currentMins = String(now.getMinutes()).padStart(2, '0')
  const currentTimeStr = `${currentHours}:${currentMins}`

  const getEventDateStr = (ev) => {
    if (ev.date && typeof ev.date === 'string') {
      const parts = ev.date.split('-')
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
      }
    }
    const calYear = state?.calendar?.year || currentYear
    const calMonth = String(state?.calendar?.month || currentMonth).padStart(2, '0')
    const day = String(ev.day || 1).padStart(2, '0')
    return `${calYear}-${calMonth}-${day}`
  }

  // Filter and sort events: only upcoming events (today or future)
  const sortedUpcomingEvents = allEvents
    .filter(ev => {
      // Completed tasks are finished, not upcoming
      if (ev.kind === 'task' && ev.completed) return false

      const evDate = getEventDateStr(ev)

      // Strictly in the future
      if (evDate > todayDateStr) return true

      // Strictly in the past
      if (evDate < todayDateStr) return false

      // Date is TODAY (evDate === todayDateStr)
      // Uncompleted tasks are still pending today
      if (ev.kind === 'task') return true

      // Events with no specific time are all-day today
      if (!ev.time) return true

      // Events with a specific time today: upcoming or ongoing (within 60 mins of start)
      if (ev.time >= currentTimeStr) return true

      const [evH, evM] = ev.time.split(':').map(Number)
      if (!isNaN(evH) && !isNaN(evM)) {
        const evMinutes = evH * 60 + evM
        const curMinutes = parseInt(currentHours, 10) * 60 + parseInt(currentMins, 10)
        // Keep active for 60 minutes after start time
        if (curMinutes - evMinutes <= 60) return true
      }

      return false
    })
    .sort((a, b) => {
      const dateA = getEventDateStr(a)
      const dateB = getEventDateStr(b)
      if (dateA !== dateB) return dateA.localeCompare(dateB)
      return (a.time || '99:99').localeCompare(b.time || '99:99')
    })

  const nearestEvent = sortedUpcomingEvents[0]
  const nearestDateStr = nearestEvent ? getEventDateStr(nearestEvent) : ''
  const isNearestToday = nearestDateStr === todayDateStr
  const isNearestTomorrow = nearestDateStr === tomorrowDateStr
  const nearestDayNum = nearestEvent ? (nearestEvent.day || parseInt(nearestDateStr.split('-')[2], 10) || 1) : 1

  const formatEventDateDisplay = (dateStr, fallbackDay) => {
    if (dateStr) {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const y = parts[0]
        const m = parseInt(parts[1], 10)
        const d = parseInt(parts[2], 10)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${d} ${monthNames[m - 1] || 'Sep'} ${y}`
      }
    }
    return `${fallbackDay || 1} Sep 2026`
  }

  const totalBudget = state.finance.budgets.reduce((acc, b) => acc + (b.budget || 0), 0)
  const budgetPct = totalBudget > 0 ? Math.round((state.finance.totalSpending / totalBudget) * 100) : 0

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      
      {/* 4 Top Quick Stats Pills */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Shopping Pill */}
        <button
          onClick={() => setActiveTab('shopping')}
          className="bg-[#fceef1] hover:bg-[#fadce2] transition-colors rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-2xs group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-rose-200/60 flex items-center justify-center text-rose-500 mb-1 group-hover:scale-105 transition-transform">
            <ShoppingCart size={16} strokeWidth={2.2} />
          </div>
          <span className="text-base font-extrabold text-rose-500 leading-tight">
            {pendingShopping}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 mt-0.5">Shopping</span>
        </button>

        {/* Events Pill */}
        <button
          onClick={() => setActiveTab('calendar')}
          className="bg-[#e7f8f6] hover:bg-[#d8f4f0] transition-colors rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-2xs group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-teal-200/60 flex items-center justify-center text-teal-600 mb-1 group-hover:scale-105 transition-transform">
            <Calendar size={16} strokeWidth={2.2} />
          </div>
          <span className="text-base font-extrabold text-teal-600 leading-tight">
            {sortedUpcomingEvents.length}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 mt-0.5">Events</span>
        </button>

        {/* Pet Care Pill */}
        <button
          onClick={() => setActiveTab('pet')}
          className="bg-[#fdf1e7] hover:bg-[#fae4d4] transition-colors rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-2xs group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-amber-200/60 flex items-center justify-center text-amber-600 mb-1 group-hover:scale-105 transition-transform">
            <PawPrint size={16} strokeWidth={2.2} />
          </div>
          <span className="text-base font-extrabold text-amber-600 leading-tight">
            {state.pets?.length || 0}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 mt-0.5">Pet Care</span>
        </button>

        {/* Budget Pill */}
        <button
          onClick={() => setActiveTab('finance')}
          className="bg-[#fcedee] hover:bg-[#fadbe0] transition-colors rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center text-center shadow-2xs group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-rose-200/70 flex items-center justify-center text-rose-800 mb-1 group-hover:scale-105 transition-transform">
            <PiggyBank size={16} strokeWidth={2.2} />
          </div>
          <span className="text-base font-extrabold text-[#8e1c24] leading-tight">
            {budgetPct}%
          </span>
          <span className="text-[11px] font-semibold text-stone-500 mt-0.5">Budget</span>
        </button>
      </div>

      {/* Section: Awards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight font-display">Awards</h2>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold text-[#8e1c24] hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        <div
          onClick={() => setActiveTab('profile')}
          className="bg-[#fff3f4] border border-[#fddbe0] rounded-3xl p-4 flex items-center justify-between shadow-2xs cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-rose-100/90 flex items-center justify-center text-[#8e1c24] shadow-xs">
              <Award size={24} strokeWidth={2.3} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-500">Your points</div>
              <div className="text-lg font-extrabold text-stone-900 leading-tight">
                {state.awards.points} <span className="text-sm font-semibold text-stone-500">/ {state.awards.targetPoints} pts</span>
              </div>
              <div className="text-xs font-bold text-[#8e1c24] mt-0.5">
                Next: {state.awards.nextReward}
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-2xs">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* Section: Today's Pet */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight font-display">Today's Pet</h2>
          <button
            onClick={() => setActiveTab('pet')}
            className="text-xs font-bold text-[#8e1c24] hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {todayPet ? (
          <div className="bg-gradient-to-r from-[#e7f9f6] to-[#f4faf9] border border-teal-100/80 rounded-3xl p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={todayPet.photo}
                  alt={todayPet.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-xs border border-white"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white">
                  🐾
                </span>
              </div>
              <div>
                <div className="text-base font-extrabold text-stone-900">{todayPet.name}</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 mt-0.5">
                  <Droplets size={13} strokeWidth={2.4} />
                  <span>{todayPet.todayTask}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => markPetRoutineDone(todayPet.id, todayPet.todayTask)}
              className="w-10 h-10 rounded-full bg-[#8e1c24] hover:bg-[#78171e] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Mark routine done"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setActiveTab('pet')}
            className="bg-stone-50 border border-dashed border-stone-300 rounded-3xl p-4 text-center cursor-pointer hover:bg-stone-100/80 transition-all"
          >
            <p className="text-xs font-bold text-stone-600">ยังไม่มีสัตว์เลี้ยงในระบบ 🐾</p>
            <p className="text-[11px] text-stone-400 mt-0.5">แตะเพื่อไปที่หน้า Pet และเพิ่มสัตว์เลี้ยง</p>
          </div>
        )}
      </div>

      {/* Section: Shopping List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight font-display">Shopping List</h2>
          <button
            onClick={() => setActiveTab('shopping')}
            className="text-xs font-bold text-[#8e1c24] hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-3 shadow-2xs divide-y divide-stone-100">
          {state.shopping.length === 0 ? (
            <div className="py-5 text-center text-xs text-stone-400">
              ไม่มีรายการซื้อของ (กดที่แท็บ Shopping เพื่อเพิ่มรายการ)
            </div>
          ) : (
            state.shopping.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => toggleShoppingItem(item.id)}
                className="py-2.5 px-1.5 flex items-center justify-between hover:bg-stone-50/80 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-[#8e1c24] border-[#8e1c24] text-white'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                  >
                    {item.completed && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-medium ${item.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                    {item.text}
                  </span>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg">
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section: Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight font-display">Upcoming Events</h2>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-bold text-[#8e1c24] hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {nearestEvent ? (
          <div
            onClick={() => setActiveTab('calendar')}
            className="bg-white border border-stone-200/80 rounded-3xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-stone-300 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                nearestEvent.kind === 'task' ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-rose-50 border-rose-100 text-[#8e1c24]'
              }`}>
                <span className="text-xl font-extrabold">{nearestDayNum}</span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-stone-900">{nearestEvent.title}</div>
                <div className="text-xs text-stone-400 font-medium flex items-center gap-1.5 mt-0.5">
                  {isNearestToday && (
                    <span className="font-extrabold text-teal-700 bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded text-[10px]">
                      TODAY
                    </span>
                  )}
                  {isNearestTomorrow && (
                    <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded text-[10px]">
                      TOMORROW
                    </span>
                  )}
                  <span>{formatEventDateDisplay(nearestDateStr, nearestEvent.day)}</span>
                  {nearestEvent.time && (
                    <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                      <Clock size={11} className="text-stone-400" />
                      <span>{nearestEvent.time} น.</span>
                    </span>
                  )}
                  <span className="capitalize text-stone-400">
                    · {nearestEvent.kind === 'task' ? 'Task' : 'Event'} · {nearestEvent.type} {nearestEvent.user && state.users?.[nearestEvent.user] ? `(${state.users[nearestEvent.user].avatar || '👤'} ${state.users[nearestEvent.user].name})` : ''}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-stone-300" />
          </div>
        ) : (
          <div className="p-4 bg-white rounded-3xl text-center text-xs text-stone-400">
            No upcoming events
          </div>
        )}
      </div>

    </div>
  )
}
