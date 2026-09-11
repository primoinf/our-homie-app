import React, { useState, useRef, useEffect } from 'react'
import { ArrowDown, RefreshCw, Check, Sparkles } from 'lucide-react'

export default function PullToRefresh({ onRefresh, isRefreshing, children }) {
  const [pullDistance, setPullDistance] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const containerRef = useRef(null)
  const startYRef = useRef(0)
  const startXRef = useRef(0)
  const isPullingRef = useRef(false)
  const hasHapticRef = useRef(false)
  const prevRefreshingRef = useRef(isRefreshing)

  const THRESHOLD = 55
  const MAX_PULL = 85

  // Show temporary success checkmark when refresh transitions from true -> false
  useEffect(() => {
    if (prevRefreshingRef.current && !isRefreshing) {
      setShowSuccess(true)
      const t = setTimeout(() => {
        setShowSuccess(false)
        setPullDistance(0)
      }, 900)
      return () => clearTimeout(t)
    }
    prevRefreshingRef.current = isRefreshing
  }, [isRefreshing])

  const handleTouchStart = (e) => {
    if (isRefreshing || showSuccess) return
    const container = containerRef.current
    if (!container) return

    // Only start pull if scrolled to top
    if (container.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY
      startXRef.current = e.touches[0].clientX
      isPullingRef.current = true
      hasHapticRef.current = false
    }
  }

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || isRefreshing || showSuccess) return
    const container = containerRef.current
    if (!container || container.scrollTop > 0) {
      isPullingRef.current = false
      setPullDistance(0)
      return
    }

    const currentY = e.touches[0].clientY
    const currentX = e.touches[0].clientX
    const deltaY = currentY - startYRef.current
    const deltaX = Math.abs(currentX - startXRef.current)

    // Ignore if horizontal gesture
    if (deltaX > deltaY) {
      isPullingRef.current = false
      setPullDistance(0)
      return
    }

    if (deltaY > 0) {
      // Non-linear dampening formula
      const damped = Math.min(MAX_PULL, Math.pow(deltaY, 0.8))
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
  }

  const handleTouchEnd = async () => {
    if (!isPullingRef.current) return
    isPullingRef.current = false

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setPullDistance(50) // Keep indicator visible while syncing
      if (onRefresh) {
        await onRefresh()
      }
    } else {
      setPullDistance(0)
    }
  }

  const effectiveHeight = isRefreshing || showSuccess ? 50 : pullDistance
  const isPastThreshold = pullDistance >= THRESHOLD

  return (
    <main
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 overflow-y-auto px-4 pt-5 pb-4 relative"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain'
      }}
    >
      {/* Pull-to-refresh Animated Banner */}
      <div
        style={{
          height: `${effectiveHeight}px`,
          opacity: effectiveHeight > 0 ? Math.min(1, effectiveHeight / 30) : 0,
          transition: isPullingRef.current ? 'none' : 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-full overflow-hidden flex items-center justify-center pointer-events-none -mt-1 mb-2"
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
