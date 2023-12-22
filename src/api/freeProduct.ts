import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const freeProductApi = {
  createfreeProduct: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `freeProduct/create`;
    return axiosClientJWT.post(url, payload, config);
  },
  getProductByStatus: (payload: { status: string }) => {
    const url = apiConfig.baseUrl + `freeProduct/status`;
    return axiosClient.post(url, payload);
  },
  getProductsByEmail: (email:string) => {
    const url = apiConfig.baseUrl + `freeProduct/getFreeProductsByEmail/${email}`;
    return axiosClient.get(url);
  },
  getHideProductsByOwner: (userId:string) => {
    const url = apiConfig.baseUrl + `freeProduct/getHideProductsByOwner/${userId}`;
    return axiosClientJWT.get(url);
  },

  getFreeProducts: (limit?: Number) => {
    let url = apiConfig.baseUrl + `freeProduct/all`;
    if (limit) {
      url = apiConfig.baseUrl + `freeProduct/getFreeProducts/${limit}`;
    }
    return axiosClient.get(url);
  },
  getAllFreeProducts: (limit?: Number) => {
    let url = apiConfig.baseUrl + `freeProduct/all`;
    if (limit) {
      url = apiConfig.baseUrl + `freeProduct/all/${limit}`;
    }
    return axiosClient.get(url);
  },
  editFreeProduct: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `freeProduct/edit`;
    return axiosClientJWT.patch(url, payload, config);
  },
  signUpToReceive: (payload: any) => {
    const url =
      apiConfig.baseUrl + `freeProduct/signUpToReceive/${payload.idProduct}`;
    return axiosClientJWT.post(url, payload);
  },
  getProductById: (id: string | undefined) => {
    const url = apiConfig.baseUrl + `freeProduct/${id}`;
    return axiosClient.get(url);
  },
  getParticipationList: (payload: any) => {
    // chu ý
    const url =
      apiConfig.baseUrl +
      `freeProduct/getParticipationList/${payload.idProduct}`;
    return axiosClientJWT.get(url);
  },
  confirmSharingProduct: (payload: {
    idUser?: string;
    email?: string;
    idProduct: string;
    owner: string;
    type: string;
  }) => {
    const url = apiConfig.baseUrl + `freeProduct/confirmSharingProduct`;
    return axiosClientJWT.post(url, payload);
  },
};

export default freeProductApi;
