import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../interface";
import { setClose } from "../../redux/myModalSlice";
import { logo } from "../../asset/images";

import "./MyModal.css";
import FormLogin from "../FormLogin";

function MyModal({
  name,
  placement,
  ...props
}: {
  name: string;
  placement: any;
}) {
  const myModal = useSelector((e: IRootState) => e.myModal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setClose());
  };

  return (
    <>
      <Offcanvas
        className={name}
        show={myModal.show}
        onHide={handleClose}
        placement={placement}
        {...props}
      >
        <Offcanvas.Body>
          <div className="p-5 login-container">
            <div className="login__head">
              <img className="login__logo" src={logo} alt="" />
              <div className="login__close" onClick={handleClose}></div>
            </div>

            <FormLogin status={myModal.status}></FormLogin>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MyModal;
