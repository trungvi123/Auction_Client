
import { Col, Container, Row } from "react-bootstrap";
import FreeProductForm from "../../components/FreeProductForm";

const CreateFreeProduct = () => {
  
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1 className="mb-4">Tạo vật phẩm chia sẻ</h1>
            </div>
                <FreeProductForm type="create"></FreeProductForm>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateFreeProduct;
