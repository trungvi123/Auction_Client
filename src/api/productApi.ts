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
  search: (payload: { keyword: string }) => {
    const url = apiConfig.baseUrl + `product/search`;
    return axiosClientJWT.post(url, payload);
  },
  getCurrentPriceById: (id: string) => {
    const url = apiConfig.baseUrl + `product/price/${id}`;
    return axiosClient.get(url);
  },
  getPrepareToStart: () => {
    const url = apiConfig.baseUrl + `product/prepareToStart`;
    return axiosClient.get(url);
  },
  getQuatityProduct: () => {
    const url = apiConfig.baseUrl + `product/quatityProduct`;
    return axiosClient.get(url);
  },
  getProducts: (page: Number = 1) => {
    const url = apiConfig.baseUrl + `product/page/${page}`;
    return axiosClient.get(url);
  },
  getAllProducts: () => {
    const url = apiConfig.baseUrl + `product/all/`;
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
  updateAuctionStarted: (id: string) => {
    const url = apiConfig.baseUrl + `product/edit/auctionStarted/${id}`;
    return axiosClientJWT.get(url);
  },
  updateAuctionEnded: (payload: any) => {
    const url = apiConfig.baseUrl + `product/edit/auctionEnded/${payload.id}`;
    return axiosClientJWT.post(url, payload);
  },

  updateShipping: (payload: { id: string }) => {
    const url = apiConfig.baseUrl + `product/edit/shipping/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
  editProducts: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `product/edit`;
    return axiosClientJWT.patch(url, payload, config);
  },
  refuseProduct: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/edit/refuseProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
  approveAgainProduct: (payload: any) => {
    const url =
      apiConfig.baseUrl + `admin/edit/approveAgainProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
  approveProduct: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/edit/approveProduct/${payload.id}`;
    return axiosClientJWT.patch(url, payload);
  },
};
export default productApi;
