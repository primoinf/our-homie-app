import React from 'react'
import { useApp } from './context/AppContext'
import AppShell from './components/layout/AppShell'
import AuthView from './components/views/AuthView'
import HomeView from './components/views/HomeView'
import ShoppingView from './components/views/ShoppingView'
import CalendarView from './components/views/CalendarView'
import PetView from './components/views/PetView'
import FinanceView from './components/views/FinanceView'
import ProfileView from './components/views/ProfileView'

export default function App() {
  const { isAuthenticated, activeTab } = useApp()

  if (!isAuthenticated) {
    return <AuthView />
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />
      case 'shopping':
        return <ShoppingView />
      case 'calendar':
        return <CalendarView />
      case 'pet':
        return <PetView />
      case 'finance':
        return <FinanceView />
      case 'profile':
        return <ProfileView />
      default:
        return <HomeView />
    }
  }

  return (
    <AppShell>
      {renderActiveView()}
    </AppShell>
  )
}
