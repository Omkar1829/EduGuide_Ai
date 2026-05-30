import api from "./api";

const courseService = {
  getAllCourses: (params) => api.get("/courses", { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  searchCourses: (query) => api.get("/courses/search", { params: { q: query } }),
  getCoursesByCategory: (category) => api.get(`/courses/category/${category}`),
  getEnrolledCourses: (params) => api.get("/courses/enrolled", { params }),
  enrollInCourse: (id) => api.post(`/courses/${id}/enroll`),
  updateCourseProgress: (id, progress) => api.put(`/courses/${id}/progress`, { progress }),
  unenrollFromCourse: (id) => api.delete(`/courses/${id}/unenroll`),
};

export default courseService;
