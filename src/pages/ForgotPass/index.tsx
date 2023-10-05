import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";



import { forgotPassBg, logo } from "../../asset/images";
import userApi, { IResetPass } from "../../api/userApi";
import "./ForgotPass.css";

const ForgotPass = () => {
  const refForm: any = useRef();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const form = refForm.current;

    if (form.checkValidity()) {
      // do sómething
      const data: IResetPass = { email };
      const result: any = await userApi.resetPass(data);

      if (result?.status === "success") {
        toast.success(
          "Chúng tôi đã gửi mật khẩu tạm thời qua email của bạn, vui lòng kiểm tra!"
        );
      }
    }
    setValidated(true);
  };

  return (
    <div className="d-flex">
      <div className="side-bar">
        <img className="side-bar__bg" src={forgotPassBg} alt="bg side bar" />
      </div>
      <Container>
        <div className="forgot-main">
          <div className="forgot-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="forgot-content">
            <div>
              <Link to={"/"}>
                <BiArrowBack size={32}></BiArrowBack>
              </Link>
            </div>
            <p className="text-top">Bạn đã quên mật khẩu?</p>
            <p className="text-bot">
              Vui lòng cung cấp email đã đăng ký để lấy lại mật khẩu.
            </p>
            <Form
              noValidate
              ref={refForm}
              validated={validated}
              className="forgot-form"
            >
              <Form.Group as={Col} sm={12} md="6" controlId="validationCustom01">
                <Form.Label className="email-lable">Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Email của bạn có vẻ không hợp lệ!
                </Form.Control.Feedback>
              </Form.Group>
              <div onClick={handleSubmit} className="btn-11 mt-4">
                <span className="btn-11__content">Tiếp tục</span>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPass;
