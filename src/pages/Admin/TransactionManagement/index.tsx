import { Col, Container, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import ProductsTable from "../../../components/ProductsTable";
import productApi from "../../../api/productApi";
import { useState } from "react";

const TransactionManagement = () => {
  const [statusAuction, setStatusAuction] = useState("Đang chờ duyệt");

  const auction_list = useQuery({
    queryKey: ["auction-list__admin", { statusAuction }],
    queryFn: async () => {
      const payload = {
        status: statusAuction,
      };
      const res = await productApi.getProductByStatus(payload);

      return res;
    },
    staleTime: 240 * 1000,
  });

  return (
    <Container >
      <Row style={{minHeight:'450px'}} className="mt-5">
        <Col>
        <ProductsTable
            statusAuction={statusAuction}
            typeList={"create"}
            handleByAdmin={true}
            data={auction_list?.data?.data || []}
          ></ProductsTable>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionManagement;