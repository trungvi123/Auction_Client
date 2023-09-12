import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const productApi = {
  getProductById: (id: string) => {
    const url = apiConfig.baseUrl + `product/${id}`;
    return axiosClient.get(url);
  },
  getProductByStatus: (payload: { status: string }) => {
    const url = apiConfig.baseUrl + `product/status`;
    return axiosClient.post(url, payload);
  },
  getCurrentPriceById: (id: string) => {
    const url = apiConfig.baseUrl + `product/price/${id}`;
    return axiosClient.get(url);
  },
  getQuatityProduct: () => {
    const url = apiConfig.baseUrl + `product/quatityProduct`;
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
  createProducts: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `product/create`;
    return axiosClientJWT.post(url, payload, config);
  },
  editProducts: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `product/edit`;
    return axiosClientJWT.patch(url, payload, config);
  },
  updateAuctionStarted: (id: string) => {
    const url = apiConfig.baseUrl + `product/edit/auctionStarted/${id}`;
    return axiosClientJWT.get(url);
  },
  updateAuctionEnded: (payload: any) => {
    const url = apiConfig.baseUrl + `product/edit/auctionEnded/${payload.id}`;
    return axiosClientJWT.post(url, payload);
  },
  approveProduct: (payload: any) => {
    const url = apiConfig.baseUrl + `product/edit/approveProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
  refuseProduct: (payload: any) => {
    const url = apiConfig.baseUrl + `product/edit/refuseProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
  approveAgainProduct: (payload: any) => {
    const url =
      apiConfig.baseUrl + `product/edit/approveAgainProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
};
export default productApi;
