import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../interface";
import { setClose } from "../../redux/myModalSlice";
import { logo } from "../../asset/images";

import "./MyModal.css";
import { Link } from "react-router-dom";
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
        {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header> */}
        <Offcanvas.Body>
          <div className="p-5">
            <div className="login__head">
              <img className="login__logo" src={logo} alt="" />
              <div className="login__close" onClick={handleClose}></div>
            </div>
            <p className="login__text">
              Bạn chưa có tài khoản? <Link to={'/register'}>Đăng Ký Ngay</Link>
            </p>
            <FormLogin></FormLogin>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MyModal;