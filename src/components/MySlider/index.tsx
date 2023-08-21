import { useEffect, useState } from "react";
// import Slider from 'react-slick';
import Slider, {Settings} from 'react-slick';
import { IProduct } from "../../interface";
import ProductCard from "../../components/ProductCard";
import productApi from "../../api/productApi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const MySlider = ({ type, quantity = 6 }: any) => {


  const [products, setProducts] = useState<IProduct[]>();

  useEffect(() => {
    if (type === "product") {
      const getProducts = async () => {
        const result: any = await productApi.getProducts(quantity);
        if (result?.status === "success") {
          setProducts(result.data);
        }
      };
      getProducts();
    }
  }, [type,quantity]);

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
        {products &&
          products?.map((item) => {
            return <ProductCard key={item._id} data={item}></ProductCard>;
          })}
      </Slider>
    </div>
  );
};

export default MySlider;
