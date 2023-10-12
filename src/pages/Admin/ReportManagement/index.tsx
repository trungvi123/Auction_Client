import { Col, Container, Row } from "react-bootstrap";
import userApi from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import ReportTable from "../../../components/Admin/ReportTable";

const ReportManagerment = () => {
  const report_list = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await userApi.getReports();
      return res;
    },
    staleTime: 240 * 1000,
  });

   

  return (
    <Container>
      <Row>
        <Col>
          <ReportTable data={report_list?.data?.data || []}></ReportTable>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportManagerment;
