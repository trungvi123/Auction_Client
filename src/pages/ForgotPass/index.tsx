import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

import { forgotPassBg, logo } from "../../asset/images";
import userApi, { IConfirmResetPass, IResetPass } from "../../api/userApi";
import "./ForgotPass.css";
import { Backdrop, CircularProgress } from "@mui/material";

const ForgotPass = () => {
  const refForm: any = useRef();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  const handleSubmit = async () => {
    if (email && OTP) {
      setLoading(true);
      // do sómething
      const data: IResetPass = { email, OTP };
      const result: any = await userApi.resetPass(data);

      if (result?.status === "success") {
        toast.success(
          "Chúng tôi đã gửi mật khẩu tạm thời qua email của bạn, vui lòng kiểm tra!"
        );
        setEmail("");
      }
      setLoading(false);
    } else {
      toast.error("Vui lòng nhập email và mã OTP!");
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (email) {
      setLoading(true);
      const result: any = await userApi.confirmResetPass({ email });
      if (result?.status === "success") {
        toast.success(
          "Chúng tôi đã gửi một mã OTP qua email của bạn, vui lòng kiểm tra!"
        );
      }
      setLoading(false);
    } else {
      toast.error("Vui lòng nhập email!");
    }
  };

  return (
    <div className="d-flex">
      <div className="side-bar">
        <img className="side-bar__bg" src={forgotPassBg} alt="bg side bar" />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        {/* <CircularProgress color="inherit" />
         */}
         <span className="newsLoader"></span>

      </Backdrop>
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

            <div className="d-flex align-items-end">
              <Form.Group
                as={Col}
                sm={12}
                md="6"
                controlId="validationCustom01"
              >
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
              <div onClick={handleSendOTP} className="btn-11 mt-4 sendOTP">
                <span className="btn-11__content">Gửi mã</span>
              </div>
            </div>

            <Form.Group as={Col} sm={12} md="6" controlId="validationCustom02">
              <Form.Label className="email-lable mt-3">OTP</Form.Label>
              <Form.Control
                required
                type="text"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
              />
            </Form.Group>
            <div onClick={handleSubmit} className="btn-11 mt-4">
              <span className="btn-11__content">Tiếp tục</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPass;
