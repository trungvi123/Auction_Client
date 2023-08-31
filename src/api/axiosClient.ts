import queryString from "query-string";
import axios from "axios";
import apiConfig from "./axiosConfig";
import toast from "react-hot-toast";
import userApi from "./userApi";

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify({ ...params }),
});

// const axiosClientJWT = axios.create({
//   baseURL: apiConfig.baseUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
//   paramsSerializer: (params) => queryString.stringify({ ...params }),
// });

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

// axiosClientJWT.interceptors.response.use(
//   (response) => {
//     if (response && response.data) {
//       return response.data;
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 400) {
//       // Xử lý lỗi ở đây mà không cần thông báo đỏ lên màn hình
//       toast.error(error.response.data.errors?.msg);
//     }
//     if (error.response && error.response.status === 422) {
//       toast.error("Vui lòng nhập đúng định dạng dữ liệu!!!");
//     }
//     if (error.response && error.response.status === 500) {
//       toast.error("Lỗi hệ thống!!!");
//     }
//   }
// );

// const accessTokenPromise = new Promise((resolve) => {
//   const accessToken = localStorage.getItem("token");
//   resolve(accessToken);
// });

// axiosClientJWT.interceptors.request.use(async (config) => {
//   try {
//     let date = new Date();

//     accessTokenPromise.then(async (accessToken:any) => {
//       // Tiếp tục thực hiện các câu lệnh sau khi có accessToken
//       if (accessToken) {
//         // Tiến hành sử dụng accessToken
//         config.headers.authorization = "Bearer " + accessToken;

//         var decodedToken: any = jwtDecode(accessToken);
//         if (decodedToken?.exp < date.getTime() / 1000) {
//           const data: any = await userApi.refreshToken();
//           localStorage.setItem(
//             "token",
//             JSON.stringify(data?.accessToken || "")
//           );
//           config.headers.authorization = "Bearer " + data?.accessToken;
//         }
//       } else {
//         console.log("Access Token not found.");
//         // Xử lý khi không có accessToken ở đây
//       }
//     });
//   } catch (error) {
//     console.log("Vui long dang nhap de co trai nghiem tot nhat");
//     console.log(error);
//   }

//   return config;
// });

const axiosClientJWT = axios.create({
  withCredentials: true,
  baseURL: apiConfig.baseUrl,
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
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!")
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
    return Promise.reject(error);
  }
);

export default axiosClient;
export { axiosClientJWT };
