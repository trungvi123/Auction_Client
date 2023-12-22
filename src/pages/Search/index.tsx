import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import productApi from "../../api/productApi";
import { auction, breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import FreeProductCard from "../../components/FreeProductCard";
import ProductCard from "../../components/ProductCard";
import SEO from "../../components/SEO";
import formatDateTime from "../../utils/formatDay";
import normalizeWord from "../../utils/normalizeWord";

const Search = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword: string | null = params.get("keyword");

  const searchQuery = useQuery({
    queryKey: ["search", { keyword: normalizeWord(keyword) }],
    queryFn: async () => {
      const res: any = await productApi.search({
        keyword: normalizeWord(keyword) || "",
      });
      return res.data;
    },
  });

  console.log(searchQuery?.data);

  return (
    <Container>
      <SEO title={"Tìm kiếm"}></SEO>
      <Breadcrumbs
        title={`Kết quả tìm kiếm từ khóa "${keyword}"`}
        type={"tìm kiếm"}
        img={breadcrumbs}
      ></Breadcrumbs>
      <Row>
        <Col md={12}>
          <div>
            <Row className="mt-3">
              {searchQuery.data?.data?.map((item: any, index: number) => {
                return (
                  <Col md={6} lg={4} sm={12} key={index}>
                    {item?.isFree ? (
                      <FreeProductCard data={item}></FreeProductCard>
                    ) : (
                      <ProductCard data={item}></ProductCard>
                    )}
                  </Col>
                );
              })}
            </Row>
            <Row className="mt-3">
              {searchQuery?.data?.dataNews?.map((item: any, index: number) => {
                return (
                  <Col md={6} lg={4} sm={12} key={item._id}>
                    <div key={item._id} className="px-2">
                      <div className="position-relative mb-3">
                        <Link to={`/tin-tuc/${item?._id}`}>
                          <img
                            className="img-fluid border border-bottom-0 news-img"
                            src={item?.img || auction}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "250px",
                            }}
                            alt="hinh-anh"
                          />
                        </Link>

                        <div className="bg-white border border-top-0 p-4">
                          <div className="mb-2">
                            <div
                              style={{
                                height: "30px",
                                width: "100px",
                                borderRadius: "12px",
                                backgroundColor: "yellow",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                              className=" text-uppercase d-flex justify-content-center align-items-center"
                            >
                              {item?.newsSystem ? "Hệ thống" : "Tin tức"}
                            </div>
                          </div>
                          <Link
                            to={`/tin-tuc/${item?._id}`}
                            className="h5 d-block mb-3 text-secondary text-uppercase font-weight-bold"
                          >
                            {item?.title}
                          </Link>
                          <p className="m-0">{item?.description}</p>
                        </div>
                        <div
                          className="d-flex justify-content-between bg-white border border-top-0 p-4"
                          style={{ gap: "8px" }}
                        >
                          <Link to={`/cua-hang?user=${item?.owner?.email}`}>
                            <div
                              className="d-flex align-items-center"
                              style={{ gap: "8px" }}
                            >
                              <img
                                className="rounded-circle"
                                src={item?.owner?.avatar}
                          style={{ objectFit: 'cover' }}

                                width="45"
                                height="45"
                                alt=""
                              />
                              <div>
                                <small style={{ flex: 1 }}>
                                  {item?.owner?.firstName +
                                    " " +
                                    item?.owner?.lastName}
                                </small>
                                <p className="text-body mb-0">
                                  <small>
                                    {formatDateTime(item?.createdAt)}
                                  </small>
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
