import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const newsApi = {
  create: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `news/`;
    return axiosClientJWT.post(url, payload, config);
  },
  edit: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `news/editNews`;
    return axiosClientJWT.post(url, payload, config);
  },
  getAllNews: () => {
    const url = apiConfig.baseUrl + `news/getNews`;
    return axiosClient.get(url);
  },
  getNewById: (id: string | undefined) => {
    if (id) {
      const url = apiConfig.baseUrl + `news/getNewsById/${id}`;
      return axiosClient.get(url);
    }
  },
  getMyNews: () => {
    const url = apiConfig.baseUrl + `news/getMyNews`;
    return axiosClientJWT.get(url);
  },
  getHideNews: () => {
    const url = apiConfig.baseUrl + `news/getHideNews`;
    return axiosClientJWT.get(url);
  },
  getRefuseNews: () => {
    const url = apiConfig.baseUrl + `news/getRefuseNews`;
    return axiosClientJWT.get(url);
  },
  hideNews: (id: string) => {
    const url = apiConfig.baseUrl + `news/hideNews`;
    return axiosClientJWT.post(url, { id });
  },
  reApprove: (id: string) => {
    const url = apiConfig.baseUrl + `news/reApprove`;
    return axiosClientJWT.post(url, { id });
  },
  showNews: (id: string) => {
    const url = apiConfig.baseUrl + `news/showNews`;
    return axiosClientJWT.post(url, { id });
  },
  handleApproveNews: (payload: { id: string; type: string }) => {
    const url = apiConfig.baseUrl + `admin/handleApproveNews`;
    return axiosClientJWT.post(url, payload);
  },
  getReApproveNews: () => {
    const url = apiConfig.baseUrl + `admin/getReApproveNews`;
    return axiosClientJWT.get(url);
  },
  getNewsByStatus_admin: (type: string) => {
    const url = apiConfig.baseUrl + `admin/getNewsByStatus_admin/${type}`;
    return axiosClientJWT.get(url);
  },
  deleteNews: (id: string) => {
    const url = apiConfig.baseUrl + `admin/deleteNews/${id}`;
    return axiosClientJWT.delete(url);
  },
};

export default newsApi;
