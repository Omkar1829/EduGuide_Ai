import api from "./api";

const quizService = {
  getQuizzes: (params) => api.get("/quizzes", { params }),
  createQuiz: (data) => api.post("/quizzes", data),
  generateAIQuiz: () => api.post("/quizzes/generate"),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  submitQuiz: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  getQuizResults: (id) => api.get(`/quizzes/${id}/results`),
  getUserResults: (params) => api.get("/quizzes/results", { params }),
};

export default quizService;
