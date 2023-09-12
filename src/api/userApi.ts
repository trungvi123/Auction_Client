import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

export interface ISignUpPayload {
  birthday: String;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: String;
  password: String;
  idCard: String;
  bankNumber: String;
  bankName: String;
  address: String;
}

export interface ISignInPayload {
  email: String;
  password: String;
}

export interface IChangePassPayload {
  email: String;
  password: String;
  newPassword: String;
}

export interface IResetPass {
  email: String;
}

const userApi = {
  signIn: (payload: ISignInPayload) => {
    const url = apiConfig.baseUrl + "user/signIn";
    return axiosClient.post(url, payload);
  },
  signUp: (payload: ISignUpPayload) => {
    const url = apiConfig.baseUrl + "user/signUp";
    return axiosClient.post(url, payload);
  },
  resetPass: (payload: IResetPass) => {
    const url = apiConfig.baseUrl + "user/resetPass";
    return axiosClientJWT.post(url, payload);
  },
  changePass: (payload: IChangePassPayload) => {
    const url = apiConfig.baseUrl + "user/changePass";
    return axiosClientJWT.post(url, payload);
  },
  getUser: (id: string) => {
    const url = apiConfig.baseUrl + `user/${id}`;
    return axiosClient.get(url);
  },
  refreshToken: () => {
    const url = apiConfig.baseUrl + "token/refresh";
    return axiosClient.post(url, {});
  },
  getPurchasedProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/purchasedProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getQuatityUser: () => {
    const url = apiConfig.baseUrl + `user/quatityUsers`;
    return axiosClient.get(url);
  },
  getWinProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/winProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getRefuseProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/refuseProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getBidsProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/bidsProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/owner/${id}`;
    return axiosClientJWT.get(url);
  },
  deleteProductHistory: (payload: {
    idOwner: string;
    type: string;
    idProd: string;
  }) => {
    const url =
      apiConfig.baseUrl + `user/deleteProductHistory/${payload.idOwner}`;
    return axiosClientJWT.post(url, payload);
  },
};

export default userApi;
