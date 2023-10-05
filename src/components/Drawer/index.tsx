import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ExpandLess,
  ExpandMore,
  Gavel,
  Checkroom,
  OtherHouses,
  AutoStories,
  Tag,
  Diamond,
  CircleNotifications,
  Storefront,
  ContactPhone,Badge
} from "@mui/icons-material";
import Collapse from '@mui/material/Collapse';
import { Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { useQuery } from "@tanstack/react-query";

const icons: any = {
  "quan-ao": <Checkroom></Checkroom>,
  "do-gia-dung": <OtherHouses></OtherHouses>,
  sach: <AutoStories></AutoStories>,
  khac: <Tag></Tag>,
  "thiet-bi-dien-tu": <Tag></Tag>,
  "trang-suc": <Diamond></Diamond>,
};

export default function TemporaryDrawer() {
  const [show, setShow] = React.useState(false);
  const [openCate, setOpenCate] = React.useState(true);
  const [openNews, setOpenNews] = React.useState(true);

  const caterogyQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res: any = await categoryApi.getAllCategory();
      return res;
    },
    staleTime: 1000 * 600,
  });

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setShow(open);
    };

  const list = () => (
    <Box role="presentation">
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={"tim kiếm"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={() => setOpenCate(!openCate)}>
          <ListItemIcon >
            <Gavel />
          </ListItemIcon>
          <ListItemText sx={{ pr: 4 }} primary="Tài sản đấu giá" />
          {openCate ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCate} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to={`/danh-muc-tai-san`}>
              <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                <ListItemIcon><Storefront></Storefront></ListItemIcon>
                <ListItemText primary={'Tất cả'} />
              </ListItemButton>
            </Link>

            {caterogyQuery?.data &&
              caterogyQuery?.data?.category?.map((e: any) => {
                return (
                  <Link key={e.link} to={`/danh-muc-tai-san/${e.link}`}>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemIcon>{icons[e.link]}</ListItemIcon>
                      <ListItemText primary={e.name} />
                    </ListItemButton>
                  </Link>
                );
              })}
          </List>
        </Collapse>
        <ListItemButton onClick={() => setOpenNews(!openNews)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText sx={{ pr: 4 }} primary="Tin tức" />
          {openNews ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openNews} unmountOnExit>
          <List component="div" disablePadding>
            <Link to={`/tin-tuc`}>
              <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <CircleNotifications />
                </ListItemIcon>
                <ListItemText primary={"Thông báo đấu giá"} />
              </ListItemButton>
            </Link>
            <Link to={`/tin-tuc`}>
              <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <Tag />
                </ListItemIcon>
                <ListItemText primary={"Tin khác"} />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Badge />
          </ListItemIcon>
          <ListItemText primary="Giới thiệu" />
        </ListItemButton>
        <ListItemButton onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <ContactPhone />
          </ListItemIcon>
          <ListItemText primary="Liên hệ" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <div onClick={toggleDrawer(true)} className="search__circle">
          <MenuIcon className="search__icon"></MenuIcon>
        </div>
        <Drawer anchor={"left"} open={show} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
