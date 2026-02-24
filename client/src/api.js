import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

const token = localStorage.getItem("token");

if (token) {
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

export default api;
