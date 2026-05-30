import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, GraduationCap, Briefcase, BarChart3, ArrowLeft, ShieldCheck, Brain } from 'lucide-react'
import { ROUTES } from '../../utils/constants'

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  courses: GraduationCap,
  jobs: Briefcase,
  quizzes: Brain,
  analytics: BarChart3,
}

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { path: '/admin', label: 'Dashboard', iconKey: 'dashboard', exact: true },
    { path: '/admin/users', label: 'Users', iconKey: 'users' },
    { path: '/admin/courses', label: 'Courses', iconKey: 'courses' },
    { path: '/admin/jobs', label: 'Jobs', iconKey: 'jobs' },
    { path: '/admin/quizzes', label: 'Quizzes', iconKey: 'quizzes' },
    { path: '/admin/analytics', label: 'Analytics', iconKey: 'analytics' },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] z-40 transform transition-transform duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col py-6 overflow-y-auto scrollbar-thin">
          <div className="px-4 mb-4">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = iconMap[item.iconKey]
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="px-4 mt-auto space-y-3">
            <div className="border-t border-white/10 pt-4">
              <Link
                to={ROUTES.DASHBOARD}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
              >
                <ArrowLeft className="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span>Back to User Dashboard</span>
              </Link>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin Access</p>
                  <p className="text-xs text-gray-400">Full permissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
