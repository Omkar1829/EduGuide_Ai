import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../store/slices/authSlice'
import { ROUTES } from '../../utils/constants'
import { 
  Sun, 
  Moon, 
  Bell, 
  BellOff, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Sparkles
} from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('eduguide-dark-mode') !== 'false'
  )
  const menuRef = useRef(null)
  const notifRef = useRef(null)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notifications)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('eduguide-dark-mode', isDarkMode)
  }, [isDarkMode])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const navLinks = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.AI_DASHBOARD, label: 'AI Counselor' },
    { path: ROUTES.COURSES, label: 'Courses' },
    { path: ROUTES.JOBS, label: 'Jobs' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-950/70 border-b border-white/5 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                EduGuide
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-white bg-white/10 shadow-glass-inset' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications panel toggle */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass rounded-2xl shadow-glass border border-white/10 overflow-hidden animate-slide-up bg-gray-900/90 backdrop-blur-xl">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    <div className="p-6 text-center text-gray-500">
                      <BellOff className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-xs">No new notifications</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-gray-300">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-glass border border-white/10 overflow-hidden animate-slide-up bg-gray-900/90 backdrop-blur-xl">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <Link
                      to={ROUTES.SETTINGS}
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl text-sm font-medium transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      to={ROUTES.PROFILE_WIZARD}
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl text-sm font-medium transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-medium transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
