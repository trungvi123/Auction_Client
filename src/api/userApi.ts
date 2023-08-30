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
};

export default userApi;
