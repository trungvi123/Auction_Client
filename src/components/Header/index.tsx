import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { BiChevronDown, BiSearch, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import * as io from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@mui/material";

import CurrentTime from "../CurrentTime";
import { setShow, setStatus } from "../../redux/myModalSlice";
import { setShowSearch } from "../../redux/searchModalSlice";
import { IRootState } from "../../interface";
import {
  setBasicUser,
  setEmail,
  setIdUser,
  setLastName,
} from "../../redux/authSlice";
import "./Header.css";
import categoryApi from "../../api/categoryApi";
import TemporaryDrawer from "../Drawer";
import {
  AccountCircle,
  ExitToApp,
  Gavel,
  Notifications,
  Password,
  VolunteerActivism,
  Widgets,
} from "@mui/icons-material";
import NotificationDrawer from "../NotificationDrawer";
import apiConfig from "../../api/axiosConfig";
const socket = io.connect(apiConfig.baseUrl);

const Header = () => {
  const dispatch = useDispatch();
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const clientId = useSelector((e: IRootState) => e.auth._id);
  const logo = useSelector((e: IRootState) => e.ui.images.logo);
  const basicUser = useSelector((e: IRootState) => e.auth.basicUser);


  const [loadNotifications, setLoadNotifications] = useState<boolean>(false);

  const [unreadNotifications, setUnreadNotifications] = useState<ReactNode>(0);

  const [openNotificationDrawer, setOpenNotificationDrawer] =
    useState<boolean>(false);

  const caterogyQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res: any = await categoryApi.getAllCategory();
      return res;
    },
    staleTime: 1000 * 600,
  });

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
    dispatch(setBasicUser(true));
    dispatch(setIdUser(""));
    window.location.replace("/");
  };

  const handleOpenNotificationDrawer = useCallback((state: boolean) => {
    setOpenNotificationDrawer(state);
  }, []);

  const handleSetUnreadNotifications = useCallback((state:ReactNode)=>{
    setUnreadNotifications(state)
  },[])

  useEffect(() => {
    socket.emit("join_Notification_Room", clientId);
    socket.on("new_notification", () => {
      setLoadNotifications(!loadNotifications);
    });
  }, [clientId, loadNotifications]);

  return (
    <div className={`header`}>
      <Navbar className="h-100">
        <Container className="header-container">
          <div className="temporaryDrawer">
            <TemporaryDrawer isAdmin={!basicUser}></TemporaryDrawer>
          </div>

          <div>
            <NotificationDrawer
              handleOpenNotificationDrawer={handleOpenNotificationDrawer}
              handleSetUnreadNotifications={handleSetUnreadNotifications}
              open={openNotificationDrawer}
              clientId={clientId}
              loadNotifications={loadNotifications}
            ></NotificationDrawer>
          </div>

          <Navbar.Brand as={Link} to="/">
            <img className="head__logo" src={logo} alt="" />
          </Navbar.Brand>
          <Nav className="nav-container">
            {!basicUser && (
              <div className="NavLink-box">
                <Nav.Link>
                  Quản lí
                  <div className="arrow-icon__box">
                    <BiChevronDown className="arrow-icon"></BiChevronDown>
                  </div>
                </Nav.Link>
                <div className="head-menu-child">
                  <ul>
                    <li className="head-link">
                      <Link to={"/admin/dashboard"}>Dashboard</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/auction"}>Quản lý cuộc đấu giá</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/users"}>Quản lý người dùng</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/reports"}>Quản lý khiếu nại</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/ui"}>Quản lý giao diện</Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}

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
                    <Link to={`/danh-muc-tai-san`}>Tất cả</Link>
                  </li>
                  {caterogyQuery?.data &&
                    caterogyQuery?.data?.category?.map((e: any) => {
                      return (
                        <li key={e.link} className="head-link">
                          <Link to={`/danh-muc-tai-san/${e.link}`}>
                            {e.name}
                          </Link>
                        </li>
                      );
                    })}
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

            <div onClick={openSearchModal} className="search__circle search">
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
                    <li>
                      <Link
                        to="/profile"
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <AccountCircle></AccountCircle>
                        <span className="px-2 d-block head-link-span">
                          Hồ sơ
                        </span>
                      </Link>
                    </li>
                    <li>
                      <div
                        onClick={() => setOpenNotificationDrawer(true)}
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <Badge badgeContent={unreadNotifications} color="error">
                          <Notifications></Notifications>
                        </Badge>

                        <span className="px-2 d-block head-link-span">
                          Thông báo
                        </span>
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/tao-dau-gia"
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <Gavel></Gavel>
                        <span className="px-2 d-block head-link-span">
                          Tạo cuộc đấu giá
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/chia-se-vat-pham"
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <VolunteerActivism></VolunteerActivism>
                        <span className="px-2 d-block head-link-span">
                          Tặng / chia sẻ vật phẩm
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/quan-li-dau-gia"
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <Widgets></Widgets>
                        <span className="px-2 d-block head-link-span">
                          Quản lí cuộc đấu giá
                        </span>
                      </Link>
                    </li>
                    <hr className="my-0" />
                    <li
                      onClick={handleChangePass}
                      className="head-link d-flex align-items-center head-menu-child-item"
                    >
                      <Password></Password>
                      <span className="px-2 d-block head-link-span">
                        Đổi mật khẩu
                      </span>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="head-link d-flex align-items-center head-menu-child-item"
                    >
                      <ExitToApp></ExitToApp>
                      <span className="px-2 d-block head-link-span">
                        Đăng xuất
                      </span>
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
export { socket };
