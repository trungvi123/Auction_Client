import { Pagination, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import freeProductApi from "../../api/freeProduct";
import productApi from "../../api/productApi";
import { breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import FreeProductCard from "../../components/FreeProductCard";
import ProductCard from "../../components/ProductCard";
import "./ProductList.css";

interface IFilter {
  status: any[];
  category: any[];
  typeProduct: any[];
}
const ProductList = () => {
  const initialFilter = {
    status: [],
    category: [],
    typeProduct: [],
  };

  const status = [
    {
      name: "Sắp diễn ra",
      slug: "sap-dien-ra",
    },
    {
      name: "Đang diễn ra",
      slug: "dang-dien-ra",
    },
    {
      name: "Đã kết thúc",
      slug: "da-ket-thuc",
    },
  ];

  const params = useParams();

  const [filter, setFilter] = useState<IFilter>(initialFilter);
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(2);

  const [products, setProduct] = useState<any>([]);
  const [productsRender, setProductRender] = useState<any>([]);
  const productsQuery = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => productApi.getAllProducts(),
    staleTime: 1000 * 600,
  });
  const handleChange = (
    event: React.ChangeEvent<unknown>,
    pageCurr: number
  ) => {
    const pageCount = Math.ceil(products.length / 9);
    const newArrProd = products.slice((pageCurr - 1) * 9, pageCurr * 9);
    setPage(pageCurr);
    setProductRender(newArrProd);
    setPageNumber(pageCount);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [page, filter]);

  const freeProductsQuery = useQuery({
    queryKey: ["allFreeProducts"],
    queryFn: () => freeProductApi.getAllFreeProducts(),
    staleTime: 1000 * 600,
  });

  const categoryQuery: any = useQuery({
    queryKey: ["category"],
    queryFn: () => categoryApi.getAllCategory(),
    staleTime: 1000 * 600,
  });

  useEffect(() => {
    if (params.cate) {
      setFilter({ ...filter, category: [params.cate] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.cate]);

  const filterSelect = (type: string, check: boolean, item: any) => {
    if (check) {
      // check
      switch (type) {
        case "STATUS":
          setFilter({ ...filter, status: [...filter.status, item.slug] });
          break;
        case "CATEGORY":
          setFilter({ ...filter, category: [...filter.category, item.link] });
          break;
        case "TYPEPRODUCT":
          setFilter({ ...filter, typeProduct: [...filter.typeProduct, item] });
          break;
      }
    } else {
      // uncheck
      switch (type) {
        case "STATUS":
          const newStatus = filter.status.filter((e) => e !== item.slug);
          setFilter({ ...filter, status: newStatus });
          break;
        case "CATEGORY":
          const newCategory = filter.category.filter((e) => e !== item.link);
          setFilter({ ...filter, category: newCategory });
          break;
        case "TYPEPRODUCT":
          const newType = filter.typeProduct.filter((e) => e !== item);
          setFilter({ ...filter, typeProduct: newType });
          break;
      }
    }
  };

  useMemo(() => {
    const array1 = freeProductsQuery.data?.data;
    const array2 = productsQuery.data?.data;
    let productTemp = [];

    if (filter.typeProduct.length === 2 || filter.typeProduct.length === 0) {
      productTemp = array1?.concat(array2);
    } else {
      if (filter.typeProduct[0] === "san-pham-dau-gia") {
        productTemp = array2;
      } else {
        productTemp = array1;
      }
    }

    if (filter.category.length > 0 && productTemp) {
      productTemp = productTemp.filter((e: any) =>
        filter.category.includes(e.category.link)
      );
    }

    if (filter.status.length > 0) {
      productTemp = productTemp?.filter((e: any) =>
        filter.status.includes(e.slugCase)
      );
    }

    const pageCount = Math.ceil(productTemp?.length / 9);
    const newArrProd = productTemp?.slice((1 - 1) * 9, 1 * 9);
    setProductRender(productTemp?.slice(0, 9));
    setProduct(productTemp);
    setPage(1);
    setProductRender(newArrProd);
    setPageNumber(pageCount);
  }, [
    filter.category,
    filter.status,
    filter.typeProduct,
    freeProductsQuery.data?.data,
    productsQuery.data?.data,
  ]);

  return (
    <Container>
      <Breadcrumbs
        title={"Danh mục tài sản"}
        type={"danh mục tài sản"}
        img={breadcrumbs}
      ></Breadcrumbs>
      <Row>
        <Col md={3}>
          <div className="filter-container">
            <div className="filter-box">
              <div className="status-filter">
                <div className="mb-3">
                  <h4 style={{ fontWeight: 600 }}>Loại tài sản</h4>
                  <span className="title-hightlight"></span>
                </div>
                <div>
                  <label
                    className="containerCheckbox"
                    htmlFor={"san-pham-dau-gia"}
                  >
                    Sản phẩm đấu giá
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        filterSelect(
                          "TYPEPRODUCT",
                          e.target.checked,
                          "san-pham-dau-gia"
                        )
                      }
                      id={"san-pham-dau-gia"}
                      className="status-checkall"
                      name="checkbox-status"
                      value="0"
                    ></input>
                    <span className="checkmark"></span>
                  </label>
                  <label
                    className="containerCheckbox"
                    htmlFor={"san-pham-mien-phi"}
                  >
                    Sản phẩm miễn phí
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        filterSelect(
                          "TYPEPRODUCT",
                          e.target.checked,
                          "san-pham-mien-phi"
                        )
                      }
                      id={"san-pham-mien-phi"}
                      className="status-checkall"
                      name="checkbox-status"
                      value="0"
                    ></input>
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="filter-box">
              <div className="status-filter">
                <div className="mb-3">
                  <h4 style={{ fontWeight: 600 }}>Trạng thái tài sản</h4>
                  <span className="title-hightlight"></span>
                </div>
                <div>
                  {status.map((item, index) => {
                    return (
                      <label
                        key={index}
                        className="containerCheckbox"
                        htmlFor={item.slug}
                      >
                        {item.name}
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            filterSelect("STATUS", e.target.checked, item)
                          }
                          id={item.slug}
                          className="status-checkall"
                          name="checkbox-status"
                          value="0"
                        ></input>
                        <span className="checkmark"></span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="filter-box">
              <div className="status-filter">
                <div className="mb-3">
                  <h4 style={{ fontWeight: 600 }}>Danh mục tài sản</h4>
                  <span className="title-hightlight"></span>
                </div>
                <div>
                  {categoryQuery.data?.category?.map(
                    (item: any, index: number) => {
                      return (
                        item.link !== params?.cate && (
                          <label
                            key={index}
                            className="containerCheckbox"
                            htmlFor={item.link}
                          >
                            {item.name}
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                filterSelect("CATEGORY", e.target.checked, item)
                              }
                              id={item.link}
                              className="status-checkall"
                              name="checkbox-status"
                              value="0"
                            ></input>
                            <span className="checkmark"></span>
                          </label>
                        )
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={9}>
          <div>
            <Row>
              {productsRender &&
                productsRender?.map((item: any, index: number) => {
                  return (
                    <Col md={4} key={index}>
                      {item?.isFree ? (
                        <FreeProductCard data={item}></FreeProductCard>
                      ) : (
                        <ProductCard data={item}></ProductCard>
                      )}
                    </Col>
                  );
                })}
            </Row>
            {products?.length > 9 && (
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
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
