import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Card from '../components/common/Card'
import { ROUTES } from '../utils/constants'
import { 
  GraduationCap, 
  CheckCircle, 
  Briefcase, 
  User, 
  Sparkles,
  TrendingUp,
  ArrowRight,
  Bot,
  Compass,
  FileCheck
} from 'lucide-react'

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    quizzesCompleted: 0,
    jobsApplied: 0,
    profileCompletion: 0,
  })

  useEffect(() => {
    setStats({
      coursesEnrolled: 5,
      quizzesCompleted: 3,
      jobsApplied: 8,
      profileCompletion: 75,
    })
  }, [])

  const quickActions = [
    { label: 'Take Career Quiz', desc: 'Assess your strengths', icon: Compass, path: ROUTES.QUIZ, color: 'from-blue-500 to-indigo-500 shadow-blue-500/20' },
    { label: 'AI Career Dashboard', desc: 'Personalized guidelines', icon: Bot, path: ROUTES.AI_DASHBOARD, color: 'from-purple-500 to-pink-500 shadow-purple-500/20' },
    { label: 'Explore Courses', desc: 'Learn top industry skills', icon: GraduationCap, path: ROUTES.COURSES, color: 'from-emerald-500 to-teal-500 shadow-emerald-500/20' },
    { label: 'Browse Jobs', desc: 'Find your dream job', icon: Briefcase, path: ROUTES.JOBS, color: 'from-orange-500 to-rose-500 shadow-orange-500/20' },
  ]

  return (
    <div className="space-y-8 animate-in pb-10">
      {/* Header section with gradient background card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-base-950 p-6 sm:p-8 shadow-glass backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 border border-primary-500/20 text-primary-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Empowering Career Growth
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>!
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
              Track your learning, check your counseling matches, and continue your guided education path.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-gray-950">
              <span className="text-white font-bold text-sm">{stats.profileCompletion}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Profile Strength</p>
              <p className="text-xs text-gray-400 mt-0.5">Complete to unlock better matches</p>
              <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" 
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Courses Enrolled', value: stats.coursesEnrolled, icon: GraduationCap, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Quizzes Completed', value: stats.quizzesCompleted, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Jobs Applied', value: stats.jobsApplied, icon: Briefcase, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Profile Actions', value: '4 Pending', icon: User, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary-400" /> What would you like to do next?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} to={action.path} className="group">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-lg hover:bg-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-4 text-white transition-transform duration-300 group-hover:rotate-6`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">{action.label}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{action.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary-400 font-semibold mt-4 transition-colors group-hover:text-primary-300">
                    Get started <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent activity & counselor promotion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card header={
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-400" />
              <span className="font-bold text-white text-base">Recent Activities</span>
            </div>
          }>
            <div className="space-y-3.5">
              {[
                { text: 'Completed Python Fundamentals Quiz', time: '2 hours ago', status: 'Success', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { text: 'Enrolled in Data Science & Machine Learning Course', time: '1 day ago', status: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { text: 'Applied for Front-End Engineer position at TechCorp', time: '2 days ago', status: 'Applied', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
              ].map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${activity.color} whitespace-nowrap`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-br from-primary-950/40 via-purple-950/20 to-base-950 p-6 shadow-glass backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-44 h-44 bg-secondary-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg text-white mb-5 animate-bounce">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Need direct career guidance?</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Chat with our advanced **AI Career Counselor** to receive personalized course roadmaps, quiz evaluations, or simulated career paths instantly.
              </p>
            </div>
            
            <Link 
              to={ROUTES.AI_DASHBOARD} 
              className="relative z-10 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-center font-bold text-sm text-white rounded-xl transition-colors mt-4 flex items-center justify-center gap-2 group-hover:border-white/20"
            >
              <span>Consult AI Counselor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
