import { useState, useEffect } from 'react'
import { User, Mail } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'

const UserFormModal = ({ isOpen, onClose, onSave, user, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT',
    isActive: true,
    subscriptionTier: 'NEWBIE',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'STUDENT',
        isActive: user.isActive !== undefined ? user.isActive : true,
        subscriptionTier: user.subscriptionTier || 'NEWBIE',
      })
    } else {
      setFormData({ firstName: '', lastName: '', email: '', role: 'STUDENT', isActive: true, subscriptionTier: 'NEWBIE' })
    }
  }, [user, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            icon={<User className="w-4 h-4" />}
          />
        </div>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          icon={<Mail className="w-4 h-4" />}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Role</label>
          <select
            name="role"
            value={formData.role?.toUpperCase()}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {formData.role?.toLowerCase() === 'student' && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Membership Tier</label>
            <select
              name="subscriptionTier"
              value={formData.subscriptionTier}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            >
              <option value="NEWBIE">Newbie (Free)</option>
              <option value="PRO">Pro Membership</option>
              <option value="PRO_PLUS">Pro Plus Membership</option>
            </select>
          </div>
        )}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
          />
          <div>
            <p className="text-sm font-medium text-white">Active Account</p>
            <p className="text-xs text-gray-400">User can access the platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default UserFormModal
