import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ShoppingCart, LayoutGrid, Utensils, Home, Cross, PawPrint, Check, Plus, Trash2 } from 'lucide-react'

export default function ShoppingView() {
  const { state, toggleShoppingItem, addShoppingItem, deleteShoppingItem } = useApp()
  const cartuneName = state.users?.cartune?.name || 'มะแอ๊ะ'
  const gunName = state.users?.gun?.name || 'ตูบศักดิ์'
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [newItemText, setNewItemText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const categories = [
    { id: 'All', label: 'All', icon: LayoutGrid },
    { id: 'Food', label: 'Food', icon: Utensils },
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Health', label: 'Health', icon: Cross },
    { id: 'Pets', label: 'Pets', icon: PawPrint }
  ]

  const filteredItems = state.shopping.filter(item => {
    if (selectedCategory === 'All') return true
    return item.category === selectedCategory
  })

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    const catToUse = selectedCategory === 'All' ? 'Home' : selectedCategory
    addShoppingItem(newItemText, catToUse)
    setNewItemText('')
    setIsAdding(false)
  }

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-[#8e1c24]" size={24} strokeWidth={2.4} />
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-display">
              Shopping List
            </h1>
          </div>
          <p className="text-xs text-stone-400 font-medium mt-0.5">
            Added by {cartuneName} & {gunName}
          </p>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-[#8e1c24] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              <Icon size={13} strokeWidth={2.4} />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Shopping Items List Card */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs divide-y divide-stone-100">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-stone-400 text-sm">
            No items in {selectedCategory} category
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between group hover:bg-stone-50/60 rounded-xl px-1 transition-colors"
            >
              <div
                onClick={() => toggleShoppingItem(item.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-2"
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                    item.completed
                      ? 'bg-[#8e1c24] border-[#8e1c24] text-white'
                      : 'border-stone-300 bg-white group-hover:border-stone-400'
                  }`}
                >
                  {item.completed && <Check size={13} strokeWidth={3} />}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`text-sm font-medium break-words ${
                      item.completed ? 'line-through text-stone-400' : 'text-stone-800'
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.addedBy && (
                    <span className="text-[10px] text-stone-400 truncate">
                      by {item.addedBy}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg">
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => deleteShoppingItem(item.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="ลบรายการนี้"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Inline + Add item input */}
        <div className="pt-3">
          {isAdding ? (
            <form onSubmit={handleAddItem} className="flex items-center gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Type item name..."
                autoFocus
                className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#8e1c24]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#8e1c24] text-white text-xs font-bold rounded-xl active:scale-95"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-700 text-sm font-medium py-1 px-1 transition-colors w-full cursor-pointer"
            >
              <Plus size={16} className="text-[#8e1c24]" strokeWidth={2.5} />
              <span>Add item...</span>
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
