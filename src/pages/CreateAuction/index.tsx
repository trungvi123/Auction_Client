import { useEffect } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import ProductForm from "../../components/ProductForm";
import { setProdDescription } from "../../redux/utilsSlice";

import "./CreateAuction.css";

function CreateAuction() {
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(setProdDescription(''))
  },[dispatch])


  return (
    <Container>
      <Row className="w-100 d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1>Tạo cuộc đấu giá</h1>
            </div>

            <ProductForm type='create'></ProductForm>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAuction;
