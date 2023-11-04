import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { err } from "../../asset/images";
import React, { useEffect, useState } from "react";
import { auction } from "../../asset/images";

const MyImageGallery = ({
  imagesLink = [],
  thumbnail = "bottom",
}: {
  imagesLink: string[];
  thumbnail?: any;
}) => {
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    if (imagesLink.length > 0) {
      const result = imagesLink?.map((item) => {
        return {
          original: item,
          thumbnail: item,

          originalHeight: 500,
          thumbnailHeight: 80,
        };
      });
      setImages(result);
    } else {
      const result = {
        original: auction,
        thumbnail: auction,
      };
      setImages([result]);
    }
  }, [imagesLink]);

  return (
    <div>
      <ImageGallery
        thumbnailPosition={thumbnail}
        onErrorImageURL={err}
        lazyLoad={true}
        showNav={false}
        items={images}
      ></ImageGallery>
    </div>
  );
};

export default React.memo(MyImageGallery);
