import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import productApi from "../../api/productApi";
import ProductsTable from "../../components/ProductsTable";
import { IRootState } from "../../interface";

const ManagementAuction = () => {
  const idOwner = useSelector((e:IRootState)=>e.auth._id) 
  const [data,setData] = useState([])
  useEffect(()=>{
    const fetchData = async () => {
        const result:any = await productApi.getProductsByOwner(idOwner)
        if(result.status === 'success'){
          setData(result.data)
        }
        
    }
    fetchData()
  },[idOwner])

  return (
    <div>
      <Container>
        <Row className="mt-5">
          <Col sm={12}>
            <ProductsTable data={data}></ProductsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagementAuction;
