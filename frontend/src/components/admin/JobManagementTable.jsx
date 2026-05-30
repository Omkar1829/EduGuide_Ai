import { useState } from 'react'
import { Eye, Pencil, Trash2, MapPin, ExternalLink, X } from 'lucide-react'
import AdminTable from './AdminTable'
import DeleteConfirmModal from './DeleteConfirmModal'

const JobManagementTable = ({ jobs, loading, pagination, onPageChange, onSort, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)

  const columns = [
    {
      key: 'title',
      label: 'Job',
      sortable: true,
      render: (_, job) => (
        <div className="max-w-xs">
          <p className="font-medium text-white truncate">{job.title}</p>
          <p className="text-xs text-gray-500 truncate">{job.company}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (location) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="truncate">{location || 'Remote'}</span>
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
      key: 'type',
      label: 'Type',
      render: (type) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
          type === 'full-time' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
          type === 'part-time' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
          type === 'contract' ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' :
          'bg-sky-500/15 text-sky-400 border-sky-500/20'
        }`}>
          {type?.charAt(0).toUpperCase() + type?.slice(1).replace('-', ' ') || 'N/A'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Posted',
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-400">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (_, job) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(job)}
            className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(job)}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all duration-200"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(job)}
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
        data={jobs}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
        onSort={onSort}
        emptyMessage="No jobs found"
      />

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-semibold text-white">Job Details</h2>
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
                  <p className="text-xs text-gray-500 mb-1">Company</p>
                  <p className="font-medium text-white">{viewTarget.company || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-white">{viewTarget.location || 'Remote'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-medium text-white">
                    {viewTarget.type?.charAt(0).toUpperCase() + viewTarget.type?.slice(1).replace('-', ' ') || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="font-medium text-white">{viewTarget.experience || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Salary</p>
                  <p className="font-medium text-white">
                    {viewTarget.salaryMin && viewTarget.salaryMax
                      ? `$${viewTarget.salaryMin.toLocaleString()} - $${viewTarget.salaryMax.toLocaleString()}`
                      : viewTarget.salaryMin
                      ? `From $${viewTarget.salaryMin.toLocaleString()}`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-white">{viewTarget.category || 'N/A'}</p>
                </div>
              </div>
              {viewTarget.skills && viewTarget.skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(viewTarget.skills) ? viewTarget.skills : viewTarget.skills.split(',')).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewTarget.url && (
                <a
                  href={viewTarget.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" /> View Job Posting
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
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </>
  )
}

export default JobManagementTable
