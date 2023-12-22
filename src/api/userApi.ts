import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

export interface ISignUpPayload {
  birthday: String;
  firstName: String;
  lastName: String;
  email: String;
  emailPaypal: String;
  phoneNumber: String;
  password: String;
  idCard: String;
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
  OTP: string;
}

export interface IConfirmResetPass {
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
  getNumberOfIntro: () => {
    const url = apiConfig.baseUrl + "user/getNumberOfIntro";
    return axiosClient.get(url);
  },
  resetPass: (payload: IResetPass) => {
    const url = apiConfig.baseUrl + "user/resetPass";
    return axiosClientJWT.post(url, payload);
  },
  confirmResetPass: (payload: IConfirmResetPass) => {
    const url = apiConfig.baseUrl + "user/confirmResetPass";
    return axiosClientJWT.post(url, payload);
  },
  chat: (payload: { message: string }) => {
    const url = "http://127.0.0.1:5001/api/chatbot";
    return axiosClient.post(url, payload);
  },
  contact: (payload: any) => {
    const url = apiConfig.baseUrl + "user/contact";
    return axiosClient.post(url, payload);
  },
  changePass: (payload: IChangePassPayload) => {
    const url = apiConfig.baseUrl + "user/changePass";
    return axiosClientJWT.post(url, payload);
  },
  getUser: (id: string) => {
    const url = apiConfig.baseUrl + `user/${id}`;
    return axiosClientJWT.get(url);
  },
  getUserByEmail: (email: string) => {
    const url = apiConfig.baseUrl + `user/getUserByEmail/${email}`;
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
  createRate: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `user/createRate`;
    return axiosClientJWT.post(url, payload, config);
  },
  addFollow: (payload: { followEmail: string; myId: string }) => {
    const url = apiConfig.baseUrl + `user/addFollow`;
    return axiosClientJWT.post(url, payload);
  },
  createOTP: () => {
    const url = apiConfig.baseUrl + `user/createOTP`;
    return axiosClientJWT.post(url);
  },
  verifyAccount: (payload: { OTP: string }) => {
    const url = apiConfig.baseUrl + `user/verifyAccount`;
    return axiosClientJWT.post(url, payload);
  },
  addFollowProduct: (payload: {
    productId: string;
    time: string;
    type: string;
  }) => {
    const url = apiConfig.baseUrl + `user/addFollowProduct`;
    return axiosClientJWT.post(url, payload);
  },
  unFollowProduct: (payload: { productId: string }) => {
    const url = apiConfig.baseUrl + `user/unFollowProduct`;
    return axiosClientJWT.post(url, payload);
  },
  unFollow: (payload: { followEmail: string; myId: string }) => {
    const url = apiConfig.baseUrl + `user/unFollow`;
    return axiosClientJWT.post(url, payload);
  },
  replyComment: (payload: any) => {
    const url = apiConfig.baseUrl + `user/replyComment/${payload.rateId}`;
    return axiosClientJWT.post(url, payload);
  },
  handleFinishTransaction: (payload: { id: string; userId: string }) => {
    const url =
      apiConfig.baseUrl + `user/handleFinishTransaction/${payload.id}`;
    return axiosClientJWT.post(url, payload);
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
  getNotifications: (userId: string) => {
    const url = apiConfig.baseUrl + `user/notifications/${userId}`;
    return axiosClientJWT.get(url);
  },

  updateNotifications: (userId: string) => {
    const url = apiConfig.baseUrl + `user/updateNotifications/${userId}`;
    return axiosClientJWT.patch(url);
  },
  updateProfile: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `user/updateProfile/`;
    return axiosClientJWT.patch(url, payload, config);
  },
  deleteNotification: (payload: { id: string; userId: string }) => {
    const url = apiConfig.baseUrl + `user/deleteNotification/${payload.id}`;
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
  getAllUser: () => {
    const url = apiConfig.baseUrl + `admin/getAllUser`;
    return axiosClientJWT.get(url);
  },
  approveReport: (id: string) => {
    const url = apiConfig.baseUrl + `admin/approveReport/${id}`;
    return axiosClientJWT.patch(url);
  },
  deleteReport: (id: string) => {
    const url = apiConfig.baseUrl + `admin/deleteReport/${id}`;
    return axiosClientJWT.delete(url);
  },
  deleteStatistic: (year: string) => {
    const url = apiConfig.baseUrl + `admin/deleteStatistic/${year}`;
    return axiosClientJWT.delete(url);
  },
  deleteTemplate: (id: string) => {
    const url = apiConfig.baseUrl + `admin/deleteTemplate/${id}`;
    return axiosClientJWT.delete(url);
  },
  getProfitByYear:(id: string)=>{
    const url = apiConfig.baseUrl + `admin/getProfitByYear/${id}`;
    return axiosClientJWT.get(url);
  },
  getReports: () => {
    const url = apiConfig.baseUrl + `admin/reports`;
    return axiosClientJWT.get(url);
  },
  getTemplateActive: () => {
    const url = apiConfig.baseUrl + `user/getTemplateActive`;
    return axiosClient.get(url);
  },
  getAllStatistic: () => {
    const url = apiConfig.baseUrl + `admin/getAllStatistic`;
    return axiosClientJWT.get(url);
  },
  getStatisticByYear: (year: string) => {
    const url = apiConfig.baseUrl + `admin/getStatisticByYear/${year}`;
    return axiosClientJWT.get(url);
  },
  updateBlockUserById: (payload: { id: string; type: string }) => {
    const url = apiConfig.baseUrl + `admin/updateBlockUserById/${payload.id}`;
    return axiosClientJWT.post(url, payload);
  },
  createStatistic: (payload: { year: string }) => {
    const url = apiConfig.baseUrl + `admin/createStatistic`;
    return axiosClientJWT.post(url, payload);
  },
  sendMailToUser: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/sendMailToUser/`;
    return axiosClientJWT.post(url, payload);
  },
  createTemplate: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/createTemplate/`;
    return axiosClientJWT.post(url, payload);
  },
  updateTemplate: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/updateTemplate`;
    return axiosClientJWT.post(url, payload);
  },
  updateImgTemplate: (payload: any, config: any) => {
    const url = apiConfig.baseUrl + `admin/updateImgTemplate`;
    return axiosClientJWT.post(url, payload, config);
  },
  getTemplates: () => {
    const url = apiConfig.baseUrl + `admin/getTemplates`;
    return axiosClientJWT.get(url);
  },
  activeTemplate: (id: string) => {
    const url = apiConfig.baseUrl + `admin/activeTemplate/${id}`;
    return axiosClientJWT.patch(url);
  },
  handleExport: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/handleExport`;
    return axiosClientJWT.post(url, payload);
  },
  handleExport2: () => {
    const url = apiConfig.baseUrl + `admin/handleExport2`;
    return axiosClientJWT.get(url);
  },
  getNewContact: () => {
    const url = apiConfig.baseUrl + `admin/getNewContact`;
    return axiosClientJWT.get(url);
  },
  getContactReply: () => {
    const url = apiConfig.baseUrl + `admin/getContactReply`;
    return axiosClientJWT.get(url);
  },
  deleteUserById: (userId:string) => {
    const url = apiConfig.baseUrl + `admin/deleteUser/${userId}`;
    return axiosClientJWT.delete(url);
  },
  replyContact: (payload: any) => {
    const url = apiConfig.baseUrl + `admin/replyContact/${payload.id}`;
    return axiosClientJWT.post(url, payload);
  },
  payouts: (payload: {
    productId: string;
    emailPaypal: string;
    value: string;
  }) => {
    const url = apiConfig.baseUrl + `admin/payouts/`;
    return axiosClientJWT.post(url, payload);
  },
};

export default userApi;
