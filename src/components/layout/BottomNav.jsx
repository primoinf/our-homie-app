import React from 'react'
import { Home, ShoppingCart, Calendar, PawPrint, Wallet, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function BottomNav() {
  const { activeTab, setActiveTab, state } = useApp()

  // Incompleted shopping items count for badge
  const uncompletedShopping = state.shopping.filter(i => !i.completed).length

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, badge: uncompletedShopping },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'pet', label: 'Pet', icon: PawPrint },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 max-w-md mx-auto">
      <div className="flex items-center justify-around px-1 py-1.5 pb-safe">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-transform active:scale-95 group focus:outline-none"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.9}
                  className={`transition-colors duration-150 ${
                    isActive ? 'text-[#8e1c24]' : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-[#8e1c24] rounded-full border-2 border-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors duration-150 font-medium ${
                  isActive ? 'text-[#8e1c24] font-bold' : 'text-stone-400 group-hover:text-stone-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
