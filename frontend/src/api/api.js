import axios from "axios";

const API = axios.create({
  baseURL: "https://project-management-dashboard-6job.onrender.com/api",
  withCredentials: true,
});

export default API;