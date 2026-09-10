import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function AuthView() {
  const { login } = useApp()
  const [tab, setTab] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('cartune@homie.app')
  const [password, setPassword] = useState('••••••••')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email.includes('gun') ? 'gun' : 'cartune')
  }

  return (
    <div className="min-h-screen bg-[#faf8f7] flex flex-col justify-between px-6 py-8 max-w-md mx-auto">
      {/* Top Spacer */}
      <div></div>

      {/* Mascot Illustration & Brand Header */}
      <div className="flex flex-col items-center text-center">
        {/* Cute Mascot Family SVGs */}
        <div className="relative w-64 h-32 flex items-center justify-center mb-6">
          {/* Orange Flower Mascot (Left) */}
          <div className="absolute left-6 bottom-4 w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="text-stone-800 text-xs font-bold select-none">^ ᴗ ^</div>
          </div>

          {/* Cyan Blob/Ghost (Far Left) */}
          <div className="absolute left-2 bottom-1 w-9 h-11 bg-teal-400 rounded-t-full rounded-b-md flex items-center justify-center shadow-xs">
            <div className="flex gap-1 text-[8px] text-stone-800 font-bold">• •</div>
          </div>

          {/* Big Pink Circle (Center) */}
          <div className="relative z-10 w-24 h-24 bg-pink-400 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white">
            <div className="flex gap-2 text-stone-900 font-bold text-base leading-none">
              <span>^</span>
              <span>^</span>
            </div>
            <div className="text-stone-900 text-xs font-extrabold mt-1">‿</div>
          </div>

          {/* Orange Rounded Square Mascot (Right) */}
          <div className="absolute right-4 bottom-3 w-16 h-16 bg-amber-500 rounded-2xl flex flex-col items-center justify-center shadow-md">
            <div className="flex gap-1.5 text-stone-900 font-bold text-xs">
              <span>^</span>
              <span>^</span>
            </div>
            <div className="w-3 h-0.5 bg-stone-900 rounded-full mt-1"></div>
          </div>

          {/* Little Star (Far Right Bottom) */}
          <div className="absolute right-7 bottom-0 text-amber-300 text-xl font-bold select-none">
            ★
          </div>

          {/* Little Pink Floating Cloud (Top Right) */}
          <div className="absolute right-8 top-2 w-7 h-7 bg-pink-200 rounded-full flex items-center justify-center text-[10px] text-stone-700 shadow-2xs">
            ε
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold text-[#8e1c24] tracking-tight font-display">
          Our Homie
        </h1>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-xs font-normal">
          Manage our home together. Shopping, calendar, pets, and shared finances, all in one app
        </p>

        {/* Tab Switcher: Sign In / Sign Up */}
        <div className="mt-8 bg-stone-100/90 p-1 rounded-full flex items-center w-full max-w-xs border border-stone-200/70">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              tab === 'signin'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              tab === 'signup'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mt-5 space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-stone-200/90 text-sm text-stone-800 focus:outline-none focus:border-[#8e1c24] shadow-2xs"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3 bg-white rounded-full border border-stone-200/90 text-sm text-stone-800 focus:outline-none focus:border-[#8e1c24] shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-[#8e1c24] hover:bg-[#78171e] active:scale-98 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ArrowRight size={17} strokeWidth={2.5} />
            <span>Sign In</span>
          </button>
        </form>

        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo: Use Quick login below'); }} className="mt-4 text-xs font-semibold text-stone-500 hover:text-stone-800 underline">
          Forgot password?
        </a>

        {/* Quick Demo Access Buttons */}
        <div className="mt-8 pt-5 border-t border-stone-200/60 w-full max-w-xs">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Quick One-Click Demo
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => login('cartune')}
              className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>👩🏻</span> Cartune
            </button>
            <button
              onClick={() => login('gun')}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>👦🏻</span> Gun
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-stone-400">
        Our Homie PWA · Ready for GitHub & Vercel
      </div>
    </div>
  )
}
