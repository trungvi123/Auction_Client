import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../interface";
import { setClose, setRefreshList } from "../../redux/myModalSlice";
import { logo } from "../../asset/images";

import "./MyModal.css";
import FormLogin from "../FormLogin";
import productApi from "../../api/productApi";
import toast from "react-hot-toast";

function MyModal({
  name,
  placement,
  ...props
}: {
  name: string;
  placement: any;
}) {
  const myModal = useSelector((e: IRootState) => e.myModal);
  const idOwner: any = useSelector((e: IRootState) => e.auth._id);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setClose());
  };

  const handleDeleteItem = () => {
    const _id: string = myModal.idItemDelete;
    const payload = {
      idProd: _id,
      idOwner,
    };
    const delApi = async () => {
      const result: any = await productApi.deleteProductById(payload);
      if (result?.status === "success") {
        toast.success("Đã xóa sản phẩm thành công!");
        dispatch(setRefreshList())
        dispatch(setClose())
      } else {
        toast.error("Đã xóa sản phẩm thất bại!");
        dispatch(setClose())
      }
    };
    delApi()
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
          <div className="p-5">
            <div className="login__head">
              <img className="login__logo" src={logo} alt="" />
              <div className="login__close" onClick={handleClose}></div>
            </div>
            {myModal.type === "login" ? (
              <FormLogin status={myModal.status}></FormLogin>
            ) : (
              <div className={`myAlert ${myModal.variant}`}>
                <h4 className="mt-4">{myModal.message}</h4>
                <div className="myAlert__btn">
                  <div className="btn-11" onClick={handleClose}>
                    <span className="btn-11__content">Đóng</span>
                  </div>
                  <div className="btn-11" onClick={handleDeleteItem}>
                    <span
                      className="btn-11__content"
                      
                    >
                      Tiếp tục
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MyModal;
