import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormRegister from "../../components/FormRegister";
import { IRootState } from "../../interface";

const Profile = () => {
 

  return (
    <Container>
      <Row className="w-100 d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1>Hồ sơ</h1>
            </div>
            <FormRegister status='updateProfile'></FormRegister>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
