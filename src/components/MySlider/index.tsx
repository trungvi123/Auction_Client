
import Slider, { Settings } from "react-slick";
import ProductCard from "../../components/ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      <Slider {...settings}>
        {data &&
          data?.map((item: any) => {
            return <ProductCard key={item._id} data={item}></ProductCard>;
          })}
      </Slider>
    </div>
  );
};

export default MySlider;
