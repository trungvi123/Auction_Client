import { Col, Container, Row } from "react-bootstrap";
import FormRegister from "../../components/FormRegister";
import SEO from "../../components/SEO";

const Profile = () => {
 

  return (
    <Container>
      <SEO title={'Hồ sơ'}></SEO>

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
