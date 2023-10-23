import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import freeProductApi from "../../api/freeProduct";
import productApi from "../../api/productApi";
import { banner_res, product_bg, home_intro } from "../../asset/images/";
import FreeProductCard from "../../components/FreeProductCard";
import MySlider from "../../components/MySlider";
import ProductCard from "../../components/ProductCard";
import TitleH2 from "../../components/TitleH2";
import { IRootState } from "../../interface";

import "./Home.css";
const Home = () => {
  const page = 1;
  const banner_infor = useSelector((e: IRootState) => e.ui.images.short_intro);
  const intro = useSelector((e: IRootState) => e.ui.inforPage.shortIntro);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getPrepareToStart(),
    staleTime: 1000 * 600,
  });

  const freeProductsQuery = useQuery({
    queryKey: ["freePproducts", page],
    queryFn: () => freeProductApi.getAllFreeProducts(9),
    staleTime: 1000 * 600,
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
                Chào mừng bạn đến với CIT Auction
              </p>
              <h1 className="home-intro__left__h1">
                Nền tảng đấu giá trực tuyến hàng đầu Việt Nam
              </h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(intro),
                }}
                className="home-intro__left__text2"
              ></div>
              <div className="btn-11">
                <span className="btn-11__content">KHÁM PHÁ</span>
              </div>
            </div>
          </Col>
          <Col xxl={5} xl={6} lg={6}>
            <div className="d-flex align-items-center h-100">
              <img className="home-banner" src={banner_infor} alt="banner" />
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
                Chào mừng bạn đến với CIT AUCTION Auction
              </p>
              <h1 className="home-intro__left__h1 res">
                Nền tảng đấu giá trực tuyến hàng đầu Việt Nam
              </h1>
              <p className="home-intro__left__text2 res">
                Tự hào là một trong những nhà đấu giá lớn nhất tại Việt Nam, Lạc
                Việt luôn là đơn vị tiên phong ứng dụng công nghệ thông tin vào
                hoạt động đấu giá. CIT AUCTION là đơn vị tổ chức cuộc đấu giá
                trực tuyến chính thống đầu tiên tại Việt Nam, vào ngày
                17/07/2020.
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
            {productsQuery?.data?.data?.length > 0 && (
              <TitleH2 title="Tài sản sắp được đấu giá"></TitleH2>
            )}
            {productsQuery?.data?.data?.length >= 3 ? (
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
                      <Col md={6} lg={4} sm={12} key={item._id}>
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

      <section className="product-section">
        <img className="product-section__bg" src={product_bg} alt="" />
        <Container>
          <div>
            {freeProductsQuery?.data?.data?.length > 0 && (
              <TitleH2 title="Các sản phẩm có thể nhận miễn phí"></TitleH2>
            )}
            {freeProductsQuery?.data?.data?.length >= 6 ? (
              <div>
                {/* type dùng để biết xem slider này sẽ chứa card loại nào */}
                {/* quantity dùng để xác định số lượng sản phẩm lấy về qua Api */}
                <MySlider
                  type={"freeProduct"}
                  data={freeProductsQuery?.data?.data}
                ></MySlider>
              </div>
            ) : (
              <div>
                <Row>
                  {freeProductsQuery?.data?.data?.map((item: any) => {
                    return (
                      <Col md={6} lg={4} sm={12} key={item._id}>
                        <FreeProductCard data={item}></FreeProductCard>
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
