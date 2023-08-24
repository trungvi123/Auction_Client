import axiosClient from "./axiosClient";
import apiConfig from "./axiosConfig";


const productApi = {
  getProductById: (id: string) => {
    const url = apiConfig.baseUrl + `product/${id}`;
    return axiosClient.get(url);
  },
  deleteProductById: (payload:any) => {
    const url = apiConfig.baseUrl + `product/delete/${payload.idProd}`;
    return axiosClient.post(url,payload);
  },
  getProducts: (quantity:Number = 5) => {
    const url = apiConfig.baseUrl + `product/all/${quantity}`;
    return axiosClient.get(url);
  },
  getProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `product/owner/${id}`;
    return axiosClient.get(url);
  },
  createProducts: (payload:any,config:any) => {
    const url = apiConfig.baseUrl + `product/create`;
    return axiosClient.post(url,payload,config);
  },
  editProducts: (payload:any,config:any) => {
    const url = apiConfig.baseUrl + `product/edit`;
    return axiosClient.patch(url,payload,config);
  },
};

export default productApi;
