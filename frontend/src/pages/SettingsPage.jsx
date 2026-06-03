import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import {
  User,
  Bell,
  Shield,
  Settings,
  Lock,
  Phone,
  Mail,
  Globe,
  Moon,
  Save,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { fetchProfile, updateProfile } from '../store/slices/profileSlice'
import { setUser } from '../store/slices/authSlice'

const SettingsPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.profile)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ]

  const inputClass = 'w-full py-3 px-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20'
  const selectClass = 'w-full py-3 px-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20 appearance-none cursor-pointer'

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile || user) {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: profile?.phoneNumber || '',
        bio: profile?.bio || '',
      })
    }
  }, [profile, user])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phoneNumber: formData.phone || undefined,
        bio: formData.bio || undefined,
      })).unwrap()

      dispatch(setUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }))
      
      toast.success('Profile settings saved successfully!')
    } catch (err) {
      toast.error(err || 'Failed to save profile changes')
    }
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Settings className="w-5 h-5 text-white" />
          </div>
          Settings
        </h1>
        <p className="text-gray-400">Manage your account preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-500/15 to-secondary-500/10 text-primary-400 border border-primary-500/20 shadow-sm shadow-primary-500/10'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`} />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                      activeTab === tab.id ? 'text-primary-400 opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card header={
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              </div>
            }>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Name Fields (First and Last Name) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`${inputClass} pl-11`}
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`${inputClass} pl-11`}
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className={`${inputClass} pl-11 opacity-60 cursor-not-allowed`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                {/* Bio Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Bio</label>
                  <textarea
                    className={`${inputClass} min-h-[120px] resize-none`}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button type="submit" icon={<Save className="w-4 h-4" />}>Save Changes</Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                    Looking to manage qualifications or certifications?
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xl">
                    Add, edit, or remove your academic history, skills portfolio, and professional certifications to receive tailored AI recommendations.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-300 hover:bg-primary-500/25 transition text-xs font-bold shrink-0 shadow-sm"
                >
                  Manage Portfolio <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card header={
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              </div>
            }>
              <div className="space-y-3">
                {[
                  { label: 'Email notifications', description: 'Receive email updates about your activity', enabled: true, icon: Mail },
                  { label: 'Push notifications', description: 'Receive push notifications in your browser', enabled: true, icon: Bell },
                  { label: 'Course updates', description: 'Get notified about new courses and content', enabled: false, icon: Globe },
                  { label: 'Job alerts', description: 'Receive personalized job recommendations', enabled: true, icon: Settings },
                ].map((item, index) => {
                  const ItemIcon = item.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/15 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <ItemIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:after:translate-x-full after:shadow-sm transition-colors duration-200" />
                      </label>
                    </div>
                  )
                })}
              </div>
              <Button className="mt-6" icon={<Save className="w-4 h-4" />}>Save Preferences</Button>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card header={
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
              </div>
            }>
              <form className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input type="password" className={`${inputClass} pl-11`} placeholder="Enter current password" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input type="password" className={`${inputClass} pl-11`} placeholder="Enter new password" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <input type="password" className={`${inputClass} pl-11`} placeholder="Confirm new password" />
                  </div>
                </div>
                <Button icon={<Shield className="w-4 h-4" />}>Update Password</Button>
              </form>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card header={
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
              </div>
            }>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Language
                  </label>
                  <div className="relative">
                    <select className={selectClass}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-gray-500" />
                    Theme
                  </label>
                  <div className="relative">
                    <select className={selectClass}>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                    </div>
                  </div>
                </div>

                <Button icon={<Save className="w-4 h-4" />}>Save Preferences</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
