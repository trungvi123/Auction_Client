import queryString from "query-string";
import axios from "axios";

import apiConfig from "./axiosConfig";
import toast from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
});

const axiosClientJWT = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
});

const token = localStorage.getItem("token");
axiosClientJWT.interceptors.request.use(async (config) => {
  config.headers.authorization = "Beaer " + JSON.parse(token ? token : "");
  return config;
});

axiosClient.interceptors.request.use(async (config) => config);
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 400) {
      // Xử lý lỗi ở đây mà không cần thông báo đỏ lên màn hình
      toast.error(error.response.data.errors?.msg);
    }
    if (error.response && error.response.status === 422) {
      toast.error("Vui lòng nhập đúng định dạng dữ liệu!!!");
    }
    if (error.response && error.response.status === 500) {
      toast.error("Lỗi hệ thống!!!");
    }
  }
);

axiosClientJWT.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 400) {
      // Xử lý lỗi ở đây mà không cần thông báo đỏ lên màn hình
      toast.error(error.response.data.errors?.msg);
    }
    if (error.response && error.response.status === 422) {
      toast.error("Vui lòng nhập đúng định dạng dữ liệu!!!");
    }
    if (error.response && error.response.status === 500) {
      toast.error("Lỗi hệ thống!!!");
    }
  }
);

export default axiosClient;
export { axiosClientJWT };
