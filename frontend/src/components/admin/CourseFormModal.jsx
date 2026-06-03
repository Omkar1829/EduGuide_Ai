import { useState, useEffect } from 'react'
import { GraduationCap, Building2, Link as LinkIcon, Clock, DollarSign } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'

const COURSE_CATEGORIES = [
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'AI & Deep Learning',
  'Blockchain',
  'UI/UX Design',
  'Business',
  'Other',
]

const CourseFormModal = ({ isOpen, onClose, onSave, course, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    provider: '',
    url: '',
    duration: '',
    level: 'beginner',
    category: 'Web Development',
    price: '0',
    currency: 'USD',
  })

  const selectClass = "w-full py-3.5 px-4 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20 transition-all duration-200 text-sm cursor-pointer"

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        provider: course.provider || '',
        url: course.url || '',
        duration: course.duration || '',
        level: course.level || 'beginner',
        category: course.category || 'Web Development',
        price: course.price?.toString() || '0',
        currency: course.currency || 'USD',
      })
    } else {
      setFormData({
        title: '', description: '', provider: '', url: '',
        duration: '', level: 'beginner', category: 'Web Development',
        price: '0', currency: 'USD',
      })
    }
  }, [course, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: parseFloat(formData.price) || 0,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? 'Edit Course' : 'Add Course'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Course Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Complete Web Development Bootcamp"
          required
          icon={<GraduationCap className="w-4 h-4" />}
        />
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of the course..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 min-h-[80px] resize-none transition-all duration-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            placeholder="e.g. Coursera, Udemy"
            icon={<Building2 className="w-4 h-4" />}
          />
          <Input
            label="Course URL"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://..."
            icon={<LinkIcon className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 8 weeks"
            icon={<Clock className="w-4 h-4" />}
          />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={selectClass}
            >
              <option className="bg-gray-950 text-white" value="beginner">Beginner</option>
              <option className="bg-gray-950 text-white" value="intermediate">Intermediate</option>
              <option className="bg-gray-950 text-white" value="advanced">Advanced</option>
              <option className="bg-gray-950 text-white" value="all-levels">All Levels</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={selectClass}
            >
              {COURSE_CATEGORIES.map((cat) => (
                <option className="bg-gray-950 text-white" key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            icon={<DollarSign className="w-4 h-4" />}
          />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={selectClass}
            >
              <option className="bg-gray-950 text-white" value="USD">USD</option>
              <option className="bg-gray-950 text-white" value="EUR">EUR</option>
              <option className="bg-gray-950 text-white" value="GBP">GBP</option>
              <option className="bg-gray-950 text-white" value="INR">INR</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
          <Button variant="secondary" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CourseFormModal
