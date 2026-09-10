import React from 'react'
import { useApp } from '../../context/AppContext'
import BottomNav from './BottomNav'

export default function AppShell({ children }) {
  const { toastMessage } = useApp()

  return (
    <div className="min-h-screen bg-[#ede8e4] flex justify-center items-start sm:py-4">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md bg-[#faf8f7] min-h-screen sm:min-h-[920px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-stone-200/60 pb-20">
        
        {/* Dynamic Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
            <div className="bg-stone-900/95 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-stone-700/50 backdrop-blur-md flex items-center gap-2 max-w-xs pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* View Content with Safe Area Padding */}
        <main className="flex-1 overflow-y-auto px-4 pt-5 pb-4">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
