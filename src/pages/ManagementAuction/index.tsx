import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import ProductsTable from "../../components/ProductsTable";
import { IRootState } from "../../interface";

const ManagementAuction = () => {
  const idOwner = useSelector((e: IRootState) => e.auth._id);
  const [typeList, setTypeList] = useState("create");

  const auction_list = useQuery({
    queryKey: ["auction-list__user", { typeList }],
    queryFn: async () => {
      let result: any;
      if (typeList === "create") {
        result = await userApi.getProductsByOwner(idOwner);
      } else if (typeList === "buy") {
        result = await userApi.getPurchasedProductsByOwner(idOwner);
      } else if (typeList === "win") {
        result = await userApi.getWinProductsByOwner(idOwner);
      }else if(typeList === "refuse"){
        result = await userApi.getRefuseProductsByOwner(idOwner);
      } else {
        result = await userApi.getBidsProductsByOwner(idOwner);
      }
      return result;
    },
    staleTime: 240 * 1000,
  });

  return (
    <div>
      <Container>
        <Row className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeList(e.target.value)}
              aria-label="Default select example"
            >
              <option value="create">Cuộc đấu giá đã tạo</option>
              <option value="join">Cuộc đấu giá đã tham gia</option>
              <option value="buy">Sản phẩm được mua ngay</option>
              <option value="win">Sản phẩm đấu giá thành công</option>
              <option value="refuse">Sản phẩm đấu giá bị từ chối</option>
            </Form.Select>
          </Col>
          <Col sm={12}>
            <ProductsTable
              typeList={typeList}
              data={auction_list?.data?.data || []}
            ></ProductsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagementAuction;
