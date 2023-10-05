import React, { useState, useCallback, useEffect } from "react";
import { Image } from "react-bootstrap";
import { useDropzone, FileWithPath, DropzoneOptions } from "react-dropzone";
import { minus, uploadImg } from "../../asset/images";
import "./DropImages.css";

interface ImageUploaderProps {
  onImagesUpload: (images: File[]) => void;
  resetSelectedImages?: boolean;
}
const DropImages: React.FC<ImageUploaderProps> = ({
  onImagesUpload,
  resetSelectedImages = false,
}) => {
  const [selectedImages, setSelectedImages] = useState<FileWithPath[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setSelectedImages([...selectedImages, ...acceptedFiles]);
      onImagesUpload([...selectedImages, ...acceptedFiles]);
    },
    [onImagesUpload, selectedImages]
  );
  useEffect(() => {
    if (resetSelectedImages) {
      setSelectedImages([]);
    }
  }, [resetSelectedImages]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "text/html": [".html", ".htm"],
    },
    multiple: true,
  };
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const handleRemoveImgSelect = (file: any) => {
    const Images: FileWithPath[] = selectedImages.filter(
      (e) => e.name !== file.name
    );
    URL.revokeObjectURL(file);
    setSelectedImages(Images);
  };

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept=".jpg, .jpeg, .png ,.html,.htm" />
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Image src={uploadImg} alt="upload img"></Image>
          <p className="pt-3">
            Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg | .html |
            .htm
          </p>
        </div>
      </div>
      <div className="selected-images">
        {selectedImages.map((file, index) => (
          <div key={index} className="selected-images__box">
            <Image
              className="selected-images__img"
              alt={`Image ${index}`}
              src={URL.createObjectURL(file)}
              thumbnail
            />
            <Image
              onClick={() => handleRemoveImgSelect(file)}
              className="selected-images__icon"
              alt="icon-minus"
              src={minus}
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DropImages);
