import api from './api'

const adminService = {
  getStats: () => api.get('/admin/stats'),
  getPlatformStats: () => api.get('/admin/stats'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getActivity: (params) => api.get('/admin/activity', { params }),
  getRecentActivity: (limit) => api.get('/admin/activity', { params: { limit } }),

  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),

  getCourses: (params) => api.get('/admin/courses', { params }),
  getCourseById: (id) => api.get(`/admin/courses/${id}`),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),

  getJobs: (params) => api.get('/admin/jobs', { params }),
  getJobById: (id) => api.get(`/admin/jobs/${id}`),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  scrapeJobs: (data) => api.post('/admin/jobs/scrape', data),
  getScrapeStatus: () => api.get('/admin/jobs/scrape/status'),
  stopScrapeJobs: () => api.post('/admin/jobs/scrape/stop'),
}

export default adminService

