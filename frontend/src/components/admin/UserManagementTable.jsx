import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import AdminTable from './AdminTable'
import DeleteConfirmModal from './DeleteConfirmModal'
import UserFormModal from './UserFormModal'
import { useState } from 'react'

const UserManagementTable = ({ users, loading, pagination, onPageChange, onSort, onEdit, onDelete, onToggleActive, onSave }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [viewTarget, setViewTarget] = useState(null)

  const columns = [
    {
      key: 'avatar',
      label: '',
      width: '48px',
      render: (_, user) => {
        const initial = user.firstName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U';
        return (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
            <span className="text-white text-sm font-medium">{initial}</span>
          </div>
        )
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, user) => {
        const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.name || 'N/A');
        return (
          <div>
            <p className="font-medium text-white">{fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )
      },
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
          role?.toLowerCase() === 'admin' ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' :
          role?.toLowerCase() === 'counselor' ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' :
          'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
        }`}>
          {role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'subscriptionTier',
      label: 'Membership',
      sortable: true,
      render: (_, user) => {
        if (user.role?.toLowerCase() !== 'student') return <span className="text-gray-500 font-medium">-</span>;
        const currentTier = user.subscriptionTier || 'NEWBIE';
        
        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            currentTier === 'PRO_PLUS' ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' :
            currentTier === 'PRO' ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' :
            'bg-gray-500/15 text-gray-400 border-gray-500/20'
          }`}>
            {currentTier === 'PRO_PLUS' ? 'Pro Plus ⭐' :
             currentTier === 'PRO' ? 'Pro 🚀' :
             'Newbie 🌱'}
          </span>
        )
      }
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (isActive) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
          isActive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (date) => (
        <span className="text-gray-400 text-sm">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_, user) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(user)}
            className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditTarget(user)}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all duration-200"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(user.id || user._id)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              user.isActive
                ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-400/10'
                : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10'
            }`}
            title={user.isActive ? 'Deactivate' : 'Activate'}
          >
            {user.isActive ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setDeleteTarget(user)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-sm text-indigo-300">{selectedRows.length} selected</span>
          <button
            onClick={() => {
              selectedRows.forEach((i) => {
                const user = users[i]
                if (user) onToggleActive(user.id || user._id)
              })
              setSelectedRows([])
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-200"
          >
            <ToggleRight className="w-3.5 h-3.5" /> Toggle Active
          </button>
          <button
            onClick={() => setSelectedRows([])}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
        onSort={onSort}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        emptyMessage="No users found"
      />

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-semibold text-white">User Details</h2>
              <button onClick={() => setViewTarget(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-white text-2xl font-bold">{viewTarget.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{viewTarget.name}</h3>
                  <p className="text-gray-400">{viewTarget.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {viewTarget.role === 'student' && (
                  <div className="col-span-2 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                    <p className="text-xs text-gray-500 mb-1">Membership Tier</p>
                    <p className="font-medium text-indigo-400">
                      {viewTarget.subscriptionTier === 'PRO_PLUS' ? 'Pro Plus Membership ⭐' :
                       viewTarget.subscriptionTier === 'PRO' ? 'Pro Membership 🚀' :
                       'Newbie (Free) 🌱'}
                    </p>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="font-medium text-white">{viewTarget.role?.charAt(0).toUpperCase() + viewTarget.role?.slice(1)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className={`font-medium ${viewTarget.isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {viewTarget.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                  <p className="font-medium text-white">
                    {viewTarget.createdAt ? new Date(viewTarget.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium text-white">
                    {viewTarget.updatedAt ? new Date(viewTarget.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <UserFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(data) => {
          onSave(data, editTarget.id || editTarget._id)
          setEditTarget(null)
        }}
        user={editTarget}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget.id || deleteTarget._id)
          setDeleteTarget(null)
        }}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove their account and all associated data.`}
      />
    </>
  )
}

export default UserManagementTable
