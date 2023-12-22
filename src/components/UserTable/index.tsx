import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import userApi from "../../api/userApi";

interface IProTable {
  name: string;
  email: string;
  warnLevel: number;
  handle: {
    idUser: string;
    block: boolean;
    email: string;
  };
}

function UserTable({ data }: { data: any }) {
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [inforFunc, setInforFunc] = useState<{
    variant: string;
    idUser: string;
  }>({
    variant: "",
    idUser: "",
  });
  const dataLocal = useRef<IProTable[]>([]);
  const queryClient = useQueryClient();
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  useMemo(() => {
    if (data?.length) {
      dataLocal.current = data?.map((item: any) => {
        return {
          name: item.lastName,
          email: item.email,
          warnLevel: item.warnLevel,
          handle: {
            idUser: item._id,
            email: item.email,
            block: item.block,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const runFunc = async () => {
    if (inforFunc.variant === "block" || inforFunc.variant === "unblock") {
      const res: any = await userApi.updateBlockUserById({
        id: inforFunc.idUser,
        type: inforFunc.variant,
      });
      if (res?.status === "success") {
        if (inforFunc.variant === "block") {
          toast.success("Khóa tài khoản người dùng thành công!");
        } else {
          toast.success("Mở khóa tài khoản người dùng thành công!");
        }
        queryClient.invalidateQueries({ queryKey: ["user-list__admin"] });
      }
    } else {
      const res: any = await userApi.deleteUserById(inforFunc.idUser);
      if (res?.status === "success") {
        toast.success("Xóa tài khoản người dùng thành công!");
        queryClient.invalidateQueries({ queryKey: ["user-list__admin"] });
      } else {
        toast.success("Xóa tài khoản người dùng thất bại!");
      }
    }

    handleClose();
  };

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Tên",
        accessorKey: "name",
        id: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
        id: "email",
      },
      {
        header: "Mức độ cảnh báo",
        accessorKey: "warnLevel",
        id: "warnLevel",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { email: string; idUser: string; block: string } =
            cell.getValue<{
              email: string;
              idUser: string;
              block: string;
            }>();
          return (
            <>
              <div
                className={`btn-11`}
                onClick={() => {
                  if (data.block) {
                    setMsgModal(
                      "Xác nhận rằng bạn muốn mở khóa cho tài khoản này!"
                    );
                    setInforFunc({
                      variant: "unblock",
                      idUser: data.idUser,
                    });
                  } else {
                    setInforFunc({
                      variant: "block",
                      idUser: data.idUser,
                    });
                    setMsgModal("Xác nhận rằng bạn muốn khóa tài khoản này!");
                  }
                  handleShow();
                }}
              >
                <span className="btn-11__content">
                  {data.block ? "Mở khóa" : "Khóa"}
                </span>
              </div>

              <div
                className={`btn-11 mt-2`}
                onClick={() => {
                  setInforFunc({
                    variant: "delete",
                    idUser: data.idUser,
                  });
                  setMsgModal("Xác nhận rằng bạn muốn xóa tài khoản này!");

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
            <Button variant="danger" onClick={runFunc}>
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

export default React.memo(UserTable);
