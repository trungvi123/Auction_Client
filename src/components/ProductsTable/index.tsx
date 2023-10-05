import { MaterialReactTable } from "material-react-table";
import { type MRT_ColumnDef } from "material-react-table";
import { useCallback, useMemo, useRef, useState } from "react";
import { Image } from "react-bootstrap";

import { auction } from "../../asset/images";
import { Link, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import userApi from "../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../interface";
import { useQueryClient } from "@tanstack/react-query";
import {
  setFreeProductPermission,
  setProductPermission,
} from "../../redux/authSlice";

interface IProTable {
  name: string;
  images: {
    src: string;
    idProduct: string;
  };
  statusPayment: string;
  status: string;
  handle: {
    _id: string;
    name: string;
    status: string;
    statusPaymentSlug: string;
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
  const prodPer: any = useSelector((e: IRootState) => e.auth.productPermission);
  const freeProdPer: any = useSelector(
    (e: IRootState) => e.auth.freeProductPermission
  );
  const idOwner: any = useSelector((e: IRootState) => e.auth._id);
  const queryClient = useQueryClient();

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  const handleApprove = (id: string) => {
    const approveApi = async () => {
      const res: any = await productApi.approveProduct({
        id,
        isFree: freeProduct,
      });
      if (res?.status === "success") {
        toast.success("Duyệt cuộc đấu giá thành công!");
        if (freeProduct) {
          queryClient.invalidateQueries({
            queryKey: ["freeProduct-list__admin", { statusAuction }],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "freeProduct-list__admin",
              { statusAuction: "Đã được duyệt" },
            ],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["auction-list__admin", { statusAuction }],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "auction-list__admin",
              { statusAuction: "Đã được duyệt" },
            ],
          });
        }

        // thêm api gửi mail
      }
    };
    approveApi();
  };

  const handleRefuse = (id: string) => {
    const refuseApi = async () => {
      const res: any = await productApi.refuseProduct({
        id,
        isFree: freeProduct,
      });
      if (res?.status === "success") {
        toast.success("Đã từ chối cuộc đấu giá thành công!");
        // thêm api gửi mail
        if (freeProduct) {
          queryClient.invalidateQueries({
            queryKey: ["freeProduct-list__admin", { statusAuction }],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "freeProduct-list__admin",
              { statusAuction: "Đã từ chối" },
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
    refuseApi();
  };

  const handleApproveAgain = (id: string) => {
    const againApi = async () => {
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
    againApi();
  };

  const handleDelete = (id: string) => {
    const delApi = async () => {
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
              queryKey: ["freeProduct-list__admin", { statusAuction }],
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
                queryKey: [
                  "freeProduct-list__user",
                  { typeFreeList: "refuse" },
                ],
              });
            }
            if (typeList === "refuse") {
              // khi xoa o refuse thi cap nhat lai luon cache cua create
              queryClient.invalidateQueries({
                queryKey: [
                  "freeProduct-list__user",
                  { typeFreeList: "create" },
                ],
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
    delApi();
  };

  const runFunc = (infor: { variable: string; id: string }) => {
    if (infor.variable === "approve") {
      handleApprove(infor.id);
    } else if (infor.variable === "refuse") {
      handleRefuse(infor.id);
    } else if (infor.variable === "approveAgain") {
      handleApproveAgain(infor.id);
    } else {
      handleDelete(infor.id);
    }
    handleClose();
  };

  useMemo(() => {
    if (data.length > 0) {
      dataLocal.current = data?.map((item: any) => {
        return {
          name: item.name,
          images: {
            src: item.images[0] ? item.images[0] : auction,
            idProduct: item._id,
          },
          status: item.status,
          statusPayment: item.statusPayment,
          handle: {
            _id: item._id,
            name: item.name,
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
      },
      {
        header: "Trạng thái",
        accessorKey:
          typeList === "win" || typeList === "buy" ? "statusPayment" : "status",
        id: "status",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: {
            _id: string;
            status: string;
            name: string;
            statusPaymentSlug: string;
          } = cell.getValue<{
            _id: string;
            name: string;
            status: string;
            statusPaymentSlug: string;
          }>();
          return (
            <>
              {!handleByAdmin ? ( // xử lí của user
                <div>
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
                  {typeList === "create" &&
                    data.status === "Đã được duyệt" &&
                    !freeProduct && (
                      <div className="btn-11 disable">
                        <span className="btn-11__content">Sửa</span>
                      </div>
                    )}
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
                  {typeList === "refuse" && data.status === "Đã bị từ chối" && (
                    <div
                      className="btn-11"
                      onClick={() => {
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

                  {(typeList === "win" || typeList === "buy") &&
                    data.statusPaymentSlug === "chua-thanh-toan" && (
                      <Link to={`/thanh-toan/${data._id}`} className="btn-11">
                        <span className="btn-11__content">Thanh toán</span>
                      </Link>
                    )}

                  <div
                    className="btn-11 mt-2"
                    onClick={() => {
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
                </div>
              ) : (
                // xử lý admin
                <div>
                  {statusAuction === "Đang chờ duyệt" && (
                    <>
                      <div
                        className="btn-11"
                        onClick={() => {
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
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msgModal}</Modal.Body>
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
      />
    </>
  );
}

export default ProductsTable;
