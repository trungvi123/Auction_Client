import { MaterialReactTable } from "material-react-table";
import { type MRT_ColumnDef } from "material-react-table";
import { useCallback, useMemo, useRef, useState } from "react";
import { Col, Form, Image, Row } from "react-bootstrap";
import { IconButton, Tooltip } from "@mui/material";
import { Autorenew, LocalShipping, MonetizationOn } from "@mui/icons-material";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { socket } from "../Header";

import { auction } from "../../asset/images";
import productApi from "../../api/productApi";
import userApi from "../../api/userApi";
import { IRootState } from "../../interface";
import {
  setFreeProductPermission,
  setProductPermission,
} from "../../redux/authSlice";
import { checkoutType } from "../../constant/index";
import DropImages from "../../components/DropImages";

interface IProTable {
  name: {
    name: string;
    paid: boolean;
    shipping: boolean;
    successfulTransaction: boolean;
  };
  images: {
    src: string;
    idProduct: string;
  };
  status: {
    statusPayment: string;
    status: string;
    checkoutTypeSlug: string;
  };
  handle: {
    _id: string;
    paid: boolean;
    name: string;
    status: string;
    auctionStarted: boolean;
    checkoutTypeSlug: string;
    seller: string;
    buyer: string;
    shipping: boolean;
    statusPaymentSlug: string;
    successfulTransaction: boolean;
  };
}

function ProductsTable({
  data,
  typeList, // create => myProduct => can delete || other => not myProduct => can't delete
  handleByAdmin = false,
  statusAuction = "Đã được duyệt",
  freeProduct = false,
}: any) {
  const next = useNavigate();
  const dispatch = useDispatch();
  const dataLocal = useRef<IProTable[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [inforHandle, setInforHanle] = useState({
    variable: "",
    id: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [comment, setComment] = useState<string>("");

  const [star, setStar] = useState<number>(5);
  const [modalMode, setModalMode] = useState<string>("");
  const [reportReason, setReportReason] = useState<string[]>([]);
  const [reportId, setReportId] = useState({
    buyer: "",
    seller: "",
  });
  const prodPer: any = useSelector((e: IRootState) => e.auth.productPermission);
  const freeProdPer: any = useSelector(
    (e: IRootState) => e.auth.freeProductPermission
  );
  const idOwner: any = useSelector((e: IRootState) => e.auth._id);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShow = () => {
    setShowModal(true);
  };

  const handleApprove = async (id: string) => {
    const res: any = await productApi.approveProduct({
      id,
      isFree: freeProduct,
    });
    if (res?.status === "success") {
      toast.success("Duyệt cuộc đấu giá thành công!");
      if (freeProduct) {
        queryClient.invalidateQueries({
          queryKey: [
            "freeProduct-list__admin",
            { statusFreeAuction: statusAuction },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "freeProduct-list__admin",
            { statusFreeAuction: "Đã được duyệt" },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["freePproducts"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction }],
        });
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction: "Đã được duyệt" }],
        });
        socket.emit("refreshPage");
      }

      // thêm api gửi mail
    }
  };

  const handleRefuse = async (id: string) => {
    const res: any = await productApi.refuseProduct({
      id,
      isFree: freeProduct,
    });
    if (res?.status === "success") {
      toast.success("Đã từ chối cuộc đấu giá thành công!");
      // thêm api gửi mail
      if (freeProduct) {
        queryClient.invalidateQueries({
          queryKey: [
            "freeProduct-list__admin",
            { statusFreeAuction: statusAuction },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "freeProduct-list__admin",
            { statusFreeAuction: "Đã từ chối" },
          ],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction }],
        });

        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction: "Đã từ chối" }],
        });
      }
    }
  };

  const handleApproveAgain = async (id: string) => {
    const res: any = await productApi.approveAgainProduct({
      id,
      isFree: freeProduct,
    });
    if (res?.status === "success") {
      toast.success("Đã kiến nghị duyệt lại cuộc đấu giá thành công!");

      queryClient.invalidateQueries({
        queryKey: ["auction-list__user", { typeList }],
      });
      // thêm api gửi mail
    }
  };

  const handleDelete = async (id: string) => {
    let result: any;
    const payload = {
      idProd: id,
      idOwner,
      isFree: freeProduct,
    };
    if (typeList === "create" || typeList === "refuse") {
      // xóa bên bảng các sản phẩm đã tạo hoac bi tu choi
      result = await productApi.deleteProductById(payload);
    } else {
      const pl = {
        ...payload,
        type: typeList,
      };
      result = await userApi.deleteProductHistory(pl);
    }
    if (result?.status === "success") {
      if (freeProduct) {
        dispatch(setFreeProductPermission([...freeProdPer, result._id]));
      } else {
        dispatch(setProductPermission([...prodPer, result._id]));
      }
      toast.success("Đã xóa thành công!");
      if (handleByAdmin) {
        if (freeProduct) {
          queryClient.invalidateQueries({
            queryKey: [
              "freeProduct-list__admin",
              { statusFreeAuction: statusAuction },
            ],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["auction-list__admin", { statusAuction }],
          });
        }
      } else {
        if (freeProduct) {
          if (typeList === "create") {
            // khi xoa o create thi cap nhat lai luon cache cua refuse
            queryClient.invalidateQueries({
              queryKey: ["freeProduct-list__user", { typeFreeList: "refuse" }],
            });
          }
          if (typeList === "refuse") {
            // khi xoa o refuse thi cap nhat lai luon cache cua create
            queryClient.invalidateQueries({
              queryKey: ["freeProduct-list__user", { typeFreeList: "create" }],
            });
          }
          // cap nhat cache san pham mien phi
          queryClient.invalidateQueries({
            queryKey: ["freeProduct-list__user", { typeFreeList: typeList }],
          });
        } else {
          if (typeList === "create") {
            // khi xoa o create thi cap nhat lai luon cache cua refuse
            queryClient.invalidateQueries({
              queryKey: ["auction-list__user", { typeList: "refuse" }],
            });
          }
          if (typeList === "refuse") {
            // khi xoa o refuse thi cap nhat lai luon cade cua create
            queryClient.invalidateQueries({
              queryKey: ["auction-list__user", { typeList: "create" }],
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["auction-list__user", { typeList }],
          });
        }
      }
    } else {
      toast.error("Đã xóa sản phẩm thất bại!");
    }
  };

  const handleShipping = async (id: string) => {
    const res: any = await productApi.updateShipping({ id });
    if (res?.status === "success") {
      queryClient.invalidateQueries({
        queryKey: ["auction-list__user", { typeList }],
      });
    }
  };

  const runFunc = (infor: { variable: string; id: string }) => {
    if (infor.variable === "approve") {
      handleApprove(infor.id);
    } else if (infor.variable === "refuse") {
      handleRefuse(infor.id);
    } else if (infor.variable === "approveAgain") {
      handleApproveAgain(infor.id);
    } else if (infor.variable === "updateShipping") {
      handleShipping(infor.id);
    } else if (infor.variable === "report") {
      handleReport(infor.id);
    } else if (infor.variable === "finishTransaction") {
      handleFinishTransaction(infor.id);
    } else if (infor.variable === "rate") {
      handleRate(infor.id);
    } else {
      handleDelete(infor.id);
    }
    handleClose();
  };

  useMemo(() => {
    if (data.length > 0) {
      dataLocal.current = data?.map((item: any) => {
        return {
          name: {
            name: item.name,
            paid: item.paid,
            shipping: item.shipping,
            successfulTransaction: item.successfulTransaction,
          },
          images: {
            src: item.images[0] ? item.images[0] : auction,
            idProduct: item._id,
          },
          status: {
            status: item.status,
            checkoutTypeSlug: item.checkoutTypeSlug,
            statusPayment: item.statusPayment,
          },
          handle: {
            _id: item._id,
            name: item.name,
            paid: item.paid,
            rate: item.rate,
            successfulTransaction: item.successfulTransaction,
            shipping: item.shipping,
            auctionStarted: item.auctionStarted,
            seller: item.owner,
            checkoutTypeSlug: item.checkoutTypeSlug,
            buyer: item.winner || item.purchasedBy,
            status: item.status,
            statusPaymentSlug: item.statusPaymentSlug,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const handleViewReceivedList = (id: string) => {
    next(`/danh-sach/${id}`);
  };

  const handleImageUpload = useCallback((images: File[]) => {
    // Nhận dữ liệu ảnh từ DropImages và cập nhật state của Form
    setUploadedImages(images);
  }, []);

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Ảnh",
        accessorKey: "images",
        id: "images",
        Cell: ({ cell }) => {
          const data: {
            src: string;
            idProduct: string;
          } = cell.getValue<{
            src: string;
            idProduct: string;
          }>();

          return (
            <Image
              onClick={() =>
                next(
                  `${
                    freeProduct ? "/chi-tiet-chia-se/" : "/chi-tiet-dau-gia/"
                  }${data.idProduct}`
                )
              }
              width={120}
              height={120}
              src={data.src}
              style={{ cursor: "pointer" }}
            />
          );
        },
      },
      {
        header: "Tên tài sản",
        accessorKey: "name",
        id: "name",
        Cell: ({ cell }) => {
          const data: {
            name: string;
            paid: boolean;
            shipping: boolean;
            successfulTransaction: boolean;
          } = cell.getValue<{
            name: string;
            paid: boolean;
            shipping: boolean;
            successfulTransaction: boolean;
          }>();
          let statusShipping = "";
          if (typeList === "create") {
            if (data.paid) {
              statusShipping = "Đã được thanh toán";
            } else {
              statusShipping = "Chưa được thanh toán";
            }
          } else {
            if (data.shipping && !data.successfulTransaction) {
              statusShipping = "Đang giao hàng";
            } else if (data.shipping && data.successfulTransaction) {
              statusShipping = "Đã giao hàng";
            } else {
              statusShipping = "Chưa giao hàng";
            }
          }
          return (
            <div>
              {!handleByAdmin && (
                <Tooltip placement="top" title={statusShipping}>
                  <IconButton>
                    {typeList === "create" && (
                      <MonetizationOn color={data.paid ? "success" : "error"} />
                    )}
                    {(typeList === "win" || typeList === "buy") && (
                      <LocalShipping
                        color={
                          data.shipping
                            ? data.successfulTransaction
                              ? "success"
                              : "warning"
                            : "error"
                        }
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {data.name}
            </div>
          );
        },
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        id: "status",
        Cell: ({ cell }) => {
          const data: {
            status: string;
            checkoutTypeSlug: string;
            statusPayment: string;
          } = cell.getValue<{
            status: string;
            checkoutTypeSlug: string;
            statusPayment: string;
          }>();

          return (
            <div>
              {typeList === "win" || typeList === "buy" ? (
                <>
                  <p>{data.statusPayment}</p>
                  <p>({checkoutType[data.checkoutTypeSlug]})</p>
                </>
              ) : (
                <>
                  <p>{data.status}</p>
                  {!freeProduct && (
                    <p>({checkoutType[data.checkoutTypeSlug]})</p>
                  )}
                </>
              )}
            </div>
          );
        },
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: {
            _id: string;
            status: string;
            name: string;
            seller: string;
            buyer: string;
            shipping: boolean;
            auctionStarted: boolean;
            rate: string;
            successfulTransaction: boolean;
            paid: boolean;
            checkoutTypeSlug: string;
            statusPaymentSlug: string;
          } = cell.getValue<{
            _id: string;
            name: string;
            status: string;
            shipping: boolean;
            successfulTransaction: boolean;
            paid: boolean;
            rate: string;
            auctionStarted: boolean;
            checkoutTypeSlug: string;
            seller: string;
            buyer: string;
            statusPaymentSlug: string;
          }>();
          return (
            <>
              {!handleByAdmin ? ( // xử lí của user
                <div>
                  {/* Nút sửa khi sản phẩm chưa được duyệt và chưa bất đầu */}
                  {typeList === "create" &&
                    data.status === "Đang chờ duyệt" && (
                      <Link
                        to={`${
                          freeProduct
                            ? "/chinh-sua-chia-se/"
                            : "/chinh-sua-dau-gia/"
                        }${data._id}`}
                        className="btn-11"
                      >
                        <span className="btn-11__content">Sửa</span>
                      </Link>
                    )}

                  {/* Nút xem sản phẩm đã được duyệt và đã bất đầu*/}
                  {typeList === "create" &&
                    !data.auctionStarted &&
                    (data.paid || data.checkoutTypeSlug === "cod") &&
                    data.status === "Đã được duyệt" && (
                      <Link
                        to={`/chi-tiet-dau-gia/${data._id}`}
                        className="btn-11"
                      >
                        <span className="btn-11__content">Chi tiết</span>
                      </Link>
                    )}

                  {/* Nút xác nhận gửi hàng của người bán*/}
                  {typeList === "create" &&
                    data.auctionStarted &&
                    (data.paid || data.checkoutTypeSlug === "cod") &&
                    !data.shipping &&
                    data.status === "Đã được duyệt" && (
                      <div
                        className={`btn-11 ${data.checkoutTypeSlug === "cod"}`}
                        onClick={() => {
                          if (!data.shipping) {
                            setModalMode("");
                            setMsgModal(
                              "Xác nhận cho người mua biết rằng bạn đã gửi hàng!"
                            );
                            handleShow();
                            setInforHanle({
                              variable: "updateShipping",
                              id: data._id,
                            });
                          }
                        }}
                      >
                        <span className="btn-11__content">Xác nhận</span>
                      </div>
                    )}

                  {/* Nút khiếu nại của người bán trong trường hợp COD*/}
                  {typeList === "create" &&
                    data.checkoutTypeSlug === "cod" &&
                    data.shipping &&
                    !data.paid &&
                    data.status === "Đã được duyệt" && (
                      <div
                        className={`btn-11 `}
                        onClick={() => {
                          setModalMode("report");
                          setMsgModal(
                            "Hãy cho chúng tôi biết lí do bạn muốn khiếu nại!"
                          );
                          setReportId({
                            seller: data.seller,
                            buyer: data.buyer,
                          });
                          setInforHanle({
                            variable: "report",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Khiếu nại</span>
                      </div>
                    )}

                  {/* Nút khiếu nại của người bán khi sản phẩm chưa được thanh toán */}
                  {/* Không áp dụng trường hợp vận chuyện COD */}
                  {typeList === "create" &&
                    !data.paid &&
                    !freeProduct &&
                    data.checkoutTypeSlug !== "cod" &&
                    data.status === "Đã được duyệt" && (
                      <div
                        className="btn-11"
                        onClick={() => {
                          setModalMode("report");
                          setMsgModal(
                            "Hãy cho chúng tôi biết lí do bạn muốn khiếu nại!"
                          );
                          setReportId({
                            seller: data.seller,
                            buyer: data.buyer,
                          });
                          setInforHanle({
                            variable: "report",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Khiếu nại</span>
                      </div>
                    )}

                  {/* Nút khiếu nại của người mua khi chưa nhận được sản phẩm */}
                  {(typeList === "win" || typeList === "buy") &&
                    ((data.checkoutTypeSlug !== "cod" &&
                      data.statusPaymentSlug === "da-thanh-toan") ||
                      (data.checkoutTypeSlug === "cod" &&
                        data.statusPaymentSlug === "chua-thanh-toan")) &&
                    !data.successfulTransaction && (
                      <div
                        className="btn-11"
                        onClick={() => {
                          setModalMode("report");
                          setReportId({
                            seller: data.seller,
                            buyer: data.buyer,
                          });
                          setInforHanle({
                            variable: "report",
                            id: data._id,
                          });
                          setMsgModal(
                            "Hãy cho chúng tôi biết lí do bạn muốn khiếu nại!"
                          );
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Khiếu nại</span>
                      </div>
                    )}

                  {/* Nút xác nhận của người mua khi nhận được sản phẩm */}
                  {(typeList === "win" || typeList === "buy") &&
                    data.statusPaymentSlug === "da-thanh-toan" &&
                    data.shipping &&
                    !data.successfulTransaction && (
                      <div
                        className="btn-11 mt-2"
                        onClick={() => {
                          setModalMode("");

                          setInforHanle({
                            variable: "finishTransaction",
                            id: data._id,
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn đã nhận được sản phẩm!"
                          );
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Đã nhận hàng</span>
                      </div>
                    )}

                  {/* Nút kiến nghị để admin duyệt lại */}
                  {typeList === "refuse" && data.status === "Đã bị từ chối" && (
                    <div
                      className="btn-11"
                      onClick={() => {
                        setModalMode("");
                        setMsgModal(
                          "Bạn có chắc muốn kiến nghị duyệt một lần nữa cho cuộc đấu giá này?"
                        );
                        setInforHanle({
                          variable: "approveAgain",
                          id: data._id,
                        });
                        handleShow();
                      }}
                    >
                      <span className="btn-11__content">
                        Kiến nghị duyệt lại
                      </span>
                    </div>
                  )}

                  {/* Nút thanh toán */}
                  {(typeList === "win" || typeList === "buy") &&
                    data.statusPaymentSlug === "chua-thanh-toan" &&
                    data.checkoutTypeSlug !== "cod" && (
                      <Link to={`/thanh-toan/${data._id}`} className="btn-11">
                        <span className="btn-11__content">Thanh toán</span>
                      </Link>
                    )}

                  {/* Nút xác nhận của người mua khi nhận được hàng bằng hình thức COD */}
                  {(typeList === "win" || typeList === "buy") &&
                    data.statusPaymentSlug === "chua-thanh-toan" &&
                    data.checkoutTypeSlug === "cod" &&
                    data.shipping && (
                      <div
                        onClick={() => {
                          setModalMode("");
                          setMsgModal(
                            "Xác nhận với người bán rằng bạn đã nhận được hàng!"
                          );
                          setInforHanle({
                            variable: "finishTransaction",
                            id: data._id,
                          });
                          handleShow();
                        }}
                        className="btn-11 mt-2"
                      >
                        <span className="btn-11__content">Đã nhận hàng</span>
                      </div>
                    )}

                  {/* Nút xem danh sách người nhận sản phẩm */}
                  {typeList === "create" &&
                    data.status === "Đã được duyệt" &&
                    freeProduct && (
                      <div
                        className="btn-11"
                        onClick={() => handleViewReceivedList(data._id)}
                      >
                        <span className="btn-11__content">Xem danh sách</span>
                      </div>
                    )}
                  {/* Nút đánh giá sản phẩm */}
                  {data.successfulTransaction &&
                    !freeProduct &&
                    !data.rate &&
                    typeList !== "create" && (
                      <div
                        className="btn-11 mt-2"
                        onClick={() => {
                          setModalMode("rate");
                          setInforHanle({
                            variable: "rate",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Đánh giá</span>
                      </div>
                    )}
                  {/* Nút xóa sản phẩm */}
                  <div
                    className="btn-11 mt-2"
                    onClick={() => {
                      setModalMode("");
                      setMsgModal("Bạn có chắc muốn ẩn cuộc đấu giá này?");
                      setInforHanle({
                        variable: "delete",
                        id: data._id,
                      });
                      handleShow();
                    }}
                  >
                    <span className="btn-11__content">Ẩn</span>
                  </div>
                </div>
              ) : (
                // xử lý admin
                <div>
                  {statusAuction === "Đang chờ duyệt" && (
                    <>
                      <div
                        className="btn-11"
                        onClick={() => {
                          setModalMode("");
                          setMsgModal(
                            "Bạn có chắc muốn duyệt cuộc đấu giá này?"
                          );
                          setInforHanle({
                            variable: "approve",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Duyệt</span>
                      </div>
                      <div
                        className="btn-11 mt-2"
                        onClick={() => {
                          setModalMode("");
                          setMsgModal(
                            "Bạn có chắc muốn từ chối cuộc đấu giá này?"
                          );
                          setInforHanle({
                            variable: "refuse",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Từ chối</span>
                      </div>
                    </>
                  )}
                  {statusAuction === "Đã từ chối" && (
                    <>
                      <div
                        className="btn-11"
                        onClick={() => {
                          setModalMode("");

                          setMsgModal(
                            "Bạn có chắc muốn duyệt lại cuộc đấu giá này?"
                          );
                          setInforHanle({
                            variable: "approve",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Duyệt lại</span>
                      </div>
                      <div
                        className="btn-11 mt-2"
                        onClick={() => {
                          setModalMode("");

                          setMsgModal("Bạn có chắc muốn xóa cuộc đấu giá này?");
                          setInforHanle({
                            variable: "delete",
                            id: data._id,
                          });
                          handleShow();
                        }}
                      >
                        <span className="btn-11__content">Xóa vĩnh viễn</span>
                      </div>
                    </>
                  )}

                  {statusAuction === "Đã được duyệt" && (
                    <div
                      className="btn-11 mt-2"
                      onClick={() => {
                        setModalMode("");
                        setMsgModal("Bạn có chắc muốn xóa cuộc đấu giá này?");
                        setInforHanle({
                          variable: "delete",
                          id: data._id,
                        });
                        handleShow();
                      }}
                    >
                      <span className="btn-11__content">Xóa</span>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [next, freeProduct, handleByAdmin, typeList, statusAuction]
  );

  const handleSelectReport = (checked: boolean, value: string) => {
    if (checked) {
      setReportReason([...reportReason, value]);
    } else {
      const newArr = reportReason.filter((e) => e !== value);
      setReportReason(newArr);
    }
  };

  const handleReport = async (id: string) => {
    let data: {
      type: string[];
      accuserId: string; // id người tố cáo
      accusedId: string; // id người bị tố cáo
      productId: string;
    };
    if (typeList === "create") {
      // người bán khiểu nại người mua
      data = {
        type: reportReason,
        accuserId: reportId.seller, // id người tố cáo
        accusedId: reportId.buyer, // id người bị tố cáo
        productId: id,
      };
    } else {
      // người mua khiếu nại người bán
      data = {
        type: reportReason,
        accuserId: reportId.buyer, // id người tố cáo
        accusedId: reportId.seller, // id người bị tố cáo
        productId: id,
      };
    }
    const res: any = await userApi.createReport(data);
    if (res?.status === "success") {
      toast.success("Khiếu nại thành công!");
    } else {
      toast.error("Khiếu nại không thành công!");
    }
  };

  const handleFinishTransaction = async (id: string) => {
    const res: any = await userApi.handleFinishTransaction({
      id,
      userId: idOwner,
    });
    if (res?.status === "success") {
      toast.success("Xác nhận thành công!");
      queryClient.invalidateQueries({
        queryKey: ["auction-list__user", { typeList }],
      });
    } else {
      toast.error("Xác nhận không thành công!");
    }
  };

  const handleRefreshList = (a: any) => {
    if (handleByAdmin) {
      if (freeProduct) {
        queryClient.invalidateQueries({
          queryKey: [
            "freeProduct-list__admin",
            { statusFreeAuction: statusAuction },
          ],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction }],
        });
      }
    } else {
      if (freeProduct) {
        queryClient.invalidateQueries({
          queryKey: ["freeProduct-list__user", { typeFreeList: typeList }],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["auction-list__user", { typeList }],
        });
      }
    }
  };

  const handleRate = async (id: string) => {
    console.log("do");

    const formData = new FormData();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    formData.append("id", id);
    formData.append("comment", comment);
    formData.append("star", star.toString());
    for (let i = 0; i < uploadedImages.length; i++) {
      formData.append("images", uploadedImages[i]);
    }

    const res: any = await userApi.createRate(formData, config);
    if (res?.status === "success") {
      toast.success("Đánh giá thành công!");
    }
    console.log(res);
  };

  return (
    <>
      <>
        <Modal
          show={showModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === "report"
                ? "Khiếu nại"
                : modalMode === "rate"
                ? "Đánh giá"
                : "Thông báo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {msgModal}
            {modalMode === "report" && (
              <div className="mt-4">
                <label
                  className="containerCheckbox"
                  htmlFor={"qua-han-thanh-toan"}
                >
                  Người dùng không thanh toán sau 3 ngày!
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectReport(e.target.checked, "qua-han-thanh-toan")
                    }
                    id={"qua-han-thanh-toan"}
                    className="status-checkall"
                    name="checkbox-status"
                    value="0"
                  ></input>
                  <span className="checkmark"></span>
                </label>
                <label
                  className="containerCheckbox"
                  htmlFor={"khong-nhan-hang"}
                >
                  Người đấu giá không nhận hàng
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectReport(e.target.checked, "khong-nhan-hang")
                    }
                    id={"khong-nhan-hang"}
                    className="status-checkall"
                    name="checkbox-status"
                    value="0"
                  ></input>
                  <span className="checkmark"></span>
                </label>
                <label
                  className="containerCheckbox"
                  htmlFor={"khong-nhan-duoc-hang"}
                >
                  Không nhận được hàng
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectReport(
                        e.target.checked,
                        "khong-nhan-duoc-hang"
                      )
                    }
                    id={"khong-nhan-duoc-hang"}
                    className="status-checkall"
                    name="checkbox-status"
                    value="0"
                  ></input>
                  <span className="checkmark"></span>
                </label>
              </div>
            )}

            {modalMode === "rate" && (
              <div>
                <div className="d-flex">
                  <Typography component="legend">
                    Chất lượng sản phẩm:
                  </Typography>
                  <Rating
                    name="simple-controlled"
                    value={star}
                    onChange={(event, newValue: any) => {
                      setStar(newValue);
                    }}
                  />
                </div>
                <Row className="mt-4">
                  <Form.Group className="mb-3" as={Col} md="12">
                    <Form.Control
                      type="text"
                      as={"textarea"}
                      value={comment}
                      placeholder="Nhận xét"
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <div className="rate-upload mt-2">
                  <DropImages
                    handleImageUpload={handleImageUpload}
                  ></DropImages>
                </div>
                <span style={{ fontSize: "11px" }}>
                  Lưu ý: chúng tôi chỉ giữ lại 4 ảnh đầu tiên mà bạn chọn!
                </span>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="danger" onClick={() => runFunc(inforHandle)}>
              Tiếp tục
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      <MaterialReactTable
        columns={columns}
        data={dataLocal.current}
        enableColumnOrdering
        enableGlobalFilter={true} //turn off a feature
        renderTopToolbarCustomActions={() => (
          <IconButton onClick={handleRefreshList}>
            <Autorenew></Autorenew>
          </IconButton>
        )}
      />
    </>
  );
}

export default ProductsTable;
