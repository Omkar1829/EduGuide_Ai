import { useState } from 'react'
import { Eye, Pencil, Trash2, Star, ExternalLink, X } from 'lucide-react'
import AdminTable from './AdminTable'
import DeleteConfirmModal from './DeleteConfirmModal'

const CourseManagementTable = ({ courses, loading, pagination, onPageChange, onSort, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)

  const columns = [
    {
      key: 'title',
      label: 'Course',
      sortable: true,
      render: (_, course) => (
        <div className="max-w-xs">
          <p className="font-medium text-white truncate">{course.title}</p>
          <p className="text-xs text-gray-500 truncate">{course.provider}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (category) => (
        <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
          {category}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (rating) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm text-white">{rating || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'enrolledCount',
      label: 'Enrolled',
      sortable: true,
      render: (count) => (
        <span className="text-sm text-gray-300">{count || 0}</span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (level) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
          level === 'advanced' ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' :
          level === 'intermediate' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
          'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
        }`}>
          {level?.charAt(0).toUpperCase() + level?.slice(1) || 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (_, course) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(course)}
            className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(course)}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all duration-200"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(course)}
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
      <AdminTable
        columns={columns}
        data={courses}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
        onSort={onSort}
        emptyMessage="No courses found"
      />

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-semibold text-white">Course Details</h2>
              <button onClick={() => setViewTarget(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{viewTarget.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{viewTarget.description || 'No description'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Provider</p>
                  <p className="font-medium text-white">{viewTarget.provider || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-white">{viewTarget.category || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-medium text-white">{viewTarget.duration || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Level</p>
                  <p className="font-medium text-white">{viewTarget.level || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="font-medium text-white">
                    {viewTarget.price ? `${viewTarget.currency || 'USD'} ${viewTarget.price}` : 'Free'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <p className="font-medium text-white">{viewTarget.rating || 'N/A'}</p>
                  </div>
                </div>
              </div>
              {viewTarget.url && (
                <a
                  href={viewTarget.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" /> Visit Course
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          onDelete(deleteTarget.id || deleteTarget._id)
          setDeleteTarget(null)
        }}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </>
  )
}

export default CourseManagementTable
