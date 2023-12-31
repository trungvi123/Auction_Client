import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Breadcrumbs from "../../components/Breadcrumbs";
import { useLocation } from "react-router-dom";
import MyImageGallery from "../../components/MyImageGallery";
import InforTabs from "../../components/InforTabs";
import formatDay from "../../utils/formatDay";
import { IFreeProduct, IRootState } from "../../interface";
import freeProductApi from "../../api/freeProduct";
import "../ProductDetail/ProductDetail.css";
import { setShow, setStatus } from "../../redux/myModalSlice";
import SEO from "../../components/SEO";

const FreeProductDetail = () => {
  const location = useLocation();
  let url = location.pathname;
  const idProduct = url.split("/")[2].trim();
  const auth = useSelector((e: IRootState) => e.auth);
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>();
  const [type, setType] = useState<string>();
  const [imgData, setImgData] = useState<string[]>([]);
  const [product, setProduct] = useState<IFreeProduct>();
  const [owner, setOwner] = useState<any>();
  const [cate, setCate] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [accepterCount, setAccepterCount] = useState(0);
  const [disableBtn, setDisableBtn] = useState({
    status: "Chưa được duyệt",
    alreadyJoin: false,
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    if (!disableBtn.alreadyJoin) {
      setShowModal(true);
    }
  };
  useEffect(() => {
    // chi tiết của cuộc đấu giá
    if (url.split("/")[1].trim() === "chi-tiet-chia-se") {
      const fectProduct = async () => {
        const result: any = await freeProductApi.getProductById(idProduct);
        if (result) {
          setProduct(result.data);
          setTitle(result.data.name);
          setOwner(result.data.owner);
          setCate(result.data.category.name);
          setImgData(result.data.images);
          setType("Chi tiết chia sẻ");
          setAccepterCount(result.data.accepterList.length);
          if (result.data?.status === "Đã được duyệt") {
            setDisableBtn({
              status: "Đã được duyệt",
              alreadyJoin: false,
            });
            result.data.accepterList.forEach((item: any) => {
              if (item.user === auth._id) {
                setDisableBtn({
                  status: "Đã được duyệt",
                  alreadyJoin: true,
                });
              }
            });
          }
        }
      };
      fectProduct();
    }
  }, [auth._id, idProduct, url]);

  const handleReceived = async () => {
    const payload = {
      idUser: auth._id,
      idProduct,
      lastName: auth.lastName,
      email: auth.email,
    };

    const res: any = await freeProductApi.signUpToReceive(payload);
    handleClose();
    if (res?.status === "success") {
      toast.success("Đăng ký tham gia nhận sản phẩm thành công!");
      setDisableBtn({
        status: "Đã được duyệt",
        alreadyJoin: true,
      });
    } else {
      toast.error(res.msg);
    }
  };

  return (
    <div>
      <SEO title={product?.name}></SEO>
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
          <p>Bạn sẽ đăng ký tham gia nhận sản phẩm này?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleReceived}>
            Tiếp tục
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Breadcrumbs title={title} type={type}></Breadcrumbs>
        <Row className="pt-5">
          <Col md={7}>
            <MyImageGallery imagesLink={imgData}></MyImageGallery>
          </Col>
          <Col md={5}>
            <div className="infor-container">
              <div className="infor-row">
                <p className="infor-row__left">Loại tài sản:</p>
                <p className="infor-row__right">{cate ? cate : ""}</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Hình thức:</p>
                <p className="infor-row__right">Tặng / chia sẻ</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Trạng thái:</p>
                <p className="infor-row__right"> {product?.outOfStock ? 'Sản phẩm đã được nhận':'Còn sản phẩm'} </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Tên chủ tài sản:</p>
                <p className="infor-row__right">
                  {owner ? owner.firstName + " " + owner.lastName : ""}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Ngày đăng:</p>
                <p className="infor-row__right">
                  {formatDay(product ? product.createdAt : "")}
                </p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Số người đăng ký tối đa:</p>
                <p className="infor-row__right">20 người</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Số người đăng ký hiện tại:</p>
                <p className="infor-row__right">{accepterCount} người</p>
              </div>
            </div>
            {disableBtn?.status === "Đã được duyệt" && (
              <div className="handle-auction">
                <div
                  className={` btn-11 btn-11__full ${
                    disableBtn.alreadyJoin ? "disable" : ""
                  }`}
                  onClick={() => {
                    if (auth.email && auth._id) {
                      handleShow();
                    } else {
                      dispatch(setStatus("login"));
                      dispatch(setShow());
                    }
                  }}
                >
                  <span className="btn-11__content">
                    {disableBtn.alreadyJoin
                      ? "Đã đăng ký nhận"
                      : "Đăng ký nhận"}
                  </span>
                </div>
              </div>
            )}
          </Col>
        </Row>
        <Row className="pt-5">
          <Col>
            <InforTabs data={product} freeProduct={true}></InforTabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FreeProductDetail;
