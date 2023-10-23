import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ProductForm from "../../components/ProductForm";

import "./CreateAuction.css";

function CreateAuction() {
 
  return (
    <Container>
      <Row className=" d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1 className="mb-4">Tạo cuộc đấu giá</h1>
            </div>

            <ProductForm type='create'></ProductForm>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAuction;
