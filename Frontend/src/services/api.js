import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost : 8080/api",
});

// Request Interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,

  (error) => {
    // Auto logout on unauthorized token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;