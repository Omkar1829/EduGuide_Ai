import api from "./api";

const recommendationService = {
  getRecommendations: (params = {}) =>
    api.get("/recommendations", { params }),

  getRecommendationById: (id) => api.get(`/recommendations/${id}`),

  createRecommendation: (data) => api.post("/recommendations", data),

  acceptRecommendation: (id) => api.put(`/recommendations/${id}/accept`),

  rejectRecommendation: (id) => api.put(`/recommendations/${id}/reject`),
};

export default recommendationService;
