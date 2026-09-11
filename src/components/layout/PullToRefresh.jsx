import React, { useState, useRef, useEffect } from 'react'
import { ArrowDown, RefreshCw, Check, Sparkles } from 'lucide-react'

export default function PullToRefresh({ onRefresh, isRefreshing, children }) {
  const [pullDistance, setPullDistance] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const startYRef = useRef(0)
  const startXRef = useRef(0)
  const isPullingRef = useRef(false)
  const hasHapticRef = useRef(false)
  const prevRefreshingRef = useRef(isRefreshing)

  const THRESHOLD = 52
  const MAX_PULL = 72

  // Show temporary success checkmark when refresh transitions from true -> false
  useEffect(() => {
    if (prevRefreshingRef.current && !isRefreshing) {
      setShowSuccess(true)
      const t = setTimeout(() => {
        setShowSuccess(false)
        setPullDistance(0)
      }, 1200)
      return () => clearTimeout(t)
    }
    prevRefreshingRef.current = isRefreshing
  }, [isRefreshing])

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (isRefreshing || showSuccess) return
      if (e.touches.length !== 1) return

      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      // ONLY allow pulling if user is at the very top of the page
      if (scrollTop <= 2) {
        startYRef.current = e.touches[0].clientY
        startXRef.current = e.touches[0].clientX
        isPullingRef.current = true
        hasHapticRef.current = false
      } else {
        isPullingRef.current = false
      }
    }

    const handleTouchMove = (e) => {
      if (!isPullingRef.current || isRefreshing || showSuccess) return

      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      if (scrollTop > 2) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }

      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      const deltaY = currentY - startYRef.current
      const deltaX = Math.abs(currentX - startXRef.current)

      // CRITICAL: If user is swiping UP to scroll down the page (deltaY <= 0)
      // or moving horizontally (deltaX > deltaY), cancel pull IMMEDIATELY
      // and do NOT re-render, so normal native scrolling continues unobstructed!
      if (deltaY <= 0 || deltaX > deltaY) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }

      // User is dragging DOWNWARDS from the top of the page
      const damped = Math.min(MAX_PULL, Math.pow(deltaY, 0.75))
      setPullDistance(damped)

      if (damped >= THRESHOLD && !hasHapticRef.current) {
        hasHapticRef.current = true
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(12) } catch (_) {}
        }
      } else if (damped < THRESHOLD) {
        hasHapticRef.current = false
      }
    }

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return
      isPullingRef.current = false

      if (pullDistance >= THRESHOLD && !isRefreshing) {
        setPullDistance(44)
        if (onRefresh) {
          await onRefresh()
        }
      } else {
        setPullDistance(0)
      }
    }

    // Passive listeners NEVER delay or block native browser scrolling
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isRefreshing, showSuccess, pullDistance, onRefresh])

  const effectiveHeight = isRefreshing || showSuccess ? 44 : pullDistance
  const isPastThreshold = pullDistance >= THRESHOLD

  return (
    <main className="flex-1 px-4 pt-4 pb-4 relative">
      {/* Pull-to-refresh Status Banner */}
      <div
        style={{
          height: `${effectiveHeight}px`,
          opacity: effectiveHeight > 0 ? Math.min(1, effectiveHeight / 25) : 0,
          transition: isPullingRef.current ? 'none' : 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-full overflow-hidden flex items-center justify-center pointer-events-none -mt-1 mb-2 select-none"
      >
        <div className="flex items-center gap-2 bg-white/95 px-3.5 py-1.5 rounded-full shadow-xs border border-stone-200/90 text-xs font-semibold backdrop-blur-xs text-stone-700 animate-fade-in">
          {showSuccess ? (
            <>
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={11} strokeWidth={3} />
              </span>
              <span className="text-emerald-700 font-bold text-[11px]">ซิงค์ข้อมูลล่าสุดสำเร็จ ✨</span>
            </>
          ) : isRefreshing ? (
            <>
              <RefreshCw size={13} className="text-[#8e1c24] animate-spin" />
              <span className="text-[#8e1c24] font-bold text-[11px]">กำลังซิงค์กับ GitHub Cloud... ☁️</span>
            </>
          ) : isPastThreshold ? (
            <>
              <Sparkles size={13} className="text-[#8e1c24] animate-bounce" />
              <span className="text-[#8e1c24] font-bold text-[11px]">ปล่อยเพื่อซิงค์ข้อมูล ✨</span>
            </>
          ) : (
            <>
              <ArrowDown
                size={13}
                className="text-stone-400 transition-transform duration-200"
                style={{ transform: `rotate(${Math.min(180, (pullDistance / THRESHOLD) * 180)}deg)` }}
              />
              <span className="text-stone-500 text-[11px]">ดึงลงเพื่อซิงค์ข้อมูลล่าสุด</span>
            </>
          )}
        </div>
      </div>

      {children}
    </main>
  )
}
