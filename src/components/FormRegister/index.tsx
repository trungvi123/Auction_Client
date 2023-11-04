import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useDispatch, useSelector } from "react-redux";
import userApi, { ISignUpPayload } from "../../api/userApi";
import { IRootState } from "../../interface";
import { setEmail, setEmailPaypal, setLastName } from "../../redux/authSlice";
import { setShow } from "../../redux/myModalSlice";
import "./FormRegister.css";

const inititalStatePayload = {
  birthday: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  idCard: "",
  address: "",
  emailPaypal: "",
  verifyAccount: false,
};

function FormRegister({ status = "register" }: { status?: string }) {
  const [validated, setValidated] = useState(false);
  const refForm: any = useRef();
  const dispatch = useDispatch();
  const clientId = useSelector((e: IRootState) => e.auth._id);

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [OTP, setOTP] = useState("");
  const [modalMode, setModalMode] = useState("create");

  const [payload, setPayload] = useState(inititalStatePayload);
  const [errDate, setErrDate] = useState<boolean>(false);
  const [errPhone, setErrPhone] = useState<boolean>(false);
  const [erridCard, setErrIdCard] = useState<boolean>(false);
  const [errEmail, setErrEmail] = useState<boolean>(false);
  const [errEmailPaypal, setErrEmailPaypal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBirdthday = (date: any) => {
    setErrDate(false);
    const dob = new Date(date);
    // Tạo ngày tham chiếu (ngày hiện tại - 14 năm)
    const referenceDate = new Date();
    referenceDate.setFullYear(referenceDate.getFullYear() - 14);
    if (dob <= referenceDate) {
      // Đủ 14 tuổi
      setPayload({ ...payload, birthday: date });
    } else {
      setErrDate(true);
    }
  };

  const handleNumberPhone = (number: string) => {
    const phoneNumberPattern = /^0\d{9}$/;
    const check = phoneNumberPattern.test(number);
    setPayload({ ...payload, phoneNumber: number });
    setErrPhone(false);
    if (!check) {
      setErrPhone(true);
    }
  };

  const handleIdCard = (number: string) => {
    const pattern = /^\d+$/;
    const check = pattern.test(number);
    setPayload({ ...payload, idCard: number });
    setErrIdCard(false);
    if (!check) {
      setErrIdCard(true);
    }
  };

  useEffect(() => {
    if (status === "updateProfile") {
      const getUser = async () => {
        const res: any = await userApi.getUser(clientId);
        if (res?.status === "success") {
          setPayload({
            birthday: res.data.birthday,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber,
            idCard: res.data.idCard,
            address: res.data.address,
            emailPaypal: res.data.emailPaypal || "",
            verifyAccount: res.data.verifyAccount,
          });
        }
      };
      if (clientId) {
        getUser();
      }
    }
  }, [clientId, status]);

  const handleSubmit = async () => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    let check: boolean = true;
    if (!emailRegex.test(payload.email)) {
      setErrEmail(true);
      check = false;
    }
    if (!emailRegex.test(payload.emailPaypal)) {
      setErrEmailPaypal(true);
      check = false;
    }

    if (check && !errDate && !errPhone && !erridCard) {
      if (status === "register") {
        const form = refForm.current;
        if (form.checkValidity()) {
          if (pass === pass2) {
            const data: ISignUpPayload = {
              ...payload,
              password: pass,
            };
            const result: any = await userApi.signUp(data);

            if (result?.status === "success") {
              toast.success("Tạo tài khoản thành công!");
              dispatch(setShow());
            }
          } else {
            toast.error("Mật khẩu không giống nhau. Vui lòng kiểm tra lại!");
          }
        }
        setValidated(true);
      } else {
        const res: any = await userApi.updateProfile({
          ...payload,
          userId: clientId,
        });
        if (res?.status === "success") {
          toast.success("Cập nhật hồ sơ thành công");
          dispatch(setEmailPaypal(payload.emailPaypal));
          dispatch(setEmail(payload.email));
          dispatch(setLastName(payload.lastName));
        }
      }
    }
  };

  const handleVertifyAccount = async () => {
    const res: any = await userApi.verifyAccount({ OTP });
    console.log(res);
    if (res?.status === "success") {
      setModalMode("vertify");
      setModalMode("");
      handleClose();
      setPayload({ ...payload, verifyAccount: true });
      toast.success('Xác minh tài khoản thành công!')
    }else {
      toast.error('Xác minh tài khoản thất bại!')
    }
  };

  const handleCreateOTP = async () => {
    const res: any = await userApi.createOTP();
    if (res?.status === "success") {
      setModalMode("vertify");
    }
  };

  return (
    <>
      <>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Xác minh tài khoản</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMode === "vertify" && (
              <div>
                Bạn vui lòng nhập mã xác minh đã được gửi về email{" "}
                {payload.email}!
                <Form.Group
                  className="mb-3 mt-3"
                  as={Col}
                  md="12"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="Mã xác minh"
                    value={OTP}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                </Form.Group>
              </div>
            )}

            {modalMode === "create" && (
              <div>
                Chúng tôi sẽ gửi cho bạn một mã xác minh đến {payload.email}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            {modalMode === "create" && (
              <Button variant="primary" onClick={handleCreateOTP}>
                Tiếp tục
              </Button>
            )}
            {modalMode === "vertify" && (
              <Button variant="primary" onClick={handleVertifyAccount}>
                Xác minh
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
      <Form noValidate validated={validated} ref={refForm}>
        <Row className=" mt-5">
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom01"
          >
            <Form.Label>Họ</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Họ"
              value={payload.firstName}
              onChange={(e) =>
                setPayload({ ...payload, firstName: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập họ của bạn!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom02"
          >
            <Form.Label>Tên</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Tên"
              value={payload.lastName}
              onChange={(e) =>
                setPayload({ ...payload, lastName: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập tên của bạn!
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom03"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Email"
              value={payload.email}
              onChange={(e) => {
                setErrEmail(false);
                setPayload({ ...payload, email: e.target.value });
              }}
            />
            {errEmail && <p className="text__invalid">Email không hợp lệ!</p>}
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập email của bạn!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom04"
          >
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Số điện thoại"
              value={payload.phoneNumber}
              onChange={(e) => handleNumberPhone(e.target.value)}
            />
            {errPhone && (
              <p className="text__invalid">Số điện thoại không hợp lệ!</p>
            )}
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập số điện thoại của bạn!
            </Form.Control.Feedback>
          </Form.Group>

          {status === "register" && (
            <>
              <Form.Group
                className="mb-3"
                as={Col}
                md="6"
                controlId="validationCustom05"
              >
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  minLength={3}
                  required
                  value={pass}
                  onChange={(e: any) => setPass(e.target.value)}
                  type="password"
                  placeholder="Mật khẩu"
                />
                <Form.Control.Feedback type="invalid">
                  Mật khẩu của bạn có vẻ không hợp lệ!
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="mb-3"
                as={Col}
                md="6"
                controlId="validationCustom06"
              >
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  minLength={3}
                  required
                  value={pass2}
                  onChange={(e: any) => setPass2(e.target.value)}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                />
                <Form.Control.Feedback type="invalid">
                  Mật khẩu của bạn có vẻ không hợp lệ!
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom07"
          >
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              required
              type="date"
              value={payload.birthday}
              onChange={(e) => handleBirdthday(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập ngày sinh của bạn!
            </Form.Control.Feedback>
            {errDate && <p className="text__invalid">Bạn chưa đủ 14 tuổi!</p>}
          </Form.Group>

          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom08"
          >
            <Form.Label>Căn cước công dân</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="CCCD"
              value={payload.idCard}
              onChange={(e) => handleIdCard(e.target.value)}
            />
            {erridCard && (
              <p className="text__invalid">Số căn cước không hợp lệ!</p>
            )}
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập số căn cước công dân của bạn!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom13"
          >
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Địa chỉ"
              value={payload.address}
              onChange={(e) =>
                setPayload({ ...payload, address: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Vui lòng nhập địa chỉ của bạn!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom14"
          >
            <Form.Label>Email paypal (nếu có)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              value={payload.emailPaypal}
              onChange={(e) => {
                setErrEmailPaypal(false);
                setPayload({ ...payload, emailPaypal: e.target.value });
              }}
            />
            {errEmailPaypal && (
              <p className="text__invalid">Email không hợp lệ!</p>
            )}
          </Form.Group>
        </Row>

        <div className="d-flex">
          <div
            style={{ width: "150px" }}
            onClick={handleSubmit}
            className="btn-11"
          >
            <span className="btn-11__content">
              {status === "register" ? "Đăng ký" : "Cập nhật"}
            </span>
          </div>
          {status !== "register" && !payload.verifyAccount && (
            <div
              style={{ width: "200px", marginLeft: 10 }}
              onClick={handleShow}
              className="btn-11"
            >
              <span className="btn-11__content">Xác minh tài khoản</span>
            </div>
          )}
        </div>
      </Form>
    </>
  );
}

export default FormRegister;
