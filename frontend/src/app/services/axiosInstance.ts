import { ACCESS_TOKEN } from "@shared/constants";
import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
  baseURL: __API_URL__,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = location.pathname.substring(1, 3) || "en";

  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
