import api from "./api";

const profileService = {
  getProfile: () => api.get("/profile/profile"),

  updateProfile: (data) => api.put("/profile/profile", data),

  addAcademicRecord: (data) => api.post("/profile/profile/academic-records", data),

  updateAcademicRecord: (recordId, data) =>
    api.put(`/profile/profile/academic-records/${recordId}`, data),

  deleteAcademicRecord: (recordId) =>
    api.delete(`/profile/profile/academic-records/${recordId}`),

  addSubjectMark: (recordId, data) =>
    api.post(`/profile/profile/academic-records/${recordId}/marks`, data),

  deleteSubjectMark: (markId) =>
    api.delete(`/profile/profile/marks/${markId}`),

  getInterests: () => api.get("/profile/profile/interests"),

  addInterest: (data) => api.post("/profile/profile/interests", data),

  removeInterest: (interestId) =>
    api.delete(`/profile/profile/interests/${interestId}`),

  getCareerGoals: () => api.get("/profile/profile/career-goals"),

  addCareerGoal: (data) => api.post("/profile/profile/career-goals", data),

  updateCareerGoal: (goalId, data) =>
    api.put(`/profile/profile/career-goals/${goalId}`, data),

  removeCareerGoal: (goalId) =>
    api.delete(`/profile/profile/career-goals/${goalId}`),

  getStrengths: () => api.get("/profile/profile/strengths"),

  addStrength: (data) => api.post("/profile/profile/strengths", data),

  removeStrength: (strengthId) =>
    api.delete(`/profile/profile/strengths/${strengthId}`),

  getWeaknesses: () => api.get("/profile/profile/weaknesses"),

  addWeakness: (data) => api.post("/profile/profile/weaknesses", data),

  removeWeakness: (weaknessId) =>
    api.delete(`/profile/profile/weaknesses/${weaknessId}`),

  getSkills: () => api.get("/profile/profile/skills"),

  addSkill: (data) => api.post("/profile/profile/skills", data),

  removeSkill: (skillId) => api.delete(`/profile/profile/skills/${skillId}`),

  searchSkills: (query) => api.get(`/profile/skills/search?q=${encodeURIComponent(query)}`),

  getCertifications: () => api.get("/profile/profile/certifications"),

  addCertification: (data) => api.post("/profile/profile/certifications", data),

  updateCertification: (certId, data) =>
    api.put(`/profile/profile/certifications/${certId}`, data),

  removeCertification: (certId) =>
    api.delete(`/profile/profile/certifications/${certId}`),

  getProfileCompletion: () => api.get("/profile/profile/completion"),
};

export default profileService;
