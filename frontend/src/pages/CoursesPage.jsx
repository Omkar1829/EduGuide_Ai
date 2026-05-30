import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { Search, Star, Clock, Users, BookOpen, Filter, Sparkles } from 'lucide-react'
import { fetchCourses } from '../store/slices/courseSlice'

const CoursesPage = () => {
  const dispatch = useDispatch()
  const navigateTo = (id) => `/courses/${id}`
  
  const { courses: backendCourses = [], loading } = useSelector((state) => state.courses || {})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['All', 'Technology', 'Business', 'Design', 'Science']

  useEffect(() => {
    dispatch(fetchCourses({ limit: 100 }))
  }, [dispatch])

  // Simple client-side filtering for search responsiveness
  const filteredCourses = backendCourses.filter(
    (course) =>
      (selectedCategory === 'all' || course.category?.toLowerCase() === selectedCategory.toLowerCase()) &&
      (course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       course.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-8 animate-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Courses
          </h1>
          <p className="text-gray-400">Discover courses tailored to your AI-guided career roadmap.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span><strong className="text-white">{filteredCourses.length}</strong> courses found</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search courses by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-gray-500 mr-1">
            <Filter className="w-4 h-4" />
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.toLowerCase()
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading && backendCourses.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" className="text-primary-500" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link 
              key={course.id} 
              to={navigateTo(course.id)} 
              className="group block h-full transform hover:scale-[1.01] transition-transform duration-300"
            >
              <Card hover className="h-full flex flex-col justify-between p-0 overflow-hidden border border-white/10 bg-white/5 shadow-glass backdrop-blur-lg">
                {/* Course Image */}
                <div className="aspect-video w-full overflow-hidden bg-gray-800/50 relative group border-b border-white/5">
                  <img
                    src={`https://picsum.photos/seed/${course.title}/400/200`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-gray-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-500/15 text-primary-400 border border-primary-500/20">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-amber-400">{course.rating ? course.rating.toFixed(1) : '4.5'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-primary-300 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    {/* Short Description */}
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {course.description || "Unlock key industry skills with this curated syllabus."}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-white/5 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4.5 h-4.5 text-gray-500" />
                      {course.duration || '8 weeks'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4.5 h-4.5 text-gray-500" />
                      {(course.enrolledCount || 150).toLocaleString()} students
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center glass border border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No courses found</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            Try adjusting your search query or filters to discover available courses.
          </p>
          <Button
            variant="ghost"
            className="mt-4 border border-white/15 bg-white/5 text-white"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
