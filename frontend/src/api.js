import axios from "axios";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) =>
    api.post("/auth/login", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),
  getMe: () => api.get("/auth/me"),
};

export const jobsAPI = {
  getAll: () => api.get("/jobs"),
  create: (data) => api.post("/jobs", data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};
export const aiAPI = {
  analyzeMatch: (jobDescription, resumeText) => 
    api.post('/analyze-match', { jobDescription, resumeText }),
  parseResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/parse-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
