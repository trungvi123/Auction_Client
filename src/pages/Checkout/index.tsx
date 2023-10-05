import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import paymentApi from "../../api/paymentApi";
import productApi from "../../api/productApi";
import { breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import MyImageGallery from "../../components/MyImageGallery";
import formatMoney from "../../utils/formatMoney";
import formatDay from "../../utils/formatDay";

const Checkout = () => {
  const params = useParams();
  const [idProduct, setIdProduct] = useState<string | undefined>("");

  const CLIENT_ID =
    "ASQVRgiZX9e6DoA1pR1a-sXte8xdUWJqQeOc7QZKzNkGJM4MSia2CTiLuqxMOgehqeufbCwRwaQ40Gns";
  const productQuery = useQuery({
    queryKey: ["product-checkout", params.id],
    queryFn: async () => {
      const result: any = await productApi.getProductById(params.id || "");
      setIdProduct(params.id);
      return result.data;
    },
  });

  const createOrder = async () => {
    const result: any = await productApi.getProductById(params.id || "");
    let price
    if(result.data.purchasedBy){
      price = Number(result.data.price.$numberDecimal) / 24000
    }else {
      price = Number(result.data.currentPrice.$numberDecimal) / 24000
    }
    
    const payload = {
      price: price.toFixed(2).toString(),
    };
    const order: any = await paymentApi.createOrderPayPal(payload);
    if (order) {
      return order.id;
    }
  };

  const onApprove = async (data: any) => {
    // Order is captured on the server and the response is returned to the browser
    if (!idProduct) {
      toast.error("Thanh toán thất bại!");
    }

    const payload = {
      orderID: data.orderID,
      productId: idProduct,
    };
    const result: any = await paymentApi.captureOrderPayPal(payload);
    if (result?.status === "COMPLETED") {
      toast.success("Đã thanh toán thành công!");
    }
  };

  return (
    <Container>
      <Breadcrumbs
        title={productQuery.data?.name}
        type={"thanh toán"}
        img={breadcrumbs}
      ></Breadcrumbs>
      <Row className="pt-5">
        <Col md={7}>
          <MyImageGallery
            imagesLink={productQuery?.data?.images || []}
          ></MyImageGallery>
        </Col>
        <Col md={5}>
          <div className="infor-container">
            <div className="infor-row">
              <p className="infor-row__left">Loại tài sản:</p>
              <p className="infor-row__right">
                {productQuery.data?.category.name}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Trạng thái:</p>
              <p className="infor-row__right">
                {productQuery.data?.statusPayment}
              </p>
            </div>

            <div className="infor-row">
              <p className="infor-row__left">Giá khởi điểm:</p>
              <p className="infor-row__right">
                {formatMoney(productQuery.data?.basePrice?.$numberDecimal)}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Giá mua ngay:</p>
              <p className="infor-row__right">
                {formatMoney(productQuery.data?.price?.$numberDecimal)}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Bước giá:</p>
              <p className="infor-row__right">
                {formatMoney(productQuery.data?.stepPrice?.$numberDecimal)}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Phương thức đấu giá:</p>
              <p className="infor-row__right">Trả giá lên và liên tục</p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Tên chủ tài sản:</p>
              <p className="infor-row__right">
                {productQuery.data?.owner.firstName +
                  " " +
                  productQuery.data?.owner.lastName || ""}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Thời gian bắt đầu đấu giá:</p>
              <p className="infor-row__right">
                {formatDay(productQuery.data?.startTime || "")}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">Thời gian kết thúc đấu giá:</p>
              <p className="infor-row__right">
                {formatDay(productQuery.data?.endTime || "")}
              </p>
            </div>
            <div className="infor-row">
              <p className="infor-row__left">
                {productQuery.data?.purchasedBy
                  ? "Bạn đã mua thành công với giá:"
                  : "Bạn đã đấu giá thành công với giá:"}
              </p>
              <p className="infor-row__right">
                {productQuery.data?.purchasedBy
                  ? formatMoney(productQuery.data?.price?.$numberDecimal)
                  : formatMoney(
                      productQuery.data?.currentPrice?.$numberDecimal
                    )}
              </p>
            </div>
          </div>
          {productQuery.data?.statusPaymentSlug !== "da-thanh-toan" && (
            <div className="infor-container">
              <div>
                <PayPalScriptProvider
                  options={{
                    clientId: CLIENT_ID,
                  }}
                >
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
