import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import {
  BiCheckShield,
  BiChevronDown,
  BiLogOut,
  BiSearch,
  BiUser,
} from "react-icons/bi";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";

import { logo } from "../../asset/images";
import CurrentTime from "../CurrentTime";
import { setShow, setStatus } from "../../redux/myModalSlice";
import { setShowSearch } from "../../redux/searchModalSlice";
import { IRootState } from "../../interface";
import { setEmail, setIdUser, setLastName } from "../../redux/authSlice";
import "./Header.css";
import React, { useEffect, useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const basicUser = useSelector((e: IRootState) => e.auth.basicUser);
  const [isScrolled, setIsScrolled] = useState(false);
  const openMyModal = () => {
    dispatch(setStatus("login"));
    dispatch(setShow());
  };
  const handleChangePass = () => {
    dispatch(setStatus("changePass"));
    dispatch(setShow());
  };
  const openSearchModal = () => {
    dispatch(setShowSearch());
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("reduxState");
    dispatch(setEmail(""));
    dispatch(setLastName(""));
    dispatch(setIdUser(""));
    window.location.replace("/");
  };

  const handleScroll = () => {
    // Kiểm tra vị trí cuộn chuột để xác định có thêm class hay không
    if (window.scrollY > 30) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    // Thêm sự kiện lắng nghe sự kiện cuộn chuột
    window.addEventListener("scroll", handleScroll);

    // Xóa sự kiện khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header ${isScrolled ? "isScrolled" : ""}`}>
      <Navbar>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img className="head__logo" src={logo} alt="" />
          </Navbar.Brand>
          <Nav>
            <div className="NavLink-box">
              <Nav.Link>
                Tài sản đấu giá
                <div className="arrow-icon__box">
                  <BiChevronDown className="arrow-icon"></BiChevronDown>
                </div>
              </Nav.Link>
              <div className="head-menu-child">
                <ul>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Quần áo</Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Đồ gia dụng</Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Sách</Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Khác</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="NavLink-box">
              <Nav.Link>
                Cuộc đấu giá
                <div className="arrow-icon__box">
                  <BiChevronDown className="arrow-icon"></BiChevronDown>
                </div>
              </Nav.Link>
              <div className="head-menu-child">
                <ul>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>
                      Cuộc đấu giá sắp diễn ra
                    </Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>
                      Cuộc đấu giá đang diễn ra
                    </Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>
                      Cuộc đấu giá sắp kết thúc
                    </Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>
                      Cuộc đấu giá đã kết thúc
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="NavLink-box">
              <Nav.Link>
                Tin tức
                <div className="arrow-icon__box">
                  <BiChevronDown className="arrow-icon"></BiChevronDown>
                </div>
              </Nav.Link>
              <div className="head-menu-child">
                <ul>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Thông báo đấu giá</Link>
                  </li>
                  <li className="head-link">
                    <Link to={"/category/quan-ao"}>Tin khác</Link>
                  </li>
                </ul>
              </div>
            </div>

            <Nav.Link as={Link} to="/news">
              Giới thiệu
            </Nav.Link>
            <Nav.Link as={Link} to="/news">
              Liên hệ
            </Nav.Link>
          </Nav>

          <div className="head-right">
            <CurrentTime></CurrentTime>

            <div onClick={openSearchModal} className="search__circle">
              <BiSearch className="search__icon"></BiSearch>
            </div>
            {!lastName ? (
              <div onClick={openMyModal} className="btn-11 head__btn__login">
                Đăng Nhập
              </div>
            ) : (
              <div className="search__circle user__cirlce">
                <BiUser className="search__icon"></BiUser>
                <div className="head-menu-child head-menu-child-user">
                  <h6 className="lastName">{lastName}</h6>
                  <ul>
                    {!basicUser && (
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="head-link d-flex align-items-center head-menu-child-item"
                        >
                          <BiCheckShield size={18}></BiCheckShield>
                          <span className="px-2 d-block">DashBoard</span>
                        </Link>
                      </li>
                    )}
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
                        <span className="px-2 d-block">
                          Quản lí cuộc đấu giá
                        </span>
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
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default React.memo(Header);
