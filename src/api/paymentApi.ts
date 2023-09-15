import axiosClient from "./axiosClient";
import apiConfig from "./axiosConfig";

interface IPaypalOrder {
  price: string;
}

interface IPaypalCapture {
  orderID: string;
}

const paymentApi = {
  createOrderPayPal: (payload: IPaypalOrder) => {
    const url = apiConfig.baseUrl + `payment/paypal/orders`;
    return axiosClient.post(url, payload);
  },
  captureOrderPayPal: (payload: IPaypalCapture) => {
    const url =
      apiConfig.baseUrl + `payment/paypal/orders/${payload.orderID}/capture`;
    return axiosClient.post(url, payload);
  },
};

export default paymentApi;
