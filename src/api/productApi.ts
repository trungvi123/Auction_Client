import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const productApi = {
  getProductById: (id: string) => {
    const url = apiConfig.baseUrl + `product/${id}`;
    return axiosClient.get(url);
  },
  getCurrentPriceById: (id: string) => {
    const url = apiConfig.baseUrl + `product/price/${id}`;
    return axiosClient.get(url);
  },
  getProducts: (quantity: Number = 5) => {
    const url = apiConfig.baseUrl + `product/all/${quantity}`;
    return axiosClient.get(url);
  },
  getBidsById: (id: string) => {
    const url = apiConfig.baseUrl + `product/bids/${id}`;
    return axiosClient.get(url);
  },
  deleteProductById: (payload: any) => {
    const url = apiConfig.baseUrl + `product/delete/${payload.idProd}`;
    return axiosClientJWT.post(url, payload);
  },
  getProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `product/owner/${id}`;
    return axiosClientJWT.get(url);
  },
  createProducts: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `product/create`;
    return axiosClientJWT.post(url, payload, config);
  },
  editProducts: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `product/edit`;
    return axiosClientJWT.patch(url, payload, config);
  },
};

export default productApi;
