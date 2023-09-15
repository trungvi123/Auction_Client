import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const freeProductApi = {
  createfreeProduct: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `freeProduct/create`;
    return axiosClientJWT.post(url, payload, config);
  },
};

export default freeProductApi;
