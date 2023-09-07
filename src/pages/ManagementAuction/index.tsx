import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import ProductsTable from "../../components/ProductsTable";
import { IRootState } from "../../interface";

const ManagementAuction = () => {
  const idOwner = useSelector((e: IRootState) => e.auth._id);
  const refreshList = useSelector((e: IRootState) => e.myModal.refreshList);
  const [typeSelect, setTypeSelect] = useState("create");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let result: any;
      if (typeSelect === "create") {
        result = await userApi.getProductsByOwner(idOwner);
      } else if (typeSelect === "buy") {
        result = await userApi.getPurchasedProductsByOwner(idOwner);
      } else if (typeSelect === "win") {
        result = await userApi.getWinProductsByOwner(idOwner)
      } else {
        result = await userApi.getBidsProductsByOwner(idOwner)
      }
      if (result?.status === "success") {     
        setData(result.data);
      }
    };
    fetchData();
  }, [idOwner, refreshList, typeSelect]);

  return (
    <div>
      <Container>
        <Row className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeSelect(e.target.value)}
              aria-label="Default select example"
            >
              <option value="create">Cuộc đấu giá đã tạo</option>
              <option value="join">Cuộc đấu giá đã tham gia</option>
              <option value="buy">Sản phẩm được mua ngay</option>
              <option value="win">Sản phẩm đấu giá thành công</option>
            </Form.Select>
          </Col>
          <Col sm={12}>
            <ProductsTable typeSelect={typeSelect} data={data}></ProductsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagementAuction;
