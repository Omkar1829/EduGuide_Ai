import api from "./api";

const aiDashboardService = {
  getCareerScore: () => api.get("/resumes").then((res) => {
    const resumes = res?.data?.resumes || res?.data;
    return resumes;
  }),

  getRecommendedStreams: () => api.get("/recommendations", { params: { type: "STREAM" } }),

  getCareerRecommendations: () =>
    api.get("/recommendations", { params: { type: "CAREER" } }),

  getSkillGap: () => api.get("/profile/profile/completion"),

  getRoadmaps: (params = {}) => api.get("/roadmaps", { params }),

  getRoadmapById: (id) => api.get(`/roadmaps/${id}`),

  createRoadmap: (data) => api.post("/roadmaps", data),

  updateRoadmap: (id, data) => api.put(`/roadmaps/${id}`, data),

  deleteRoadmap: (id) => api.delete(`/roadmaps/${id}`),

  getChatHistory: (sessionId, params = {}) =>
    api.get(`/chat/history/${sessionId}`, { params }),

  getChatSessions: () => api.get("/chat/sessions"),

  sendMessage: (data) => api.post("/chat/message", data),

  deleteChatSession: (sessionId) => api.delete(`/chat/sessions/${sessionId}`),

  getResumes: (params = {}) => api.get("/resumes", { params }),

  getResumeById: (id) => api.get(`/resumes/${id}`),

  createResume: (data) => api.post("/resumes", data),

  updateResume: (id, data) => api.put(`/resumes/${id}`, data),

  deleteResume: (id) => api.delete(`/resumes/${id}`),

  analyzeResume: (id) => api.post(`/resumes/${id}/analyze`),
};

export default aiDashboardService;
