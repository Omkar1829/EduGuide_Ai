import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ChatWidget from '../dashboard/ChatWidget'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="lg:pl-64 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>

      {/* Mobile sidebar toggle — glassmorphic floating button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 left-6 z-50 lg:hidden w-13 h-13 rounded-2xl
                   bg-white/[0.06] backdrop-blur-xl border border-white/[0.12]
                   flex items-center justify-center
                   shadow-lg shadow-indigo-500/15
                   hover:bg-white/[0.10] hover:border-white/[0.20] hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25
                   active:scale-95 transition-all duration-300"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default DashboardLayout
