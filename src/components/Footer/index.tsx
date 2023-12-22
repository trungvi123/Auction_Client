import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "../../interface";

import './Footer.css'

const Footer = () => {
  const inforPage = useSelector((e:IRootState)=>e.ui.inforPage)

  return (
    <footer className="footer">
      <div className="footer-bg"></div>
      <Container className="footer-content">
        <Row>
          <Col lg={6} md={12} xl={4} className="d-flex justify-content-xl-center">
            <div className="footer-item mt-4">
              <h5>Công ty đấu giá hợp danh CIT AUCTION</h5>
              <ul className="footer-list">
                <li>Mã số thuế: {inforPage?.mst || '0999.999.999'}</li>
                <li>Địa chỉ: {inforPage?.address}</li>
                <li><a href={`tel:${inforPage?.phoneNumber}`}>Điện thoại: {inforPage?.phoneNumber}</a> </li>
                <li><a href={`mailTo:${inforPage?.email}`}>Email: {inforPage?.email}</a> </li>
              </ul>
            </div>
          </Col>
          <Col lg={6} md={12} xl={4} className="d-flex justify-content-xl-center">
            <div className="footer-item mt-4 ">
              <h5>Về chúng tôi</h5>
              <ul className="footer-list">
                <li>
                  <Link to={"/gioi-thieu"}>Giới thiệu</Link>
                </li>
                <li>
                  <Link to={"/"}>Quy chế hoạt động</Link>
                </li>
                <li>
                  <Link to={"/"}>Hướng dẫn sử dụng</Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg={6} md={12} xl={4} className="d-flex justify-content-xl-center">
            <div className="footer-item mt-4">
              <h5>Chính sách</h5>
              <ul className="footer-list">
                <li>
                  <Link to={"/tin-tuc/6573224d0732e771be58507b"}>Câu hỏi thường gặp</Link>
                </li>
                <li>
                  <Link to={"/tin-tuc/65731eea8e5e17ae0ac551f0"}>Chính sách bảo mật thông tin</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default React.memo(Footer);
