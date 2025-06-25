import axios from "axios";

const api = axios.create({
  // baseURL: "http://103.200.20.149/:8080/api/",
  baseURL: "http://14.225.205.143:8080/api/",
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;