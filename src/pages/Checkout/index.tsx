import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import paymentApi from "../../api/paymentApi";

const Checkout = () => {
  const CLIENT_ID =
    "ASQVRgiZX9e6DoA1pR1a-sXte8xdUWJqQeOc7QZKzNkGJM4MSia2CTiLuqxMOgehqeufbCwRwaQ40Gns";
  const productId = '650491dc027134e45c350a23'
  const createOrder = async () => {
    const payload = {
      price: "30.00",
    };
    const order: any = await paymentApi.createOrderPayPal(payload);
    if (order) {
      return order.id;
    }
    return null;

    // .then((order) => order.id);
  };

  const onApprove = async (data: any) => {
    // Order is captured on the server and the response is returned to the browser
    const payload = {
      orderID: data.orderID,
      productId : productId
    };
    const result:any = await paymentApi.captureOrderPayPal(payload);
    if(result?.status === 'COMPLETED'){
      toast.success('Đã thanh toán thành công!')
    }

  };
  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: CLIENT_ID,
        }}
      >
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
};

export default Checkout;
