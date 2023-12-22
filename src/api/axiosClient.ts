import queryString from "query-string";
import axios from "axios";
import apiConfig from "./axiosConfig";
import toast from "react-hot-toast";
import userApi from "./userApi";

const axiosClient = axios.create({
  // withCredentials: true,
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
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
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.msg
            ? error.response.data?.msg
            : "Có lỗi xảy ra!!"
        );
        return null;
      }
    }
    if (error.response && error.response.status === 422) {
      toast.error("Vui lòng nhập đúng định dạng dữ liệu!!!");
    }
    if (error.response && error.response.status === 500) {
      toast.error("Lỗi hệ thống!!!");
    }
    if (error.response?.status === 429) {
      toast.error(
        error.response?.data?.msg
          ? error.response.data?.msg
          : "Yêu cầu quá nhiều lần, vui lòng thử lại sau!"
      );
      return null;
    }
  }
);

const axiosClientJWT = axios.create({
  withCredentials: true,
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClientJWT.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers["authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClientJWT.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse: any = await userApi.refreshToken();

        if (refreshResponse.status === "failure") {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          window.location.replace("/");
          localStorage.removeItem("token");
          localStorage.removeItem("reduxState");
        }
        const newAccessToken = refreshResponse?.accessToken;
        localStorage.setItem("token", newAccessToken);

        originalRequest.headers["authorization"] = `Bearer ${newAccessToken}`;
        return axiosClientJWT(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 400) {
      toast.error(
        error.response?.data?.msg ? error.response.data?.msg : "Có lỗi xảy ra!!"
      );
      return null;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
export { axiosClientJWT };
