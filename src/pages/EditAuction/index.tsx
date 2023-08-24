import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import ProductForm from "../../components/ProductForm";

import "./EditAuction.css";

function EditAuction() {
  const params = useParams()
  
  return (
    <Container>
      <Row className="w-100 d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1>Chỉnh sửa cuộc đấu giá</h1>
            </div>

            <ProductForm type='edit' id={params.id}></ProductForm>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EditAuction;