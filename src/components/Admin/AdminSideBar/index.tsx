import React from "react";
import { Navbar } from "react-bootstrap";
import { BiPieChartAlt2, BiReceipt, BiSolidUserAccount } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { logo } from "../../../asset/images";

import "./AdminSideBar.css";

const AdminSideBar = () => {
  const local = useLocation();

  return (
    <div className="ad-sidebar">
      <div className="sidebar-head">
        <Navbar.Brand as={Link} to="/">
          <img className="head__logo" src={logo} alt="" />
        </Navbar.Brand>
      </div>
      <div className="sidebar-content">
        <ul>
          <li
            className={`sidebar-content__link ${
              local.pathname === "/admin/dashboard" ? "active" : ""
            }`}
          >
            <Link to={"/admin/dashboard"}>
              <BiPieChartAlt2></BiPieChartAlt2>
              <span>DASHBOARD</span>
            </Link>
          </li>
          <li className={`sidebar-content__link ${local.pathname === "/admin/auction" ? "active" : ""}`}>
            <Link to={"/admin/auction"}>
              <BiReceipt></BiReceipt>
              <span>Auction</span>
            </Link>
          </li>
          <li className={`sidebar-content__link ${local.pathname === "/admin/users" ? "active" : ""}`}>
            <Link to={"/admin/users"}>
              <BiSolidUserAccount></BiSolidUserAccount>
              <span>Users</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(AdminSideBar);
