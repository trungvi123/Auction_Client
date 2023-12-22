import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { BiChevronDown, BiSearch, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import * as io from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Store,
  ExitToApp,
  Gavel,
  Notifications,
  Password,
  VolunteerActivism,
  Widgets,
  Feed,
} from "@mui/icons-material";
import NotificationDrawer from "../NotificationDrawer";
import apiConfig from "../../api/axiosConfig";
import userApi from "../../api/userApi";
import {
  setHappenningProduct,
  setUpcomingProduct,
} from "../../redux/productSlice";
const socket = io.connect(apiConfig.baseUrl);

const Header = () => {
  const dispatch = useDispatch();
  const lastName = useSelector((e: IRootState) => e.auth.lastName);
  const clientId: string = useSelector((e: IRootState) => e.auth._id);
  const crrEmail = useSelector((e: IRootState) => e.auth.email);
  const logo = useSelector((e: IRootState) => e.ui.images.logo);
  const basicUser = useSelector((e: IRootState) => e.auth.basicUser);
  const happenningProduct = useSelector(
    (e: IRootState) => e.product?.happenningProduct
  );
  const upcomingProduct = useSelector(
    (e: IRootState) => e.product?.upcomingProduct
  );
  const [loadNotifications, setLoadNotifications] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<ReactNode>(0);
  const [openNotificationDrawer, setOpenNotificationDrawer] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const caterogyQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res: any = await categoryApi.getAllCategory();
      return res;
    },
    staleTime: 1000 * 600,
  });

  useQuery({
    queryKey: ["userNotification"],
    queryFn: async () => {
      const res: any = await userApi.getUser(clientId);
      if (res?.status === "success") {
        setMilestones([
          ...res.data.followProductPreEnd,
          ...res.data.followProductPreStart,
        ]);
      }
      return res.data;
    },
    enabled: clientId !== '',
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

  const handleSetUnreadNotifications = useCallback((state: ReactNode) => {
    setUnreadNotifications(state);
  }, []);

  useEffect(() => {
    if(clientId){
      socket.emit("join_Notification_Room", clientId);
    }
    
    socket.on("respone_refreshPage", () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    });
  }, [clientId, queryClient]);
  useEffect(()=>{
    socket.on("new_notification", (data: any) => {
      setLoadNotifications(!loadNotifications);   
         
      if (data === "milestone_new") {
        queryClient.invalidateQueries({ queryKey: ["userNotification"] });
      }
    });
  },[loadNotifications, queryClient])

  useEffect(() => {
    socket.on(
      "respone_refreshProductState",
      (data: { type: string; productId: string }) => {
        if (data?.type === "removeHappenningProduct") {
          const filter = happenningProduct.filter(
            (item: any) => item._id !== data?.productId
          );
          dispatch(setHappenningProduct(filter));
          if (filter.length === 0) {
            queryClient.invalidateQueries({ queryKey: ["allProducts"] });
          }
        } else {
          const arr1: any = [];

          upcomingProduct.forEach((item: any) => {
            if (item._id !== data?.productId) {
              arr1.push(item);
            } else {
              dispatch(setHappenningProduct([...happenningProduct, item]));
            }
          });
          dispatch(setUpcomingProduct(arr1));
        }
      }
    );
  }, [dispatch, happenningProduct, queryClient, upcomingProduct]);

  return (
    <div className={`header`}>
      <Navbar className="h-100" style={{ position: "relative" }}>
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
                      <Link to={"/admin/news"}>Quản lý tin tức</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/users"}>Quản lý người dùng</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/reports"}>Quản lý khiếu nại</Link>
                    </li>
                    <li className="head-link">
                      <Link to={"/admin/contact"}>Quản lý liên hệ</Link>
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
              <Nav.Link as={Link} to="/news">
                Tin tức
              </Nav.Link>
            </div>

            <Nav.Link as={Link} to="/gioi-thieu">
              Giới thiệu
            </Nav.Link>
            <Nav.Link as={Link} to="/lien-he">
              Liên hệ
            </Nav.Link>
          </Nav>
          <div className="head-right">
            <CurrentTime
              clientId={clientId}
              milestones={milestones}
            ></CurrentTime>

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
                      <Link
                        to={`/cua-hang?user=${crrEmail}`}
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <Store></Store>
                        <span className="px-2 d-block head-link-span">
                          Cửa hàng
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
                    <li>
                      <Link
                        to="/quan-li-tin-tuc"
                        className="head-link d-flex align-items-center head-menu-child-item"
                      >
                        <Feed></Feed>
                        <span className="px-2 d-block head-link-span">
                          Quản lí tin tức
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
