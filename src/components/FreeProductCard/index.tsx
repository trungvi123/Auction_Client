import React from "react";
import { BiSolidShareAlt } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

import { auction } from "../../asset/images";
import formatDateTime from "../../utils/formatDay";
// import "./FreeProductCard.css";

interface IProps {
  createdAt: string;
  images: string[];
  name: string;
  accepterList: string[];
  _id: string;
}

const FreeProductCard = ({ data }: { data: IProps }) => {
  return (
    <div className="card-container">
      <div className="card-content">
        <p className="card-time1">Thời gian có thể tham gia</p>
        <p className="card-time2">{formatDateTime(data.createdAt)}</p>
        <div className="card-img-box">
          
          <LazyLoadImage
            alt="product-img"
            className="card-img"
            width='1000'
            height='1000'
            src={data?.images[0] ? data.images[0] : auction} // use normal <img> attributes as props
          />
        </div>
        <p className="card-name">{data.name}</p>
        <p>
          Số lượng người tham gia nhận hiện tại
          <span className="card-price"> {data.accepterList.length} người</span>
        </p>
        <div className="card-more">
          <Link
            to={`/chi-tiet-chia-se/${data._id}`}
            className="btn-11 card-more__btn"
          >
            <span className="btn-11__content">Chi tiết</span>
          </Link>
          <div className="card-more__share">
            <BiSolidShareAlt></BiSolidShareAlt>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FreeProductCard);
