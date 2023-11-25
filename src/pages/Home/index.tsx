import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import freeProductApi from "../../api/freeProduct";
import productApi from "../../api/productApi";
import { banner_res, product_bg, home_intro } from "../../asset/images/";
import FreeProductCard from "../../components/FreeProductCard";
import MySlider from "../../components/MySlider";
import ProductCard from "../../components/ProductCard";
import SEO from "../../components/SEO";
import TitleH2 from "../../components/TitleH2";
import { IRootState } from "../../interface";
import { setHappenningProduct, setUpcomingProduct } from "../../redux/productSlice";

import "./Home.css";
const Home = () => {
  const banner_infor = useSelector(
    (e: IRootState) => e.ui?.images?.short_intro
  );
  const intro = useSelector((e: IRootState) => e.ui?.inforPage?.shortIntro);
  const goingOnList = useSelector((e:IRootState)=> e.product?.happenningProduct)
  const prepareToStart = useSelector((e:IRootState)=> e.product?.upcomingProduct)
 
  const dispatch = useDispatch()

  const freeProductsQuery = useQuery({
    queryKey: ["freePproducts"],
    queryFn: () => freeProductApi.getFreeProducts(9),
    staleTime: 1000 * 600,
  });

  const allProductsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => productApi.getAllProducts(),
    staleTime: 1000 * 600,
  });

  const caterogyQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res: any = await categoryApi.getAllCategory();
      return res;
    },
    staleTime: 1000 * 600,
  });

  useEffect(() => {
    const list1:any[] = [];
    const list2:any[] = [];
    allProductsQuery?.data?.data?.forEach((item: any) => {
      if (item.auctionEnded === false && item.auctionStarted === true) { // dang dien ra
        list1.push(item)
      } else if (item.auctionEnded === false && item.auctionStarted === false) { // sap dien ra
        list2.push(item)
      }
    });
    dispatch(setHappenningProduct(list1))
    dispatch(setUpcomingProduct(list2))
  }, [allProductsQuery?.data?.data, dispatch]);

  return (
    <Container fluid>
      <SEO title={"Trang chủ"}></SEO>
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
                Nền tảng đấu giá trực tuyến
              </h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(intro),
                }}
                className="home-intro__left__text2"
              ></div>
              <Link to={"/gioi-thieu"} className="btn-11">
                <span className="btn-11__content">KHÁM PHÁ</span>
              </Link>
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
                Nền tảng đấu giá trực tuyến
              </h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(intro),
                }}
                className="home-intro__left__text2 res"
              ></div>
              <Link
                style={{ width: "300px" }}
                to={"/gioi-thieu"}
                className="btn-11"
              >
                <span className="btn-11__content">KHÁM PHÁ</span>
              </Link>
            </div>
          </Col>
        </Row>
      </section>

      {goingOnList?.length > 0 && (
        <section className="product-section">
          <img className="product-section__bg" src={product_bg} alt="" />
          <Container>
            <div>
              <TitleH2 title="Tài sản đang được đấu giá"></TitleH2>

              {goingOnList?.length >= 3 ? (
                <div>
                  {/* type dùng để biết xem slider này sẽ chứa card loại nào */}
                  {/* quantity dùng để xác định số lượng sản phẩm lấy về qua Api */}
                  <MySlider type={"product"} data={goingOnList}></MySlider>
                </div>
              ) : (
                <div>
                  <Row>
                    {goingOnList?.map((item: any) => {
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
      )}

      {prepareToStart?.length > 0 && (
        <section className="product-section">
          <img className="product-section__bg" src={product_bg} alt="" />
          <Container>
            <div>
              <TitleH2 title="Tài sản sắp được đấu giá"></TitleH2>

              {prepareToStart?.length >= 3 ? (
                <div>
                  {/* type dùng để biết xem slider này sẽ chứa card loại nào */}
                  {/* quantity dùng để xác định số lượng sản phẩm lấy về qua Api */}
                  <MySlider
                    type={"product"}
                    data={prepareToStart}
                  ></MySlider>
                </div>
              ) : (
                <div>
                  <Row>
                    {prepareToStart?.map((item: any) => {
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
      )}

      {caterogyQuery?.data?.category.map((cate: any) => {
        const allProducts =  [...goingOnList,...prepareToStart]
        let dataFilter = allProducts.filter(
          (item: any) =>
            item.category.link === cate.link &&
            item.auctionEnded === false &&
            item.auctionStarted === false
        );

        dataFilter?.sort((a: any, b: any) => {
          if (a.startTime < b.startTime) {
            return -1;
          }
          if (a.startTime > b.startTime) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        if (dataFilter?.length > 0) {
          return (
            <section className="product-section" key={cate.link}>
              <img className="product-section__bg" src={product_bg} alt="" />

              <Container>
                <div>
                  <TitleH2
                    title={`${
                      cate.link === "khac"
                        ? "Các cuộc đấu giá khác"
                        : `${cate.name} sắp được đấu giá`
                    } `}
                  ></TitleH2>

                  {dataFilter?.length >= 3 ? (
                    <div>
                      {/* type dùng để biết xem slider này sẽ chứa card loại nào */}
                      {/* quantity dùng để xác định số lượng sản phẩm lấy về qua Api */}
                      <MySlider
                        type={"product"}
                        data={dataFilter || []}
                      ></MySlider>
                    </div>
                  ) : (
                    <div>
                      <Row>
                        {dataFilter?.map((item: any) => {
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
          );
        } else {
          return null;
        }
      })}

      <section className="product-section">
        <img className="product-section__bg" src={product_bg} alt="" />
        <Container>
          <div>
            {freeProductsQuery?.data?.data?.length > 0 && (
              <TitleH2 title="Các sản phẩm có thể nhận miễn phí"></TitleH2>
            )}
            {freeProductsQuery?.data?.data?.length >= 3 ? (
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
