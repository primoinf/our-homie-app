import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  Wallet, Plus, Check, Clock, Utensils, PawPrint, Receipt, Home, Wrench,
  ShoppingBag, Coffee, Store, Building2, PiggyBank, ArrowUpDown, Trash2,
  Car, Sparkles, Heart, ChevronLeft, ChevronRight, ChevronDown, RotateCcw,
  Calendar as CalendarIcon
} from 'lucide-react'
import {
  MONTH_NAMES_EN,
  MONTH_NAMES_TH,
  MONTH_NAMES_TH_SHORT,
  getTodayDateStr,
  getCurrentYearMonth,
  formatMonthYear,
  formatMonthYearTh,
  getAdjacentMonth,
  getTxYearMonth,
  formatTxDisplayDate
} from '../../utils/dateUtils'

export default function FinanceView() {
  const { state, addExpense, deleteExpense, addBudgetCategory, deleteBudgetCategory } = useApp()
  const cartuneName = state?.users?.cartune?.name || 'Cartune'
  const gunName = state?.users?.gun?.name || 'Gun'

  // Current real month/year
  const currentYM = getCurrentYearMonth()

  // Selected month state
  const [selectedYear, setSelectedYear] = useState(currentYM.year)
  const [selectedMonth, setSelectedMonth] = useState(currentYM.month)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(currentYM.year)

  const isCurrentMonth = selectedYear === currentYM.year && selectedMonth === currentYM.month

  // Add Expense Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState(state.currentUser === 'gun' ? gunName : cartuneName)
  const [category, setCategory] = useState('Food')
  const [expenseDate, setExpenseDate] = useState(getTodayDateStr())

  // Add Budget Category Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryBudget, setCategoryBudget] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('ShoppingBag')

  const { finance } = state
  const allTransactions = finance?.transactions || []

  // Month navigation handlers
  const handlePrevMonth = () => {
    const { year, month } = getAdjacentMonth(selectedYear, selectedMonth, -1)
    setSelectedYear(year)
    setSelectedMonth(month)
    setPickerYear(year)
    setShowMonthPicker(false)
  }

  const handleNextMonth = () => {
    const { year, month } = getAdjacentMonth(selectedYear, selectedMonth, 1)
    setSelectedYear(year)
    setSelectedMonth(month)
    setPickerYear(year)
    setShowMonthPicker(false)
  }

  const handleGoCurrentMonth = () => {
    setSelectedYear(currentYM.year)
    setSelectedMonth(currentYM.month)
    setPickerYear(currentYM.year)
    setShowMonthPicker(false)
  }

  // Filter transactions for the selected month
  const monthlyTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      const { year, month } = getTxYearMonth(tx, currentYM.year, currentYM.month)
      return year === selectedYear && month === selectedMonth
    }).sort((a, b) => {
      const timeA = a.createdAt || (typeof a.id === 'string' && a.id.startsWith('t_') ? parseInt(a.id.slice(2), 10) : 0)
      const timeB = b.createdAt || (typeof b.id === 'string' && b.id.startsWith('t_') ? parseInt(b.id.slice(2), 10) : 0)
      return timeB - timeA
    })
  }, [allTransactions, selectedYear, selectedMonth, currentYM.year, currentYM.month])

  // Calculate monthly metrics dynamically
  const {
    monthlyTotalSpending,
    monthlyCartunePaid,
    monthlyGunPaid,
    categorySpentMap
  } = useMemo(() => {
    let total = 0
    let cPaid = 0
    let gPaid = 0
    const catMap = {}

    const cName = (state?.users?.cartune?.name || '').toLowerCase().trim()
    const gName = (state?.users?.gun?.name || '').toLowerCase().trim()

    monthlyTransactions.forEach(tx => {
      const amt = Number(tx.amount) || 0
      total += amt
      const payerStr = (tx.payer || '').toLowerCase().trim()
      const isCartune = payerStr.includes('cartune') || (cName && payerStr.includes(cName))
      if (isCartune) {
        cPaid += amt
      } else {
        gPaid += amt
      }
      const cat = tx.category || 'Other'
      catMap[cat] = (catMap[cat] || 0) + amt
    })

    return {
      monthlyTotalSpending: total,
      monthlyCartunePaid: cPaid,
      monthlyGunPaid: gPaid,
      categorySpentMap: catMap
    }
  }, [monthlyTransactions, state?.users?.cartune?.name, state?.users?.gun?.name])

  // Calculate monthly budgets with dynamic spent for the selected month
  const monthlyBudgets = useMemo(() => {
    return (finance?.budgets || []).map(b => ({
      ...b,
      spent: categorySpentMap[b.name] || 0
    }))
  }, [finance?.budgets, categorySpentMap])

  // Calculate settlement for the selected month
  const monthlyDiff = monthlyGunPaid - monthlyCartunePaid
  const monthlySettleSummary = monthlyDiff > 0
    ? `${cartuneName} owes ${gunName} ฿${(monthlyDiff / 2).toLocaleString()}`
    : monthlyDiff < 0
    ? `${gunName} owes ${cartuneName} ฿${(Math.abs(monthlyDiff) / 2).toLocaleString()}`
    : 'All expenses balanced equally'

  // Pending settlement calculation
  const pendingCartuneAmt = monthlyDiff > 0 ? (monthlyDiff / 2) : (isCurrentMonth && finance.cartunePending ? finance.cartunePending : 0)
  const pendingGunAmt = monthlyDiff < 0 ? (Math.abs(monthlyDiff) / 2) : (isCurrentMonth && finance.gunPending ? finance.gunPending : 0)

  const ICON_OPTIONS = [
    { name: 'Utensils', label: 'อาหาร', icon: Utensils },
    { name: 'Coffee', label: 'เครื่องดื่ม/คาเฟ่', icon: Coffee },
    { name: 'ShoppingBag', label: 'ช้อปปิ้ง', icon: ShoppingBag },
    { name: 'Receipt', label: 'บิล/สาธารณูปโภค', icon: Receipt },
    { name: 'Home', label: 'ของใช้ในบ้าน', icon: Home },
    { name: 'PawPrint', label: 'สัตว์เลี้ยง', icon: PawPrint },
    { name: 'Car', label: 'เดินทาง', icon: Car },
    { name: 'Sparkles', label: 'ส่วนตัว/สุขภาพ', icon: Sparkles },
    { name: 'Building2', label: 'ที่พัก/ส่วนกลาง', icon: Building2 },
    { name: 'PiggyBank', label: 'ออมเงิน', icon: PiggyBank }
  ]

  const getCategoryIcon = (name, iconName) => {
    const key = (iconName || name || '').toLowerCase()
    if (key.includes('util') || key.includes('receipt') || key.includes('ไฟ') || key.includes('น้ำ')) return Receipt
    if (key.includes('pet') || key.includes('paw') || key.includes('แมว') || key.includes('หมา')) return PawPrint
    if (key.includes('home') || key.includes('house') || key.includes('บ้าน')) return Home
    if (key.includes('bldg') || key.includes('building') || key.includes('คอนโด') || key.includes('ส่วนกลาง')) return Building2
    if (key.includes('save') || key.includes('saving') || key.includes('piggy') || key.includes('ออม')) return PiggyBank
    if (key.includes('food') || key.includes('utensils') || key.includes('อาหาร') || key.includes('ข้าว')) return Utensils
    if (key.includes('coffee') || key.includes('cafe') || key.includes('entertain') || key.includes('เหล้า') || key.includes('ดื่ม')) return Coffee
    if (key.includes('car') || key.includes('travel') || key.includes('เดินทาง') || key.includes('น้ำมัน')) return Car
    if (key.includes('sparkle') || key.includes('beauty') || key.includes('สวย')) return Sparkles
    if (key.includes('heart') || key.includes('health')) return Heart
    if (key.includes('wrench') || key.includes('ซ่อม')) return Wrench
    return ShoppingBag
  }

  const availableCategories = Array.from(new Set([
    ...(finance?.budgets || []).map(b => b.name),
    'Food', 'Home Supplies', 'Utilities', 'Pets', 'Entertainment'
  ]))

  const resolvePayerMember = (payerString) => {
    const p = (payerString || '').toLowerCase().trim()
    const cName = (state?.users?.cartune?.name || '').toLowerCase().trim()
    const gName = (state?.users?.gun?.name || '').toLowerCase().trim()

    // Check if matches Cartune
    if (p === 'cartune' || (cName && p === cName) || p.includes('cartune') || (cName && p.includes(cName))) {
      return state?.users?.cartune || { name: cartuneName, avatar: '🐱', role: 'Partner' }
    }
    // Check if matches Gun
    if (p === 'gun' || (gName && p === gName) || p.includes('gun') || (gName && p.includes(gName))) {
      return state?.users?.gun || { name: gunName, avatar: '🐶', role: 'Partner' }
    }
    return { name: payerString, avatar: '👤', role: 'Member' }
  }

  const openAddModalWithDate = (dateOverride = null) => {
    if (dateOverride) {
      setExpenseDate(dateOverride)
    } else if (isCurrentMonth) {
      setExpenseDate(getTodayDateStr())
    } else {
      // Default to 1st day of the selected month
      setExpenseDate(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`)
    }
    setShowAddModal(true)
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!title.trim() || !amount) return
    const isGun = payer === gunName || payer.toLowerCase().includes('gun') || payer.toLowerCase().includes(gunName.toLowerCase())
    const selectedMember = isGun ? (state?.users?.gun || { name: gunName }) : (state?.users?.cartune || { name: cartuneName })
    addExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      payer: selectedMember?.name || payer,
      category,
      date: expenseDate || getTodayDateStr()
    })
    setTitle('')
    setAmount('')
    setShowAddModal(false)
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    addBudgetCategory({
      name: categoryName.trim(),
      budget: parseFloat(categoryBudget) || 0,
      icon: categoryIcon
    })
    setCategoryName('')
    setCategoryBudget('')
    setCategoryIcon('ShoppingBag')
    setShowAddCategoryModal(false)
  }

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#8e1c24] flex items-center justify-center text-white">
              <Wallet size={14} />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-display">
              Finance
            </h1>
          </div>
          <p className="text-xs text-stone-400 font-medium mt-0.5">
            {formatMonthYear(selectedYear, selectedMonth)} · Shared Expenses
          </p>
        </div>

        <button
          onClick={() => openAddModalWithDate()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8e1c24] hover:bg-[#78171e] text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* MONTH NAVIGATION BAR */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPickerYear(selectedYear)
                setShowMonthPicker(!showMonthPicker)
              }}
              className="flex flex-col items-center px-3 py-1 rounded-2xl hover:bg-stone-50 active:scale-98 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={14} className="text-[#8e1c24]" />
                <span className="text-sm font-extrabold text-stone-900 font-display group-hover:text-[#8e1c24] transition-colors">
                  {formatMonthYear(selectedYear, selectedMonth)}
                </span>
                <ChevronDown size={14} className={`text-stone-400 transition-transform ${showMonthPicker ? 'rotate-180 text-[#8e1c24]' : ''}`} />
              </div>
              <span className="text-[10px] text-stone-400 font-medium">
                {formatMonthYearTh(selectedYear, selectedMonth)}
              </span>
            </button>

            {!isCurrentMonth && (
              <button
                type="button"
                onClick={handleGoCurrentMonth}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-[#8e1c24] text-[10px] font-extrabold rounded-full border border-rose-200/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="กลับไปที่เดือนปัจจุบัน"
              >
                <RotateCcw size={10} strokeWidth={2.5} />
                <span>เดือนนี้</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
            title="เดือนถัดไป"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Month Dropdown Picker */}
        {showMonthPicker && (
          <div className="mt-3 pt-3 border-t border-stone-100 animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-stone-400">เลือกเดือนที่ต้องการดู:</span>
              {/* Year switchers */}
              <div className="flex items-center gap-1">
                {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setPickerYear(y)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      pickerYear === y
                        ? 'bg-[#8e1c24] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {MONTH_NAMES_EN.map((mName, idx) => {
                const mNum = idx + 1
                const isSelected = selectedYear === pickerYear && selectedMonth === mNum
                const isThisMonth = currentYM.year === pickerYear && currentYM.month === mNum
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      setSelectedYear(pickerYear)
                      setSelectedMonth(mNum)
                      setShowMonthPicker(false)
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center relative ${
                      isSelected
                        ? 'bg-[#8e1c24] text-white shadow-xs scale-102 font-extrabold'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60'
                    }`}
                  >
                    <div>{mName.slice(0, 3)}</div>
                    <div className={`text-[9px] font-medium ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                      {MONTH_NAMES_TH_SHORT[idx]}
                    </div>
                    {isThisMonth && !isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8e1c24]"></span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* HERO CARD: Deep Crimson Gradient (Image 2) */}
      <div className="relative rounded-3xl p-5 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#7d141d] via-[#a8202b] to-[#6d1017]">
        {/* Ambient glow in corner */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-wider text-rose-200 uppercase">
              {isCurrentMonth ? "THIS MONTH'S SPENDING" : `${formatMonthYear(selectedYear, selectedMonth).toUpperCase()} SPENDING`}
            </div>
            {!isCurrentMonth && (
              <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full text-rose-100 backdrop-blur-xs">
                {monthlyTransactions.length} รายการ
              </span>
            )}
          </div>
          
          <div className="text-3xl font-extrabold tracking-tight mt-1 flex items-baseline gap-1 font-display">
            <span className="text-xl font-bold opacity-90">฿</span>
            <span>{monthlyTotalSpending.toLocaleString()}</span>
          </div>

          {/* Paid Split Bars */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/15">
            <div>
              <div className="text-xs text-rose-200/90 font-semibold">{cartuneName} Paid</div>
              <div className="text-base font-bold mt-0.5">
                ฿ {monthlyCartunePaid.toLocaleString()}
              </div>
              {/* Progress indicator */}
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-white/80 h-full rounded-full transition-all duration-500"
                  style={{ width: `${monthlyTotalSpending > 0 ? Math.min(100, (monthlyCartunePaid / monthlyTotalSpending) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-xs text-rose-200/90 font-semibold">{gunName} Paid</div>
              <div className="text-base font-bold mt-0.5">
                ฿ {monthlyGunPaid.toLocaleString()}
              </div>
              {/* Progress indicator */}
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-white/80 h-full rounded-full transition-all duration-500"
                  style={{ width: `${monthlyTotalSpending > 0 ? Math.min(100, (monthlyGunPaid / monthlyTotalSpending) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Two Frosted Glass Settlement Cards */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="flex items-center gap-1 text-[11px] text-rose-100 font-medium">
                <Clock size={11} />
                <span>{cartuneName} {monthlyDiff > 0 ? 'To Pay' : 'Pending'}</span>
              </div>
              <div className="text-base font-extrabold mt-0.5">
                ฿ {pendingCartuneAmt.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-200/80 mt-0.5">
                {monthlyDiff > 0 ? `Owes ${gunName}` : 'Settled'}
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="flex items-center gap-1 text-[11px] text-rose-100 font-medium">
                <Clock size={11} />
                <span>{gunName} {monthlyDiff < 0 ? 'To Pay' : 'Pending'}</span>
              </div>
              <div className="text-base font-extrabold mt-0.5">
                ฿ {pendingGunAmt.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-200/80 mt-0.5">
                {monthlyDiff < 0 ? `Owes ${cartuneName}` : 'Settled'}
              </div>
            </div>
          </div>

          {/* Settle Balance Banner */}
          <div className="mt-3 pt-2 text-center text-[11px] font-semibold text-rose-100/90 flex items-center justify-center gap-1">
            <ArrowUpDown size={12} />
            <span>{monthlySettleSummary}</span>
          </div>
        </div>
      </div>

      {/* MONTHLY BUDGET SECTION (Image 2) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
            MONTHLY BUDGET {isCurrentMonth ? '' : `(${MONTH_NAMES_EN[selectedMonth - 1].toUpperCase()})`}
          </span>
          <button
            type="button"
            onClick={() => setShowAddCategoryModal(true)}
            className="text-xs font-bold text-[#8e1c24] hover:underline cursor-pointer"
          >
            + Add Category
          </button>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs divide-y divide-stone-100">
          {monthlyBudgets.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              ยังไม่มีหมวดหมู่งบประมาณ (กด + Add Category ด้านบนเพื่อเพิ่ม)
            </div>
          ) : (
            monthlyBudgets.map(cat => {
              const Icon = getCategoryIcon(cat.name, cat.icon)
              const isOver = cat.spent > cat.budget
              const pct = cat.budget > 0 ? Math.min(100, (cat.spent / cat.budget) * 100) : 0

              return (
                <div key={cat.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-stone-400" />
                      <span className="text-sm font-bold text-stone-800">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs font-bold">
                        <span className={isOver ? 'text-[#8e1c24] font-extrabold' : 'text-stone-800'}>
                          ฿{cat.spent.toLocaleString()}
                        </span>
                        <span className="text-stone-400 font-medium"> / ฿{cat.budget.toLocaleString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteBudgetCategory(cat.id)}
                        className="opacity-40 hover:opacity-100 text-stone-400 hover:text-rose-600 transition-all p-1 rounded-lg cursor-pointer"
                        title={`ลบหมวดหมู่ ${cat.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-[#8e1c24]' : 'bg-stone-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* TRANSACTIONS FEED (Image 3) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
            {isCurrentMonth ? 'RECENT EXPENSES' : `EXPENSES · ${formatMonthYear(selectedYear, selectedMonth).toUpperCase()}`}
          </span>
          <span className="text-xs text-stone-400">
            {monthlyTransactions.length} items
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-3 shadow-2xs divide-y divide-stone-100">
          {monthlyTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-stone-400 font-medium">
                ยังไม่มีรายการค่าใช้จ่ายในเดือน {formatMonthYearTh(selectedYear, selectedMonth)}
              </p>
              <button
                onClick={() => openAddModalWithDate(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`)}
                className="mt-2.5 px-4 py-1.5 bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                + บันทึกค่าใช้จ่ายในเดือนนี้
              </button>
            </div>
          ) : (
            monthlyTransactions.map(tx => {
              const Icon = getCategoryIcon(tx.category)
              const member = resolvePayerMember(tx.payer)
              const isCartune = member?.id === 'cartune' || tx.payer.toLowerCase().includes('cartune') || (state?.users?.cartune?.name && tx.payer.includes(state.users.cartune.name))

              return (
                <div key={tx.id} className="py-2.5 px-1.5 flex items-center justify-between hover:bg-stone-50/70 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Category icon circle */}
                    <div className="w-9 h-9 rounded-2xl bg-blue-50/80 text-blue-500 flex items-center justify-center shrink-0">
                      <Icon size={17} strokeWidth={2.2} />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-stone-900 leading-snug">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                        {/* Payer Avatar Badge with member avatar */}
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] leading-none shrink-0 shadow-2xs ${
                          isCartune ? 'bg-rose-100 border border-rose-200/80' : 'bg-slate-100 border border-slate-200/80'
                        }`}>
                          {member?.avatar || (isCartune ? '🐱' : '🐶')}
                        </span>
                        <span className="font-semibold text-stone-700">{member?.name || tx.payer}</span>
                        <span>·</span>
                        <span>{formatTxDisplayDate(tx)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-extrabold text-stone-900">
                      ฿ {tx.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteExpense(tx.id)}
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
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl animate-fade-in border border-stone-200">
            <h3 className="text-lg font-extrabold text-stone-900 mb-3 font-display">Add Shared Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-600">Item or Note</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BigC, ค่าไฟ, Bbq Plaza"
                  autoFocus
                  className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600">Amount (฿)</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600">Date (วันที่บันทึก)</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-600">Who Paid?</label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full mt-1 px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value={cartuneName}>{cartuneName}</option>
                    <option value={gunName}>{gunName}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    {availableCategories.map(catOption => (
                      <option key={catOption} value={catOption}>{catOption}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl animate-fade-in border border-stone-200">
            <h3 className="text-lg font-extrabold text-stone-900 mb-1 font-display">Add Budget Category</h3>
            <p className="text-xs text-stone-400 mb-3">กำหนดหมวดหมู่และงบประมาณรายเดือน</p>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-600">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. อาหาร, คาเฟ่, ท่องเที่ยว, ช้อปปิ้ง"
                  autoFocus
                  className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600">Monthly Budget (฿)</label>
                <input
                  type="number"
                  step="any"
                  value={categoryBudget}
                  onChange={(e) => setCategoryBudget(e.target.value)}
                  placeholder="e.g. 3000"
                  className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600">Icon</label>
                <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                  {ICON_OPTIONS.map(opt => {
                    const IconComp = opt.icon
                    const isSelected = categoryIcon === opt.name
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setCategoryIcon(opt.name)}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-[#8e1c24] text-[#8e1c24] shadow-2xs scale-105'
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                        title={opt.label}
                      >
                        <IconComp size={18} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategoryModal(false)
                    setCategoryName('')
                    setCategoryBudget('')
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
