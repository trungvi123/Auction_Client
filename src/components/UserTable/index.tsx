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
  warnLevel:number;
  handle: {
    idUser: string;
    email: string;
  };
}

function UserTable({
  data,
}: {
  data: any;
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
          warnLevel: item.warnLevel,
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

  

//   const handleReceived = async () => {
//     const payload = {
//       idUser: idHandle,
//       owner: productInfor.owner,
//       idProduct: productInfor._id,
//       type: "idUser",
//     };

//     const res: any = await freeProductApi.confirmSharingProduct(payload);
//     if (res.status === "success") {
//       toast.success("Tặng sản phẩm thành công!");
//       handleClose()
//       queryClient.invalidateQueries({
//         queryKey: ["participationList", { idProduct: productInfor._id }],
//       });
//     } else {
//       toast.error("Tặng sản phẩm thất bại!");
//       handleClose()
//     }
//   };

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
          const data: { email: string; idUser: string } = cell.getValue<{
            email: string;
            idUser: string;
          }>();
          return (
            <>
              <div
                className={`btn-11`}
                onClick={() => {
                  
                }}
              >
                <span className="btn-11__content">Khóa</span>
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
            <Button variant="danger" >
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
