import React, { useState, useCallback } from "react";
import { Image } from "react-bootstrap";
import { useDropzone, FileWithPath, DropzoneOptions } from "react-dropzone";
import { uploadImg } from "../../asset/images";
import "./DropImages.css";

interface ImageUploaderProps {
  onImagesUpload: (images: File[]) => void;
}
const DropImages: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [selectedImages, setSelectedImages] = useState<FileWithPath[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setSelectedImages([...selectedImages, ...acceptedFiles]);
      onImagesUpload([...selectedImages, ...acceptedFiles]);
    },
    [onImagesUpload, selectedImages]
  );
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

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
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
          <Image
            className="selected-images__img"
            key={index}
            alt={`Image ${index}`}
            src={URL.createObjectURL(file)}
            thumbnail
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(DropImages);
