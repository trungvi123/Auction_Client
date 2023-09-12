
import { Col, Container, Row } from "react-bootstrap";
import AuctionChart from "../../../components/Admin/AuctionChart";

const Dashboard = () => {
  return (
    <Container fluid>
      <Row className="mt-5">
        <Col sm={12}>
          <AuctionChart></AuctionChart>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
