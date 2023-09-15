import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addMinutes } from "date-fns";
import Form from "react-bootstrap/Form";

import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi";
import { IRootState } from "../../interface";
import TextEditor from "../TextEditor";
import DropImages from "../DropImages";
import { setProdDescription } from "../../redux/utilsSlice";
import { minus } from "../../asset/images";
import "../ProductForm/ProductForm.css";
import { useNavigate } from "react-router-dom";
import freeProductApi from "../../api/freeProduct";
interface ICate {
  _id: string;
  name: string;
}
const FreeProductForm = ({ type, id = "" }: { type: string; id?: string }) => {
  const dispatch = useDispatch();
  const next = useNavigate();
  const [cateList, setCateList] = useState<ICate[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imgsEdit, setImgsEdit] = useState([]);
  const [dataEdit, setDataEdit] = useState({
    name: "",
    category: "",
    oldCategory: "",
    description: "",
  });

  const prodDescription = useSelector(
    (e: IRootState) => e.utils.prodDescription
  );
  const idOwner = useSelector((e: IRootState) => e.auth._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { ...dataEdit, checkbox: false } });

  useEffect(() => {
    if (type === "edit") {
      const fetchProd = async () => {
        const result: any = await productApi.getProductById(id);

        if (result?.status === "success") {
          const data = {
            name: result.data.name,
            oldCategory: result.data.category,
            category: "",
            description: "",
          };
          setDataEdit(data);
          reset(data);
          setImgsEdit(result.data.images);
          // setUploadedImages(result.data.images);

          dispatch(setProdDescription(result.data.description));
        }
      };
      fetchProd();
    }
  }, [dispatch, id, type, reset]);

  const handleImageUpload = (images: File[]) => {
    // Nhận dữ liệu ảnh từ DropImages và cập nhật state của Form
    setUploadedImages(images);
  };

  useEffect(() => {
    const fetchcate = async () => {
      const resCate: any = await categoryApi.getAllCategory();

      if (resCate?.status === "success") {
        setCateList(resCate.category);
      }
    };
    fetchcate();
  }, []);

  const submit = (data: any) => {
    // phòng trường hợp người dùng k click vào thay đổi thì sẽ không vào được hàm handleStartDateChange
    const formData = new FormData();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    formData.append("name", data.name);
    formData.append("description", prodDescription);
    formData.append("category", data.category);
    formData.append("owner", idOwner);
    for (let i = 0; i < uploadedImages.length; i++) {
      formData.append("images", uploadedImages[i]);
    }

    if (type !== "edit") {
      const createFreeProd = async () => {
        const result: any = await freeProductApi.createfreeProduct(
          formData,
          config
        );
        if (result?.status === "success") {
          toast.success("Tạo cuộc đấu giá thành công!");
          toast.success(
            "Bạn có thể bắt đầu cuộc đấu giá ngay sau khi được hệ thống của chúng tôi thông qua!"
          );
          // next("/quan-li-dau-gia");
        }
      };
      createFreeProd();
    } else {
      // const KeepImgs: string[] = [...imgsEdit];
      // for (let i = 0; i < KeepImgs.length; i++) {
      //   formData.append("keepImgs", KeepImgs[i]);
      // } // giữ lại những hình cũ

      // formData.append("id", id);

      // formData.append("oldCategory", dataEdit.oldCategory);

      // const editProd = async () => {
      //   const result: any = await productApi.editProducts(formData, config);
      //   if (result?.status === "success") {
      //     toast.success("Sửa cuộc đấu giá thành công!");
      //     toast.success(
      //       "Bạn có thể bắt đầu cuộc đấu giá ngay sau khi được hệ thống của chúng tôi thông qua!"
      //     );
      //     // next("/quan-li-dau-gia");
      //   }
      // };
      // editProd();
    }
  };

  const deleteImgsEdit = (item: any) => {
    const result = imgsEdit.filter((e) => e !== item);
    setImgsEdit(result);
  };
  return (
    <Form>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            placeholder="Sách, quần áo, ..."
            {...register("name", { required: true })}
          />
          {errors?.name?.type === "required" && (
            <p className="text__invalid">Vui lòng nhập tên sản phẩm</p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom0333">
          <Form.Label>Loại sản phẩm</Form.Label>
          <Form.Select
            // aria-label="Chọn loại sản phẩm"
            {...register("category", { required: true })}
          >
            <option value="">Chọn loại sản phẩm</option>
            {cateList &&
              cateList.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
          </Form.Select>
          {errors?.category?.type === "required" && (
            <p className="text__invalid">Vui lòng chọn loại sản phẩm</p>
          )}
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <TextEditor></TextEditor>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <Form.Label>
            Ảnh (Ảnh đầu tiên sẽ là ảnh đại diện cho sản phẩm)
          </Form.Label>
          <DropImages
            dataEdit={uploadedImages}
            onImagesUpload={handleImageUpload}
          ></DropImages>
          {imgsEdit.length > 0 && (
            <div className="selected-images">
              {imgsEdit.map((item, index) => (
                <div key={index} className="selected-images__box">
                  <Image
                    className="selected-images__img"
                    alt={`Image ${index}`}
                    src={item}
                    thumbnail
                  />
                  <Image
                    onClick={() => deleteImgsEdit(item)}
                    className="selected-images__icon"
                    alt="icon-minus"
                    src={minus}
                  ></Image>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check
          {...register("checkbox", { required: true })}
          label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá) , Chính sách bảo mật thông tin khách hàng , Cơ chế giải quyết tranh chấp , Quy chế hoạt động tại website đấu giá trực tuyến"
        />
        {errors?.checkbox?.type === "required" && (
          <p className="text__invalid">
            Bạn phải đồng ý với các điều khoản của chúng tôi!
          </p>
        )}
      </Form.Group>

      <div onClick={handleSubmit(submit)} className="btn-11 btn-createAuction">
        <span className="btn-11__content">
          {type === "edit" ? "Sửa cuộc đấu giá" : "Tạo cuộc đấu giá"}
        </span>
      </div>
    </Form>
  );
};

export default FreeProductForm;
