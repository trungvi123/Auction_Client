import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Breadcrumbs from "../../components/Breadcrumbs";
import { breadcrumbs } from "../../asset/images";
import { useLocation } from "react-router-dom";
import productApi from "../../api/productApi";
import changeTypeBreadcrumbs from "../../utils/changeTypeBreadcrumbs";
import MyImageGallery from "../../components/MyImageGallery";
import "./ProductDetail.css";
import InforTabs from "../../components/InforTabs";
import formatMoney from "../../utils/formatMoney";
import formatDay from "../../utils/formatDay";

import { IProduct } from "../../interface";
import userApi from "../../api/userApi";
import categoryApi from "../../api/categoryApi";

const ProductDetail = () => {
  const [title, setTitle] = useState<string>();
  const [product, setProduct] = useState<IProduct>();
  const [type, setType] = useState<string>();
  const [imgData, setImgData] = useState<string[]>([]);
  const [owner, setOwner] = useState<any>();
  const [cate, setCate] = useState<any>();

  const location = useLocation();
  let url = location.pathname;

  useEffect(() => {
    // chi tiết của cuộc đấu giá
    if (url.split("/")[1].trim() === "chi-tiet-dau-gia") {
      const fectProduct = async () => {
        const result: any = await productApi.getProductById(
          url.split("/")[2].trim()
        );
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
  }, [url]);

  useEffect(()=>{
    


  },[])

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
            <div className="countdown-time-box">
              <div className="countdown-time-item">
                <span id="countdown-time-hour" className="countdown-time">
                  18
                </span>
                <span className="countdown-text">Giờ</span>
              </div>
              <div className="countdown-time-item">
                <span id="countdown-time-minute" className="countdown-time">
                  18
                </span>
                <span className="countdown-text">Phút</span>
              </div>
              <div className="countdown-time-item">
                <span id="countdown-time-second" className="countdown-time">
                  18
                </span>
                <span className="countdown-text">Giây</span>
              </div>
            </div>
            <div className="infor-container">
              <div className="infor-row">
                <p className="infor-row__left">Loại tài sản:</p>
                <p className="infor-row__right">{cate ? cate.name : ""}</p>
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
                <p className="infor-row__right">1000</p>
              </div>
              <div className="infor-row">
                <p className="infor-row__left">Phương thức đấu giá:</p>
                <p className="infor-row__right">
                  Trả giá lên và liên tục Trả giá lên và liên tục Trả giá lên và
                  liên tục Trả giá lên và liên tục Trả giá lên và liên tục Trả
                  giá lên và liên tục
                </p>
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
            </div>
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
