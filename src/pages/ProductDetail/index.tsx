import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FacebookIcon, FacebookShareButton } from "react-share";
import { NotificationsActive, NotificationsNone } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

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
import { setShow, setStatus } from "../../redux/myModalSlice";
import { auctionType, checkoutType, baseUrl } from "../../constant";
import { socket } from "../../components/Header";
import { toggleFireworks } from "../../redux/uiSlice";
import SEO from "../../components/SEO";
import userApi from "../../api/userApi";

const ProductDetail = () => {
  const location = useLocation();
  let url = location.pathname;
  const idProduct = url.split("/")[2].trim();
  const idClient = useSelector((e: IRootState) => e.auth._id);
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const emailPaypal = useSelector((e: IRootState) => e.auth.emailPaypal);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [product, setProduct] = useState<IProduct>();
  const [imgData, setImgData] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalForWinner, setShowModalForWinner] = useState(false);
  const [joined, setJoined] = useState(false);
  const [auctionPrice, setAuctionPrice] = useState<number>(0);
  const [timeStep, setTimeStep] = useState<number>(1);
  const [currentPriceBid, setCurrentPriceBid] = useState<number>(0); // giá này là giá sẽ hiển thị khi người dùng liên tục trả giá, mà k cần request lại db
  const [timeCountDown, setTimeCountDown] = useState<any>();
  const [stopCountDown, setStopCountDown] = useState<boolean>(false);
  //notification product
  const [getNotification, setGetNotification] = useState<string>("");
  const [typeNotification, setTypeNotification] = useState<string[]>([]);
  const [inforPreStart, setInforPreStart] = useState<any>({
    time: "",
    type: "",
  });
  const [inforPreEnd, setInforPreEnd] = useState<any>({
    time: "",
    type: "",
  });

  const fectProduct = useCallback(
    async (idProduct: string) => {
      const result: any = await productApi.getProductById(idProduct);

      if (result) {
        if (result.data.auctionTypeSlug === "dau-gia-nguoc") {
          setCurrentPriceBid(parseFloat(result.data.basePrice.$numberDecimal));
        }
        setProduct(result.data);
        setImgData(result.data.images);
        if (!result.data.auctionStarted) {
          setTimeCountDown({ time: result.data.startTime, type: "start" });
        }

        if (result.data.auctionStarted && !result.data.auctionEnded) {
          setTimeCountDown({ time: result.data.endTime, type: "end" });
        }

        if (result.data.auctionEnded) {
          if (result.data.winner === idClient) {
            setShowModal(true);
            setShowModalForWinner(true);
            dispatch(toggleFireworks(true));
          }
        }
      }
    },
    [dispatch, idClient]
  );

  const refreshProductCb = useCallback(
    (state: string) => {
      if (state === "finishStart" || state === "finishEnd") {
        fectProduct(idProduct);
      }
    },
    [fectProduct, idProduct]
  );

  useEffect(() => {
    // chi tiết của cuộc đấu giá
    if (url.split("/")[1].trim() === "chi-tiet-dau-gia") {
      fectProduct(idProduct);
    }
  }, [fectProduct, idProduct, url]);

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
        dispatch(setStatus("login"));
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

    if (!emailPaypal && product?.checkoutTypeSlug === "payment") {
      toast.error(
        "Bạn nên cập nhật thông tin paypal của mình trước khi tham gia cuộc đấu giá có hình thức thanh toán này!"
      );
    } else {
      handleJoinRoom();
    }
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

  useEffect(() => {
    socket.on("respone_bid_price", (data) => {
      setCurrentPriceBid(parseFloat(data.price.$numberDecimal));
    });

    socket.on("respone_buy_now", (data: { buyNow: boolean }) => {
      if (data.buyNow) {
        setStopCountDown(true);
        fectProduct(idProduct);
      }
    });

    socket.on("new_notification", (data: any) => {
      if (data === "milestone_new") {
        fectProduct(idProduct);
      }
    });

    return () => {
      // Đóng kết nối khi component bị unmount (thường trong componentWillUnmount)
      socket.disconnect();
    };
  }, [fectProduct, idProduct]);

  const confirmBuyNow = () => {
    if (idClient) {
      const update = async () => {
        const result: any = await productApi.updateAuctionEnded({
          id: idProduct,
          idUser: idClient,
          type: "buy",
        });
        if (result.status === "success") {
          setStopCountDown(true);
          setShowModalForWinner(true);
          setShowModal(true);

          setProduct(result.data);
          setImgData(result.data.images);

          socket.emit("buy_now", {
            buyNow: true,
          });
        }
      };

      update();
    } else {
      dispatch(setShow());
      dispatch(setStatus("login"));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowModalForWinner(false);
  };

  const handleGetNotification = async () => {
    if (!inforPreEnd.time && !inforPreStart.time) {
      toast.error("Vui lòng điền thông tin để nhận thông báo!");
    } else {
      let success = false;
      if (inforPreEnd.time) {
        const res1: any = await userApi.addFollowProduct({
          type: "pre-end",
          time: inforPreEnd.time,
          productId: idProduct,
        });
        if (res1?.status === "success") {
          success = true;
        }
      }
      if (inforPreStart.time) {
        const res2: any = await userApi.addFollowProduct({
          type: "pre-start",
          time: inforPreStart.time,
          productId: idProduct,
        });
        if (res2?.status === "success") {
          success = true;
        }
      }

      if (success) {
        toast.success("Nhận thông báo thành công!");
        queryClient.invalidateQueries({ queryKey: ["userNotification"] });
        fectProduct(idProduct);
        handleClose();
      }
    }
  };

  const handleUnfollowProduct = async () => {
    const res: any = await userApi.unFollowProduct({ productId: idProduct });
    if (res?.status === "success") {
      toast.success("Hủy nhận thông báo thành công!");
      fectProduct(idProduct);
      handleClose();
    }
  };

  return (
    <div>
      <SEO
        title={product?.name}
        type={"product"}
        image={product?.images[0]}
        url={`${baseUrl}/chi-tiet-dau-gia/${product?._id}`}
        description={product?.description}
      ></SEO>
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
          {!showModalForWinner && !getNotification && (
            <h6>
              Bạn sẽ mua ngay sản phẩm {product?.name} với giá{" "}
              {product?.price?.$numberDecimal}?
            </h6>
          )}
          {showModalForWinner && (
            <h6>
              Xin chúc mừng bạn đã đấu giá sản phẩm {product?.name} thành công!
            </h6>
          )}

          {getNotification === "follow" &&
            (!product?.auctionEnded || !product?.auctionStarted) && (
              <div>
                <div>
                  {!product?.auctionStarted && (
                    <label className="containerCheckbox" htmlFor={"pre-start"}>
                      Trước khi bắt đầu
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setTypeNotification([
                              ...typeNotification,
                              "pre-start",
                            ]);
                          } else {
                            const newArr = typeNotification.filter(
                              (item) => item !== "pre-start"
                            );
                            setTypeNotification(newArr);
                            setInforPreStart({});
                          }
                        }}
                        id={"pre-start"}
                        className="status-checkall"
                        name="checkbox-status"
                        value="pre-start"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                  )}
                  {!product?.auctionEnded && (
                    <label className="containerCheckbox" htmlFor={"pre-end"}>
                      Trước khi kết thúc
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setTypeNotification([
                              ...typeNotification,
                              "pre-end",
                            ]);
                          } else {
                            const newArr = typeNotification.filter(
                              (item) => item !== "pre-end"
                            );
                            setTypeNotification(newArr);
                            setInforPreEnd({});
                          }
                        }}
                        id={"pre-end"}
                        className="status-checkall"
                        name="checkbox-status"
                        value="pre-end"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                  )}
                </div>
                <div>
                  {typeNotification.includes("pre-start") && (
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>
                        Nhận thông báo trước khi bắt đầu khoảng: (PHÚT)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={inforPreStart.time}
                        placeholder="VD: 10"
                        onChange={(e) => {
                          setInforPreStart({
                            time: e.target.value,
                            type: "pre-start",
                          });
                        }}
                      />
                    </Form.Group>
                  )}
                  {typeNotification.includes("pre-end") && (
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>
                        Nhận thông báo trước khi kết thúc khoảng: (PHÚT)
                      </Form.Label>
                      <Form.Control
                        value={inforPreEnd.time}
                        onChange={(e) => {
                          setInforPreEnd({
                            time: e.target.value,
                            type: "pre-end",
                          });
                        }}
                        type="text"
                        placeholder="VD: 10"
                      />
                    </Form.Group>
                  )}
                </div>
              </div>
            )}

          {getNotification === "unfollow" && (
            <div>Bạn có muốn hủy nhận thông báo sản phẩm này?</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={`${showModalForWinner ? "primary" : "secondary"}`}
            onClick={() => {
              dispatch(toggleFireworks(false));
              handleClose();
              setTypeNotification([]);
            }}
          >
            Đóng
          </Button>
          {!showModalForWinner && !getNotification && (
            <Button variant="primary" onClick={confirmBuyNow}>
              Tiếp tục
            </Button>
          )}

          {getNotification === "follow" && (
            <Button variant="primary" onClick={handleGetNotification}>
              Tiếp tục
            </Button>
          )}

          {getNotification === "unfollow" && (
            <Button variant="primary" onClick={handleUnfollowProduct}>
              Tiếp tục
            </Button>
          )}
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
            <div className="d-flex justify-content-between">
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
              {(!product?.auctionEnded || !product?.auctionStarted) && (
                <div>
                  {!product?.follower.includes(idClient) ? (
                    <Tooltip title="Nhận thông báo" placement="right">
                      <IconButton
                        aria-label="more"
                        style={{ height: "40px" }}
                        onClick={() => {
                          setGetNotification("follow");
                          setShowModalForWinner(false);
                          setShowModal(true);
                        }}
                      >
                        <NotificationsNone></NotificationsNone>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Đã đăng ký nhận thông báo"
                      placement="right"
                    >
                      <IconButton
                        aria-label="more"
                        style={{ height: "40px" }}
                        onClick={() => {
                          setGetNotification("unfollow");
                          setShowModalForWinner(false);
                          setShowModal(true);
                        }}
                      >
                        <NotificationsActive></NotificationsActive>
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            {product?.stateSlug !== "da-ket-thuc" && (
              <CountDownTime
                productId={idProduct}
                idClient={idClient}
                refreshProductCb={refreshProductCb}
                stop={stopCountDown}
                time={timeCountDown}
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
              <div className="infor-row">
                <p className="infor-row__left mb-0">Chia sẻ:</p>
                <div className="infor-row__right">
                  <FacebookShareButton
                    url={`https://cit-auction.web.app/chi-tiet-dau-gia/${product?._id}`}
                    quote={"sadsadsadsa"}
                    hashtag={"#citauction"}
                    // description={"aiueo"}
                    className="Demo__some-network__share-button"
                  >
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                </div>
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
