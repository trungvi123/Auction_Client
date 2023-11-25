import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import newsApi from "../../api/newsApi";
import { auction } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import formatDateTime from "../../utils/formatDay";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();

  const newsQuery = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const res: any = await newsApi.getNewById(id);
      return res?.data;
    },
    enabled: id !== undefined,
  });

  const otherNewsQuery = useQuery({
    queryKey: ["news"],
    queryFn: () => newsApi.getAllNews(),
    staleTime: 1000 * 600,
  });

  return (
    <Container>
      <Breadcrumbs title={newsQuery?.data?.title} type="tin tức"></Breadcrumbs>
      <Row>
        <Col lg={8}>
          <div className="left-content mt-4">
            <div className="news-author ">
              <div className="news-author__avatar">
                <img
                  src={newsQuery?.data?.owner.avatar}
                  className="w-100"
                  alt=""
                />
              </div>
              <div>
                <span>
                  Được chia sẻ bởi:{" "}
                  <Link to={`/cua-hang?user=${newsQuery?.data?.owner.email}`}>
                    <b>
                      {newsQuery?.data?.owner.firstName +
                        " " +
                        newsQuery?.data?.owner.lastName}
                    </b>
                  </Link>
                </span>
                <p className="mb-0">
                  {formatDateTime(newsQuery?.data?.createdAt)}
                </p>
              </div>
            </div>
            <div
              className="mt-4 news-content"
              dangerouslySetInnerHTML={{ __html: newsQuery?.data?.content }}
            ></div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="mt-4 ">
            <div className="mb-3">
              <div className="section-title mb-0">
                <h5 className="m-0 text-uppercase font-weight-bold">
                  Tin khác
                </h5>
              </div>
              <div className="p-2 news-other-list">
                {otherNewsQuery?.data?.data?.slice(0,6).map((item: any) => {
                  if (item._id !== id) {
                    return (
                      <div key={item._id} className="news-other-item mt-1">
                        <Link to={""} className="news-other-item__img">
                          <img src={item.img || auction} alt="" />
                        </Link>
                        <div className="news-other-item__content">
                          <Link to={""} className="title">
                            {item.title}
                          </Link>
                          <div className="d-flex justify-content-end">
                            <p className="mb-0">
                              {" "}
                              {formatDateTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null
                })}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsDetail;
