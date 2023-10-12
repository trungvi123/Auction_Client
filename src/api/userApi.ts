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
  getAllUser: () => {
    const url = apiConfig.baseUrl + `user/all`;
    return axiosClient.get(url);
  },
  createReport: (payload: {
    type: string[];
    accuserId: string;
    accusedId: string;
    productId: string;
  }) => {
    const url = apiConfig.baseUrl + `user/createReport`;
    return axiosClientJWT.post(url, payload);
  },
  getReports: () => {
    const url = apiConfig.baseUrl + `user/reports`;
    return axiosClientJWT.get(url);
  },
  handleFinishTransaction: (payload: { id: string }) => {
    const url =
      apiConfig.baseUrl + `user/handleFinishTransaction/${payload.id}`;
    return axiosClientJWT.post(url, payload);
  },
  approveReport: (id: string) => {
    const url = apiConfig.baseUrl + `user/approveReport/${id}`;
    return axiosClientJWT.patch(url);
  },
  deleteReport: (id: string) => {
    const url = apiConfig.baseUrl + `user/deleteReport/${id}`;
    return axiosClientJWT.delete(url);
  },
  updateBlockUserById: (id: string) => {
    const url = apiConfig.baseUrl + `user/updateBlockUserById/${id}`;
    return axiosClientJWT.post(url);
  },
  updateWarnUserById: (id: string) => {
    const url = apiConfig.baseUrl + `user/updateWarnUserById/${id}`;
    return axiosClientJWT.post(url);
  },
  refreshToken: () => {
    const url = apiConfig.baseUrl + "token/refresh";
    return axiosClient.post(url, {});
  },
  getPurchasedProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/purchasedProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getReceivedProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/receivedProducts/${id}`;
    return axiosClientJWT.get(url);
  },
  getParticipateProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/getParticipateReceiving/${id}`;
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
  getRefuseFreeProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/refuseFreeProducts/${id}`;
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
  getFreeProductsByOwner: (id: string) => {
    const url = apiConfig.baseUrl + `user/owner/freeProduct/${id}`;
    return axiosClientJWT.get(url);
  },
  sendMailToUser: (payload: any) => {
    const url = apiConfig.baseUrl + `user/sendMailToUser/`;
    return axiosClientJWT.post(url, payload);
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
