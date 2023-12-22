import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import {
  intro_icon1,
  intro_icon2,
  intro_icon3,
  intro_icon4,
  long_intro,
} from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import { IRootState } from "../../interface";
import "./Introduce.css";

const Introduce = () => {
  const description = useSelector((e: IRootState) => e.ui.inforPage.longIntro);

  const numberIntro = useQuery({
    queryKey: ["numberIntro"],
    queryFn: () => userApi.getNumberOfIntro(),
  });

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <img
        style={{
          position: "absolute",
          top: "110px",
          left: "0",
          zIndex: "-1",
        }}
        src={long_intro}
        alt=""
      />
      <Container>
        <Breadcrumbs title={"Về chúng tôi"} type={"Về chúng tôi"}></Breadcrumbs>
        <h1
          style={{
            fontWeight: "600",
            textAlign: "center",
            marginTop: "48px",
            marginBottom: "24px",
          }}
        >
          Lời giới thiệu
        </h1>
        <Row className="justify-content-center">
          <Col sm={10}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "400",
                color: "#696969",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            ></div>
          </Col>
        </Row>
      </Container>
      <Container fluid className="statistics-container">
        <hr />
        <Row>
          <h2
            style={{
              marginTop: "40px",
              fontWeight: "600",
              fontSize: "28px",
              lineHeight: "36px",
              textTransform: "uppercase",
              color: "#121212",
              textAlign: "center",
            }}
            className="text-center"
          >
            Những con số nổi bật
          </h2>

          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon1} alt="" />
              <span className="statistics-item__count">{numberIntro?.data?.data?.auction}+</span>
              <span className="statistics-item__type">
                Cuộc đấu giá đã được tạo
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon2} alt="" />
              <span className="statistics-item__count">{numberIntro?.data?.data?.free}+</span>
              <span className="statistics-item__type">
                Sản phẩm được chia sẻ
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon3} alt="" />
              <span className="statistics-item__count">{numberIntro?.data?.data?.news}+</span>
              <span className="statistics-item__type">
                Bài viết được đăng tải
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon4} alt="" />
              <span className="statistics-item__count">{numberIntro?.data?.data?.user}+</span>
              <span className="statistics-item__type">Số lượng thành viên</span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Introduce;
