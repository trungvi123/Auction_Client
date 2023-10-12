import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as io from "socket.io-client";

import Breadcrumbs from "../../components/Breadcrumbs";
import { breadcrumbs } from "../../asset/images";
import { useLocation } from "react-router-dom";
import productApi from "../../api/productApi";
import MyImageGallery from "../../components/MyImageGallery";
import "./ProductDetail.css";
import InforTabs from "../../components/InforTabs";
import formatMoney from "../../utils/formatMoney";
import formatDay from "../../utils/formatDay";

import { IProduct, IRootState } from "../../interface";
import CountDownTime from "../../components/CountDownTime";
import roomApi from "../../api/roomApi";
import { setShow } from "../../redux/myModalSlice";
import { auctionType, checkoutType } from "../../constant";

const socket = io.connect("http://localhost:5000");

const ProductDetail = () => {
  const location = useLocation();
  let url = location.pathname;
  const idProduct = url.split("/")[2].trim();
  const idClient = useSelector((e: IRootState) => e.auth._id);
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const dispatch = useDispatch();

  const [product, setProduct] = useState<IProduct>();
  const [imgData, setImgData] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [joined, setJoined] = useState(false);
  const [auctionPrice, setAuctionPrice] = useState<number>(0);
  const [timeStep, setTimeStep] = useState<number>(1);
  const [currentPriceBid, setCurrentPriceBid] = useState<number>(0); // giá này là giá sẽ hiển thị khi người dùng liên tục trả giá, mà k cần request lại db
  const [timeCountDown, setTimeCountDown] = useState<any>();
  const [stopCountDown, setTopCountDown] = useState<boolean>(false);

  const fectProduct = async (idProduct: string) => {
    const result: any = await productApi.getProductById(idProduct);

    if (result) {
      if (result.data.auctionTypeSlug === "dau-gia-nguoc") {
        setCurrentPriceBid(parseFloat(result.data.basePrice.$numberDecimal));
      }
      setProduct(result.data);

      setImgData(result.data.images);
      setTimeCountDown({
        time: result.data.startTime,
        type: "start",
      });
    }
  };
  const bidsTime = useCallback(
    (notify = false, type = "start") => {
      if (notify) {
        if (type === "start") {
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionStarted(
              idProduct
            );
            if (result) {
              setProduct(result.data);
              setTimeCountDown({
                time: result.data.endTime,
                type: "end",
              });
            }
          };
          fectProduct();
        } else {
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionEnded({
              id: idProduct,
              idUser: idClient,
              type: "bid",
            });
            if (result) {
              setProduct(result.data);
            }
          };
          fectProduct();
        }
      } else {
        fectProduct(idProduct);
      }
    },
    [idClient, idProduct]
  );

  useEffect(() => {
    // chi tiết của cuộc đấu giá
    if (url.split("/")[1].trim() === "chi-tiet-dau-gia") {
      fectProduct(idProduct);
    }
  }, [idProduct, url]);

  useEffect(() => {
    const checkJoin = async () => {
      const result: any = await roomApi.getRoomByIdProd(idProduct);
      if (result?.status === "success") {
        const check: any = result.room.users.find((e: any) => {
          return e === idClient;
        });

        if (check) {
          setJoined(true);
          socket.emit("joinRoom", product?.room);
        } else {
          setJoined(false);
        }
      }
    };
    if (idClient !== "") {
      checkJoin();
    }
  }, [idClient, idProduct, product, url]);

  const handleJoinAuction = () => {
    const handleJoinRoom = async () => {
      if (idClient === "") {
        dispatch(setShow());
      } else {
        const res: any = await roomApi.joinRoom({
          idProd: idProduct,
          idRoom: product?.room,
          idUser: idClient,
        });
        if (res?.status === "success") {
          toast.success("Tham gia đấu giá thành công!");
          socket.emit("joinRoom", product?.room);
          setJoined(true);
        } else {
          toast.error("Tham gia đấu giá thất bại!");
        }
      }
    };
    handleJoinRoom();
  };

  const handleBid = () => {
    if (product?.auctionTypeSlug === "dau-gia-xuoi") {
      if (auctionPrice > parseFloat(product?.currentPrice.$numberDecimal)) {
        if (auctionPrice <= currentPriceBid) {
          toast.error("Giá của bạn phải cao hơn giá hiện tại của sản phẩm!");
        } else {
          socket.emit("bid_price", {
            users: idClient,
            product: idProduct,
            price: auctionPrice,
            lastName: lastName,
            room: product?.room,
            auctionTypeSlug: product.auctionTypeSlug,
          });
          setCurrentPriceBid(auctionPrice);
          toast.success("Ra giá thành công!");
        }
      } else {
        toast.error("Giá của bạn phải cao hơn giá hiện tại của sản phẩm!");
      }
    } else {
      // dau gia ngược
      if (auctionPrice < parseFloat(product?.currentPrice.$numberDecimal)) {
        if (auctionPrice >= currentPriceBid) {
          toast.error("Giá của bạn phải thấp hơn giá hiện tại của sản phẩm!");
        } else {
          socket.emit("bid_price", {
            users: idClient,
            product: idProduct,
            price: auctionPrice,
            lastName: lastName,
            room: product?.room,
            auctionTypeSlug: product?.auctionTypeSlug,
          });
          setCurrentPriceBid(auctionPrice);
          toast.success("Ra giá thành công!");
        }
      } else {
        toast.error("Giá của bạn phải thấp hơn giá hiện tại của sản phẩm11!");
      }
    }
  };

  console.log(auctionPrice, currentPriceBid);

  useEffect(() => {
    socket.on("respone_bid_price", (data) => {
      setCurrentPriceBid(parseFloat(data.price.$numberDecimal));
    });

    socket.on("respone_buy_now", (data: { buyNow: boolean }) => {
      if (data.buyNow) {
        setTopCountDown(true);
      }
    });
  }, [idProduct]);

  const confirmBuyNow = () => {
    const fectProduct = async () => {
      const result: any = await productApi.updateAuctionEnded({
        id: idProduct,
        idUser: idClient,
        type: "buy",
      });
      if (result.status === "success") {
        setTopCountDown(true);
        handleClose();
      }
    };
    socket.emit("buy_now", {
      buyNow: true,
    });
    fectProduct();
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            Bạn sẽ mua ngay sản phẩm {product?.name} với giá{" "}
            {product?.price?.$numberDecimal}?
          </h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={confirmBuyNow}>
            Tiếp tục
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Breadcrumbs
          title={product?.name}
          type={"Chi tiết đấu giá"}
          img={breadcrumbs}
        ></Breadcrumbs>
        <Row className="pt-4">
          <Col sm={12} md={12} lg={7} className="pt-3">
            <MyImageGallery imagesLink={imgData}></MyImageGallery>
          </Col>
          <Col sm={12} md={12} lg={5} className="pt-3">
            {product?.stateSlug !== "da-ket-thuc" && (
              <p className="countdown-time-title">
                {product?.stateSlug === "sap-dien-ra"
                  ? "Thời gian đếm ngược bắt đầu đấu giá:"
                  : "Thời gian đếm ngược kết thúc đấu giá:"}
              </p>
            )}
            {product?.stateSlug === "da-ket-thuc" && (
              <p className="countdown-time-title">Cuộc đấu giá đã kêt thúc</p>
            )}
            {product?.stateSlug !== "da-ket-thuc" && (
              <CountDownTime
                stop={stopCountDown}
                time={timeCountDown}
                bidsTime={bidsTime}
              ></CountDownTime>
            )}

            <div className="infor-container">
              <div className="infor-row">
                <p className="infor-row__left">Loại tài sản:</p>
                <p className="infor-row__right">{product?.category.name}</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Trạng thái:</p>
                <p className="infor-row__right">{product?.state}</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Giá khởi điểm:</p>
                <p className="infor-row__right">
                  {formatMoney(product?.basePrice?.$numberDecimal)}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Giá mua ngay:</p>
                <p className="infor-row__right">
                  {formatMoney(product?.price?.$numberDecimal)}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Bước giá:</p>
                <p className="infor-row__right">
                  {formatMoney(product?.stepPrice?.$numberDecimal)}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Phương thức đấu giá:</p>
                <p className="infor-row__right">
                  {auctionType[product?.auctionTypeSlug || ""]}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Phương thức thanh toán:</p>
                <p className="infor-row__right">
                  {checkoutType[product?.checkoutTypeSlug || ""]}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Tên chủ tài sản:</p>
                <p className="infor-row__right">
                  {product
                    ? product.owner.firstName + " " + product.owner.lastName
                    : ""}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Thời gian bắt đầu đấu giá:</p>
                <p className="infor-row__right">
                  {formatDay(product ? product.startTime : "")}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Thời gian kết thúc đấu giá:</p>
                <p className="infor-row__right">
                  {formatDay(product ? product.endTime : "")}
                </p>
              </div>

              {product?.auctionStarted && (
                <>
                  <div className="infor-row">
                    <p className="infor-row__left">
                      {product?.auctionTypeSlug === "dau-gia-xuoi"
                        ? "Giá cao nhất hiện tại:"
                        : "Giá thấp nhất hiện tại:"}
                    </p>
                    <p className="infor-row__right">
                      {currentPriceBid
                        ? formatMoney(currentPriceBid)
                        : formatMoney(product?.currentPrice?.$numberDecimal)}
                    </p>
                  </div>
                </>
              )}

              <div className="infor-row">
                <p className="infor-row__left">Lưu ý:</p>
                <p className="infor-row__right">
                  Mức giá hợp lệ mà bạn đưa ra sẽ là mức giá{" "}
                  {product?.auctionTypeSlug === "dau-gia-xuoi"
                    ? "cao nhất hiện tại"
                    : "thấp nhất hiện tại"}
                </p>
              </div>
            </div>
            {product?.stateSlug === "dang-dien-ra" && (
              <div>
                {!joined ? (
                  <div className="handle-auction">
                    <div
                      className={`btn-11 btn-11__full ${
                        product?.auctionStarted ? "" : "disable"
                      } `}
                      onClick={handleJoinAuction}
                    >
                      <span className="btn-11__content ">Tham gia đấu giá</span>
                    </div>
                  </div>
                ) : (
                  <div className="handle-auction">
                    <div
                      className="btn-11 btn-11__full"
                      onClick={() => setShowModal(true)}
                    >
                      <span className="btn-11__content">Mua ngay</span>
                    </div>
                    <div className="handle-auction__bid mt-2">
                      <div className="step-price">
                        {" "}
                        {formatMoney(product?.stepPrice?.$numberDecimal)}
                      </div>
                      <p className="step-price-time">x</p>
                      <input
                        className="handle-auction__input"
                        type="number"
                        max={10000}
                        min={1}
                        value={timeStep}
                        onChange={(e: any) => {
                          if (e.target.value <= 10000 && e.target.value >= 1) {
                            setTimeStep(e.target.value);
                            setAuctionPrice(
                              e.target.value *
                                product?.stepPrice?.$numberDecimal
                            );
                          } else {
                            setTimeStep(1);

                            if (e.target.value < 1) {
                              toast.error("Bước nhảy tối thiểu là 1");
                            } else {
                              toast.error(
                                "Mỗi lần đấu giá vui lòng không quá 10000 bước nhảy!"
                              );
                            }
                          }
                        }}
                      />
                      <p className="step-price-equal">=</p>

                      <div className="total-price">
                        {formatMoney(
                          timeStep * product?.stepPrice?.$numberDecimal
                        )}
                      </div>
                    </div>

                    <div
                      className="btn-11 btn-11__full mt-2"
                      onClick={handleBid}
                    >
                      <span className="btn-11__content">Đấu giá</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
        <Row className="pt-5">
          <Col>
            <InforTabs
              data={product}
              socket={socket}
              joined={joined}
            ></InforTabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;
