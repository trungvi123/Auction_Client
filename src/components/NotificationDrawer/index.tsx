import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { auction } from "../../asset/images";
import "./NotificationDrawer.css";
import { ArrowForwardIos, Delete, MoreVert, RemoveRedEye } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import formatDateTime from "../../utils/formatDay";
import userApi from "../../api/userApi";
import { Link } from "react-router-dom";

interface INotification {
  _id: string;
  createdAt: string;
  img: string;
  content: string;
  link?: string;
  read: boolean;
  type: string;
  recipient: string[];
}

const NotificationDrawer = ({
  open,
  clientId,
  loadNotifications,
  handleOpenNotificationDrawer,
  handleSetUnreadNotifications,
}: {
  open: boolean;
  loadNotifications: boolean;
  clientId: string;
  handleSetUnreadNotifications: (state: React.ReactNode) => void;
  handleOpenNotificationDrawer: (state: boolean) => void;
}) => {
  const [show, setShow] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any>();
  const [refreshNotifi, setRefreshNotifi] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShow(open);
  }, [open]);

  React.useEffect(() => {
    const getNotifications = async () => {
      const res: any = await userApi.getNotifications(clientId);
      if (res?.status === "success") {
        setNotifications(res.data.notification);

        const count = res.data.notification.reduce(
          (accumulator: number, currentValue: any) => {
            if (currentValue.read === false) {
              return accumulator + 1;
            }
            return accumulator;
          },
          0
        );
        handleSetUnreadNotifications(count);
      }
    };
    if (clientId) {
      getNotifications();
    }
  }, [
    clientId,
    refreshNotifi,
    handleSetUnreadNotifications,
    loadNotifications,
  ]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      handleOpenNotificationDrawer(open);
      setShow(open);
      if (!open) {
        const updateNotif = async () => {
          const res: any = await userApi.updateNotifications(clientId);
          if (res?.status === "success") {
            handleSetUnreadNotifications(0);
            setRefreshNotifi(!refreshNotifi);
          }
        };
        updateNotif();
      }
    };

  const handleDeleteNotif = async (id: string) => {
    const payload = {
      id,
      userId: clientId,
    };
    const res: any = await userApi.deleteNotification(payload);
    if (res?.status === "success") {
      setRefreshNotifi(!refreshNotifi);
    }
  };

  const list = () => (
    <Box role="presentation">
      <List className="" sx={{ width: "100%", maxWidth: "360px" }}>
        <div className="m-3 d-flex align-items-center justify-content-between">
          <h4>Thông báo</h4>
          <IconButton onClick={toggleDrawer(false)}>
            <ArrowForwardIos fontSize="medium"></ArrowForwardIos>
          </IconButton>
        </div>
        {notifications &&
          notifications.map((item: INotification) => {
            return (
              <ListItem key={item._id}>
                <div className={`notification-item ${item.type}`}>
                  <div className="notification-circle">
                    <img
                      onError={(e: any) => (e.target.src = auction)}
                      src={item.img}
                      alt="img-notification"
                    />
                  </div>
                  <div className="notification-content">
                    {item.content}
                    <p>{formatDateTime(item.createdAt)}</p>
                  </div>
                  <div className="actions">
                    <IconButton
                      aria-label="more"
                      style={{ height: "40px" }}
                      className="action-btn"
                    >
                      <MoreVert />
                    </IconButton>
                    <div className="action-item">
                      <Tooltip title="Delete" placement="right">
                        <IconButton
                          aria-label="more"
                          style={{ height: "40px" }}
                          onClick={() => handleDeleteNotif(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {item.link && (
                        <Tooltip title="Chi tiết" placement="right">
                          <IconButton
                            aria-label="more"
                            style={{ height: "40px" }}
                            
                          >
                            <Link to={item.link}>
                            <RemoveRedEye />

                            </Link>
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {!item.read && <div className="ureadNotification"></div>}
                </div>
              </ListItem>
            );
          })}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer anchor={"left"} open={show} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default React.memo(NotificationDrawer);
