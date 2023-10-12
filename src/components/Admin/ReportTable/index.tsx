import { Email, MarkEmailRead, Autorenew } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import userApi from "../../../api/userApi";
import { reportType } from "../../../constant";

interface IProTable {
  productName: string;
  accuser: IInforMail;
  accused: IInforMail;
  type: string[];
  handle: {
    idReport: string;
    approve: boolean;
  };
}

interface IInforFunc {
  type: string;
  id?: string;
  email?: string;
  idReport?: string;
}

interface IInforMail {
  email: string;
  productName: string;
  typeReport: string;
  idReport: string;
  mailToAccuser?: boolean;
  mailToAccused?: boolean;
}

function ReportTable({ data }: { data: any }) {
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const dataLocal = useRef<IProTable[]>([]);
  const queryClient = useQueryClient();
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  const [inforFunc, setInforFunc] = useState<IInforFunc>();
  const [inforMail, setInforMail] = useState<IInforMail>();

  useMemo(() => {
    if (data?.length) {
      dataLocal.current = data?.map((item: any) => {
        let types = item.type.map((e: string) => {
          return reportType[e];
        });
        types = types.join(", ");

        return {
          productName: item.productId.name,
          accuser: {
            email: item.accuser.email,
            productName: item.productId.name,
            typeReport: types,
            idReport: item._id,
            mailToAccuser: item.mailToAccuser,
            mailToAccused: item.mailToAccused,
          },
          accused: {
            email: item.accused.email,
            productName: item.productId.name,
            typeReport: types,
            idReport: item._id,
            mailToAccuser: item.mailToAccuser,
            mailToAccused: item.mailToAccused,
          },
          type: types,
          handle: {
            idReport: item._id,
            approve: item.approve,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const runFunc = async (inforFunc: IInforFunc | undefined) => {
    if (inforFunc?.type === "mailToAccuser") {
      const data = {
        ...inforMail,
        type: "mailToAccuser",
      };
      const res: any = await userApi.sendMailToUser(data);
      if (res?.status === "success") {
        toast.success("Gửi email thành công!");
        queryClient.invalidateQueries({ queryKey: ["reports"] });
      } else {
        toast.error("Gửi email thất bại!");
      }
      handleClose();

      // queryClient.invalidateQueries({ queryKey: ["reports"] });
    } else if (inforFunc?.type === "mailToAccused") {
      const data = {
        ...inforMail,
        type: "mailToAccused",
      };
      const res: any = await userApi.sendMailToUser(data);
      if (res?.status === "success") {
        toast.success("Gửi email thành công!");
        queryClient.invalidateQueries({ queryKey: ["reports"] });
      } else {
        toast.error("Gửi email thất bại!");
      }
      handleClose();

      // queryClient.invalidateQueries({ queryKey: ["reports"] });
    } else if (inforFunc?.type === "approveReport") {
      if (inforFunc?.idReport) {
        const res: any = await userApi.approveReport(inforFunc.idReport);
        if (res?.status === "success") {
          toast.success("Duyệt khiếu nại thành công!");
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        }
      }
      handleClose();
    } else {
      // deleteReport
      if (inforFunc?.idReport) {
        const res: any = await userApi.deleteReport(inforFunc.idReport);
        if (res?.status === "success") {
          toast.success("Xóa khiếu nại thành công!");
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        }
      }
      handleClose();
    }
  };

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Tên sản phẩm",
        accessorKey: "productName",
        id: "productName",
      },
      {
        header: "Người tố cáo",
        accessorKey: "accuser",
        id: "accuser",
        Cell: ({ cell }) => {
          const data: IInforMail = cell.getValue<IInforMail>();
          // MarkEmail
          return (
            <>
              <Tooltip
                placement="top"
                title={!data.mailToAccuser ? "Chưa gửi email!" : "Đã gửi email"}
              >
                <IconButton>
                  {!data.mailToAccuser ? (
                    <Email color={"error"} />
                  ) : (
                    <MarkEmailRead color={"success"}></MarkEmailRead>
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title={`Gửi mail cho ${data.email}`}>
                <span
                  className="cursorPointer"
                  onClick={() => {
                    setInforFunc({
                      type: "mailToAccuser",
                      email: cell.getValue<string>(),
                    });
                    setInforMail({
                      email: data.email,
                      productName: data.productName,
                      typeReport: data.typeReport,
                      idReport: data.idReport,
                    });
                    setMsgModal(`Gửi email xác nhận tố cáo đến ${data.email}?`);
                    handleShow();
                  }}
                >
                  {data.email}
                </span>
              </Tooltip>
            </>
          );
        },
      },
      {
        header: "Bị cáo",
        accessorKey: "accused",
        id: "accused",
        Cell: ({ cell }) => {
          const data: IInforMail = cell.getValue<IInforMail>();

          return (
            <>
              <Tooltip
                placement="top"
                title={!data.mailToAccused ? "Chưa gửi email!" : "Đã gửi email"}
              >
                <IconButton>
                  {!data.mailToAccused ? (
                    <Email color={"error"} />
                  ) : (
                    <MarkEmailRead color={"success"}></MarkEmailRead>
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title={`Gửi mail cho ${data.email}`}>
                <span
                  className="cursorPointer"
                  onClick={() => {
                    setInforFunc({
                      type: "mailToAccused",
                      email: cell.getValue<string>(),
                    });
                    setInforMail({
                      email: data.email,
                      productName: data.productName,
                      typeReport: data.typeReport,
                      idReport: data.idReport,
                    });
                    setMsgModal(`Gửi email xác nhận tố cáo đến ${data.email}?`);
                    handleShow();
                  }}
                >
                  {data.email}
                </span>
              </Tooltip>
            </>
          );
        },
      },
      {
        header: "Loại tố cáo",
        accessorKey: "type",
        id: "type",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { idReport: string; approve: boolean } = cell.getValue<{
            idReport: string;
            approve: boolean;
          }>();
          return (
            <>
              <div
                className={`btn-11 mt-2 ${data.approve ? "disable" : ""}`}
                onClick={() => {
                  if (!data.approve) {
                    setInforFunc({
                      type: "approveReport",
                      idReport: data.idReport,
                    });
                    setMsgModal(`Xác nhận duyệt tố cáo này!`);
                    handleShow();
                  }
                }}
              >
                <span className="btn-11__content">Duyệt</span>
              </div>
              <div
                className={`btn-11 mt-2`}
                onClick={() => {
                  setInforFunc({
                    type: "deleteReport",
                    idReport: data.idReport,
                  });
                  setMsgModal(`Xác nhận xóa tố cáo này!`);
                  handleShow();
                }}
              >
                <span className="btn-11__content">Xóa</span>
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  const handleRefreshList = (a: any) => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
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
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msgModal}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="danger" onClick={() => runFunc(inforFunc)}>
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

export default React.memo(ReportTable);
