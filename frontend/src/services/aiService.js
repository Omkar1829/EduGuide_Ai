import api from "./api";

const aiService = {
  getCareerRecommendation: () => api.post("/ai/career-recommendation", {}),

  getStreamRecommendation: () => api.post("/ai/stream-recommendation", {}),

  analyzeSkillGap: (targetCareer) =>
    api.post("/ai/skill-gap", { targetCareer }),

  generateRoadmap: (targetCareer) =>
    api.post("/ai/roadmap-generate", { targetCareer }),

  sendMessage: (message, sessionId, history = []) =>
    api.post("/ai/chat", { message, sessionId, history }),

  analyzeResume: (resumeContent) =>
    api.post("/ai/resume-analyze", { resumeContent }),

  simulateFuture: (paths, timeline) =>
    api.post("/ai/future-simulate", { paths, timeline }),

  analyzeQuiz: (quizId, resultId) =>
    api.post("/ai/quiz-analyze", { quizId, resultId }),

  recommendCourses: (filters = {}) =>
    api.post("/ai/course-recommend", { filters }),

  matchJobs: (filters = {}) => api.post("/ai/job-match", { filters }),
};

export default aiService;
