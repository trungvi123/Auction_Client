import { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import userApi, { IChangePassPayload, ISignInPayload } from "../../api/userApi";
import { setClose, setStatus } from "../../redux/myModalSlice";
import {
  setEmail,
  setLastName,
  setIdUser,
  setBasicUser,
  setProductPermission,
  setFreeProductPermission,
  setEmailPaypal,
} from "../../redux/authSlice";

interface IToken {
  _id: any;
  email: String;
  emailPaypal: string;
  lastName: String;
  role: String;
  productPermission: string[];
  freeProductPermission: string[];
}

interface IPropsForm {
  status: string;
}

function FormLogin(props: IPropsForm) {
  const [validated, setValidated] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  // this state for change pass feature
  const [dataChange, setDataChange] = useState({
    passChange: "",
    passChange2: "",
  });

  const refForm: any = useRef();
  const dispatch = useDispatch();
  const next = useNavigate();
  const handleClose = () => {
    dispatch(setClose());
  };

  const handleSubmit = async () => {
    const form = refForm.current;
    if (form.checkValidity()) {
      if (props.status === "login") {
        const data: ISignInPayload = payload;

        const result: any = await userApi.signIn(data);
        if (result?.status === "success") {
          toast.success("Đăng nhập thành công!");
          next("/");
          localStorage.setItem("token", result.accessToken);

          const data: IToken = jwtDecode(result.accessToken);
          if (data.role !== "user") {
            dispatch(setBasicUser(false));
          }

          dispatch(setStatus("changePass"));
          dispatch(setClose());
          dispatch(setEmailPaypal(data.emailPaypal));
          dispatch(setEmail(data.email));
          dispatch(setLastName(data.lastName));
          dispatch(setIdUser(data._id));
          dispatch(setProductPermission(data.productPermission));
          dispatch(setFreeProductPermission(data.freeProductPermission));
        }
      } else {
        if (dataChange.passChange === dataChange.passChange2) {
          const data: IChangePassPayload = {
            email: payload.email,
            password: payload.password,
            newPassword: dataChange.passChange,
          };
          const result: any = await userApi.changePass(data);
          if (result?.status === "success") {
            toast.success("Đổi mật khẩu thành công!");
            dispatch(setClose());
          } else {
            toast.error("Đổi mật khẩu thất bại!");
          }
        } else {
          toast.error("Mật khẩu mới không giống nhau. Vui lòng kiểm tra lại!");
        }
      }
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
      {props.status === "login" ? (
        <p className="login__text">
          Bạn chưa có tài khoản?{" "}
          <Link onClick={handleClose} to={"/dang-ky"}>
            Đăng Ký Ngay
          </Link>
        </p>
      ) : (
        props.status !== "login" && <h3 className="my-4">Đổi mật khẩu</h3>
      )}

      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustom01">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="abc@gmail.com"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">
            Email của bạn có vẻ không hợp lệ!
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationCustom02">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            minLength={3}
            required
            type="password"
            placeholder="********"
            value={payload.password}
            onChange={(e) =>
              setPayload({ ...payload, password: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập mật khẩu tối thiểu 8 kí tự!
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      {props.status === "changePass" && (
        <>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom20">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                minLength={3}
                required
                type="password"
                placeholder="********"
                value={dataChange.passChange}
                onChange={(e) =>
                  setDataChange({ ...dataChange, passChange: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập mật khẩu tối thiểu 8 kí tự!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom21">
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control
                minLength={3}
                required
                type="password"
                placeholder="********"
                value={dataChange.passChange2}
                onChange={(e) =>
                  setDataChange({ ...dataChange, passChange2: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập mật khẩu tối thiểu 8 kí tự!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </>
      )}

      <Link
        className="forgot__link"
        onClick={handleClose}
        to={"/quen-mat-khau"}
      >
        Quên mật khẩu?
      </Link>
      <div onClick={handleSubmit} className="btn-11 login__btn">
        <span className="btn-11__content">
          {props.status === "login" ? "Đăng Nhập" : "Đổi mật khẩu"}
        </span>
      </div>
    </Form>
  );
}

export default FormLogin;
