import { Autorenew } from "@mui/icons-material";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useQueryClient } from "@tanstack/react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import userApi from "../../../api/userApi";
import TextEditor from "../../TextEditor";

interface IProTable {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  content: string;
  handle: {
    id: string;
    email: string;
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

interface IInforContact {
  id: string;
  email: string;
  subject: string;
}

function ContactTable({ data }: { data: any }) {
  const dataLocal = useRef<IProTable[]>([]);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [inforContact, setInforContact] = useState<IInforContact>({
    id: "",
    email: "",
    subject: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [html, setHtml] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useMemo(() => {
    if (data?.length) {
      dataLocal.current = data?.map((item: any) => {
        return {
          name: item.name,
          email: item.email,
          phoneNumber: item.phoneNumber,
          address: item.address,
          content: item.content,
          handle: {
            id: item._id,
            email: item.email,
          },
        };
      });
    } else {
      dataLocal.current = [];
    }
  }, [data]);

  const handleRefreshList = (a: any) => {
    queryClient.invalidateQueries({ queryKey: ["contact-list"] });
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
        header: "Số điện thoại",
        accessorKey: "phoneNumber",
        id: "phoneNumber",
      },
      {
        header: "Địa chỉ",
        accessorKey: "address",
        id: "address",
      },
      {
        header: "Nội dung",
        accessorKey: "content",
        id: "content",
      },
      {
        header: "Xử lí",
        accessorKey: "handle",
        Cell: ({ cell }) => {
          const data: { id: string; email: string } = cell.getValue<{
            id: string;
            email: string;
          }>();
          return (
            <>
              <div
                className={`btn-11`}
                onClick={() => {
                  handleClickOpen();
                  setInforContact({
                    id: data.id,
                    email: data.email,
                    subject: `CIT Auction - Phản hồi liên hệ - ${data.email}`,
                  });
                  setHtml(`
                    <p>Chúng tôi đã nhận được liên hệ của bạn</p>
                    <p>Chúc bạn một ngày tốt lành</p>
                    <p>Trân trọng,</p>
                    <p><b>CIT Auction</b></p>
                  `);
                }}
              >
                <span className="btn-11__content">Phản hồi</span>
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  const handlerodDescription = useCallback((state: string) => {
    setHtml(state);
  }, []);

  const hanleReplyContact = async () => {
    setLoading(true);
    handleClose()
    const payload = {
      id: inforContact.id,
      email: inforContact.email,
      subject: inforContact.subject,
      html,
    };

    const res: any = await userApi.replyContact(payload);
  
    if (res?.status === "success") {
      toast.success("Gửi phản hồi thành công!");
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        {/* <CircularProgress color="inherit" /> */}
        <span className="newsLoader"></span>

      </Backdrop>
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Phản hồi đến người dùng {inforContact?.email}</DialogTitle>
        <DialogContent>
          <Form.Group
            style={{ width: "552px", marginBottom: "10px" }}
            controlId="validationCustom01"
          >
            <Form.Label>Subject</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Xin chào"
              value={inforContact?.subject}
              onChange={(e) =>
                setInforContact({ ...inforContact, subject: e.target.value })
              }
            />
          </Form.Group>
          <TextEditor
            description={html}
            handlerodDescription={handlerodDescription}
          ></TextEditor>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button onClick={hanleReplyContact}>Gửi</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(ContactTable);
