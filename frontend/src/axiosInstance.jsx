import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://job-portal-backend-rhaq.onrender.com/api",

  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
