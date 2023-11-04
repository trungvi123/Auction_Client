import {
  EventAvailable,
  MoreVert,
  PeopleOutline,
  Reply,
  Star,
  StarBorder,
  Storefront,
} from "@mui/icons-material";
import { IconButton, Pagination, Rating, Stack, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import freeProductApi from "../../api/freeProduct";
import productApi from "../../api/productApi";
import userApi from "../../api/userApi";
import { auction, breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import FilterDrawer from "../../components/FilterDrawer";
import FreeProductCard from "../../components/FreeProductCard";
import MyImageGallery from "../../components/MyImageGallery";
import ProductCard from "../../components/ProductCard";
import SEO from "../../components/SEO";
import TextEditor from "../../components/TextEditor";
import { IRootState } from "../../interface";
import formatDateTime from "../../utils/formatDay";

import "../ProductList/ProductList.css";
import "./Store.css";

interface IFilter {
  status: any[];
  category: any[];
  typeProduct: any[];
  typeAuction: any[];
  star: any[];
}

const initialFilter = {
  status: [],
  category: [],
  typeProduct: [],
  typeAuction: [],
  star: [],
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
const Store = () => {
  const params = useParams();
  const { search } = useLocation();
  const searchParam = new URLSearchParams(search);
  const user: string | null = searchParam.get("user");
  const [typeList, setTypeList] = useState("product");
  const crrUser = useSelector((e: IRootState) => e.auth);

  const [filter, setFilter] = useState<IFilter>(initialFilter);
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(2);
  const [activeBigImg, setActiveBigImg] = useState<any>({});
  const [showReply, setShowReply] = useState<any>({});
  const [data, setData] = useState<any>([]);
  const [data1, setData1] = useState<any>([]);
  const [followAlready, setFollowAlready] = useState<boolean>(false);
  const [rateData, setRateData] = useState<any>({
    rate: [],
    starRate: 0,
    createdAt: "",
    follow: [],
    followTo: [],
  });
  const [rateDataRender, setRateDataRender] = useState<any>([]);
  const [reply, setReply] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const [products, setProduct] = useState<any>([]);
  const [productsRender, setProductRender] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const res: any = await productApi.getProductsByEmail(user);
        const res2: any = await freeProductApi.getProductsByEmail(user);
        const res3: any = await userApi.getUserByEmail(user);
        const checkFollow = res3?.data?.follow?.includes(crrUser._id);

        setFollowAlready(checkFollow);
        setData(res?.data);
        setData1(res2?.data);
        setRateData(res3?.data);
      }
    };
    fetchData();
  }, [crrUser._id, user, refresh]);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    pageCurr: number
  ) => {
    if (products.length > 9) {
      const pageCount = Math.ceil(products.length / 9);
      const newArrProd = products.slice((pageCurr - 1) * 9, pageCurr * 9);
      setPage(pageCurr);
      setProductRender(newArrProd);
      setPageNumber(pageCount);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [page, filter]);

  const categoryQuery: any = useQuery({
    queryKey: ["category"],
    queryFn: () => categoryApi.getAllCategory(),
    staleTime: 1000 * 600,
  });

  useEffect(() => {
    if (params.cate) {
      setFilter({
        ...initialFilter,
        category: [params?.cate],
      });
    } else {
      setFilter(initialFilter);
    }
  }, [params]);

  const filterSelect = useCallback(
    (type: string, check: boolean, item: any) => {
      if (check) {
        // check
        switch (type) {
          case "STAR":
            setFilter({ ...filter, star: [...filter.star, item] });
            break;
          case "STATUS":
            setFilter({ ...filter, status: [...filter.status, item.slug] });
            break;
          case "CATEGORY":
            setFilter({ ...filter, category: [...filter.category, item.link] });
            break;
          case "TYPEPRODUCT":
            setFilter({
              ...filter,
              typeProduct: [...filter.typeProduct, item],
            });
            break;
          case "TYPEAUCTION":
            setFilter({
              ...filter,
              typeAuction: [...filter.typeAuction, item],
            });
            break;
        }
      } else {
        // uncheck
        switch (type) {
          case "STAR":
            const newStar = filter.star.filter((e) => e !== item);
            setFilter({ ...filter, star: newStar });
            break;
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
          case "TYPEAUCTION":
            const newTypeAuction = filter.typeAuction.filter((e) => e !== item);
            setFilter({ ...filter, typeAuction: newTypeAuction });
            break;
        }
      }
    },
    [filter]
  );

  const handleFollow = async () => {
    if (crrUser._id && user) {
      if (followAlready) {
        // unfollow
        const res: any = await userApi.unFollow({
          followEmail: user,
          myId: crrUser._id,
        });
        if (res?.status === "success") {
          toast.success("Hủy theo dõi thành công!");
          setRefresh(!refresh);
        }
      } else {
        // addfollow
        const res: any = await userApi.addFollow({
          followEmail: user,
          myId: crrUser._id,
        });
        if (res?.status === "success") {
          toast.success("Theo dõi thành công!");
          setRefresh(!refresh);
        }
      }
    } else {
      toast.error("Vui lòng đăng nhập!");
    }
  };

  useMemo(() => {
    if (typeList === "product") {
      const array1 = data;
      const array2 = data1;
      let productTemp = [];

      if (filter.typeProduct.length === 2 || filter.typeProduct.length === 0) {
        productTemp = array1?.concat(array2);
      } else {
        if (filter.typeProduct[0] === "san-pham-dau-gia") {
          productTemp = array1;
        } else {
          productTemp = array2;
        }
      }

      if (filter?.category.length > 0 && productTemp) {
        productTemp = productTemp.filter((e: any) =>
          filter?.category.includes(e?.category?.link)
        );
      }

      if (filter?.typeAuction.length > 0 && productTemp) {
        productTemp = productTemp.filter((e: any) =>
          filter?.typeAuction.includes(e?.auctionTypeSlug)
        );
      }

      if (filter?.status.length > 0) {
        productTemp = productTemp?.filter((e: any) =>
          filter.status.includes(e?.stateSlug)
        );
      }
      if (productTemp?.length > 9) {
        const pageCount = Math.ceil(productTemp?.length / 9);
        const newArrProd = productTemp?.slice((1 - 1) * 9, 1 * 9);
        setPage(1);
        setProductRender(newArrProd);
        setPageNumber(pageCount);
      }
      setProduct(productTemp);
      setProductRender(productTemp);
    } else {
      let starTemp = rateData.rate;
      if (filter?.star.length > 0) {
        starTemp = rateData.rate.filter((item: any) =>
          filter?.star.includes(item.star.toString())
        );
      }

      setRateDataRender(starTemp);
    }
  }, [
    data,
    data1,
    filter?.category,
    filter?.star,
    filter.status,
    filter?.typeAuction,
    filter?.typeProduct,
    rateData?.rate,
    typeList,
  ]);

  const handleShowBigImg = (index: any) => {
    setActiveBigImg({ ...activeBigImg, [index]: true });
  };

  const handleShowReply = (index: any) => {
    setReply("");
    if (showReply[index]) {
      setShowReply({ [index]: false });
    } else {
      setShowReply({ [index]: true });
    }
  };

  const hanleReply = async (id: string) => {
    const res: any = await userApi.replyComment({
      rateId: id,
      comment: reply,
    });
    if (res?.status === "success") {
      toast.success("Phản hồi bình luận thành công!");
      setShowReply({});
      setRefresh(!refresh)
    }
  };

  return (
    <Container
      className={`productList store ${typeList === "feedback" ? "feedback" : ""}`}
    >
      <SEO title={"Cửa hàng"}></SEO>
      <Breadcrumbs
        title={"Cửa hàng"}
        type={`Cửa hàng - ${user}`}
        img={breadcrumbs}
      ></Breadcrumbs>
      <Row className="mt-3 mb-3 justify-content-between">
        <Col sm={6} md={5}>
          <div className="left-content">
            <img
              className="left-content__bg"
              src="https://down-bs-vn.img.susercontent.com/e03048a5576062894717bb1ab92241f2_tn"
              alt="bg"
            />
            <div className="left-content__inner">
              <div className="d-flex" style={{ gap: "10px" }}>
                <div className="left-content__inner__circle">
                  <img
                    src="https://ui-avatars.com/api/name=Trung%20vi&background=random"
                    alt=""
                  />
                </div>
                <span className="email mt-2">{user}</span>
              </div>
              <div className="d-flex justify-content-end">
                <div className="follow-btn" onClick={handleFollow}>
                  <span>{followAlready ? "- Hủy theo dõi" : "+ Theo dõi"}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={6} md={7}>
          <Row>
            <Col sm={10} md={6}>
              <div
                style={{ gap: "6px" }}
                className="d-flex align-items-center py-2"
              >
                <Storefront></Storefront>
                <span>Sản Phẩm:</span>
                <span style={{ color: "var(--primary-color)" }}>
                  {data?.length + data1?.length}
                </span>
              </div>
            </Col>
            <Col sm={10} md={6}>
              <div
                style={{ gap: "6px" }}
                className="d-flex align-items-center py-2"
              >
                <PeopleOutline></PeopleOutline>
                <span>Người Theo Dõi:</span>
                <span style={{ color: "var(--primary-color)" }}>
                  {rateData?.follow?.length}
                </span>
              </div>
            </Col>
            <Col sm={10} md={6}>
              <div
                style={{ gap: "6px" }}
                className="d-flex align-items-center py-2"
              >
                <StarBorder></StarBorder>
                <span>Đánh Giá:</span>
                <span style={{ color: "var(--primary-color)" }}>
                  {rateData?.starRate} ({rateData?.rate?.length} Đánh Giá)
                </span>
              </div>
            </Col>
            <Col sm={10} md={6}>
              <div
                style={{ gap: "6px" }}
                className="d-flex align-items-center py-2"
              >
                <EventAvailable></EventAvailable>
                <span>Tham gia:</span>
                <span style={{ color: "var(--primary-color)" }}>
                  {formatDateTime(rateData?.createdAt)}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={12} lg={3} className="filter-col">
          <FilterDrawer
            filterSelect={filterSelect}
            categories={categoryQuery.data?.category}
            params={params}
          ></FilterDrawer>

          <div className={`filter-container`}>
            <div className="filter-box">
              <div className="status-filter">
                <div className="mb-3">
                  <h4 style={{ fontWeight: 600 }}>Thông tin</h4>
                  <span className="title-hightlight"></span>
                </div>
                <div>
                  <label className="containerCheckbox" htmlFor={"product"}>
                    Sản phẩm
                    <input
                      type="radio"
                      onChange={(e) => setTypeList(e.target.value)}
                      id={"product"}
                      className="status-checkall"
                      defaultChecked={true}
                      name="radio-list"
                      value="product"
                    ></input>
                    <span className="checkmark radio"></span>
                  </label>
                  <label className="containerCheckbox" htmlFor={"feedback"}>
                    Phản hồi
                    <input
                      type="radio"
                      onChange={(e) => setTypeList(e.target.value)}
                      id={"feedback"}
                      className="status-checkall"
                      name="radio-list"
                      value="feedback"
                    ></input>
                    <span className="checkmark radio"></span>
                  </label>
                </div>
              </div>
            </div>

            {typeList === "product" ? (
              <div>
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
                                    filterSelect(
                                      "CATEGORY",
                                      e.target.checked,
                                      item
                                    )
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
                <div className="filter-box">
                  <div className="status-filter">
                    <div className="mb-3">
                      <h4 style={{ fontWeight: 600 }}>Hình thức đấu giá</h4>
                      <span className="title-hightlight"></span>
                    </div>
                    <div>
                      <label
                        className="containerCheckbox"
                        htmlFor={"auctionType1"}
                      >
                        Đấu giá xuôi
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            filterSelect(
                              "TYPEAUCTION",
                              e.target.checked,
                              "dau-gia-xuoi"
                            )
                          }
                          id={"auctionType1"}
                          className="status-checkall"
                          name="checkbox-status"
                          value="0"
                        ></input>
                        <span className="checkmark"></span>
                      </label>
                      <label
                        className="containerCheckbox"
                        htmlFor={"auctionType2"}
                      >
                        Đấu giá ngược
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            filterSelect(
                              "TYPEAUCTION",
                              e.target.checked,
                              "dau-gia-nguoc"
                            )
                          }
                          id={"auctionType2"}
                          className="status-checkall"
                          name="checkbox-status"
                          value="0"
                        ></input>
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="filter-box">
                <div className="status-filter">
                  <div className="mb-3">
                    <h4 style={{ fontWeight: 600 }}>Loại phản hồi</h4>
                    <span className="title-hightlight"></span>
                  </div>
                  <div>
                    <label className="containerCheckbox" htmlFor={"star1"}>
                      <Star color="warning" />
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("STAR", e.target.checked, "1")
                        }
                        id={"star1"}
                        className="status-checkall"
                        name="checkbox-start"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                    <label className="containerCheckbox" htmlFor={"star2"}>
                      <Star color="warning" />
                      <Star color="warning" />
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("STAR", e.target.checked, "2")
                        }
                        id={"star2"}
                        className="status-checkall"
                        name="checkbox-star"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                    <label className="containerCheckbox" htmlFor={"star3"}>
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("STAR", e.target.checked, "3")
                        }
                        id={"star3"}
                        className="status-checkall"
                        name="checkbox-star"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                    <label className="containerCheckbox" htmlFor={"star4"}>
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("STAR", e.target.checked, "4")
                        }
                        id={"star4"}
                        className="status-checkall"
                        name="checkbox-star"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                    <label className="containerCheckbox" htmlFor={"star5"}>
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />
                      <Star color="warning" />

                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("STAR", e.target.checked, "5")
                        }
                        id={"star5"}
                        className="status-checkall"
                        name="checkbox-star"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col md={12} lg={9}>
          {typeList === "product" ? (
            <div>
              <Row className="justify-content-center products-row">
                {productsRender &&
                  productsRender?.map((item: any, index: number) => {
                    return (
                      <Col xs={6} lg={4} key={index}>
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
          ) : (
            <div className="feedback-container mt-3">
              {rateDataRender?.map((item: any, index: number) => (
                <div key={item._id}>
                  <div className="feedback-item">
                    <div className="feedback-item__left">
                      <img src={item.from.avatar || auction} alt="" />
                    </div>
                    <div className="feedback-item__right">
                      <div className="feedback-item__top">
                        <span className="name">{item.from.name}</span>
                        <Rating
                          className="star"
                          name="read-only"
                          value={item.star}
                          readOnly
                        />
                        <span className="time">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                      <div className="feedback-item__center">
                        <p>{item.comment}</p>
                      </div>
                      {item.images.length > 0 && (
                        <div
                          className={`feedback-item__bottom ${
                            activeBigImg[index] ? "active" : ""
                          }`}
                          onClick={() => handleShowBigImg(index)}
                        >
                          <MyImageGallery
                            thumbnail="top"
                            imagesLink={item.images}
                          ></MyImageGallery>
                        </div>
                      )}
                      {user === crrUser.email && (
                        <div
                          className="d-flex justify-content-end mt-3"
                          style={{ position: "relative" }}
                        >
                          <div className="actions">
                            <IconButton
                              aria-label="more"
                              style={{ height: "40px" }}
                              className="action-btn"
                            >
                              <MoreVert />
                            </IconButton>
                            <div className="action-item">
                              <Tooltip title="Phản hồi" placement="right">
                                <IconButton
                                  aria-label="more"
                                  style={{ height: "40px" }}
                                  onClick={() => handleShowReply(index)}
                                >
                                  <Reply />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className={`${showReply[index] ? "d-block" : "d-none"}`}
                      >
                        <Form.Control
                          as={"textarea"}
                          type="text"
                          placeholder="Phản hồi..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                        />

                        <div className="d-flex mt-3" style={{ gap: "10px" }}>
                          <div
                            style={{ width: "100px" }}
                            onClick={() => handleShowReply(index)}
                            className="btn-11"
                          >
                            <span className="btn-11__content">Đóng</span>
                          </div>
                          <div
                            style={{ width: "100px" }}
                            onClick={() => hanleReply(item._id)}
                            className="btn-11"
                          >
                            <span className="btn-11__content">Phản hồi</span>
                          </div>
                        </div>
                      </div>
                      {item.replyComment && (
                        <div
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "14px 12px",
                            marginTop: "10px",
                          }}
                        >
                          <p style={{ fontWeight: "500" }}>
                            Phản hồi của người bán
                          </p>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(item.replyComment),
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Store;
