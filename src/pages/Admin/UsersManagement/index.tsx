import { Col, Container, Row } from "react-bootstrap";
import UserTable from "../../../components/UserTable";
import userApi from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";

const UsersManagerment = () => {
  const user_list = useQuery({
    queryKey: ["user-list__admin"],
    queryFn: async () => {
      const res = await userApi.getAllUser();
      return res;
    },
    staleTime: 240 * 1000,
  });

  return (
    <Container >
      <Row style={{minHeight:'450px'}} className="mt-5">
        <Col>
          <UserTable data={user_list?.data?.data || []}></UserTable>
        </Col>
      </Row>
    </Container>
  );
};

export default UsersManagerment;
