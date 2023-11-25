import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ExpandLess,
  ExpandMore,
  Gavel,
  Checkroom,
  OtherHouses,
  AutoStories,
  Tag,
  Newspaper,
  Diamond,
  CircleNotifications,
  Storefront,
  ContactPhone,
  Badge,
  Search,
  Dashboard,
  Group,
  Web,
  RecentActors,
  Flag,
} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import { Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { useQuery } from "@tanstack/react-query";
import { setShowSearch } from "../../redux/searchModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../interface";

const icons: any = {
  "quan-ao": <Checkroom></Checkroom>,
  "do-gia-dung": <OtherHouses></OtherHouses>,
  sach: <AutoStories></AutoStories>,
  khac: <Tag></Tag>,
  "thiet-bi-dien-tu": <Tag></Tag>,
  "trang-suc": <Diamond></Diamond>,
};

export default function TemporaryDrawer({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  const logo = useSelector((e: IRootState) => e.ui.images.logo);

  const [openCate, setOpenCate] = React.useState(isAdmin ? false : true);
  const [openNews, setOpenNews] = React.useState(isAdmin ? false : true);
  const dispatch = useDispatch();

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
  const openSearchModal = () => {
    dispatch(setShowSearch());
  };

  const list = () => (
    <Box role="presentation">
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <Link to={"/"} className="d-flex justify-content-center">
          <img style={{ width: "180px" }} src={logo} alt="" />
        </Link>
      </List>
      <List>
        <ListItem disablePadding onClick={toggleDrawer(false)}>
          <ListItemButton onClick={openSearchModal}>
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary={"Tìm kiếm"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      {isAdmin && (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
        >
          <Link to={`/admin/dashboard`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/auction`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Gavel />
              </ListItemIcon>
              <ListItemText primary={"Quản lí cuộc đấu giá"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/news`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary={"Quản lí tin tức"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/users`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary={"Quản lí người dùng"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/reports`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Flag />
              </ListItemIcon>
              <ListItemText primary={"Quản lý khiếu nại"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/contact`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <RecentActors />
              </ListItemIcon>
              <ListItemText primary={"Quản lý liên hệ"} />
            </ListItemButton>
          </Link>
          <Link to={`/admin/ui`}>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <Web />
              </ListItemIcon>
              <ListItemText primary={"Quản lí giao diện"} />
            </ListItemButton>
          </Link>
        </List>
      )}

      <Divider />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={() => setOpenCate(!openCate)}>
          <ListItemIcon>
            <Gavel />
          </ListItemIcon>
          <ListItemText sx={{ pr: 4 }} primary="Tài sản đấu giá" />
          {openCate ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCate} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to={`/danh-muc-tai-san`}>
              <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                <ListItemIcon>
                  <Storefront></Storefront>
                </ListItemIcon>
                <ListItemText primary={"Tất cả"} />
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
        <Link to={`/news`}>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Newspaper />
            </ListItemIcon>
            <ListItemText sx={{ pr: 4 }} primary="Tin tức" />
          </ListItemButton>
        </Link>

        <Link to={`/gioi-thieu`}>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Badge />
            </ListItemIcon>
            <ListItemText primary="Giới thiệu" />
          </ListItemButton>
        </Link>
        <Link to={`/lien-he`}>
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <ContactPhone />
            </ListItemIcon>
            <ListItemText primary="Liên hệ" />
          </ListItemButton>
        </Link>
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
