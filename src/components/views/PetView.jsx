import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { 
  PawPrint, 
  Calendar, 
  Plus, 
  Search, 
  Heart, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  Droplets, 
  Sparkles,
  Syringe,
  Scale,
  Clock,
  Camera
} from 'lucide-react'

const PRESET_PHOTOS = [
  { label: '🐶 Cocker Spaniel', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80' },
  { label: '🐱 Persian Cat', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80' },
  { label: '🐱 American Shorthair', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80' },
  { label: '🐕 Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80' },
  { label: '🐈 Orange Cat', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80' },
  { label: '🐕 Corgi', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80' }
]

export default function PetView() {
  const { 
    state, 
    setActiveTab, 
    addPet, 
    updatePet, 
    deletePet, 
    togglePetFavorite, 
    markPetRoutineDone,
    addCalendarEvent 
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  
  // Modal state
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | 'schedule' | null
  const [selectedPet, setSelectedPet] = useState(null)
  
  // Form fields
  const [formName, setFormName] = useState('')
  const [formGender, setFormGender] = useState('Female')
  const [formBreed, setFormBreed] = useState('')
  const [formAge, setFormAge] = useState('')
  const [formWeight, setFormWeight] = useState('')
  const [formLastVaccine, setFormLastVaccine] = useState('')
  const [formTodayTask, setFormTodayTask] = useState('Shower')
  const [formPhoto, setFormPhoto] = useState(PRESET_PHOTOS[0].url)
  const [formNotes, setFormNotes] = useState('')

  // Schedule to calendar state
  const [scheduleDate, setScheduleDate] = useState('2026-09-15')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [scheduleTitle, setScheduleTitle] = useState('')

  const openAddModal = () => {
    setSelectedPet(null)
    setFormName('')
    setFormGender('Female')
    setFormBreed('')
    setFormAge('1 yr 0 mo')
    setFormWeight('5 Kg')
    setFormLastVaccine('Today')
    setFormTodayTask('Shower')
    setFormPhoto(PRESET_PHOTOS[0].url)
    setFormNotes('')
    setModalMode('add')
  }

  const openEditModal = (pet) => {
    setSelectedPet(pet)
    setFormName(pet.name)
    setFormGender(pet.gender || 'Female')
    setFormBreed(pet.breed || '')
    setFormAge(pet.age || '')
    setFormWeight(pet.weight || '')
    setFormLastVaccine(pet.lastVaccine || '')
    setFormTodayTask(pet.todayTask || 'Shower')
    setFormPhoto(pet.photo || PRESET_PHOTOS[0].url)
    setFormNotes(pet.notes || '')
    setModalMode('edit')
  }

  const openScheduleModal = (pet) => {
    setSelectedPet(pet)
    setScheduleTitle(`พา ${pet.name} ไปฉีดวัคซีน / หาหมอ 💉`)
    setScheduleDate('2026-09-15')
    setScheduleTime('10:00')
    setModalMode('schedule')
  }

  const handleSavePet = (e) => {
    e.preventDefault()
    if (!formName.trim()) return

    const petData = {
      name: formName.trim(),
      gender: formGender,
      breed: formBreed.trim() || 'Pet',
      age: formAge.trim() || '1 yr',
      weight: formWeight.trim() || '5 Kg',
      lastVaccine: formLastVaccine.trim() || 'Recently',
      todayTask: formTodayTask.trim() || 'Routine check',
      photo: formPhoto || PRESET_PHOTOS[0].url,
      notes: formNotes.trim()
    }

    if (modalMode === 'add') {
      addPet(petData)
    } else if (modalMode === 'edit' && selectedPet) {
      updatePet(selectedPet.id, petData)
    }

    setModalMode(null)
  }

  const handleScheduleVet = (e) => {
    e.preventDefault()
    if (!scheduleTitle.trim()) return

    const dayNum = parseInt(scheduleDate.split('-')[2], 10) || 15
    addCalendarEvent({
      day: dayNum,
      date: scheduleDate,
      time: scheduleTime,
      title: scheduleTitle.trim(),
      category: 'Health',
      kind: 'event',
      user: state.currentUser === 'cartune' ? 'Cartune' : 'Gun'
    })
    setModalMode(null)
  }

  // Filter logic
  const filteredPets = state.pets.filter(pet => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchSearch = pet.name.toLowerCase().includes(q) || 
                          pet.breed.toLowerCase().includes(q) ||
                          (pet.notes && pet.notes.toLowerCase().includes(q))
      if (!matchSearch) return false
    }

    // Filter pill
    if (activeFilter === 'Dogs') {
      const b = pet.breed.toLowerCase()
      return b.includes('dog') || b.includes('spaniel') || b.includes('corgi') || b.includes('retriever') || b.includes('hound')
    }
    if (activeFilter === 'Cats') {
      const b = pet.breed.toLowerCase()
      return b.includes('cat') || b.includes('persian') || b.includes('shorthair') || b.includes('scottish') || b.includes('feline')
    }
    if (activeFilter === 'Favorites') {
      return !!pet.isFavorite
    }
    return true
  })

  return (
    <div className="space-y-4 pt-1 animate-fade-in pb-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PawPrint className="text-[#8e1c24]" size={24} strokeWidth={2.4} />
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-display">
              My Pets
            </h1>
          </div>
          <p className="text-xs text-stone-400 font-medium mt-0.5">
            {state.pets.length} pets in your household
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-700 flex items-center justify-center shadow-xs active:scale-95 transition-all hover:border-[#8e1c24] hover:text-[#8e1c24]"
            title="Pet Calendar"
          >
            <Calendar size={16} strokeWidth={2.2} />
          </button>
          <button
            onClick={openAddModal}
            className="w-9 h-9 rounded-full bg-[#8e1c24] hover:bg-[#78171e] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all"
            title="Add Pet"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อ, สายพันธุ์, หรือโน้ต..."
          className="w-full pl-10 pr-4 py-2.5 bg-stone-100/80 rounded-full border border-stone-200/80 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#8e1c24]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Dogs', 'Cats', 'Favorites'].map(filter => {
          const isActive = activeFilter === filter
          const labels = {
            All: `ทั้งหมด (${state.pets.length})`,
            Dogs: '🐶 สุนัข',
            Cats: '🐱 แมว',
            Favorites: '❤️ รายการโปรด'
          }
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#8e1c24] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {labels[filter]}
            </button>
          )
        })}
      </div>

      {/* Pet Cards List */}
      <div className="space-y-3.5">
        {filteredPets.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-3xl p-8 text-center shadow-2xs">
            <PawPrint className="mx-auto text-stone-300 mb-2" size={32} />
            <p className="text-xs font-bold text-stone-700">ไม่พบสัตว์เลี้ยงในหมวดนี้</p>
            <p className="text-[11px] text-stone-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกดปุ่ม + ด้านบนเพื่อเพิ่มตัวใหม่</p>
            <button
              onClick={openAddModal}
              className="mt-3 px-4 py-2 bg-[#8e1c24] text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Plus size={14} strokeWidth={2.5} /> เพิ่มสัตว์เลี้ยง
            </button>
          </div>
        ) : (
          filteredPets.map(pet => (
            <div
              key={pet.id}
              className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-2xs relative overflow-hidden group hover:border-stone-300 transition-all"
            >
              {/* Top Row: Photo + Main Info */}
              <div className="flex gap-3.5">
                {/* Pet Photo & Favorite Heart */}
                <div className="relative shrink-0 w-28 h-32 rounded-2xl overflow-hidden shadow-xs border border-stone-100 bg-stone-100">
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => togglePetFavorite(pet.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs text-[#8e1c24] active:scale-90 transition-transform"
                    title="Favorite"
                  >
                    <Heart size={14} fill={pet.isFavorite ? '#8e1c24' : 'transparent'} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Pet Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Name, Gender, and Actions */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-black text-stone-900 leading-tight font-display">
                            {pet.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            pet.gender === 'Female' 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {pet.gender === 'Female' ? '♀ เมีย' : '♂ ผู้'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          {pet.breed}
                        </p>
                      </div>

                      {/* Edit and Delete Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(pet)}
                          className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors active:scale-90"
                          title="แก้ไขข้อมูลสัตว์เลี้ยง"
                        >
                          <Pencil size={13} strokeWidth={2.2} />
                        </button>
                        <button
                          onClick={() => deletePet(pet.id)}
                          className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors active:scale-90"
                          title="ลบสัตว์เลี้ยง"
                        >
                          <Trash2 size={13} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-1 text-[11px] text-stone-600 font-medium mt-2 bg-stone-50/80 p-2 rounded-xl border border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock size={11} /> อายุ:
                        </span>
                        <span className="font-bold text-stone-800">{pet.age}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Scale size={11} /> น้ำหนัก:
                        </span>
                        <span className="font-bold text-stone-800">{pet.weight}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Syringe size={11} /> วัคซีนล่าสุด:
                        </span>
                        <span className="font-bold text-stone-800">{pet.lastVaccine}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes if available */}
              {pet.notes && (
                <div className="mt-2.5 px-3 py-2 bg-amber-50/60 border border-amber-100 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                  <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{pet.notes}</span>
                </div>
              )}

              {/* Bottom Quick Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                  <span className="text-stone-400 text-[11px]">ภารกิจวันนี้:</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    {pet.todayTask || 'ดูแลทั่วไป'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openScheduleModal(pet)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1"
                    title="นัดหมายเข้า Calendar"
                  >
                    <Calendar size={11} /> นัดหมอ
                  </button>
                  <button
                    onClick={() => markPetRoutineDone(pet.id, pet.todayTask || 'Routine')}
                    className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-1 shadow-2xs active:scale-95"
                  >
                    <Check size={12} strokeWidth={2.5} /> ทำแล้ว (+15)
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add / Edit Pet Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <PawPrint className="text-[#8e1c24]" size={20} />
                <h3 className="text-lg font-black text-stone-900 font-display">
                  {modalMode === 'add' ? 'เพิ่มสัตว์เลี้ยงตัวใหม่ 🐾' : `แก้ไขข้อมูล ${selectedPet?.name} ✏️`}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePet} className="space-y-3.5">
              {/* Pet Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ชื่อสัตว์เลี้ยง *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="เช่น Leah, Lupin, Luka..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Gender & Breed */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    เพศ
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormGender('Female')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formGender === 'Female' ? 'bg-white text-rose-600 shadow-2xs' : 'text-stone-500'
                      }`}
                    >
                      ♀ เมีย
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormGender('Male')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formGender === 'Male' ? 'bg-white text-blue-600 shadow-2xs' : 'text-stone-500'
                      }`}
                    >
                      ♂ ผู้
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    สายพันธุ์
                  </label>
                  <input
                    type="text"
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    placeholder="เช่น Persian Cat..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
              </div>

              {/* Age & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    อายุ
                  </label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="เช่น 1 yr 10 mo"
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    น้ำหนัก
                  </label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="เช่น 10 Kg, 4.2 Kg"
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
              </div>

              {/* Last Vaccine Date */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  วันฉีดวัคซีนล่าสุด
                </label>
                <input
                  type="text"
                  value={formLastVaccine}
                  onChange={(e) => setFormLastVaccine(e.target.value)}
                  placeholder="เช่น 8 Feb 2026 หรือ 15 Jun 2026"
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Today's Routine Task */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ภารกิจดูแลวันนี้ (Today's Routine)
                </label>
                <input
                  type="text"
                  value={formTodayTask}
                  onChange={(e) => setFormTodayTask(e.target.value)}
                  placeholder="เช่น Shower, Comb Fur, Check Water..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Shower', 'Comb Fur', 'Walk', 'Check Water', 'Trim Claws'].map(task => (
                    <button
                      key={task}
                      type="button"
                      onClick={() => setFormTodayTask(task)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                        formTodayTask === task 
                          ? 'bg-teal-50 text-teal-700 border-teal-200' 
                          : 'bg-stone-100 text-stone-500 border-transparent hover:bg-stone-200'
                      }`}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  รูปภาพสัตว์เลี้ยง
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormPhoto(preset.url)}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        formPhoto === preset.url ? 'border-[#8e1c24] ring-2 ring-[#8e1c24]/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 text-center truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={13} />
                  <input
                    type="url"
                    value={formPhoto}
                    onChange={(e) => setFormPhoto(e.target.value)}
                    placeholder="หรือวาง Image URL ของตัวเอง..."
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  บันทึกเพิ่มเติม / นิสัยพิเศษ
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="เช่น ขี้อ้อน, ชอบวิ่งเล่นที่สวน, ทานอาหารสูตรบำรุงไต..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  {modalMode === 'add' ? 'บันทึกสัตว์เลี้ยง 🐾' : 'อัปเดตข้อมูล ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule to Calendar Modal */}
      {modalMode === 'schedule' && selectedPet && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#8e1c24]" size={20} />
                <h3 className="text-lg font-black text-stone-900 font-display">
                  นัดหมายลง Calendar 📅
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleScheduleVet} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  หัวข้อนัดหมาย
                </label>
                <input
                  type="text"
                  required
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    วันที่
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    เวลา
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-[#8e1c24]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                💡 นัดหมายนี้จะถูกเพิ่มเข้าไปใน **Calendar** และแจ้งเตือนทั้ง Cartune & Gun
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8e1c24] hover:bg-[#78171e] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  เพิ่มลง Calendar 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
