import { BiCheckShield, BiLogOut, BiUser } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import { IRootState } from "../../../interface";
import "./AdminHeader.css";
import AdminSideBar from "../AdminSideBar";

const AdminHeader = () => {
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const openMyModal = () => {
    // dispatch(setStatus("login"));
    // dispatch(setShow());
  };
  const handleChangePass = () => {
    // dispatch(setStatus("changePass"));
    // dispatch(setShow());
  };
  const openSearchModal = () => {
    // dispatch(setShowSearch());
  };
  const handleLogout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("reduxState");
    // dispatch(setType("login"));
    // dispatch(setEmail(""));
    // dispatch(setLastName(""));
    // dispatch(setIdUser(""));
    // window.location.replace("/");
  };
  return (
    <div className="ad-header">
      <AdminSideBar></AdminSideBar>
      <Container fluid>
        <Row className="justify-content-between p-4 align-items-center">
          <Col sm={3}>
            <div>Dashboard</div>
          </Col>
          <Col sm={3} className="d-flex justify-content-end">
            <div className="search__circle user__cirlce">
              <BiUser className="search__icon"></BiUser>
              <div className="head-menu-child head-menu-child-user">
                <h6 className="lastName">{lastName}</h6>
                <ul>
                  <li>
                    <Link
                      to="/tao-dau-gia"
                      className="head-link d-flex align-items-center head-menu-child-item"
                    >
                      <BiCheckShield size={18}></BiCheckShield>
                      <span className="px-2 d-block">Tạo cuộc đấu giá</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/quan-li-dau-gia"
                      className="head-link d-flex align-items-center head-menu-child-item"
                    >
                      <BiCheckShield size={18}></BiCheckShield>
                      <span className="px-2 d-block">Quản lí cuộc đấu giá</span>
                    </Link>
                  </li>

                  <li
                    onClick={handleChangePass}
                    className="head-link d-flex align-items-center head-menu-child-item"
                  >
                    <BiCheckShield size={18}></BiCheckShield>
                    <span className="px-2 d-block">Đổi mật khẩu</span>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="head-link d-flex align-items-center head-menu-child-item"
                  >
                    <BiLogOut size={18}></BiLogOut>
                    <span className="px-2 d-block">Đăng xuất</span>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminHeader;
