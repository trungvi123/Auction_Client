import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import toast from "react-hot-toast";
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
};

function FormRegister({ status = "register" }: { status?: string }) {
  const [validated, setValidated] = useState(false);
  const refForm: any = useRef();
  const dispatch = useDispatch();
  const clientId = useSelector((e: IRootState) => e.auth._id);

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const [payload, setPayload] = useState(inititalStatePayload);
  const [errDate, setErrDate] = useState<boolean>(false);
  const [errPhone, setErrPhone] = useState<boolean>(false);
  const [erridCard, setErrIdCard] = useState<boolean>(false);
  const [errEmail, setErrEmail] = useState<boolean>(false);
  const [errEmailPaypal, setErrEmailPaypal] = useState<boolean>(false);

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

  return (
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

      <div onClick={handleSubmit} className="btn-11">
        <span className="btn-11__content">
          {status === "register" ? "Đăng ký" : "Cập nhật"}
        </span>
      </div>
    </Form>
  );
}

export default FormRegister;
