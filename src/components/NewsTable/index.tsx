import { Autorenew } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Image, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import newsApi from "../../api/newsApi";
import userApi from "../../api/userApi";
import { auction, uploadImg } from "../../asset/images";
import formatDateTime from "../../utils/formatDay";
import TextEditor from "../TextEditor";
import "./NewsTable.css";

interface IProTable {
  img: {
    src: string;
    id: string;
  };
  isApprove: number;
  title: number;
  description: number;
  createdAt: string;
  handle: {
    id: string;
    isApprove: number;
  };
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NewsTable({
  data,
  isAdmin = false,
  typeList,
}: {
  data: any;
  isAdmin?: boolean;
  typeList: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [handleMode, setHandleMode] = useState("create");
  const [errInput, setErrInput] = useState<boolean>(false);
  const [inforFunc, setInforFunc] = useState<{ variant: string; id: string }>({
    variant: "",
    id: "",
  });

  const [payload, setPayload] = useState<any>({
    title: "",
    description: "",
  });
  const [content, setContent] = useState<string>("");
  const [idEdit, setIdEdit] = useState<string>("");
  const [imgNews, setImgNews] = useState<any>();
  const [srcImgEdit, setSrcImgEdit] = useState<string>("");
  const dataLocal = useRef<IProTable[]>([]);
  const queryClient = useQueryClient();
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useMemo(() => {
    if (data?.length) {
      dataLocal.current = data?.map((item: any) => {
        let checkStatus = "Chưa được duyệt";
        if (item.isApprove === 1) {
          checkStatus = "Đã được duyệt";
        }

        return {
          img: {
            src: item.img,
            id: item._id,
          },
          title: item.title,
          isApprove: checkStatus,
          description: item.description,
          createdAt: formatDateTime(item.createdAt),
          handle: {
            id: item._id,
            isApprove: item.isApprove,
            reApprove: item.reApprove,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const runFunc = async () => {
    if (inforFunc.variant === "hide") {
      const res: any = await newsApi.hideNews(inforFunc.id);

      if (res?.status === "success") {
        toast.success("Ẩn bài viết thành công!");
        handleRefreshList();
      }
    } else if (inforFunc.variant === "show") {
      const res: any = await newsApi.showNews(inforFunc.id);

      if (res?.status === "success") {
        toast.success("Hiển thị bài viết thành công!");
        handleRefreshList();
      }
    } else if (inforFunc.variant === "reApprove") {
      const res: any = await newsApi.reApprove(inforFunc.id);

      if (res?.status === "success") {
        toast.success("Yêu cầu duyệt lại thành công!");
        handleRefreshList();
      }
    } else if (
      inforFunc.variant === "admin_approve" ||
      inforFunc.variant === "admin_reApprove"
    ) {
      const res: any = await newsApi.handleApproveNews({
        id: inforFunc.id,
        type: "approve",
      });

      if (res?.status === "success") {
        toast.success("Đã duyệt bài viết thành công!");
        handleRefreshList();
      }
    } else if (inforFunc.variant === "admin_refuse") {
      const res: any = await newsApi.handleApproveNews({
        id: inforFunc.id,
        type: "refuse",
      });

      if (res?.status === "success") {
        toast.success("Đã từ chối bài viết thành công!");
        handleRefreshList();
      }
    } else if (inforFunc.variant === "delete") {
      const res: any = await newsApi.deleteNews(inforFunc.id)

      if (res?.status === "success") {
        toast.success("Đã xóa bài viết thành công!");
        handleRefreshList();
      }
    }

    handleClose();
  };

  const handleRefreshList = () => {
    if (isAdmin) {
      queryClient.invalidateQueries({
        queryKey: ["news-list__admin", { typeList }],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ["news-list", { typeList }],
      });
    }
  };

  const handlerodDescription = useCallback((state: string) => {
    setContent(state);
  }, []);

  const handleSelectEdit = useCallback(
    (id: string) => {
      setHandleMode("edit");
      const news = data.find((item: any) => item._id === id);
      setContent(news.content);
      setIdEdit(id);
      setImgNews(null);
      setSrcImgEdit(news.img);
      setPayload({
        title: news.title,
        description: news.description,
      });
      handleClickOpen();
    },
    [data]
  );

  const handleNews = () => {
    if (handleMode === "create") {
      handleCreateNews();
    } else {
      handleEditNews();
    }
  };

  const handleCreateNews = async () => {
    if (content && payload.title && payload.description) {
      const formData = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("content", content);
      if (imgNews && imgNews.length > 0) {
        formData.append("img", imgNews[0]);
      }
      const res: any = await newsApi.create(formData, config);
      if (res?.status === "success") {
        toast.success("Đăng bài thành công!");
        handleCloseDialog();
        handleRefreshList();
        setPayload({
          title: "",
          description: "",
        });
        setContent("");
        setImgNews(null);
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin cho bài viết!");
    }
  };

  const handleEditNews = async () => {
    const formData = new FormData();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    formData.append("id", idEdit);
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("content", content);
    if (imgNews && imgNews.length > 0) {
      formData.append("img", imgNews[0]);
    }
    const res: any = await newsApi.edit(formData, config);
    if (res?.status === "success") {
      toast.success("Cập nhật bài viết thành công!");
      handleCloseDialog();
      handleRefreshList();
    }
  };
  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Ảnh",
        accessorKey: "img",
        id: "img",
        Cell: ({ cell }) => {
          const data: {
            src: string;
            id: string;
          } = cell.getValue<{
            src: string;
            id: string;
          }>();

          return (
            <Link to={`/tin-tuc/${data.id}`}>
              <Image
                width={120}
                height={120}
                src={data.src}
                style={{ cursor: "pointer" }}
              />
            </Link>
          );
        },
      },
      {
        header: "Tiêu đề",
        accessorKey: "description",
        id: "description",
      },
      {
        header: "Ngày đăng",
        accessorKey: "createdAt",
        id: "createdAt",
      },
      {
        header: "Trạng thái",
        accessorKey: "isApprove",
        id: "isApprove",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { id: string; isApprove: number; reApprove: boolean } =
            cell.getValue<{
              id: string;
              isApprove: number;
              reApprove: boolean;
            }>();

          return (
            <>
              {isAdmin ? (
                <div>
                  {typeList === "pending" && (
                    <div>
                      <div
                        className={`btn-11 mt-2`}
                        onClick={() => {
                          handleShow();
                          setInforFunc({
                            id: data.id,
                            variant: "admin_approve",
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn muốn duyệt bài viết này!"
                          );
                        }}
                      >
                        <span className="btn-11__content">Duyệt</span>
                      </div>
                      <div
                        className={`btn-11 mt-2`}
                        onClick={() => {
                          handleShow();
                          setInforFunc({
                            id: data.id,
                            variant: "admin_refuse",
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn muốn từ chối bài viết này!"
                          );
                        }}
                      >
                        <span className="btn-11__content">Từ chối</span>
                      </div>
                    </div>
                  )}

                  {typeList === "reApprove" && (
                    <div
                      className={`btn-11 mt-2`}
                      onClick={() => {
                        handleShow();
                        setInforFunc({
                          id: data.id,
                          variant: "admin_reApprove",
                        });
                        setMsgModal(
                          "Xác nhận rằng bạn muốn duyệt lại bài viết này!"
                        );
                      }}
                    >
                      <span className="btn-11__content">Duyệt lại</span>
                    </div>
                  )}

                  {typeList !== "pending" && (
                    <div
                      className={`btn-11 mt-2`}
                      onClick={() => {
                        handleShow();
                        setInforFunc({
                          id: data.id,
                          variant: "delete",
                        });
                        setMsgModal("Xác nhận rằng bạn muốn xóa bài viết này!");
                      }}
                    >
                      <span className="btn-11__content">Xóa</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!data.isApprove && typeList === "create" && (
                    <div
                      className={`btn-11`}
                      onClick={() => {
                        handleSelectEdit(data.id);
                      }}
                    >
                      <span className="btn-11__content">Sửa</span>
                    </div>
                  )}

                  {!!data.isApprove && typeList === "create" && (
                    <Link to={`/tin-tuc/${data.id}`} className={`btn-11`}>
                      <span className="btn-11__content">Xem</span>
                    </Link>
                  )}

                  {typeList === "refuse" && (
                    <div
                      className={`btn-11 mt-2 ${
                        data.reApprove ? "disable" : ""
                      }`}
                      onClick={() => {
                        if (!data.reApprove) {
                          handleShow();
                          setInforFunc({
                            id: data.id,
                            variant: "reApprove",
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn muốn kiến nghị duyệt lại bài viết này!"
                          );
                        }
                      }}
                    >
                      <span className="btn-11__content">Yêu cầu xem xét</span>
                    </div>
                  )}

                  {typeList === "hide" && (
                    <>
                      <div
                        className={`btn-11 mt-2`}
                        onClick={() => {
                          handleShow();
                          setInforFunc({
                            id: data.id,
                            variant: "show",
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn muốn hiển thị bài viết này!"
                          );
                        }}
                      >
                        <span className="btn-11__content">Hiển thị</span>
                      </div>
                      <div
                        className={`btn-11 mt-2`}
                        onClick={() => {
                          handleShow();
                          setInforFunc({
                            id: data.id,
                            variant: "delete",
                          });
                          setMsgModal(
                            "Xác nhận rằng bạn muốn xóa bài viết này!"
                          );
                        }}
                      >
                        <span className="btn-11__content">Xóa</span>
                      </div>
                    </>
                  )}
                  {typeList !== "hide" && (
                    <div
                      className={`btn-11 mt-2`}
                      onClick={() => {
                        handleShow();
                        setInforFunc({
                          id: data.id,
                          variant: "hide",
                        });
                        setMsgModal("Xác nhận rằng bạn muốn ẩn bài viết này!");
                      }}
                    >
                      <span className="btn-11__content">Ẩn</span>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        },
      },
    ],
    [handleSelectEdit, isAdmin, typeList]
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
            <Modal.Title>Xác nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{msgModal}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="danger" onClick={runFunc}>
              Tiếp tục
            </Button>
          </Modal.Footer>
        </Modal>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          className="customDialog"
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle className="text-center">{"TẠO BÀI VIẾT"}</DialogTitle>
          <div className="p-2" style={{ width: "900px" }}>
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Control
                required
                type="text"
                placeholder="Tiêu đề"
                value={payload.title}
                onChange={(e) =>
                  setPayload({ ...payload, title: e.target.value })
                }
              />
              {!payload.title && (
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập tiêu đề
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Control
                required
                as={"textarea"}
                type="text"
                placeholder="Mô tả"
                value={payload.description}
                onChange={(e) =>
                  setPayload({ ...payload, description: e.target.value })
                }
              />
              {!payload.description && (
                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập mô tả
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="mb-1">
              <div className="dropzone mt-3" style={{ height: "85px" }}>
                <input
                  id="img-select"
                  accept=".jpg, .jpeg, .png ,.html,.htm"
                  type={"file"}
                  className="d-none"
                  onChange={(e) => setImgNews(e.target.files)}
                />

                <label
                  htmlFor="img-select"
                  style={{ cursor: "pointer" }}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <Image
                    style={{ height: "50px" }}
                    src={uploadImg}
                    alt="upload img"
                  ></Image>
                  <p className="pt-1 mb-1" style={{ fontSize: "12px" }}>
                    Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg |
                    .html | .htm
                  </p>
                </label>
              </div>
            </div>

            <div className="mb-2 d-flex" style={{ gap: "50px" }}>
              {handleMode === "edit" && (
                <div>
                  <p>Ảnh cũ:</p>
                  <img
                    style={{ width: "70px", height: "70px" }}
                    src={srcImgEdit || auction}
                    alt="hinh-anh"
                  />
                </div>
              )}
              {imgNews?.length > 0 && (
                <div>
                  <p>Ảnh đang được chọn:</p>
                  <img
                    style={{ width: "70px", height: "70px" }}
                    src={URL.createObjectURL(imgNews[0])}
                    alt="hinh-anh"
                  />
                </div>
              )}
            </div>

            <TextEditor
              description={content}
              handlerodDescription={handlerodDescription}
            ></TextEditor>
          </div>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
            <Button onClick={handleNews}>
              {handleMode === "create" ? "Đăng bài" : "Cập nhật"}
            </Button>
          </DialogActions>
        </Dialog>
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
        renderBottomToolbarCustomActions={() => (
          <div
            className="btn-11 m-2"
            onClick={() => {
              handleClickOpen();
            }}
          >
            <span className="btn-11__content">+</span>
          </div>
        )}
      />
    </>
  );
}

export default React.memo(NewsTable);
