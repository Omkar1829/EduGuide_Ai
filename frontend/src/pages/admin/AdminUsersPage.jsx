import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import UserManagementTable from '../../components/admin/UserManagementTable'
import UserFormModal from '../../components/admin/UserFormModal'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import adminService from '../../services/adminService'

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  const fetchUsers = useCallback(async (page = 1, searchVal, role) => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (searchVal !== undefined ? searchVal : search) params.search = searchVal !== undefined ? searchVal : search
      if (role !== undefined ? role : roleFilter) params.role = role !== undefined ? role : roleFilter

      const res = await adminService.getUsers(params)
      const data = res.data?.data || res.data
      setUsers(data?.users || data?.data || [])
      setPagination((prev) => ({
        ...prev,
        page: data?.page || page,
        total: data?.total || 0,
        totalPages: data?.totalPages || 0,
      }))
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter])

  useEffect(() => {
    fetchUsers(1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    const timeout = setTimeout(() => fetchUsers(1, val), 400)
    return () => clearTimeout(timeout)
  }

  const handleRoleFilter = (e) => {
    const val = e.target.value
    setRoleFilter(val)
    fetchUsers(1, undefined, val)
  }

  const handlePageChange = (page) => {
    fetchUsers(page)
  }

  const handleSort = (key, direction) => {
    const sorted = [...users].sort((a, b) => {
      if (!a[key]) return 1
      if (!b[key]) return -1
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setUsers(sorted)
  }

  const handleToggleActive = async (id) => {
    try {
      await adminService.toggleUserActive(id)
      fetchUsers(pagination.page)
    } catch (err) {
      console.error('Failed to toggle user:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id)
      fetchUsers(pagination.page)
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const handleSave = async (data, id) => {
    try {
      setAddLoading(true)
      if (id) {
        await adminService.updateUser(id, data)
      }
      setShowAddModal(false)
      fetchUsers(pagination.page)
    } catch (err) {
      console.error('Failed to save user:', err)
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">User</span> Management
          </h1>
          <p className="text-gray-400">Manage platform users and their roles.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-full sm:w-48 transition-all duration-200"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="counselor">Counselor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
        <UserManagementTable
          users={users}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </div>

      <UserFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(data) => handleSave(data)}
        loading={addLoading}
      />
    </div>
  )
}

export default AdminUsersPage
