import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import categoryApi from "../../api/categoryApi";
import { IRootState } from "../../interface";
import TextEditor from "../TextEditor";
import DropImages from "../DropImages";
import { minus } from "../../asset/images";
import "../ProductForm/ProductForm.css";
import freeProductApi from "../../api/freeProduct";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { setFreeProductPermission } from "../../redux/authSlice";

const initialStateData = {
  name: "",
  category: "",
  oldCategory: "",
  description: "",
};
const FreeProductForm = ({ type, id = "" }: { type: string; id?: string }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState<string>("");

  const [resetImgs, setResetImgs] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imgsEdit, setImgsEdit] = useState([]);
  const [dataEdit, setDataEdit] = useState(initialStateData);
  const [oldCategory, setOldCategory] = useState({
    link: "",
    name: "",
    _id: "",
  });

  const idOwner = useSelector((e: IRootState) => e.auth._id);
  const freeProductsPerrmission = useSelector(
    (e: IRootState) => e.auth.freeProductPermission
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { ...dataEdit, checkbox: false } });

  useEffect(() => {
    if (type === "edit") {
      const fetchProd = async () => {
        const result: any = await freeProductApi.getProductById(id);

        if (result?.status === "success") {
          const data = {
            name: result.data.name,
            oldCategory: result.data.category,
            category: "",
            description: result.data.description,
          };

          setDescription(result.data.description)
          setOldCategory({
            name: result.data.category.name,
            link: result.data.category.link,
            _id: result.data.category._id,
          });
          setDataEdit(data);
          reset(data);
          setImgsEdit(result.data.images);
          setUploadedImages(result.data.images);

        }
      };
      fetchProd();
    }
  }, [dispatch, id, type, reset]);

  const handleImageUpload = (images: File[]) => {
    // Nhận dữ liệu ảnh từ DropImages và cập nhật state của Form
    setUploadedImages(images);
  };

  const caterogyQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res: any = await categoryApi.getAllCategory();
      return res;
    },
    staleTime: 1000 * 600,
  });

  const submit = (data: any) => {
    const formData = new FormData();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    formData.append("name", data.name);
    formData.append("description", description);
    // formData.append("category", data.category);
    formData.append("owner", idOwner);
    for (let i = 0; i < uploadedImages.length; i++) {
      formData.append("images", uploadedImages[i]);
    }

    if (type !== "edit") {
      formData.append("category", data.category);
      const createFreeProd = async () => {
        const result: any = await freeProductApi.createfreeProduct(
          formData,
          config
        );
        if (result?.status === "success") {
          dispatch(
            setFreeProductPermission([...freeProductsPerrmission, result._id])
          );
          queryClient.invalidateQueries({
            queryKey: ["freeProduct-list__user", { typeFreeList: "create" }],
          });
          toast.success("Chia sẻ thành công!");
          reset(initialStateData);
          setResetImgs(true);
        }
      };
      createFreeProd();
    } else {
      if (data.category === "") {
        formData.append("category", oldCategory._id);
      } else {
        formData.append("category", data.category);
      }
      const KeepImgs: string[] = [...imgsEdit];
      for (let i = 0; i < KeepImgs.length; i++) {
        formData.append("keepImgs", KeepImgs[i]);
      } // giữ lại những hình cũ

      formData.append("id", id);

      formData.append("oldCategory", dataEdit.oldCategory);

      const editProd = async () => {
        const result: any = await freeProductApi.editFreeProduct(
          formData,
          config
        );
        if (result?.status === "success") {
          toast.success("Chỉnh sửa thành công!");
          queryClient.invalidateQueries({
            queryKey: ["freeProduct-list__user", { typeFreeList: "create" }],
          });
          reset(initialStateData);
          setResetImgs(true);
        }
      };
      editProd();
    }
  };

  const deleteImgsEdit = useCallback((item: any) => {
    const result = imgsEdit.filter((e) => e !== item);
    setImgsEdit(result);
  }, [imgsEdit]);

  const handlerodDescription = useCallback((state: string) => {
    setDescription(state);
  }, []);

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
            aria-label="Chọn loại sản phẩm"
            {...register("category", {
              required: type !== "edit" ? true : false,
            })}
          >
            <option value={""}>
              {type !== "edit" ? "Chọn loại sản phẩm" : oldCategory.name}
            </option>
            {caterogyQuery?.data?.category?.map((item: any) => {
              return (
                item._id !== oldCategory._id && (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                )
              );
            })}
          </Form.Select>
          {type !== "edit" && errors?.category?.type === "required" && (
            <p className="text__invalid">Vui lòng chọn loại sản phẩm</p>
          )}
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <TextEditor
            description={description}
            handlerodDescription={handlerodDescription}
          ></TextEditor>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <Form.Label>
            Ảnh (Ảnh đầu tiên sẽ là ảnh đại diện cho sản phẩm)
          </Form.Label>
          <DropImages
            resetSelectedImages={resetImgs}
            handleImageUpload={handleImageUpload}
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
