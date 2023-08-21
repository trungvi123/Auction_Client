import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { err } from "../../asset/images";
import { useEffect, useState } from "react";


const MyImageGallery = ({ imagesLink }: { imagesLink: string[] }) => {
  const [images, setImages] = useState<any>([]);
  useEffect(() => {
    if (imagesLink) {
      const result = imagesLink?.map((item) => {
        return {
          original: item,
          thumbnail: item,
          // originalHeight: 600,
          // thumbnailHeight: 80,
        };
      });
      setImages(result);
    }
  }, [imagesLink]);

  // const images = [
  //   {
  //     original: "https://picsum.photos/id/1018/1000/600/a",
  //     thumbnail: "https://picsum.photos/id/1018/1000/600/c",
  //     originalHeight: 600,
  //     thumbnailHeight: 50,
  //   },
  //   {
  //     original: "https://picsum.photos/id/1015/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //     originalHeight: 600,
  //     thumbnailHeight: 50,
  //   },
  //   {
  //     original: "https://picsum.photos/id/1019/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //     originalHeight: 600,
  //     thumbnailHeight: 50,
  //   },
  // ];

  return (
    <div>
      <ImageGallery
        onErrorImageURL={err}
        lazyLoad={true}
        showNav={false}
        items={images}
      ></ImageGallery>
    </div>
  );
};

export default MyImageGallery;
