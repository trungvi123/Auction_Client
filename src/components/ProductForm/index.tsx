import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addMinutes } from "date-fns";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";

import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi";
import { IRootState } from "../../interface";
import TextEditor from "../TextEditor";
import DropImages from "../DropImages";
import { setProdDescription } from "../../redux/utilsSlice";
import { minus } from "../../asset/images";
import { setProductPermission } from "../../redux/authSlice";
import "./ProductForm.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { auctionType, checkoutType } from "../../constant";

const initialStateData = {
  name: "",
  basePrice: "",
  price: "",
  stepPrice: "",
  category: "",
  startTime: "",
  duration: "",
  description: "",
  auctionTypeSlug: "",
  checkoutTypeSlug: "",
};

const ProductForm = ({ type, id = "" }: { type: string; id?: string }) => {
  const dispatch = useDispatch();
  const productsPerrmission = useSelector(
    (e: IRootState) => e.auth.productPermission
  );
  const idOwner = useSelector((e: IRootState) => e.auth._id);
  const prodDescription = useSelector(
    (e: IRootState) => e.utils.prodDescription
  );

  const queryClient = useQueryClient();

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imgsEdit, setImgsEdit] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [invalidDate, setInvalidDate] = useState<boolean>();
  const [checkStepPrice, setCheckStepPrice] = useState<boolean>(true);
  const [resetImgs, setResetImgs] = useState<boolean>(false);
  const [dataEdit, setDataEdit] = useState(initialStateData);
  const [oldCategory, setOldCategory] = useState({
    link: "",
    name: "",
    _id: "",
  });

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
            basePrice: result.data.basePrice.$numberDecimal,
            price: result.data.price.$numberDecimal,
            stepPrice: result.data.stepPrice.$numberDecimal,
            startTime: result.data.startTime,
            duration: result.data.duration,
            auctionTypeSlug: result.data.auctionTypeSlug,
            checkoutTypeSlug: result.data.checkoutTypeSlug,
            category: "",
            description: "",
          };
          setOldCategory({
            name: result.data.category.name,
            link: result.data.category.link,
            _id: result.data.category._id,
          });
          setDataEdit(data);
          setStartDate(new Date(data.startTime));
          reset(data);
          setImgsEdit(result.data.images);
          // setUploadedImages(result.data.images);

          dispatch(setProdDescription(result.data.description));
        }
      };
      fetchProd();
    }
  }, [dispatch, id, type, reset]);

  const handleStartDateChange = (date: Date) => {
    // const hoursToAdd = 6;
    // const currentTime = new Date();
    // // Tạo một đối tượng Date mới sau khi thêm số giờ
    // const newDate = new Date(
    //   currentTime.getTime() + hoursToAdd * 1000
    // );

    // So sánh newDate với currentTime + 6 tiếng
    // nếu newDate nhỏ hơn date truyền vào thì thông qua
    // if (newDate >= date) {
    // setInvalidDate(true);
    // return false;
    // }
    setInvalidDate(false);
    setStartDate(date);
    return true;
  };

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
    // phòng trường hợp người dùng k click vào thay đổi thì sẽ không vào được hàm handleStartDateChange
    const checkTime = handleStartDateChange(startDate);
    if (
      data.auctionTypeSlug === "dau-gia-nguoc" &&
      data.stepPrice >= data.basePrice
    ) {
      // kiểm tra stepprice khi đấu giá ngược
      setCheckStepPrice(false);
    } else {
      if (!checkTime) {
        setInvalidDate(true);
      } else {
        const formData = new FormData();
        const auctionEndTime = addMinutes(startDate, data.duration);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        formData.append("name", data.name);
        formData.append("description", prodDescription);
        formData.append("basePrice", data.basePrice);
        formData.append("price", data.price);
        formData.append("stepPrice", data.stepPrice);
        formData.append("owner", idOwner);
        formData.append("duration", data.duration);
        formData.append("startTime", startDate.toLocaleString());
        formData.append("endTime", auctionEndTime.toLocaleString());

        for (let i = 0; i < uploadedImages.length; i++) {
          formData.append("images", uploadedImages[i]);
        }

        if (type !== "edit") {
          formData.append("category", data.category);
          formData.append("auctionTypeSlug", data.auctionTypeSlug);
          formData.append("checkoutTypeSlug", data.checkoutTypeSlug);

          const createProd = async () => {
            const result: any = await productApi.createProducts(
              formData,
              config
            );
            if (result?.status === "success") {
              dispatch(
                setProductPermission([...productsPerrmission, result._id])
              );
              queryClient.invalidateQueries({
                queryKey: ["auction-list__user", { typeList: "create" }],
              });
              toast.success("Tạo cuộc đấu giá thành công!");
              toast.success(
                "Bạn có thể bắt đầu cuộc đấu giá ngay sau khi được hệ thống của chúng tôi thông qua!"
              );
              // dispatch(setProdDescription(""));
              // reset(initialStateData);
              // setResetImgs(true)
            }
          };
          createProd();
        } else {
          if (data.category === "") {
            formData.append("category", oldCategory._id);
          } else {
            formData.append("category", data.category);
          }

          if (data.auctionTypeSlug === "") {
            formData.append("auctionTypeSlug", dataEdit.auctionTypeSlug);
          } else {
            formData.append("auctionTypeSlug", data.auctionTypeSlug);
          }

          if (data.checkoutTypeSlug === "") {
            formData.append("checkoutTypeSlug", dataEdit.checkoutTypeSlug);
          } else {
            formData.append("checkoutTypeSlug", data.checkoutTypeSlug);
          }

          const KeepImgs: string[] = [...imgsEdit];
          for (let i = 0; i < KeepImgs.length; i++) {
            formData.append("keepImgs", KeepImgs[i]);
          } // giữ lại những hình cũ

          formData.append("id", id);

          formData.append("oldCategory", oldCategory._id);

          const editProd = async () => {
            const result: any = await productApi.editProducts(formData, config);
            if (result?.status === "success") {
              toast.success("Sửa cuộc đấu giá thành công!");
              toast.success(
                "Bạn có thể bắt đầu cuộc đấu giá ngay sau khi được hệ thống của chúng tôi thông qua!"
              );
              // setResetImgs(true)
              // reset(initialStateData);
              // dispatch(setProdDescription(""));
            }
          };
          editProd();
        }
      }
    }
  };

  const deleteImgsEdit = (item: any) => {
    const result = imgsEdit.filter((e) => e !== item);
    setImgsEdit(result);
  };

  return (
    <Form>
      <Row>
        <Form.Group
          className="mb-3"
          as={Col}
          md="12"
          controlId="validationCustom01"
        >
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
      </Row>
      <Row>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom02"
        >
          <Form.Label>Giá khởi điểm (VND)</Form.Label>
          <Form.Control
            type="number"
            placeholder="100000"
            {...register("basePrice", {
              required: true,
              min: 0,
              max: 10000000000,
            })}
          />
          {errors?.basePrice?.type === "required" && (
            <p className="text__invalid">Vui lòng nhập giá khởi điểm</p>
          )}
          {errors?.basePrice?.type === "min" && (
            <p className="text__invalid">
              Vui lòng nhập giá khởi điểm lớn hơn hoặc bằng 0 VND
            </p>
          )}
          {errors?.basePrice?.type === "max" && (
            <p className="text__invalid">
              Vui lòng nhập giá khởi điểm nhỏ hơn 10.000.000.000 VND
            </p>
          )}
        </Form.Group>

        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom022"
        >
          <Form.Label>Giá mua ngay (VND)</Form.Label>
          <Form.Control
            type="number"
            placeholder="1000000"
            {...register("price", {
              required: true,
              min: 1000,
              max: 10000000000,
            })}
          />
          {errors?.price?.type === "required" && (
            <p className="text__invalid">Vui lòng nhập giá mua ngay</p>
          )}
          {errors?.price?.type === "min" && (
            <p className="text__invalid">
              Vui lòng nhập giá mua ngay lớn hơn 1000 VND
            </p>
          )}
          {errors?.price?.type === "max" && (
            <p className="text__invalid">
              Vui lòng nhập giá mua ngay nhỏ hơn 10.000.000.000 VND
            </p>
          )}
        </Form.Group>
      </Row>
      <Row>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom03"
        >
          <Form.Label>Bước giá (VND)</Form.Label>
          <Form.Control
            type="number"
            placeholder="50000"
            onFocus={() => setCheckStepPrice(true)}
            {...register("stepPrice", {
              required: true,
              min: 1000,
              max: 10000000000,
            })}
          />
          {errors?.stepPrice?.type === "required" && (
            <p className="text__invalid">Vui lòng nhập bước giá</p>
          )}
          {errors?.stepPrice?.type === "min" && (
            <p className="text__invalid">
              Vui lòng nhập bước giá lớn hơn 1000 VND
            </p>
          )}
          {errors?.stepPrice?.type === "max" && (
            <p className="text__invalid">
              Vui lòng nhập bước giá nhỏ hơn 10.000.000.000 VND
            </p>
          )}
          {!checkStepPrice && (
            <p className="text__invalid">
              Vui lòng nhập bước giá nhỏ hơn giá khởi điểm
            </p>
          )}
        </Form.Group>

        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom0333"
        >
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
      <Row>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom03335"
        >
          <Form.Label>Hình thức đấu giá</Form.Label>
          <Form.Select
            aria-label="Chọn hình thức đấu giá"
            {...register("auctionTypeSlug", {
              required: type !== "edit" ? true : false,
            })}
          >
            <option value={""}>
              {type !== "edit"
                ? "Chọn hình thức đấu giá"
                : auctionType[dataEdit.auctionTypeSlug]}
            </option>
            <option value="dau-gia-xuoi">Đấu giá xuôi</option>
            <option value="dau-gia-nguoc">Đấu giá ngược</option>
          </Form.Select>
          {type !== "edit" && errors?.auctionTypeSlug?.type === "required" && (
            <p className="text__invalid">Vui lòng chọn hình thức đấu giá</p>
          )}
        </Form.Group>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom03336"
        >
          <Form.Label>Hình thức thanh toán</Form.Label>
          <Form.Select
            aria-label="Chọn hình thức thanh toán"
            {...register("checkoutTypeSlug", {
              required: type !== "edit" ? true : false,
            })}
          >
            <option value={""}>
              {type !== "edit"
                ? "Chọn hình thức thanh toán"
                : checkoutType[dataEdit.checkoutTypeSlug]}
            </option>
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option value="payment">Chuyển khoản qua Paypal</option>
          </Form.Select>
          {type !== "edit" && errors?.checkoutTypeSlug?.type === "required" && (
            <p className="text__invalid">Vui lòng chọn hình thức thanh toán</p>
          )}
        </Form.Group>
      </Row>
      <Row>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom033"
        >
          <label className="labelTime" htmlFor="datePicker">
            Thời gian dự kiến bắt đầu cuộc đấu giá
          </label>
          <DatePicker
            id="datePicker"
            selected={startDate}
            onChange={handleStartDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy HH:mm"
          />
          {invalidDate && (
            <p className="text__invalid">
              Thời gian dự kiến phải sau thời gian tạo ít nhất 6 giờ
            </p>
          )}
        </Form.Group>
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom03333"
        >
          <Form.Label>Thời gian của cuộc đấu giá (PHÚT)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Dưới 2880 phút"
            {...register("duration", { required: true, min: 0.5, max: 2880 })}
          />
          {errors?.duration?.type === "required" && (
            <p className="text__invalid">Vui lòng nhập thời gian diễn ra</p>
          )}
          {errors?.duration?.type === "min" && (
            <p className="text__invalid">
              Vui lòng nhập thời gian diễn ra hơn 5 phút
            </p>
          )}
          {errors?.duration?.type === "max" && (
            <p className="text__invalid">
              Vui lòng nhập thời gian diễn ra nhỏ hơn 2880 phút
            </p>
          )}
        </Form.Group>
      </Row>
      <Row>
        <Col className="mb-3" sm={12}>
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <TextEditor></TextEditor>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3" sm={12}>
          <Form.Label>
            Ảnh (Ảnh đầu tiên sẽ là ảnh đại diện cho sản phẩm)
          </Form.Label>
          <DropImages
            resetSelectedImages={resetImgs}
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

export default ProductForm;
