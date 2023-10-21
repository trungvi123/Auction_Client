import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import productApi from "../../api/productApi";
import { breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import FreeProductCard from "../../components/FreeProductCard";
import ProductCard from "../../components/ProductCard";
import normalizeWord from "../../utils/normalizeWord";

const Search = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword: string | null = params.get("keyword");

  const searchQuery = useQuery({
    queryKey: ["search", { keyword: normalizeWord(keyword) }],
    queryFn: async () => {
      const res = await productApi.search({keyword : normalizeWord(keyword) || ''})
      return res.data
    },
  });

  
  return (
    <Container>
      <Breadcrumbs
        title={`Kết quả tìm kiếm từ khóa "${keyword}"`}
        type={"tìm kiếm"}
        img={breadcrumbs}
      ></Breadcrumbs>
      <Row>
        <Col md={12}>
          <div>
            <Row>
              {
                searchQuery.data?.map((item: any, index: number) => {
                  return (
                    <Col md={6} lg={4} sm={12} key={index}>
                      {item?.isFree ? (
                        <FreeProductCard data={item}></FreeProductCard>
                      ) : (
                        <ProductCard data={item}></ProductCard>
                      )}
                    </Col>
                  );
                })}
            </Row>
            {/* {products?.length > 9 && (
              <Row className="justify-content-center mt-4">
                <Col sm={4} className="d-flex justify-content-center">
                  <Stack spacing={2}>
                    <Pagination
                      count={pageNumber}
                      page={page}
                      onChange={handleChange}
                    />
                  </Stack>
                </Col>
              </Row>
            )} */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
