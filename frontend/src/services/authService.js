import api from "./api";

const authService = {
  register: (data) => api.post("/auth/register", data),

  login: (data) => api.post("/auth/login", data),

  refreshToken: (refreshToken) =>
    api.post("/auth/refresh-token", { refreshToken }),

  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),

  getProfile: () => api.get("/auth/profile"),

  updatePassword: (data) => api.put("/auth/password", data),
};

export default authService;
