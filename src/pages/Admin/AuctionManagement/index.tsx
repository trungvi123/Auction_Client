import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import productApi from "../../../api/productApi";
import ProductsTable from "../../../components/ProductsTable";

const AuctionManagement = () => {
  const [statusAuction, setStatusAuction] = useState("Đã được duyệt");
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
    <Container>
      <Row className="mt-5 justify-content-end">
        <Col sm={4} className={"my-4"}>
          <Form.Select
            onChange={(e: any) => setStatusAuction(e.target.value)}
            aria-label="Default select example"
          >
            <option value="Đã được duyệt">Cuộc đấu giá đã được duyệt</option>
            <option value="Đang chờ duyệt">Cuộc đấu giá chưa được duyệt</option>
            <option value="Đã từ chối">Cuộc đấu giá đã từ chối</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
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

export default AuctionManagement;
