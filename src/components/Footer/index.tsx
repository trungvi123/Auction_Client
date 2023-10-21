import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bg"></div>
      <Container className="footer-content">
        <Row>
          <Col lg={6} md={12} xl={4} className="d-flex justify-content-xl-center">
            <div className="footer-item mt-4">
              <h5>Công ty đấu giá hợp danh CIT AUCTION</h5>
              <ul className="footer-list">
                <li>Mã số thuế: 099999999</li>
                <li>Địa chỉ: Số 123, đường 3/2, quận Ninh Kiều, TP. Cần Thơ</li>
                <li><a href="tel:0999.999.999">Điện thoại: 0999.999.999</a> </li>
                <li><a href="mailTo:jemcovintage@gmail.com">Email: jemcovintage@gmail.com</a> </li>
              </ul>
            </div>
          </Col>
          <Col lg={6} md={12} xl={4} className="d-flex justify-content-xl-center">
            <div className="footer-item mt-4 ">
              <h5>Về chúng tôi</h5>
              <ul className="footer-list">
                <li>
                  <Link to={"/"}>Giới thiệu</Link>
                </li>
                <li>
                  <Link to={"/"}>Quy chế hoạt động</Link>
                </li>
                <li>
                  <Link to={"/"}>Cơ chế giải quyết tranh chấp</Link>
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
                  <Link to={"/"}>Câu hỏi thường gặp</Link>
                </li>
                <li>
                  <Link to={"/"}>Cho thuê tổ chức đấu giá trực tuyến</Link>
                </li>
                <li>
                  <Link to={"/"}>Văn bản pháp quy</Link>
                </li>
                <li>
                  <Link to={"/"}>Chính sách bảo mật thông tin</Link>
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
