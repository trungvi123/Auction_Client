import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { logo } from "../../asset/images";
import CurrentTime from "../CurrentTime";
import { useDispatch } from "react-redux";
import { setShow } from "../../redux/myModalSlice";
import { setShowSearch } from "../../redux/searchModalSlice";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();

  const openMyModal = () => {
    dispatch(setShow());
  };

  const openSearchModal = () => {
    dispatch(setShowSearch());
  };

  return (
    <div>
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

            <div onClick={openMyModal} className="btn-11 head__btn__login">
              Đăng Nhập
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
