import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Wallet, Plus, Check, Clock, Utensils, PawPrint, Receipt, Home, Wrench, ShoppingBag, Coffee, Store, Building2, PiggyBank, ArrowUpDown, Trash2 } from 'lucide-react'

export default function FinanceView() {
  const { state, addExpense, deleteExpense } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState(state.users[state.currentUser]?.name || 'Cartune')
  const [category, setCategory] = useState('Food')

  const { finance } = state

  const getCategoryIcon = (name) => {
    switch (name) {
      case 'Utilities': return Receipt
      case 'Pets': return PawPrint
      case 'Home Supplies': return Home
      case 'Building Fees': return Building2
      case 'Saving': return PiggyBank
      case 'Food': return Utensils
      case 'Entertainment': return Coffee
      default: return ShoppingBag
    }
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!title.trim() || !amount) return
    addExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      payer,
      category
    })
    setTitle('')
    setAmount('')
    setShowAddModal(false)
  }

  // Calculate settlement: Cartune paid vs Gun paid
  const diff = finance.gunPaid - finance.cartunePaid
  const settleSummary = diff > 0
    ? `Cartune owes Gun ฿${(diff / 2).toLocaleString()}`
    : diff < 0
    ? `Gun owes Cartune ฿${(Math.abs(diff) / 2).toLocaleString()}`
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
              <div className="text-xs text-rose-200/90 font-semibold">Cartune Paid</div>
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
              <div className="text-xs text-rose-200/90 font-semibold">Gun Paid</div>
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
                <span>Cartune Pending</span>
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
                <span>Gun Pending</span>
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
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-[#8e1c24] hover:underline"
          >
            + Add Category
          </button>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs divide-y divide-stone-100">
          {finance.budgets.map(cat => {
            const Icon = getCategoryIcon(cat.name)
            const isOver = cat.spent > cat.budget
            const pct = cat.budget > 0 ? Math.min(100, (cat.spent / cat.budget) * 100) : 0

            return (
              <div key={cat.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-stone-400" />
                    <span className="text-sm font-bold text-stone-800">{cat.name}</span>
                  </div>

                  <div className="text-xs font-bold">
                    <span className={isOver ? 'text-[#8e1c24] font-extrabold' : 'text-stone-800'}>
                      ฿{cat.spent.toLocaleString()}
                    </span>
                    <span className="text-stone-400 font-medium"> / ฿{cat.budget.toLocaleString()}</span>
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
          })}
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
              const isCartune = tx.payer.toLowerCase().includes('cartune')

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
                        {/* Payer Avatar Badge */}
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${
                          isCartune ? 'bg-rose-700' : 'bg-stone-800'
                        }`}>
                          {isCartune ? 'C' : 'G'}
                        </span>
                        <span className="font-semibold text-stone-600">{tx.payer}</span>
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
                    <option value="Cartune">Cartune</option>
                    <option value="Gun">Gun</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Home Supplies">Home Supplies</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Pets">Pets</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8e1c24] text-white text-xs font-bold rounded-xl"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
