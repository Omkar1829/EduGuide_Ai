import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Navbar from '../layout/Navbar'
import AdminSidebar from './AdminSidebar'
import Footer from '../layout/Footer'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="lg:pl-64 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>

      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 left-6 z-50 lg:hidden w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600
                   flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
                   hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  )
}

export default AdminLayout
