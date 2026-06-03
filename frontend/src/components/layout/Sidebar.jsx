import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES, ROLES } from '../../utils/constants'
import { 
  Home, 
  User,
  Bot, 
  GraduationCap, 
  Briefcase, 
  HelpCircle, 
  Settings, 
  Shield,
  Sparkles,
  FileText,
  Newspaper
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === ROLES.ADMIN

  const navigation = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.PROFILE, label: 'My Profile', icon: User },
    { path: ROUTES.AI_DASHBOARD, label: 'AI Dashboard', icon: Bot },
    { path: ROUTES.COURSES, label: 'Courses', icon: GraduationCap },
    { path: ROUTES.JOBS, label: 'Jobs', icon: Briefcase },
    { path: ROUTES.QUIZ, label: 'Quiz', icon: HelpCircle },
    { path: '/resume-builder', label: 'Resume Builder', icon: FileText },
    { path: '/knowledge-center', label: 'Knowledge Center', icon: Newspaper },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  ]

  if (isAdmin) {
    navigation.push({ path: ROUTES.ADMIN, label: 'Admin', icon: Shield })
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 glass-dark z-40 transform transition-all duration-300 ease-in-out border-r border-white/5
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col py-6 overflow-y-auto scrollbar-thin">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 shadow-lg shadow-primary-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="px-4 mt-auto">
            <div className="glass-card p-4 border border-white/10 bg-white/5 rounded-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Assistant</p>
                  <p className="text-xs text-gray-400">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
