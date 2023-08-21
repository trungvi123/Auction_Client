import { BiSolidShareAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

import { auction } from "../../asset/images";
import { IProduct } from "../../interface";
import formatDateTime from "../../utils/formatDay";
import "./ProductCard.css";

const ProductCard = ({ data }: { data: IProduct }) => {
  return (
    <div className="card-container">
      <div className="card-content">
        <p className="card-time1">Thời gian đấu giá</p>
        <p className="card-time2">{formatDateTime(data.startTime)}</p>
        <div className="card-img-box">
          <img
            className="card-img"
            src={data.images[0] ? data.images[0] : auction}
            alt="product-img"
          />
        </div>
        <p className="card-name">{data.name}</p>
        <p>
          Giá khởi điểm:
          <span className="card-price">
            {" "}
            {data.basePrice.$numberDecimal} VND
          </span>
        </p>
        <div className="card-more">
          <Link
            to={`/chi-tiet-dau-gia/${data._id}`}
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

export default ProductCard;
