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
  ContactPhone,
  Badge,
} from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import { Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { useQuery } from "@tanstack/react-query";
import { BiFilterAlt } from "react-icons/bi";
import "../../pages/ProductList/ProductList.css";

const status = [
  {
    name: "Sắp diễn ra",
    slug: "sap-dien-ra",
  },
  {
    name: "Đang diễn ra",
    slug: "dang-dien-ra",
  },
  {
    name: "Đã kết thúc",
    slug: "da-ket-thuc",
  },
];

export default function FilterDrawer({
  filterSelect,
  categories,
  params,
}: any) {
  const [show, setShow] = React.useState(false);
  const [openCate, setOpenCate] = React.useState(true);
  const [openNews, setOpenNews] = React.useState(true);

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
      {/* <Divider /> */}
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
      >
        <div className="filter-box">
          <div className="status-filter">
            <div className="mb-3">
              <h4 style={{ fontWeight: 600 }}>Loại tài sản</h4>
              <span className="title-hightlight"></span>
            </div>
            <div>
              <label
                className="containerCheckbox"
                htmlFor={"san-pham-dau-gia-drawer"}
              >
                Sản phẩm đấu giá
                <input
                  type="checkbox"
                  onChange={(e) =>
                    filterSelect(
                      "TYPEPRODUCT",
                      e.target.checked,
                      "san-pham-dau-gia"
                    )
                  }
                  id={"san-pham-dau-gia-drawer"}
                  className="status-checkall"
                  name="checkbox-status"
                  value="0"
                ></input>
                <span className="checkmark"></span>
              </label>
              <label
                className="containerCheckbox"
                htmlFor={"san-pham-mien-phi-drawer"}
              >
                Sản phẩm miễn phí
                <input
                  type="checkbox"
                  onChange={(e) =>
                    filterSelect(
                      "TYPEPRODUCT",
                      e.target.checked,
                      "san-pham-mien-phi"
                    )
                  }
                  id={"san-pham-mien-phi-drawer"}
                  className="status-checkall"
                  name="checkbox-status"
                  value="0"
                ></input>
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="filter-box">
          <div className="status-filter">
            <div className="mb-3">
              <h4 style={{ fontWeight: 600 }}>Trạng thái tài sản</h4>
              <span className="title-hightlight"></span>
            </div>
            <div>
              {status.map((item, index) => {
                return (
                  <label
                    key={index}
                    className="containerCheckbox"
                    htmlFor={item.slug + "drawer"}
                  >
                    {item.name}
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        filterSelect("STATUS", e.target.checked, item)
                      }
                      id={item.slug + "drawer"}
                      className="status-checkall"
                      name="checkbox-status"
                      value="0"
                    ></input>
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="filter-box">
          <div className="status-filter">
            <div className="mb-3">
              <h4 style={{ fontWeight: 600 }}>Danh mục tài sản</h4>
              <span className="title-hightlight"></span>
            </div>
            <div>
              {categories?.map((item: any, index: number) => {
                return (
                  item.link !== params?.cate && (
                    <label
                      key={index}
                      className="containerCheckbox"
                      htmlFor={item.link + 'drawer'}
                    >
                      {item.name}
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          filterSelect("CATEGORY", e.target.checked, item)
                        }
                        id={item.link + 'drawer'}
                        className="status-checkall"
                        name="checkbox-status"
                        value="0"
                      ></input>
                      <span className="checkmark"></span>
                    </label>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className="filter-box">
          <div className="status-filter">
            <div className="mb-3">
              <h4 style={{ fontWeight: 600 }}>Hình thức đấu giá</h4>
              <span className="title-hightlight"></span>
            </div>
            <div>
              <label className="containerCheckbox" htmlFor={"auctionType1-drawer"}>
                Đấu giá xuôi
                <input
                  type="checkbox"
                  onChange={(e) =>
                    filterSelect(
                      "TYPEAUCTION",
                      e.target.checked,
                      "dau-gia-xuoi"
                    )
                  }
                  id={"auctionType1-drawer"}
                  className="status-checkall"
                  name="checkbox-status"
                  value="0"
                ></input>
                <span className="checkmark"></span>
              </label>
              <label className="containerCheckbox" htmlFor={"auctionType2-drawer"}>
                Đấu giá ngược
                <input
                  type="checkbox"
                  onChange={(e) =>
                    filterSelect(
                      "TYPEAUCTION",
                      e.target.checked,
                      "dau-gia-nguoc"
                    )
                  }
                  id={"auctionType2-drawer"}
                  className="status-checkall"
                  name="checkbox-status"
                  value="0"
                ></input>
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <div
          className="btn-11 w-25 my-4 filter-btn"
          onClick={toggleDrawer(true)}
        >
          <span className="btn-11__content">
            <BiFilterAlt size={25}></BiFilterAlt>
          </span>
        </div>
        <Drawer anchor={"right"} open={show} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
