import { Autorenew } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useMemo, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import userApi from "../../../api/userApi";

interface IProTable {
  year: string;
  userCount: number;
  auctionCount: number;
  freeProductCount: number;
  handle: {
    year: string;
  };
}

function StatisticTable({
  data,
  handleSelectYear,
}: {
  data: any;
  handleSelectYear: (year:string)=>void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [msgModal, setMsgModal] = useState("");
  const [yearInput, setYearInput] = useState<string>();
  const [errInput, setErrInput] = useState<boolean>(false);
  const [inforFunc, setInforFunc] = useState<{ variant: string; year: string }>(
    {
      variant: "",
      year: "",
    }
  );

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
          year: item.year,
          userCount: item.userCount,
          auctionCount: item.auctionCount,
          freeProductCount: item.freeProductCount,
          handle: {
            year: item.year,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const runFunc = async () => {
    if (inforFunc.variant === "create") {
      if (!yearInput) {
        setErrInput(true);
      } else {
        const res: any = await userApi.createStatistic({ year: yearInput });
        if (res?.status === "success") {
          toast.success(`Tạo thống kê năm ${yearInput} thành công!`);
          queryClient.invalidateQueries({ queryKey: ["statistic"] });
        }
      }
    } else {
      const res: any = await userApi.deleteStatistic(inforFunc.year);
      if (res?.status === "success") {
        toast.success(`Xóa thống kê năm ${inforFunc.year} thành công!`);
        queryClient.invalidateQueries({ queryKey: ["statistic"] });
      }
    }
    handleClose();
  };

  const handleRefreshList = (a: any) => {
    queryClient.invalidateQueries({ queryKey: ["statistic"] });
  };

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Năm",
        accessorKey: "year",
        id: "year",
      },
      {
        header: "Số tài khoản",
        accessorKey: "userCount",
        id: "userCount",
      },
      {
        header: "Số cuộc đấu giá",
        accessorKey: "auctionCount",
        id: "auctionCount",
      },
      {
        header: "Số tài sản chia sẻ",
        accessorKey: "freeProductCount",
        id: "freeProductCount",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { year: string } = cell.getValue<{
            year: string;
          }>();
          return (
            <>
              <div
                className={`btn-11`}
                onClick={() => {
                  handleShow();
                  setYearInput("");
                  setMsgModal("Xác nhận rằng bạn muốn xóa thống kê này!");
                  setInforFunc({
                    variant: "delete",
                    year: data.year,
                  });
                }}
              >
                {/* handleSelectYear */}
                <span className="btn-11__content">Xóa</span>
              </div>
              <div className="btn-11 mt-2" onClick={()=>handleSelectYear(data.year)}>
                <span className="btn-11__content">Biểu đồ</span>
              </div>
            </>
          );
        },
      },
    ],
    [handleSelectYear]
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
            <Modal.Title>Tạo thống kê theo năm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {inforFunc.variant === "create" ? (
              <Form>
                <Form.Group className="mb-3" controlId="validationCustom01">
                  <Form.Label>Năm:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: 2022"
                    value={yearInput}
                    onChange={(e) => {
                      setYearInput(e.target.value);
                      setErrInput(false);
                    }}
                  />
                  {errInput && (
                    <p className="text__invalid">
                      Vui lòng nhập năm mà bạn muốn tạo thống kê!
                    </p>
                  )}
                </Form.Group>
              </Form>
            ) : (
              <p>{msgModal}</p>
            )}
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
              setInforFunc({
                variant: "create",
                year: "",
              });
              handleShow();
            }}
          >
            <span className="btn-11__content">+</span>
          </div>
        )}
      />
    </>
  );
}

export default React.memo(StatisticTable);
