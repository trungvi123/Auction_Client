/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiMap, BiPhoneCall, BiEnvelope } from "react-icons/bi";
import { useSelector } from "react-redux";
import { long_intro } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import SEO from "../../components/SEO";
import { IRootState } from "../../interface";
import "../Introduce/Introduce.css";

const Contact = () => {
  const inforPage = useSelector((e: IRootState) => e.ui.inforPage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = (data: any) => {
    console.log(data);
  };

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
        <SEO title={"Liên hệ"}></SEO>

        <Breadcrumbs title={"Liên hệ"} type={"Liên hệ"}></Breadcrumbs>

        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="contact-infor__container">
              <div className="contact-infor__icon-box">
                <BiMap size={45} className="contact-infor__icon"></BiMap>
              </div>
              <div className="contact-infor__text">
                <h5>Địa chỉ</h5>
                <span>{inforPage.address}</span>
              </div>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="contact-infor__container">
              <div className="contact-infor__icon-box">
                <BiPhoneCall
                  size={45}
                  className="contact-infor__icon"
                ></BiPhoneCall>
              </div>
              <div className="contact-infor__text">
                <h5>Số điện thoại</h5>
                <span>{inforPage.phoneNumber}</span>
              </div>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="contact-infor__container">
              <div className="contact-infor__icon-box">
                <BiEnvelope
                  size={45}
                  className="contact-infor__icon"
                ></BiEnvelope>
              </div>

              <div className="contact-infor__text">
                <h5>Email</h5>
                <span style={{ wordBreak: "break-word" }}>
                  {inforPage.email}
                </span>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="mt-5" lg={6}>
            <Form
              style={{
                borderRadius: "5px",
                boxShadow: "5px 7px 35px rgba(139,139,139,.1)",
                padding: "40px",
                background: "#fff",
              }}
            >
              <Row>
                <Col>
                  <h1
                    style={{
                      fontWeight: "600",
                      marginBottom: "24px",
                    }}
                  >
                    Liên hệ
                  </h1>
                  <p>
                    Vui lòng điền thông tin vào các ô bên dưới, chúng tôi sẽ
                    liên lạc và phản hồi lại quý khách
                  </p>
                </Col>
              </Row>

              <Row>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  md="6"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    type="text"
                    placeholder="Họ & tên"
                    {...register("name", { required: true })}
                  />
                  {errors?.name?.type === "required" && (
                    <p className="text__invalid">
                      Vui lòng nhập họ tên của bạn!
                    </p>
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  md="6"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: false })}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  md="6"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    type="phoneNumber"
                    placeholder="Số điện thoại"
                    {...register("phoneNumber", { required: true })}
                  />
                  {errors?.phoneNumber?.type === "required" && (
                    <p className="text__invalid">
                      Vui lòng nhập số điện thoại của bạn!
                    </p>
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  md="6"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    type="address"
                    placeholder="Địa chỉ"
                    {...register("address", { required: false })}
                  />
                  {errors?.address?.type === "required" && (
                    <p className="text__invalid">
                      Vui lòng nhập số điện thoại của bạn!
                    </p>
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  md="12"
                  controlId="validationCustom01"
                >
                  <Form.Control
                    type="message"
                    as={"textarea"}
                    placeholder="Lời nhắn"
                    {...register("message", { required: false })}
                  />
                </Form.Group>
              </Row>
              <div onClick={handleSubmit(submit)} className="btn-11">
                <span className="btn-11__content">Gửi</span>
              </div>
            </Form>
          </Col>
          <Col className="mt-5" lg={6}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7857.805863355299!2d105.76336579441995!3d10.024868625387784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d2192b0f1%3A0x4c90a391d232ccce!2zVHLGsOG7nW5nIEPDtG5nIE5naOG7hyBUaMO0bmcgVGluIHbDoCBUcnV54buBbiBUaMO0bmcgKENUVSk!5e0!3m2!1svi!2s!4v1698053782174!5m2!1svi!2s"
              width="100%"
              height="444"
              style={{ border: "0" }}
              loading="lazy"
            ></iframe>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
