import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ title, type, img }: any) => {
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs-box">
        <img className="breadcrumbs-bg" src={img} alt="bg-breadcrumbs" />
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
