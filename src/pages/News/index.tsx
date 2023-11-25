import { Backdrop, CircularProgress, Pagination, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import newsApi from "../../api/newsApi";
import { auction, breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import formatDateTime from "../../utils/formatDay";

const newsInPage = 8;
const News = () => {
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(2);
  const [newsRender, setNewsRender] = useState<any>([]);

  const newsQuery = useQuery({
    queryKey: ["news"],
    queryFn: () => newsApi.getAllNews(),
    staleTime: 1000 * 600,
  });

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    pageCurr: number
  ) => {
    if (newsQuery?.data?.data.length > newsInPage) {
      const pageCount = Math.ceil(newsQuery?.data?.data.length / newsInPage);
      const newArrProd = newsQuery?.data?.data.slice(
        (pageCurr - 1) * newsInPage,
        pageCurr * newsInPage
      );
      setPage(pageCurr);
      setNewsRender(newArrProd);
      setPageNumber(pageCount);
    }
  };
  useEffect(() => {
    if (newsQuery?.data?.data.length > newsInPage) {
      const pageCount = Math.ceil(newsQuery?.data?.data?.length / newsInPage);
      const newArrProd = newsQuery?.data?.data?.slice(0, newsInPage);
      setPage(1);
      setNewsRender(newArrProd);
      setPageNumber(pageCount);
    } else {
      setNewsRender(newsQuery?.data?.data);
    }
  }, [newsQuery?.data?.data]);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={newsQuery?.isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <Breadcrumbs
          title={"Tin tức"}
          type={"tin tức"}
          img={breadcrumbs}
        ></Breadcrumbs>
        <Row className="mt-5" style={{ minHeight: "500px" }}>
          {newsRender?.map((item: any) => {
            return (
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="position-relative mb-3">
                  <Link to={`/tin-tuc/${item._id}`}>
                    <img
                      className="img-fluid w-100"
                      src={auction}
                      style={{ objectFit: "cover" }}
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
                        {item.isSystem ? "Hệ thống" : "Tin tức"}
                      </div>
                    </div>
                    <Link
                      to={`/tin-tuc/${item._id}`}
                      className="h5 d-block mb-3 text-secondary text-uppercase font-weight-bold"
                    >
                      {item.title}
                    </Link>
                    <p className="m-0">{item.description}</p>
                  </div>
                  <div
                    className="d-flex justify-content-between bg-white border border-top-0 p-4"
                    style={{ gap: "8px" }}
                  >
                    <Link to={`/cua-hang?user=${item.owner.email}`}>
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: "8px" }}
                      >
                        <img
                          className="rounded-circle"
                          src={item.owner.avatar}
                          width="45"
                          height="45"
                          alt=""
                        />
                        <small style={{ flex: 1 }}>
                          {item.owner.firstName + " " + item.owner.lastName}
                        </small>
                      </div>
                    </Link>
                    <div className="d-flex align-items-center">
                      <span className="text-body">
                        <small>{formatDateTime(item.createdAt)}</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>
        {newsQuery?.data?.data?.length > newsInPage && (
          <Row className="justify-content-center mt-4">
            <Col sm={4} className="d-flex justify-content-center">
              <Stack spacing={2}>
                <Pagination
                  count={pageNumber}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default News;
