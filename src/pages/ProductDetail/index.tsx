import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Breadcrumbs";
import { breadcrumbs } from "../../asset/images";
import { useLocation } from "react-router-dom";
import productApi from "../../api/productApi";
// import changeTypeBreadcrumbs from "../../utils/changeTypeBreadcrumbs";
import MyImageGallery from "../../components/MyImageGallery";
import "./ProductDetail.css";
import InforTabs from "../../components/InforTabs";
import formatMoney from "../../utils/formatMoney";
import formatDay from "../../utils/formatDay";

import { IProduct, IRootState } from "../../interface";
import userApi from "../../api/userApi";
import categoryApi from "../../api/categoryApi";
import CountDownTime from "../../components/CountDownTime";
import roomApi from "../../api/roomApi";
import { setShow } from "../../redux/myModalSlice";
import toast from "react-hot-toast";
import * as io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

const ProductDetail = () => {
  const [title, setTitle] = useState<string>();
  const [product, setProduct] = useState<IProduct>();
  const [type, setType] = useState<string>();
  const [imgData, setImgData] = useState<string[]>([]);
  const [owner, setOwner] = useState<any>();
  const [cate, setCate] = useState<any>();
  const [stateAuction, setStateAuction] = useState<string>("");
  const [joined, setJoined] = useState(false);
  const [auctionPrice, setAuctionPrice] = useState<number>(0);
  const [currentPriceBid, setCurrentPriceBid] = useState<number>(); // giá này là giá sẽ hiển thị khi người dùng liên tục trả giá, mà k cần request lại db

  const location = useLocation();
  let url = location.pathname;
  const idProduct = url.split("/")[2].trim();
  const idClient = useSelector((e: IRootState) => e.auth._id);
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const dispatch = useDispatch();

  useEffect(() => {
    // chi tiết của cuộc đấu giá
    if (url.split("/")[1].trim() === "chi-tiet-dau-gia") {
      const fectProduct = async () => {
        const result: any = await productApi.getProductById(idProduct);
        if (result) {
          setProduct(result.data);
          setTitle(result.data.name);
          setImgData(result.data.images);
          setType("Chi tiết đấu giá");

          //getuser
          const fetchUser = async () => {
            const resUser: any = await userApi.getUser(result.data.owner);
            if (resUser.status === "success") {
              setOwner(resUser.user);
            }
          };

          //getcategory
          const fetchcate = async () => {
            const resCate: any = await categoryApi.getCategoryById(
              result.data.category
            );

            if (resCate.status === "success") {
              setCate(resCate.category);
            }
          };

          fetchUser();
          fetchcate();
        }
      };
      fectProduct();
    }
  }, [idProduct, url]);

  useEffect(() => {
    if (product?.auctionStarted && !product?.auctionEnded) {
      setStateAuction("Đang diễn ra");
    } else if (product?.auctionStarted && product?.auctionEnded) {
      setStateAuction("Đã kết thúc");
    } else {
      setStateAuction("Chưa diễn ra");
    }
  }, [product]);

  useEffect(() => {
    const checkJoin = async () => {
      const result: any = await roomApi.getRoomByIdProd(idProduct);
      if (result?.status === "success") {
        const check: any = result.room.users.find((e: any) => {
          return e === idClient;
        });

        if (check) {
          setJoined(true);
        } else {
          setJoined(false);
        }
      }
    };
    if (idClient !== "") {
      checkJoin();
    }
  }, [idClient, idProduct, url]);

  const handleJoinAuction = () => {
    const handleJoinRoom = async () => {
      if (idClient === "") {
        dispatch(setShow());
      } else {
        const result: any = await roomApi.getRoomByIdProd(idProduct);
        if (result?.status === "success") {
          const res: any = await roomApi.joinRoom({
            idProd: idProduct,
            idRoom: result.room._id,
            idUser: idClient,
          });
          if (res?.status === "success") {
            toast.success("Tham gia đấu giá thành công!");

            setJoined(true);
          } else {
            toast.error("Tham gia đấu giá thất bại!");
          }
        }
      }
    };
    handleJoinRoom();
  };

  const handleBid = () => {
    if (auctionPrice > parseFloat(product?.currentPrice.$numberDecimal)) {
      if (auctionPrice === currentPriceBid) {
        toast.error("Giá của bạn phải cao hơn giá hiện tại của sản phẩm!");
      } else {
        socket.emit("bid_price", {
          users: idClient,
          product: idProduct,
          price: auctionPrice,
          lastName: lastName,
        });
        setCurrentPriceBid(auctionPrice);
        toast.error("Ra giá thành công!");
      }
    } else {
      toast.error("Giá của bạn phải cao hơn giá hiện tại của sản phẩm!");
    }
  };

  useEffect(() => {
    socket.on("respone_bid_price", (data) => {
      const fectRealPrice = async () => {
        // khi nhận được phản hồi từ socket, tiến hành lấy giá hiện tại của sản phẩm
        const res: any = await productApi.getCurrentPriceById(idProduct);
        if (res?.status === "success") {
          setCurrentPriceBid(parseFloat(res.data.currentPrice.$numberDecimal));
        }
      };
      fectRealPrice();
    });
  }, [idProduct]);

  return (
    <div>
      <Container>
        <Breadcrumbs title={title} type={type} img={breadcrumbs}></Breadcrumbs>
        <Row className="pt-5">
          <Col md={7}>
            <MyImageGallery imagesLink={imgData}></MyImageGallery>
          </Col>
          <Col md={5}>
            <p className="countdown-time-title">
              Thời gian đếm ngược bắt đầu đấu giá:
            </p>
            <CountDownTime time={product?.startTime}></CountDownTime>
            <div className="infor-container">
              <div className="infor-row">
                <p className="infor-row__left">Loại tài sản:</p>
                <p className="infor-row__right">{cate ? cate.name : ""}</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Trạng thái:</p>
                <p className="infor-row__right">{stateAuction}</p>
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
                <p className="infor-row__right">Trả giá lên và liên tục</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Tên chủ tài sản:</p>
                <p className="infor-row__right">
                  {owner ? owner.firstName + " " + owner.lastName : ""}
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

              {!product?.auctionStarted && (
                <>
                  <div className="infor-row">
                    <p className="infor-row__left">Giá cao nhất hiện tại:</p>
                    <p className="infor-row__right">
                      {currentPriceBid
                        ? formatMoney(currentPriceBid)
                        : formatMoney(product?.currentPrice?.$numberDecimal)}
                    </p>
                  </div>
                </>
              )}
            </div>
            {!joined ? (
              <div className="handle-auction">
                <div
                  className="btn-11 btn-11__full"
                  onClick={handleJoinAuction}
                >
                  <span className="btn-11__content">Tham gia đấu giá</span>
                </div>
              </div>
            ) : (
              <div className="handle-auction">
                <div className="btn-11 btn-11__full">
                  <span className="btn-11__content">Mua ngay</span>
                </div>
                <div className="handle-auction__bid">
                  <input
                    className="handle-auction__input"
                    type="number"
                    value={auctionPrice}
                    onChange={(e: any) => setAuctionPrice(e.target.value)}
                    placeholder="VD: 10000 (VND)"
                  />
                  <div className="btn-11 bid" onClick={handleBid}>
                    <span className="btn-11__content">Đấu giá</span>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
        <Row className="pt-5">
          <Col>
            <InforTabs data={product}></InforTabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;