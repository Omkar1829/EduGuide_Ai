import api from "./api";

const jobService = {
  getAllJobs: (params) => api.get("/jobs", { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (query) => api.get("/jobs/search", { params: { q: query } }),
  getJobsByCategory: (category) => api.get(`/jobs/category/${category}`),
  getJobsBySkills: (skills) => api.get("/jobs/skills", { params: { skills: skills.join(",") } }),
  getSavedJobs: (params) => api.get("/jobs/saved", { params }),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  updateJobStatus: (id, status) => api.put(`/jobs/${id}/status`, { status }),
  removeSavedJob: (id) => api.delete(`/jobs/${id}/save`),
};

export default jobService;
