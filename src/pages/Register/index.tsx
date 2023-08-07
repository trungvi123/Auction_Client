
import { useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FormRegister from "../../components/FormRegister";
import { setShow } from "../../redux/myModalSlice";

import "./Register.css";

const Register = () => {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(setShow());
  };
  return (
    <Container>
      <Row className="w-100 d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
              <div className="reg__title">
                <h1>Đăng ký tài khoản</h1>
                <p>
                  Bạn đã có tài khoản?
                  <span onClick={handleOpenModal}> Đăng Nhập Ngay</span>
                </p>
              </div>
              <FormRegister></FormRegister>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
