import { useState, useEffect } from 'react'
import { Briefcase, Building2, MapPin, Link as LinkIcon, DollarSign, TrendingUp, Code } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'

const JOB_CATEGORIES = [
  'Technology',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Healthcare',
  'Education',
  'Legal',
  'Operations',
  'Customer Service',
  'Other',
]

const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'freelance',
]

const JobFormModal = ({ isOpen, onClose, onSave, job, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    url: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    skills: '',
    category: 'Technology',
    type: 'full-time',
  })

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        company: job.company || '',
        location: job.location || '',
        url: job.url || '',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        experience: job.experience || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        category: job.category || 'Technology',
        type: job.type || 'full-time',
      })
    } else {
      setFormData({
        title: '', description: '', company: '', location: '', url: '',
        salaryMin: '', salaryMax: '', experience: '', skills: '',
        category: 'Technology', type: 'full-time',
      })
    }
  }, [job, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? 'Edit Job' : 'Add Job'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior Software Engineer"
          required
          icon={<Briefcase className="w-4 h-4" />}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Job description..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 min-h-[80px] resize-none transition-all duration-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Google, Microsoft"
            required
            icon={<Building2 className="w-4 h-4" />}
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA or Remote"
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
        <Input
          label="Job URL"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://..."
          icon={<LinkIcon className="w-4 h-4" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Salary Min"
            name="salaryMin"
            type="number"
            min="0"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="e.g. 50000"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Salary Max"
            name="salaryMax"
            type="number"
            min="0"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="e.g. 120000"
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Experience Required"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 3-5 years"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
          >
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Input
          label="Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, Python (comma-separated)"
          icon={<Code className="w-4 h-4" />}
          helperText="Separate skills with commas"
        />
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {job ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default JobFormModal
