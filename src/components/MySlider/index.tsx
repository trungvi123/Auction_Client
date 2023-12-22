import Slider, { Settings } from "react-slick";
import ProductCard from "../../components/ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FreeProductCard from "../FreeProductCard";
import { Link } from "react-router-dom";
import { auction } from "../../asset/images";
import formatDateTime from "../../utils/formatDay";

interface IProps {
  type: string;
  data: any;
}

const MySlider = ({ type, data }: IProps) => {
  const settings = {
    className: "section-outstanding__slider",
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };
  return (
    <div>
      {type === "product" && (
        <Slider {...settings}>
          {data &&
            data?.map((item: any) => {
              return <ProductCard key={item._id} data={item}></ProductCard>;
            })}
        </Slider>
      )}
      {type === "freeProduct" && (
        <Slider {...settings}>
          {data &&
            data?.map((item: any) => {
              return (
                <FreeProductCard key={item._id} data={item}></FreeProductCard>
              );
            })}
        </Slider>
      )}
      {type === "news" && (
        <Slider {...settings}>
          {data &&
            data?.map((item: any) => {
              return (
                <div key={item._id} className='px-2'>
                  <div className="position-relative mb-3">
                    <Link to={`/tin-tuc/${item?._id}`}>
                      <img
                        className="img-fluid border border-bottom-0 news-img"
                        src={item?.img || auction}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "250px",
                        }}
                        alt="hinh-anh"
                      />
                    </Link>

                    <div style={{minHeight: '151px'}} className="bg-white border border-top-0 p-4">
                      <div className="mb-2">
                        <div
                          style={{
                            height: "30px",
                            width: "100px",
                            borderRadius: "12px",
                            backgroundColor: "yellow",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                          className=" text-uppercase d-flex justify-content-center align-items-center"
                        >
                          {item?.newsSystem ? "Hệ thống" : "Tin tức"}
                        </div>
                      </div>
                      <Link
                        to={`/tin-tuc/${item?._id}`}
                        className="h5 d-block mb-3 text-secondary text-uppercase font-weight-bold"
                      >
                        {item?.title}
                      </Link>
                    </div>
                    <div
                      className="d-flex justify-content-between bg-white border border-top-0 p-4"
                      style={{ gap: "8px" }}
                    >
                      <Link to={`/cua-hang?user=${item?.owner?.email}`}>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "8px" }}
                        >
                          <img
                            className="rounded-circle"
                            src={item?.owner?.avatar}
                          style={{ objectFit: 'cover' }}

                            width="45"
                            height="45"
                            alt=""
                          />
                          <div >
                            <small style={{ flex: 1 }}>
                              {item?.owner?.firstName +
                                " " +
                                item?.owner?.lastName}
                            </small>
                            <p className="text-body mb-0">
                              <small>{formatDateTime(item?.createdAt)}</small>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      )}
    </div>
  );
};

export default MySlider;
