import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";
import productApi from "../../api/productApi";
import {
  home_intro,
  banner,
  banner_res,
  product_bg,
} from "../../asset/images/";
import MySlider from "../../components/MySlider";
import ProductCard from "../../components/ProductCard";
import TitleH2 from "../../components/TitleH2";

import "./Home.css";
const Home = () => {
  const quantity = 6;

  const productsQuery = useQuery({
    queryKey: ["products", quantity],
    queryFn: () => productApi.getProducts(),
  });

  return (
    <Container fluid>
      <section className="home-intro">
        <img className="home-intro__bg" src={home_intro} alt="background" />
        <div className="under-banner"></div>
        <Row className="justify-content-center">
          <Col xxl={4} xl={5} lg={5}>
            <div className="home-intro__left">
              <p className="home-intro__left__text1">
                Chào mừng bạn đến với Lạc Việt Auction
              </p>
              <h1 className="home-intro__left__h1">
                Nền tảng đấu giá trực tuyến hàng đầu Việt Nam
              </h1>
              <p className="home-intro__left__text2">
                Tự hào là một trong những nhà đấu giá lớn nhất tại Việt Nam, Lạc
                Việt luôn là đơn vị tiên phong ứng dụng công nghệ thông tin vào
                hoạt động đấu giá. Lạc Việt là đơn vị tổ chức cuộc đấu giá trực
                tuyến chính thống đầu tiên tại Việt Nam, vào ngày 17/07/2020.
              </p>
              <div className="btn-11">
                <span className="btn-11__content">KHÁM PHÁ</span>
              </div>
            </div>
          </Col>
          <Col xxl={5} xl={6} lg={6}>
            <div className="d-flex align-items-center h-100">
              <img className="home-banner" src={banner} alt="banner" />
            </div>
          </Col>
        </Row>
      </section>
      <section className="home-intro__res">
        <img
          className="home-intro__bg home-intro__bg__res"
          src={banner_res}
          alt="background"
        />
        <Row>
          <Col>
            <div className="home-intro__left res">
              <p className="home-intro__left__text1 res">
                Chào mừng bạn đến với Lạc Việt Auction
              </p>
              <h1 className="home-intro__left__h1 res">
                Nền tảng đấu giá trực tuyến hàng đầu Việt Nam
              </h1>
              <p className="home-intro__left__text2 res">
                Tự hào là một trong những nhà đấu giá lớn nhất tại Việt Nam, Lạc
                Việt luôn là đơn vị tiên phong ứng dụng công nghệ thông tin vào
                hoạt động đấu giá. Lạc Việt là đơn vị tổ chức cuộc đấu giá trực
                tuyến chính thống đầu tiên tại Việt Nam, vào ngày 17/07/2020.
              </p>
              <div className="btn-11 w-100">
                <span className="btn-11__content">KHÁM PHÁ</span>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section className="product-section">
        <img className="product-section__bg" src={product_bg} alt="" />
        <Container>
          <div>
            <TitleH2 title="Tài sản sắp được đấu giá"></TitleH2>
            {productsQuery?.data?.data?.length >= 6 ? (
              <div>
                {/* type dùng để biết xem slider này sẽ chứa card loại nào */}
                {/* quantity dùng để xác định số lượng sản phẩm lấy về qua Api */}
                <MySlider
                  type={"product"}
                  data={productsQuery?.data?.data}
                ></MySlider>
              </div>
            ) : (
              <div>
                <Row>
                  {productsQuery?.data?.data?.map((item: any) => {
                    return (
                      <Col md={5} lg={3} sm={2} key={item._id}>
                        <ProductCard data={item}></ProductCard>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </div>
        </Container>
      </section>
    </Container>
  );
};

export default Home;
