import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import freeProductApi from "../../api/freeProduct";
import productApi from "../../api/productApi";
import userApi from "../../api/userApi";
import ProductsTable from "../../components/ProductsTable";
import SEO from "../../components/SEO";
import { IRootState } from "../../interface";

const ManagementAuction = () => {
  const idOwner = useSelector((e: IRootState) => e.auth._id);
  const [typeList, setTypeList] = useState("win");
  const [typeFreeList, setTypeFreeList] = useState("received");

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
      } else if (typeList === "refuse") {
        result = await userApi.getRefuseProductsByOwner(idOwner);
      } else if (typeList === "hide") {
        result = await productApi.getHideProductsByOwner(idOwner);
      } else {
        result = await userApi.getBidsProductsByOwner(idOwner);
      }
      return result;
    },
    staleTime: 240 * 1000,
  });

  const freeProduct_list = useQuery({
    queryKey: ["freeProduct-list__user", { typeFreeList }],
    queryFn: async () => {
      let result: any;
      if (typeFreeList === "create") {
        result = await userApi.getFreeProductsByOwner(idOwner);
      } else if (typeFreeList === "participate") {
        result = await userApi.getParticipateProductsByOwner(idOwner);
      } else if (typeFreeList === "refuse") {
        result = await userApi.getRefuseFreeProductsByOwner(idOwner);
      }else if (typeFreeList === "hide") {
        result = await freeProductApi.getHideProductsByOwner(idOwner)
      } else {
        result = await userApi.getReceivedProductsByOwner(idOwner);
      }
      return result;
    },
    staleTime: 240 * 1000,
  });

  return (
    <div>
      <Container>
        <SEO title={"Quản lí"}></SEO>

        <Row className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeList(e.target.value)}
              aria-label="Default select example"
            >
              <option value="win">Sản phẩm được bạn đấu giá thành công</option>
              <option value="buy">Sản phẩm được bạn mua ngay</option>
              <option value="join">Cuộc đấu giá bạn đã tham gia</option>
              <option value="create">Cuộc đấu giá bạn đã tạo</option>
              <option value="refuse">Sản phẩm đấu giá bị từ chối</option>
              <option value="hide">Sản phẩm đấu giá đã ẩn</option>
            </Form.Select>
          </Col>
          <Col sm={12}>
            <ProductsTable
              typeList={typeList}
              data={auction_list?.data?.data || []}
            ></ProductsTable>
          </Col>
        </Row>
        <Row className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeFreeList(e.target.value)}
              aria-label="Default select example"
            >
              <option value="received">Sản phẩm đã nhận</option>
              <option value="participate">Sản phẩm đã đăng ký nhận</option>
              <option value="create">Sản phẩm đã chia sẻ</option>
              <option value="refuse">Sản phẩm chia sẻ đã bị từ chối</option>
              <option value="hide">Sản phẩm chia sẻ đã ẩn</option>

            </Form.Select>
          </Col>
          <Col sm={12}>
            <ProductsTable
              typeList={typeFreeList}
              data={freeProduct_list?.data?.data || []}
              freeProduct={true}
            ></ProductsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagementAuction;
