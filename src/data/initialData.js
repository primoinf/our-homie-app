export const MOCK_DATA = {
  users: {
    cartune: {
      id: 'cartune',
      name: 'มะแอ๊ะ',
      email: 'cartune@homie.app',
      avatar: '🐱',
      role: 'ที่รัก',
      accentColor: '#8e1c24',
      badgeBg: '#fbe8ea',
      badgeText: '#8e1c24',
      updatedAt: 1789072000000
    },
    gun: {
      id: 'gun',
      name: 'ตูบศักดิ์',
      email: 'gun@homie.app',
      avatar: '🐶',
      role: 'ที่รัก',
      accentColor: '#1e293b',
      badgeBg: '#e2e8f0',
      badgeText: '#1e293b',
      updatedAt: 1789072000000
    }
  },

  currentUser: 'cartune',

  awards: {
    points: 0,
    targetPoints: 100,
    nextReward: 'ย้อมผมที่ enrich',
    history: [
      { id: 'a1', title: 'ล้างห้องน้ำ', points: 20, by: 'Gun', date: '2026-08-28' },
      { id: 'a2', title: 'อาบน้ำให้ Leah', points: 30, by: 'Cartune', date: '2026-08-30' }
    ]
  },

  pets: [
    {
      id: 'leah',
      name: 'Leah',
      gender: 'Female',
      breed: 'Cocker Spenial',
      age: '1 yr 10 mo',
      weight: '10 Kg',
      lastVaccine: '8 Feb 2026',
      photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Shower',
      isFavorite: true,
      notes: 'ร่าเริง ชอบวิ่งเล่นที่สวน อาบน้ำทุกวันเสาร์'
    },
    {
      id: 'lupin',
      name: 'Lupin',
      gender: 'Male',
      breed: 'Persian Cat',
      age: '8 yr 3 mo',
      weight: '4.2 Kg',
      lastVaccine: '15 Jun 2026',
      photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Comb Fur',
      isFavorite: true,
      notes: 'ขนยาว ต้องหวีขนสัปดาห์ละ 3 ครั้ง ทานอาหารสูตรบำรุงไต'
    },
    {
      id: 'luka',
      name: 'Luka',
      gender: 'Male',
      breed: 'American shorthair',
      age: '5 yr 7 mo',
      weight: '4.5 Kg',
      lastVaccine: '15 Jun 2026',
      photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Check Water',
      isFavorite: true,
      notes: 'ชอบใส่ผ้าพันคอ ขี้อ้อน ชอบนอนบนตัก'
    }
  ],

  shopping: [
    { id: 's1', text: 'หลอดไฟ', category: 'Home', completed: false, addedBy: 'Cartune' },
    { id: 's2', text: 'เช็คไส้กรองอากาศ', category: 'Home', completed: false, addedBy: 'Gun' },
    { id: 's3', text: 'เช็คฟิลเตอร์น้ำพุแมว', category: 'Home', completed: false, addedBy: 'Cartune' }
  ],

  finance: {
    monthName: 'September 2026',
    totalSpending: 38610,
    cartunePaid: 17672,
    gunPaid: 20938,
    cartunePending: 1000,
    cartunePendingCount: 1,
    gunPending: 2223.5,
    gunPendingCount: 3,
    budgets: [
      { id: 'b_util', name: 'Utilities', spent: 4250, budget: 3000, icon: 'Receipt' },
      { id: 'b_pets', name: 'Pets', spent: 7049, budget: 4000, icon: 'PawPrint' },
      { id: 'b_home', name: 'Home Supplies', spent: 15926.5, budget: 3000, icon: 'Home' },
      { id: 'b_bldg', name: 'Building Fees', spent: 0, budget: 2000, icon: 'Building2' },
      { id: 'b_save', name: 'Saving', spent: 0, budget: 2000, icon: 'PiggyBank' }
    ],
    transactions: [
      { id: 't1', title: 'แหวนสายยาง+เทปพันเกลียว', amount: 55, payer: 'Gun', date: 'Today', verified: true, icon: 'Wrench', category: 'Home Supplies' },
      { id: 't2', title: 'ค่าเน็ต', amount: 640, payer: 'Gun', date: 'Today', verified: true, icon: 'Receipt', category: 'Utilities' },
      { id: 't3', title: 'BigC', amount: 343, payer: 'Gun', date: 'Today', verified: true, icon: 'ShoppingBag', category: 'Home Supplies' },
      { id: 't4', title: 'ค่าบัตร Odyssey', amount: 1100, payer: 'Gun', date: 'Today', verified: true, icon: 'Coffee', category: 'Entertainment' },
      { id: 't5', title: 'พิซซ่าวัดเกิดพี่แป้ง', amount: 580, payer: 'Gun', date: 'Today', verified: true, icon: 'Utensils', category: 'Food' },
      { id: 't6', title: 'โลตัส', amount: 3285.5, payer: 'Gun', date: 'Today', verified: true, icon: 'Store', category: 'Home Supplies' },
      { id: 't7', title: 'หอมฟุ้ง 30.07', amount: 200, payer: 'Gun', date: 'Today', verified: true, icon: 'PawPrint', category: 'Pets' },
      { id: 't8', title: 'Bbq plaza', amount: 1080, payer: 'Cartune', date: 'Today', verified: true, icon: 'Utensils', category: 'Food' },
      { id: 't9', title: 'Petclub', amount: 2038, payer: 'Cartune', date: 'Today', verified: true, icon: 'PawPrint', category: 'Pets' }
    ]
  },

  calendar: {
    currentMonthYear: 'September 2026',
    year: 2026,
    month: 9,
    selectedDay: 10,
    events: [
      { id: 'e1', title: 'Manarom', date: '2026-09-13', day: 13, time: '10:00', type: 'shared', kind: 'event', completed: false, color: '#8e1c24' },
      { id: 'e2', title: 'Leah Vet Checkup', date: '2026-09-08', day: 8, time: '14:30', type: 'shared', kind: 'event', completed: false, color: '#8e1c24' },
      { id: 'e3', title: 'Dinner with Parents', date: '2026-09-19', day: 19, time: '18:30', type: 'shared', kind: 'event', completed: false, color: '#8e1c24' },
      { id: 'e4', title: 'Pay Electricity Bill', date: '2026-09-20', day: 20, time: '09:00', type: 'shared', kind: 'task', completed: false, color: '#8e1c24' },
      { id: 'e5', title: 'Dentist Cartune', date: '2026-09-04', day: 4, time: '11:00', type: 'personal', kind: 'event', user: 'cartune', color: '#38bdf8' },
      { id: 'e6', title: 'Gun Badminton', date: '2026-09-02', day: 2, time: '19:00', type: 'personal', kind: 'event', user: 'gun', color: '#38bdf8' },
      { id: 'e7', title: 'สั่งทรายแมว Lupin & Luka', date: '2026-09-10', day: 10, time: '12:00', type: 'shared', kind: 'task', completed: false, color: '#8e1c24' }
    ],
    moods: {
      '2026-09-01': {
        cartune: { mood: 'tired', label: 'Tired', user: 'cartune', date: '2026-09-01', icon: '😑', color: '#f59e0b', hex: '#f59e0b' },
        gun: { mood: 'calm', label: 'Calm', user: 'gun', date: '2026-09-01', icon: '😌', color: '#a78bfa', hex: '#a78bfa' }
      },
      '2026-09-02': {
        cartune: { mood: 'happy', label: 'Happy', user: 'cartune', date: '2026-09-02', icon: '😊', color: '#f472b6', hex: '#f472b6' },
        gun: { mood: 'happy', label: 'Happy', user: 'gun', date: '2026-09-02', icon: '😊', color: '#f472b6', hex: '#f472b6' }
      },
      '2026-09-03': {
        cartune: { mood: 'sad', label: 'Sad', user: 'cartune', date: '2026-09-03', icon: '🥺', color: '#38bdf8', hex: '#38bdf8' },
        gun: { mood: 'calm', label: 'Calm', user: 'gun', date: '2026-09-03', icon: '😌', color: '#a78bfa', hex: '#a78bfa' }
      },
      '2026-09-04': {
        cartune: { mood: 'calm', label: 'Calm', user: 'cartune', date: '2026-09-04', icon: '😌', color: '#a78bfa', hex: '#a78bfa' },
        gun: { mood: 'happy', label: 'Happy', user: 'gun', date: '2026-09-04', icon: '😊', color: '#f472b6', hex: '#f472b6' }
      },
      '2026-09-05': {
        cartune: { mood: 'happy', label: 'Happy', user: 'cartune', date: '2026-09-05', icon: '😊', color: '#f472b6', hex: '#f472b6' },
        gun: { mood: 'tired', label: 'Tired', user: 'gun', date: '2026-09-05', icon: '😑', color: '#f59e0b', hex: '#f59e0b' }
      }
    }
  }
}

// Clean data slate for actual daily use
export const CLEAN_DATA = {
  users: {
    cartune: {
      id: 'cartune',
      name: 'มะแอ๊ะ',
      email: 'cartune@homie.app',
      avatar: '🐱',
      role: 'ที่รัก',
      accentColor: '#8e1c24',
      badgeBg: '#fbe8ea',
      badgeText: '#8e1c24',
      updatedAt: 1789072000000
    },
    gun: {
      id: 'gun',
      name: 'ตูบศักดิ์',
      email: 'gun@homie.app',
      avatar: '🐶',
      role: 'ที่รัก',
      accentColor: '#1e293b',
      badgeBg: '#e2e8f0',
      badgeText: '#1e293b',
      updatedAt: 1789072000000
    }
  },

  currentUser: 'cartune',

  awards: {
    points: 0,
    targetPoints: 100,
    nextReward: 'ย้อมผมที่ enrich',
    history: []
  },

  pets: [
    {
      id: 'leah',
      name: 'Leah',
      gender: 'Female',
      breed: 'Cocker Spenial',
      age: '1 yr 10 mo',
      weight: '10 Kg',
      lastVaccine: '8 Feb 2026',
      photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Shower',
      isFavorite: true,
      notes: 'ร่าเริง ชอบวิ่งเล่นที่สวน อาบน้ำทุกวันเสาร์'
    },
    {
      id: 'lupin',
      name: 'Lupin',
      gender: 'Male',
      breed: 'Persian Cat',
      age: '8 yr 3 mo',
      weight: '4.2 Kg',
      lastVaccine: '15 Jun 2026',
      photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Comb Fur',
      isFavorite: true,
      notes: 'ขนยาว ต้องหวีขนสัปดาห์ละ 3 ครั้ง ทานอาหารสูตรบำรุงไต'
    },
    {
      id: 'luka',
      name: 'Luka',
      gender: 'Male',
      breed: 'American shorthair',
      age: '5 yr 7 mo',
      weight: '4.5 Kg',
      lastVaccine: '15 Jun 2026',
      photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
      todayTask: 'Check Water',
      isFavorite: true,
      notes: 'ชอบใส่ผ้าพันคอ ขี้อ้อน ชอบนอนบนตัก'
    }
  ],

  shopping: [],

  finance: {
    monthName: 'September 2026',
    totalSpending: 0,
    cartunePaid: 0,
    gunPaid: 0,
    cartunePending: 0,
    cartunePendingCount: 0,
    gunPending: 0,
    gunPendingCount: 0,
    budgets: [
      { id: 'b_util', name: 'Utilities', spent: 0, budget: 3000, icon: 'Receipt' },
      { id: 'b_pets', name: 'Pets', spent: 0, budget: 4000, icon: 'PawPrint' },
      { id: 'b_home', name: 'Home Supplies', spent: 0, budget: 3000, icon: 'Home' },
      { id: 'b_bldg', name: 'Building Fees', spent: 0, budget: 2000, icon: 'Building2' },
      { id: 'b_save', name: 'Saving', spent: 0, budget: 2000, icon: 'PiggyBank' }
    ],
    transactions: []
  },

  calendar: {
    currentMonthYear: 'September 2026',
    year: 2026,
    month: 9,
    selectedDay: 10,
    events: [],
    moods: {}
  }
}

// Default to CLEAN_DATA for fresh real usage
export const INITIAL_DATA = CLEAN_DATA
