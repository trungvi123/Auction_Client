import axiosClient, { axiosClientJWT } from "./axiosClient";
import apiConfig from "./axiosConfig";

const roomApi = {
  getRoomByIdProd: (id: string) => {
    const url = apiConfig.baseUrl + `room/${id}`;
    return axiosClient.get(url);
  },
  joinRoom: (payload: { idProd: string; idUser: string; idRoom: any }) => {
    const url = apiConfig.baseUrl + `room/join`;
    return axiosClientJWT.post(url, payload);
  },
};

export default roomApi;
