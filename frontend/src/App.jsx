import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/admin/AdminLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileWizard from './pages/ProfileWizard'
import UserDashboard from './pages/UserDashboard'
import AIDashboard from './pages/AIDashboard'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import QuizPage from './pages/QuizPage'
import QuizTakePage from './pages/QuizTakePage'
import QuizResultPage from './pages/QuizResultPage'
import SettingsPage from './pages/SettingsPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import KnowledgeCenterPage from './pages/KnowledgeCenterPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminCoursesPage from './pages/admin/AdminCoursesPage'
import AdminJobsPage from './pages/admin/AdminJobsPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminQuizzesPage from './pages/admin/AdminQuizzesPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import { fetchProfile } from './store/slices/authSlice'
import Spinner from './components/common/Spinner'

const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
}

const App = () => {
  const dispatch = useDispatch()
  const { token, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile())
    }
  }, [dispatch, token, user])

  if (token && !user && loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <Spinner size="xl" className="text-primary-500 mb-4 animate-bounce" />
        <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase animate-pulse">
          Bootstrapping Session...
        </p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/profile-wizard" element={<ProfileWizard />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/ai-dashboard" element={<AIDashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:id" element={<QuizTakePage />} />
          <Route path="/quiz/:id/results" element={<QuizResultPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
