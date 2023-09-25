import Slider, { Settings } from "react-slick";
import ProductCard from "../../components/ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FreeProductCard from "../FreeProductCard";

interface IProps {
  type: string;
  data: any;
}

const MySlider = ({ type, data }: IProps) => {
  const settings = {
    className: "section-outstanding__slider",
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    // autoplay: true,
    // autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
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
      {type !== "product" && (
        <Slider {...settings}>
          {data &&
            data?.map((item: any) => {
              return (
                <FreeProductCard key={item._id} data={item}></FreeProductCard>
              );
            })}
        </Slider>
      )}
    </div>
  );
};

export default MySlider;
