import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Wallet, Plus, Check, Clock, Utensils, PawPrint, Receipt, Home, Wrench, ShoppingBag, Coffee, Store, Building2, PiggyBank, ArrowUpDown, Trash2, Car, Sparkles, Heart } from 'lucide-react'

export default function FinanceView() {
  const { state, addExpense, deleteExpense, addBudgetCategory, deleteBudgetCategory } = useApp()
  const cartuneName = state?.users?.cartune?.name || 'Cartune'
  const gunName = state?.users?.gun?.name || 'Gun'

  const [showAddModal, setShowAddModal] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState(state.currentUser === 'gun' ? gunName : cartuneName)
  const [category, setCategory] = useState('Food')

  // Add Budget Category Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryBudget, setCategoryBudget] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('ShoppingBag')

  const { finance } = state

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

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!title.trim() || !amount) return
    const isGun = payer === gunName || payer.toLowerCase().includes('gun') || payer.toLowerCase().includes(gunName.toLowerCase())
    const selectedMember = isGun ? (state?.users?.gun || { name: gunName }) : (state?.users?.cartune || { name: cartuneName })
    addExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      payer: selectedMember?.name || payer,
      category
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

  // Calculate settlement: Cartune paid vs Gun paid
  const diff = finance.gunPaid - finance.cartunePaid
  const settleSummary = diff > 0
    ? `${cartuneName} owes ${gunName} ฿${(diff / 2).toLocaleString()}`
    : diff < 0
    ? `${gunName} owes ${cartuneName} ฿${(Math.abs(diff) / 2).toLocaleString()}`
    : 'All expenses balanced equally'

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
            {finance.monthName} · Shared Expenses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8e1c24] hover:bg-[#78171e] text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* HERO CARD: Deep Crimson Gradient (Image 2) */}
      <div className="relative rounded-3xl p-5 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#7d141d] via-[#a8202b] to-[#6d1017]">
        {/* Ambient glow in corner */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-[11px] font-bold tracking-wider text-rose-200 uppercase">
            THIS MONTH'S SPENDING
          </div>
          
          <div className="text-3xl font-extrabold tracking-tight mt-1 flex items-baseline gap-1 font-display">
            <span className="text-xl font-bold opacity-90">฿</span>
            <span>{finance.totalSpending.toLocaleString()}</span>
          </div>

          {/* Paid Split Bars */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/15">
            <div>
              <div className="text-xs text-rose-200/90 font-semibold">{cartuneName} Paid</div>
              <div className="text-base font-bold mt-0.5">
                ฿ {finance.cartunePaid.toLocaleString()}
              </div>
              {/* Progress indicator */}
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-white/80 h-full rounded-full"
                  style={{ width: `${finance.totalSpending > 0 ? Math.min(100, (finance.cartunePaid / finance.totalSpending) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-xs text-rose-200/90 font-semibold">{gunName} Paid</div>
              <div className="text-base font-bold mt-0.5">
                ฿ {finance.gunPaid.toLocaleString()}
              </div>
              {/* Progress indicator */}
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-white/80 h-full rounded-full"
                  style={{ width: `${finance.totalSpending > 0 ? Math.min(100, (finance.gunPaid / finance.totalSpending) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Two Frosted Glass Settlement Cards */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="flex items-center gap-1 text-[11px] text-rose-100 font-medium">
                <Clock size={11} />
                <span>{cartuneName} Pending</span>
              </div>
              <div className="text-base font-extrabold mt-0.5">
                ฿ {finance.cartunePending.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-200/80 mt-0.5">
                {finance.cartunePendingCount} item to settle
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="flex items-center gap-1 text-[11px] text-rose-100 font-medium">
                <Clock size={11} />
                <span>{gunName} Pending</span>
              </div>
              <div className="text-base font-extrabold mt-0.5">
                ฿ {finance.gunPending.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-200/80 mt-0.5">
                {finance.gunPendingCount} items to settle
              </div>
            </div>
          </div>

          {/* Settle Balance Banner */}
          <div className="mt-3 pt-2 text-center text-[11px] font-semibold text-rose-100/90 flex items-center justify-center gap-1">
            <ArrowUpDown size={12} />
            <span>{settleSummary}</span>
          </div>
        </div>
      </div>

      {/* MONTHLY BUDGET SECTION (Image 2) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
            MONTHLY BUDGET
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
          {(finance.budgets || []).length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              ยังไม่มีหมวดหมู่งบประมาณ (กด + Add Category ด้านบนเพื่อเพิ่ม)
            </div>
          ) : (
            finance.budgets.map(cat => {
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
            RECENT EXPENSES
          </span>
          <span className="text-xs text-stone-400">
            {finance.transactions.length} items
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-3 shadow-2xs divide-y divide-stone-100">
          {finance.transactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-stone-400 font-medium">ยังไม่มีรายการค่าใช้จ่ายในเดือนนี้</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2.5 px-4 py-1.5 bg-[#8e1c24] text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                + บันทึกค่าใช้จ่ายแรก
              </button>
            </div>
          ) : (
            finance.transactions.map(tx => {
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
                        <span>{tx.date}</span>
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
                  className="px-4 py-2 bg-[#8e1c24] text-white text-xs font-bold rounded-xl cursor-pointer"
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
