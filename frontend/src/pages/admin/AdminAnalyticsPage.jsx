import { useEffect, useState, useCallback } from 'react'
import { UserPlus, GraduationCap, Briefcase, CheckCircle, Star, Gauge, AlertTriangle, Server, Users, Database, Wifi, HardDrive } from 'lucide-react'
import ActivityChart from '../../components/admin/ActivityChart'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import adminService from '../../services/adminService'

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const res = await adminService.getAnalytics({ period })
      setAnalytics(res.data?.data || res.data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="xl" className="mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const usersOverTime = analytics?.usersOverTime || [
    { label: 'Week 1', value: 45 },
    { label: 'Week 2', value: 62 },
    { label: 'Week 3', value: 58 },
    { label: 'Week 4', value: 78 },
    { label: 'Week 5', value: 92 },
    { label: 'Week 6', value: 85 },
  ]

  const courseEnrollments = analytics?.courseEnrollments || [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 180 },
    { label: 'Mar', value: 150 },
    { label: 'Apr', value: 220 },
    { label: 'May', value: 280 },
    { label: 'Jun', value: 310 },
  ]

  const jobApplications = analytics?.jobApplications || [
    { label: 'Jan', value: 85 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 95 },
    { label: 'Apr', value: 145 },
    { label: 'May', value: 180 },
    { label: 'Jun', value: 210 },
  ]

  const topCourses = analytics?.topCourses || [
    { title: 'Complete Web Development Bootcamp', enrollments: 1250, rating: 4.8 },
    { title: 'Machine Learning A-Z', enrollments: 980, rating: 4.7 },
    { title: 'Data Science with Python', enrollments: 850, rating: 4.6 },
    { title: 'React - The Complete Guide', enrollments: 720, rating: 4.8 },
    { title: 'AWS Cloud Practitioner', enrollments: 650, rating: 4.5 },
  ]

  const topJobs = analytics?.topJobs || [
    { title: 'Senior Software Engineer', company: 'Google', applications: 320 },
    { title: 'Data Scientist', company: 'Microsoft', applications: 280 },
    { title: 'Full Stack Developer', company: 'Amazon', applications: 250 },
    { title: 'ML Engineer', company: 'Meta', applications: 220 },
    { title: 'DevOps Engineer', company: 'Netflix', applications: 190 },
  ]

  const healthMetrics = analytics?.health || {
    apiResponseTime: '45ms',
    errorRate: '0.2%',
    uptime: '99.9%',
    activeSessions: 142,
    storageUsed: '2.4 GB',
    bandwidth: '15 GB/month',
  }

  const summaryStats = [
    { label: 'Total Signups', value: analytics?.totalSignups ?? 1250, icon: <UserPlus className="w-5 h-5" />, color: 'text-indigo-400' },
    { label: 'Course Enrollments', value: analytics?.totalEnrollments ?? 3420, icon: <GraduationCap className="w-5 h-5" />, color: 'text-emerald-400' },
    { label: 'Job Applications', value: analytics?.totalApplications ?? 1890, icon: <Briefcase className="w-5 h-5" />, color: 'text-amber-400' },
    { label: 'Quiz Completions', value: analytics?.totalQuizzes ?? 856, icon: <CheckCircle className="w-5 h-5" />, color: 'text-rose-400' },
  ]

  const healthItems = [
    { label: 'API Response Time', value: healthMetrics.apiResponseTime, icon: <Gauge className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'Error Rate', value: healthMetrics.errorRate, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'Uptime', value: healthMetrics.uptime, icon: <Server className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'Active Sessions', value: healthMetrics.activeSessions, icon: <Users className="w-4 h-4" />, color: 'text-indigo-400' },
    { label: 'Storage Used', value: healthMetrics.storageUsed, icon: <HardDrive className="w-4 h-4" />, color: 'text-sky-400' },
    { label: 'Bandwidth', value: healthMetrics.bandwidth, icon: <Wifi className="w-4 h-4" />, color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Analytics</span> Dashboard
          </h1>
          <p className="text-gray-400">Platform performance and usage insights.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-full sm:w-40 transition-all duration-200"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <div key={index} className="group p-5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={usersOverTime}
          title="Users Over Time"
          type="line"
          color="primary"
        />
        <ActivityChart
          data={courseEnrollments}
          title="Course Enrollments"
          type="bar"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={jobApplications}
          title="Job Applications"
          type="bar"
          color="amber"
        />

        <Card header="Top Courses">
          <div className="space-y-3">
            {topCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 text-sm font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.enrollments} enrollments</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-gray-300">{course.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header="Top Jobs">
          <div className="space-y-3">
            {topJobs.map((job, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-sm font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  {job.applications} apps
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card header="Platform Health">
          <div className="grid grid-cols-2 gap-3">
            {healthItems.map((metric, index) => (
              <div key={index} className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.07] transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className={metric.color}>{metric.icon}</span>
                  <span className="text-xs text-gray-500">{metric.label}</span>
                </div>
                <p className="text-lg font-bold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminAnalyticsPage
