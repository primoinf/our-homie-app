import React from 'react'
import { useApp } from '../../context/AppContext'
import BottomNav from './BottomNav'
import { ArrowLeftRight, Wifi, RefreshCw, Cloud } from 'lucide-react'

export default function AppShell({ children }) {
  const { 
    activeUser, 
    partnerUser, 
    switchUser, 
    toastMessage, 
    githubSettings, 
    syncStatus, 
    triggerGitHubSync 
  } = useApp()

  const isConfigured = !!(githubSettings?.token && githubSettings?.username && githubSettings?.repo)

  return (
    <div className="min-h-screen bg-[#ede8e4] flex justify-center items-start sm:py-4">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md bg-[#faf8f7] min-h-screen sm:min-h-[920px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-stone-200/60 pb-20">
        
        {/* iOS-style Status Bar */}
        <div className="px-5 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-stone-700 select-none bg-transparent">
          <div className="flex items-center gap-1">
            <span className="tracking-tight text-sm font-bold">11:35</span>
            <span className="text-[10px] text-stone-500">🌙</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Partner Switcher Banner */}
            <button
              onClick={() => switchUser()}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 border border-stone-200/90 text-stone-700 shadow-2xs hover:bg-stone-50 active:scale-95 transition-all"
              title="Click to switch partner view"
            >
              <span>{activeUser.avatar}</span>
              <span className="text-[#8e1c24] font-bold">{activeUser.name}</span>
              <ArrowLeftRight size={10} className="text-stone-400" />
              <span className="text-stone-400 text-[10px]">({partnerUser.name})</span>
            </button>

            {/* Quick GitHub Sync Cloud Button */}
            {isConfigured && (
              <button
                onClick={() => triggerGitHubSync('sync')}
                disabled={syncStatus === 'syncing'}
                className="w-6 h-6 rounded-full bg-white/90 border border-stone-200/90 flex items-center justify-center text-stone-500 hover:text-stone-800 shadow-2xs active:scale-90 transition-transform"
                title="ซิงค์ข้อมูลกับ GitHub ตอนนี้"
              >
                <RefreshCw 
                  size={11} 
                  className={syncStatus === 'syncing' ? 'animate-spin text-[#8e1c24]' : syncStatus === 'synced' ? 'text-emerald-500' : ''} 
                />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-stone-800">
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 h-1 bg-stone-700 rounded-xs"></span>
              <span className="w-0.5 h-1.5 bg-stone-700 rounded-xs"></span>
              <span className="w-0.5 h-2 bg-stone-700 rounded-xs"></span>
              <span className="w-0.5 h-2.5 bg-stone-700 rounded-xs"></span>
            </div>
            <Wifi size={13} strokeWidth={2.4} />
            <div className="flex items-center gap-0.5 bg-amber-400/90 text-[10px] font-bold px-1 rounded-sm text-stone-900 leading-tight">
              31
            </div>
          </div>
        </div>

        {/* Dynamic Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-stone-900/95 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-stone-700/50 backdrop-blur-md flex items-center gap-2 max-w-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* View Content */}
        <main className="flex-1 overflow-y-auto px-4 pt-1 pb-4">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
