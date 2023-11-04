import { BiSolidShareAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import React from "react";

import { auction } from "../../asset/images";
import { IProduct } from "../../interface";
import formatDateTime from "../../utils/formatDay";
import formatMoney from "../../utils/formatMoney";
import "./ProductCard.css";
import { auctionType } from "../../constant";

import { FacebookShareButton } from "react-share";
import { FacebookIcon } from "react-share";


const ProductCard = ({ data }: { data: IProduct }) => {

  return (
    <div className="card-container">
      <div className="card-content">
        <p className="card-time1">Thời gian đấu giá</p>
        <p className="card-time2">{formatDateTime(data?.startTime)}</p>
        <div className="card-img-box">
          <LazyLoadImage
            alt="product-img"
            className="card-img"
            width={292}
            height={225}
            src={data?.images[0] ? data.images[0] : auction} // use normal <img> attributes as props
          />
        </div>
        <Link to={`/chi-tiet-dau-gia/${data?._id}`}>
          <p className="card-name">{data?.name}</p>
        </Link>
        <p>{auctionType[data?.auctionTypeSlug]}</p>
        <p>
          Giá khởi điểm:
          <span className="card-price">
            {" "}
            {formatMoney(data?.basePrice?.$numberDecimal)}
          </span>
        </p>
        <div className="card-more">
          <Link
            to={`/chi-tiet-dau-gia/${data?._id}`}
            className="btn-11 card-more__btn"
          >
            <span className="btn-11__content">Chi tiết</span>
          </Link>
          <div className="card-more__share">
            <BiSolidShareAlt></BiSolidShareAlt>
            <div className="share-list">
              <FacebookShareButton
                url={`https://cit-auction.web.app/chi-tiet-dau-gia/${data?._id}`}
                quote={"sadsadsadsa"}
                hashtag={"#citauction"}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon size={34} round />
              </FacebookShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
