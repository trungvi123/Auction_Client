import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import freeProductApi from "../../api/freeProduct";
import formatDateTime from "../../utils/formatDay";

interface IProTable {
  name: string;
  email: string;
  time: string;
  handle: {
    idUser: string;
    email: string;
  };
}

function ReceivedListTable({
  data,
  userReceived,
  productInfor,
}: {
  data: any;
  userReceived: string;
  productInfor: {
    owner: string;
    _id: string;
    receiver: string;
  };
}) {
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [idHandle, setIdhandle] = useState("");
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
          time: formatDateTime(item.time),
          handle: {
            idUser: item.user,
            email: item.email,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  useEffect(() => {
    if (userReceived !== "") {
      const comfirmApi = async () => {
        const payload = {
          email: userReceived,
          owner: productInfor.owner,
          idProduct: productInfor._id,
          type: "email",
        };
        const res: any = await freeProductApi.confirmSharingProduct(payload);
        if (res.status === "success") {
          toast.success("Tặng sản phẩm thành công!");
          queryClient.invalidateQueries({
            queryKey: ["participationList", { idProduct: productInfor._id }],
          });
        } else {
          toast.error("Tặng sản phẩm thất bại!");
        }
      };
      comfirmApi();
    }
  }, [productInfor._id, productInfor.owner, queryClient, userReceived]);

  const handleReceived = async () => {
    const payload = {
      idUser: idHandle,
      owner: productInfor.owner,
      idProduct: productInfor._id,
      type: "idUser",
    };

    const res: any = await freeProductApi.confirmSharingProduct(payload);
    if (res.status === "success") {
      toast.success("Tặng sản phẩm thành công!");
      handleClose()
      queryClient.invalidateQueries({
        queryKey: ["participationList", { idProduct: productInfor._id }],
      });
    } else {
      toast.error("Tặng sản phẩm thất bại!");
      handleClose()
    }
  };

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Tên người đăng ký",
        accessorKey: "name",
        id: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
        id: "email",
      },
      {
        header: "Ngày đăng ký",
        accessorKey: "time",
        id: "time",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { email: string; idUser: string } = cell.getValue<{
            email: string;
            idUser: string;
          }>();
          return (
            <>
              <div
                className={`btn-11 ${productInfor.receiver ? "disable" : ""}`}
                onClick={() => {
                  if (!productInfor.receiver) {
                    setIdhandle(data.idUser);
                    setMsgModal(`Bạn sẽ tặng tài sản này cho người dùng có email là ${data.email}?`)
                    handleShow();
                  }
                }}
              >
                <span className="btn-11__content">Đồng ý</span>
              </div>
            </>
          );
        },
      },
    ],
    [productInfor.receiver]
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
            <Button variant="danger" onClick={handleReceived}>
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

export default React.memo(ReceivedListTable);
