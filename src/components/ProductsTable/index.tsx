import { MaterialReactTable } from "material-react-table";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo, useRef, useState } from "react";
import { Image } from "react-bootstrap";

import { auction } from "../../asset/images";
import { Link, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import userApi from "../../api/userApi";
import { useSelector } from "react-redux";
import { IRootState } from "../../interface";
import { useQueryClient } from "@tanstack/react-query";

interface IProTable {
  name: string;
  images: {
    src: string;
    idProduct: string;
  };
  status: string;
  handle: {
    _id: string;
    status: string;
  };
}

function ProductsTable({
  data,
  typeList, // create => myProduct => can delete || other => not myProduct => can't delete
  handleByAdmin = false,
  statusAuction = "Đã được duyệt",
}: any) {
  const dataLocal = useRef<IProTable[]>([]);
  const next = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [inforHandle, setInforHanle] = useState({
    variable: "",
    id: "",
  });
  const idOwner: any = useSelector((e: IRootState) => e.auth._id);
  const queryClient = useQueryClient();

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  const handleApprove = (id: string) => {
    const approveApi = async () => {
      const res: any = await productApi.approveProduct({ id });
      console.log(res);
      if (res?.status === "success") {
        toast.success("Duyệt cuộc đấu giá thành công!");
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction }],
        });
        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction: "Đã được duyệt" }],
        });
        // thêm api gửi mail
      }
    };
    approveApi();
  };

  const handleRefuse = (id: string) => {
    const refuseApi = async () => {
      const res: any = await productApi.refuseProduct({ id });
      if (res?.status === "success") {
        toast.success("Đã từ chối cuộc đấu giá thành công!");
        // thêm api gửi mail

        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction }],
        });

        queryClient.invalidateQueries({
          queryKey: ["auction-list__admin", { statusAuction: "Đã từ chối" }],
        });
      }
    };
    refuseApi();
  };

  const handleApproveAgain = (id: string) => {
    const againApi = async () => {
      const res: any = await productApi.approveAgainProduct({ id });
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
      };
      if (typeList === "create") {
        // xóa bên bảng các sản phẩm đã tạo
        result = await productApi.deleteProductById(payload);
      } else {
        const pl = {
          ...payload,
          type: typeList,
        };
        result = await userApi.deleteProductHistory(pl);
      }
      if (result?.status === "success") {
        toast.success("Đã xóa sản phẩm thành công!");
        if (handleByAdmin) {
          queryClient.invalidateQueries({
            queryKey: ["auction-admin", { statusAuction }],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["auction-list__user", { typeList }],
          });
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
          handle: {
            _id: item._id,
            status: item.status,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

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
              onClick={() => next(`/chi-tiet-dau-gia/${data.idProduct}`)}
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
        accessorKey: "status",
        id: "status",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: {
            _id: string;
            status: string;
          } = cell.getValue<{
            _id: string;
            status: string;
          }>();
          return (
            <>
              {!handleByAdmin ? ( // xử lí của user
                <div>
                  {typeList === "create" &&
                    data.status === "Đang chờ duyệt" && (
                      <Link
                        to={`/chinh-sua-dau-gia/${data._id}`}
                        className="btn-11"
                      >
                        <span className="btn-11__content">Sửa</span>
                      </Link>
                    )}
                  {typeList === "create" && data.status === "Đã được duyệt" && (
                    <div className="btn-11 disable">
                      <span className="btn-11__content">Sửa</span>
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
    [next, handleByAdmin, typeList, statusAuction]
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
