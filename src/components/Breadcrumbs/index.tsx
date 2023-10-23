import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "../../interface";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ title, type }: any) => {
  const breadcrumb_img = useSelector((e:IRootState)=>e.ui.images.breadcrum)
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs-box">
        <img className="breadcrumbs-bg" src={breadcrumb_img} alt="bg-breadcrumbs" />
        <h1 className="breadcrumbs-h1">{title}</h1>
        <div>
          <Link to={"/"}>
            <span className="breadcrumbs-span">Trang chủ</span>
          </Link>
          <span> / </span>
          <span className="breadcrumbs-span active">{type}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Breadcrumbs);
