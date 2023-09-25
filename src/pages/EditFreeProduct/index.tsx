import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FreeProductForm from "../../components/FreeProductForm";
import { IRootState } from "../../interface";

import "../EditAuction/EditAuction.css";

function EditFreeProduct() {
  const freeProductPermission = useSelector(
    (e: IRootState) => e.auth.freeProductPermission
  );
  const next = useNavigate();
  const params = useParams();

  const permission = freeProductPermission?.find((item) => item === params.id);
  useEffect(() => {
    if (!permission) {
      next("/");
    }
  }, [next, permission]);

  return (
    <>
      {permission && (
        <Container>
          <Row className="w-100 d-flex justify-content-center">
            <Col xl={10} lg={8} md={10}>
              <div className="reg__wrapper">
                <div className="reg__title">
                  <h1>Chỉnh sửa vật phẩm chia sẻ</h1>
                </div>
                <FreeProductForm type="edit" id={params.id}></FreeProductForm>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default EditFreeProduct;
