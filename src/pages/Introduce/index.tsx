import DOMPurify from "dompurify";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { intro_icon1, long_intro } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import { IRootState } from "../../interface";
import "./Introduce.css";

const Introduce = () => {
  const description = useSelector((e: IRootState) => e.ui.inforPage.longIntro);

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
              <span className="statistics-item__count">50+</span>
              <span className="statistics-item__type">
                Nhà đấu giá đối tác của Lạc Việt
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon1} alt="" />
              <span className="statistics-item__count">200 triệu+</span>
              <span className="statistics-item__type">
                Giá trị tài sản đã bán
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon1} alt="" />
              <span className="statistics-item__count">145+</span>
              <span className="statistics-item__type">
                Tài sản đã đấu giá thành công
              </span>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="statistics-item py-md-5 py-sm-4 py-2">
              <img className="statistics-item__img" src={intro_icon1} alt="" />
              <span className="statistics-item__count">150+</span>
              <span className="statistics-item__type">
                Cuộc đấu giá đã diễn ra
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Introduce;
