import { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setClose } from "../../redux/myModalSlice";

function FormLogin() {
  const [validated, setValidated] = useState(false);

  const refForm: any = useRef();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setClose());
  };

  const handleSubmit = (event: any) => {
    const form = refForm.current;

    if (form.checkValidity()) {
      // do sómething
    }
    setValidated(true);
  };

  return (
    <Form
      className="form__login"
      noValidate
      ref={refForm}
      validated={validated}
    >
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustom01">
          <Form.Label>Email</Form.Label>
          <Form.Control required type="email" placeholder="abc@gmail.com" />
          <Form.Control.Feedback>Tuyệt vời</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Email của bạn có vẻ không hợp lệ!
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustom02">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            minLength={8}
            required
            type="password"
            placeholder="********"
          />
          <Form.Control.Feedback>Tuyệt vời</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập mật khẩu tối thiểu 8 kí tự!
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Link className="forgot__link" onClick={handleClose} to={"/forgotPass"}>
        Quên mật khẩu?
      </Link>
      <div onClick={handleSubmit} className="btn-11 login__btn">
        <span className="btn-11__content">Đăng Nhập</span>
      </div>
    </Form>
  );
}

export default FormLogin;
