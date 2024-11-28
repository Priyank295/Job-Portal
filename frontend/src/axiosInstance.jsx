import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://job-portal-backend-rhaq.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
