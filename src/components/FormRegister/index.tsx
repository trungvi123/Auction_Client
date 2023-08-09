import { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import userApi, { ISignUpPayload } from "../../api/userApi";
import { setShow } from "../../redux/myModalSlice";
import "./FormRegister.css";

function FormRegister() {
  const [validated, setValidated] = useState(false);
  const refForm: any = useRef();
  const dispatch = useDispatch()


  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const [payload, setPayload] = useState({
    birthday: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    idCard: "",
    bankNumber: "",
    bankName: "",
    address: "",
  });


  const handleSubmit = async (event: any) => {
    const form = refForm.current;
    if (form.checkValidity()) {
      if (pass === pass2) {
        const data:ISignUpPayload = {
          ...payload,
          password:pass
        }
        const result:any = await userApi.signUp(data)
        
        if(result?.status === 'success'){
          toast.success('Tạo tài khoản thành công!')
          dispatch(setShow())
        }

      } else {
        toast.error("Mật khẩu không giống nhau. Vui lòng kiểm tra lại!");
      }
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} ref={refForm}>
      <Row className="mb-3 mt-5">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
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
        <Form.Group as={Col} md="6" controlId="validationCustom02">
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
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Email"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập email của bạn!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Số điện thoại"
            value={payload.phoneNumber}
            onChange={(e) =>
              setPayload({ ...payload, phoneNumber: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số điện thoại của bạn!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="12" controlId="validationCustom05">
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
        <Form.Group as={Col} md="12" controlId="validationCustom06">
          <Form.Label>Mật khẩu</Form.Label>
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

        <Form.Group as={Col} md="6" controlId="validationCustom07">
          <Form.Label>Ngày sinh</Form.Label>
          <Form.Control
            required
            type="date"
            value={payload.birthday}
            onChange={(e) =>
              setPayload({ ...payload, birthday: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số điện thoại của bạn!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom08">
          <Form.Label>Căn cước công dân</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="CCCD"
            value={payload.idCard}
            onChange={(e) => setPayload({ ...payload, idCard: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số căn cước công dân của bạn!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="validationCustom13">
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
        <Form.Group as={Col} md="12" controlId="validationCustom09">
          <Form.Label>Tài khoản ngân hàng</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Số tài khoản ngân hàng"
            value={payload.bankNumber}
            onChange={(e) =>
              setPayload({ ...payload, bankNumber: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số tài khoản ngân hàng của bạn!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="validationCustom10">
          <Form.Label>Tên ngân hàng</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Tên khoản ngân hàng"
            value={payload.bankName}
            onChange={(e) =>
              setPayload({ ...payload, bankName: e.target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập số tài khoản ngân hàng của bạn!
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá) , Chính sách bảo mật thông tin khách hàng , Cơ chế giải quyết tranh chấp , Quy chế hoạt động tại website đấu giá trực tuyến"
          feedback="Bạn phải đồng ý với điều khoản của chúng tôi!"
          feedbackType="invalid"
        />
      </Form.Group>

      <div onClick={handleSubmit} className="btn-11">
        <span className="btn-11__content">Đăng Ký</span>
      </div>
    </Form>
  );
}

export default FormRegister;
