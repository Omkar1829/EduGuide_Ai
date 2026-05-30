import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import CourseManagementTable from '../../components/admin/CourseManagementTable'
import CourseFormModal from '../../components/admin/CourseFormModal'
import Button from '../../components/common/Button'
import adminService from '../../services/adminService'

const COURSE_CATEGORIES = [
  'Web Development', 'Data Science', 'Machine Learning', 'Mobile Development',
  'Cloud Computing', 'Cybersecurity', 'DevOps', 'AI & Deep Learning',
  'Blockchain', 'UI/UX Design', 'Business', 'Other',
]

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchCourses = useCallback(async (page = 1, searchVal, category) => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (searchVal !== undefined ? searchVal : search) params.search = searchVal !== undefined ? searchVal : search
      if (category !== undefined ? category : categoryFilter) params.category = category !== undefined ? category : categoryFilter

      const res = await adminService.getCourses(params)
      const data = res.data?.data || res.data
      setCourses(data?.courses || data?.data || [])
      setPagination((prev) => ({
        ...prev,
        page: data?.page || page,
        total: data?.total || 0,
        totalPages: data?.totalPages || 0,
      }))
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter])

  useEffect(() => {
    fetchCourses(1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    const timeout = setTimeout(() => fetchCourses(1, val), 400)
    return () => clearTimeout(timeout)
  }

  const handleCategoryFilter = (e) => {
    const val = e.target.value
    setCategoryFilter(val)
    fetchCourses(1, undefined, val)
  }

  const handlePageChange = (page) => {
    fetchCourses(page)
  }

  const handleSort = (key, direction) => {
    const sorted = [...courses].sort((a, b) => {
      if (!a[key]) return 1
      if (!b[key]) return -1
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setCourses(sorted)
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCourse(id)
      fetchCourses(pagination.page)
    } catch (err) {
      console.error('Failed to delete course:', err)
    }
  }

  const handleSave = async (data, id) => {
    try {
      setFormLoading(true)
      if (id) {
        await adminService.updateCourse(id, data)
      } else {
        await adminService.createCourse(data)
      }
      setShowAddModal(false)
      setEditTarget(null)
      fetchCourses(pagination.page)
    } catch (err) {
      console.error('Failed to save course:', err)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Course</span> Management
          </h1>
          <p className="text-gray-400">Manage courses and learning resources.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses by title or provider..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-full sm:w-48 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {COURSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
        <CourseManagementTable
          courses={courses}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onEdit={(course) => setEditTarget(course)}
          onDelete={handleDelete}
        />
      </div>

      <CourseFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(data) => handleSave(data)}
        loading={formLoading}
      />

      <CourseFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(data) => handleSave(data, editTarget?.id || editTarget?._id)}
        course={editTarget}
        loading={formLoading}
      />
    </div>
  )
}

export default AdminCoursesPage
