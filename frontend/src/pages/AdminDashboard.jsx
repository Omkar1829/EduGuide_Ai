import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, GraduationCap, Briefcase, HelpCircle, UserCheck, UserPlus,
  PlusCircle, PlusSquare, BarChart3, RefreshCw, AlertTriangle,
  User, CheckCircle, Server, Database, Bot, ShieldCheck, Inbox
} from 'lucide-react'
import AdminStatsCard from '../components/admin/AdminStatsCard'
import ActivityChart from '../components/admin/ActivityChart'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import adminService from '../services/adminService'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsRes, analyticsRes, activityRes] = await Promise.allSettled([
        adminService.getStats(),
        adminService.getAnalytics({ period: '7d' }),
        adminService.getActivity({ limit: 10 }),
      ])

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data?.data || statsRes.value.data)
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data?.data || analyticsRes.value.data)
      }
      if (activityRes.status === 'fulfilled') {
        setActivity(activityRes.value.data?.data || activityRes.value.data || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="xl" className="mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-amber-400 mb-4" />
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  const userGrowthData = analytics?.userGrowth || [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 15 },
    { label: 'Thu', value: 22 },
    { label: 'Fri', value: 30 },
    { label: 'Sat', value: 25 },
    { label: 'Sun', value: 18 },
  ]

  const courseEnrollmentData = analytics?.courseEnrollments || [
    { label: 'Web Dev', value: 45 },
    { label: 'Data Sci', value: 32 },
    { label: 'ML', value: 28 },
    { label: 'Mobile', value: 18 },
    { label: 'Cloud', value: 22 },
    { label: 'Cyber', value: 15 },
  ]

  const jobPostingsData = analytics?.jobPostings || [
    { label: 'Jan', value: 20 },
    { label: 'Feb', value: 35 },
    { label: 'Mar', value: 28 },
    { label: 'Apr', value: 42 },
    { label: 'May', value: 38 },
    { label: 'Jun', value: 55 },
  ]

  const quickActions = [
    { label: 'Add Course', icon: <PlusCircle className="w-6 h-6 text-white" />, path: '/admin/courses', color: 'from-indigo-500 to-purple-500' },
    { label: 'Add Job', icon: <PlusSquare className="w-6 h-6 text-white" />, path: '/admin/jobs', color: 'from-emerald-500 to-teal-500' },
    { label: 'View Users', icon: <Users className="w-6 h-6 text-white" />, path: '/admin/users', color: 'from-amber-500 to-orange-500' },
    { label: 'Analytics', icon: <BarChart3 className="w-6 h-6 text-white" />, path: '/admin/analytics', color: 'from-rose-500 to-pink-500' },
  ]

  const activityIconMap = {
    user: { icon: <User className="w-3.5 h-3.5 text-indigo-400" />, bg: 'bg-indigo-500/10' },
    course: { icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />, bg: 'bg-emerald-500/10' },
    job: { icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" />, bg: 'bg-amber-500/10' },
    default: { icon: <CheckCircle className="w-3.5 h-3.5 text-rose-400" />, bg: 'bg-rose-500/10' },
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Admin</span> Dashboard
          </h1>
          <p className="text-gray-400">Platform overview and management.</p>
        </div>
        <button
          onClick={fetchData}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.15] transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStatsCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          icon={<Users className="w-5 h-5 text-white" />}
          color="primary"
          change={stats?.userGrowth || '+12%'}
          changeType="positive"
        />
        <AdminStatsCard
          title="Total Courses"
          value={stats?.totalCourses?.toLocaleString() || '0'}
          icon={<GraduationCap className="w-5 h-5 text-white" />}
          color="emerald"
          change={stats?.courseGrowth || '+5%'}
          changeType="positive"
        />
        <AdminStatsCard
          title="Total Jobs"
          value={stats?.totalJobs?.toLocaleString() || '0'}
          icon={<Briefcase className="w-5 h-5 text-white" />}
          color="amber"
          change={stats?.jobGrowth || '+8%'}
          changeType="positive"
        />
        <AdminStatsCard
          title="Active Quizzes"
          value={stats?.activeQuizzes?.toLocaleString() || '0'}
          icon={<HelpCircle className="w-5 h-5 text-white" />}
          color="rose"
          change={stats?.quizGrowth || '+3%'}
          changeType="positive"
        />
        <AdminStatsCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || '0'}
          icon={<UserCheck className="w-5 h-5 text-white" />}
          color="sky"
          change={stats?.activeGrowth || '+7%'}
          changeType="positive"
        />
        <AdminStatsCard
          title="New This Week"
          value={stats?.newThisWeek?.toLocaleString() || '0'}
          icon={<UserPlus className="w-5 h-5 text-white" />}
          color="violet"
          change={stats?.weeklyGrowth || '+15%'}
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.path}>
            <div className="group p-5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center cursor-pointer">
              <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                {action.icon}
              </div>
              <p className="text-sm font-medium text-white">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={userGrowthData}
          title="Users Growth (Last 7 Days)"
          type="line"
          color="primary"
        />
        <ActivityChart
          data={courseEnrollmentData}
          title="Course Enrollments by Category"
          type="bar"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={jobPostingsData}
          title="Job Postings (Last 6 Months)"
          type="bar"
          color="amber"
        />

        <Card header="Recent Activity">
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
            {activity.length > 0 ? (
              activity.map((item, index) => {
                const actIcon = activityIconMap[item.type] || activityIconMap.default
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${actIcon.bg}`}>
                      {actIcon.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.message || item.text}</p>
                      <p className="text-xs text-gray-500">{item.time || item.createdAt}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Inbox className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {stats && (
        <Card header="Platform Health">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center hover:bg-white/[0.07] transition-colors duration-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm text-gray-400">Server Status</p>
              <p className="font-semibold text-emerald-400">Online</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center hover:bg-white/[0.07] transition-colors duration-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-400">Database</p>
              <p className="font-semibold text-emerald-400">Healthy</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center hover:bg-white/[0.07] transition-colors duration-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm text-gray-400">AI Service</p>
              <p className="font-semibold text-emerald-400">Active</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center hover:bg-white/[0.07] transition-colors duration-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-sky-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-sm text-gray-400">Security</p>
              <p className="font-semibold text-emerald-400">Protected</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard
