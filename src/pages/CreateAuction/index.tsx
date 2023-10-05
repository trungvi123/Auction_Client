import { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
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
