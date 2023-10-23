import { useCallback, useEffect, useState } from "react";
import { Col, Container, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import userApi from "../../../api/userApi";
import { uploadImg } from "../../../asset/images";
import "../../../components/DropImages/DropImages.css";
import TextEditor from "../../../components/TextEditor";
import { IRootState } from "../../../interface";
import { setChangeTheme } from "../../../redux/uiSlice";

const initialStateData = {
  address: "",
  color_primary: "",
  color_secondary: "",
  email: "",
  mst: "",
  phoneNumber: "",
  configName: "",
  long_intro: "",
  short_intro: "",
};

const UiManagement = () => {
  const changeTheme = useSelector((e: IRootState) => e.ui.changeTheme);
  const dispatch = useDispatch();
  const [imageURLShortIntro, setImageURLShortIntro] = useState<Blob>();
  const [imageURLLogo, setImageURLLogo] = useState<Blob>();
  const [imageURLMiniLogo, setImageURLMiniLogo] = useState<Blob>();
  const [imageURLBreadcrum, setImageURLBreadcrum] = useState<Blob>();
  const [tempaltes, setTempaltes] = useState<any>();
  const [tempalte, setTempalte] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>();
  const [isActive, setIsActive] = useState<boolean>();

  const [longIntro, setLongIntro] = useState<string>();
  const [shortIntro, setShortIntro] = useState<string>();

  const [imgEdit, setImgEdit] = useState<any>({
    0: "",
    1: "",
    2: "",
    3: "",
  });
  const [imgPayload, setImgPayload] = useState<any>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialStateData });
  useEffect(() => {
    const fetchTemplates = async () => {
      const res: any = await userApi.getTemplates();
      if (res?.status === "success") {
        setTempaltes(res.data);
      }
    };
    fetchTemplates();
  }, [refresh]);

  useEffect(() => {
    if (tempalte && tempalte !== "empty" && tempaltes) {
      const dataEdit = tempaltes.find((item: any) => item._id === tempalte);

      const dataReset = {
        address: dataEdit.address,
        color_primary: dataEdit.colors[0].color_primary,
        color_secondary: dataEdit.colors[0].color_secondary,
        email: dataEdit.email,
        long_intro: dataEdit.long_intro,
        mst: dataEdit.mst,
        phoneNumber: dataEdit.phoneNumber,
        short_intro: dataEdit.short_intro,
        configName: dataEdit.configName,
      };
      setShortIntro(dataEdit.short_intro);
      setLongIntro(dataEdit.long_intro);
      setIsActive(dataEdit.isActive);

      setImgEdit({
        0: dataEdit.images[0]?.img_intro_homePage,
        1: dataEdit.images[0]?.img_logo,
        2: dataEdit.images[0]?.img_mini_logo,
        3: dataEdit.images[0]?.img_breadcrum,
      });
      reset(dataReset);
    } else {
      reset(initialStateData);
    }
  }, [reset, tempalte, tempaltes]);

  const submit = (data: any) => {
    const payload = {
      address: data.address,
      color_primary: data.color_primary,
      color_secondary: data.color_secondary,
      email: data.email,
      long_intro: longIntro,
      mst: data.mst,
      phoneNumber: data.phoneNumber,
      short_intro: shortIntro,
      configName: data.configName,
    };

    if (!tempalte || tempalte === "empty") {
      const createApi = async () => {
        const res: any = await userApi.createTemplate(payload);
        if (res?.status === "success") {
          toast.success("Thêm giao diện mới thành công!");
          setRefresh(!refresh);
        }
      };
      createApi();
    } else {
      // update

      const payloadUpdate = {
        ...payload,
        id: tempalte,
      };

      const updateApi = async () => {
        const res: any = await userApi.updateTemplate(payloadUpdate);
        if (res?.status === "success") {
          toast.success("Cập nhật giao diện thành công!");
          setRefresh(!refresh);
        }
      };
      updateApi();
    }
  };

  const handleUpdateImg = async (type: string, index: number) => {
    if (!imgPayload[index]) {
      toast.error("Vui lòng chọn ảnh trước khi cập nhật!");
    } else {
      const formData = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      formData.append("type", type);
      formData.append("id", tempalte);
      formData.append("image", imgPayload[index]);
      const res: any = await userApi.updateImgTemplate(formData, config);
      if (res?.status === "success") {
        toast.success("Cập nhật ảnh thành công!");
      }
    }
  };

  const handleActiveTemplate = async () => {
    const res: any = await userApi.activeTemplate(tempalte);
    if (res?.status === "success") {
      toast.success("Sử dụng giao diện thành công!");
      dispatch(setChangeTheme(!changeTheme));
      setRefresh(!refresh);
    }
  };

  const handleDeleteTemplate = async () => {
    const res: any = await userApi.deleteTemplate(tempalte);
    if (res?.status === "success") {
      toast.success("Xóa giao diện thành công!");
      setTempalte("");
      setRefresh(!refresh);
    }
  };

  const hanleLongIntro = useCallback((state: string) => {
    setLongIntro(state);
  }, []);
  const hanleShortIntro = useCallback((state: string) => {
    setShortIntro(state);
  }, []);

  return (
    <Container>
      <Form className="mt-5">
        <Row className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTempalte(e.target.value)}
              aria-label="Default select example"
            >
              <option value="empty">Tạo mới</option>
              {tempaltes?.map((item: any) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.configName}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
        {(!tempalte || tempalte === "empty") && (
          <Row>
            <Form.Group
              className="mb-3"
              as={Col}
              md="6"
              controlId="validationCustom03"
            >
              <Form.Label>Tên giao diện:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên giao diện"
                {...register("configName", { required: true })}
              />
              {errors?.configName?.type === "required" && (
                <p className="text__invalid">Vui lòng nhập tên giao diện</p>
              )}
            </Form.Group>
          </Row>
        )}

        <Row>
          <h3 className="mt-3">Thông tin:</h3>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom03"
          >
            <Form.Label>Địa chỉ:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Địa chỉ"
              {...register("address", { required: true })}
            />
            {errors?.address?.type === "required" && (
              <p className="text__invalid">Vui lòng nhập địa chỉ</p>
            )}
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom03"
          >
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Số điện thoại"
              {...register("phoneNumber", { required: true })}
            />
            {errors?.phoneNumber?.type === "required" && (
              <p className="text__invalid">Vui lòng nhập số điện thoại</p>
            )}
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom03"
          >
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors?.email?.type === "required" && (
              <p className="text__invalid">Vui lòng nhập Email</p>
            )}
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom03"
          >
            <Form.Label>Mã số thuế: (nếu có)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Mã số thuế"
              {...register("mst", { required: false })}
            />
          </Form.Group>
        </Row>
        <Row>
          <h3 className="mt-3">Giới thiệu:</h3>
          <Form.Group
            className="mb-3"
            as={Col}
            md="12"
            controlId="validationCustom03"
          >
            <Form.Label>Giới thiệu ngắn:</Form.Label>
            {/* <Form.Control
              type="text"
              as="textarea"
              placeholder="Giới thiệu ngắn..."
              {...register("short_intro", { required: true })}
            />
            {errors?.short_intro?.type === "required" && (
              <p className="text__invalid">Vui lòng nhập một đoạn giới thiệu</p>
            )} */}
            <TextEditor
              description={shortIntro}
              handlerodDescription={hanleShortIntro}
            ></TextEditor>
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="12"
            controlId="validationCustom03"
          >
            <Form.Label>Giới thiệu dài:</Form.Label>
            {/* <Form.Control
              type="text"
              as="textarea"
              placeholder="Giới thiệu dài..."
              {...register("long_intro", { required: true })}
            />
            {errors?.long_intro?.type === "required" && (
              <p className="text__invalid">Vui lòng nhập một đoạn giới thiệu</p>
            )} */}
             <TextEditor
              description={longIntro}
              handlerodDescription={hanleLongIntro}
            ></TextEditor>
          </Form.Group>
        </Row>
        <Row>
          <h3 className="mt-3">Màu sắc:</h3>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom01"
          >
            <Form.Label>Màu chủ đạo website</Form.Label>
            <Form.Control
              type="color"
              className="w-50"
              {...register("color_primary", { required: true })}
            />
            {errors?.color_primary?.type === "required" && (
              <p className="text__invalid">Vui lòng chọn màu</p>
            )}
          </Form.Group>
          <Form.Group
            className="mb-3"
            as={Col}
            md="6"
            controlId="validationCustom02"
          >
            <Form.Label>Màu phụ:</Form.Label>
            <Form.Control
              type="color"
              className="w-50"
              {...register("color_secondary", { required: true })}
            />
            {errors?.color_secondary?.type === "required" && (
              <p className="text__invalid">Vui lòng chọn màu</p>
            )}
          </Form.Group>
        </Row>

        <Row
          style={{ gap: "10px", marginTop: "30px", justifyContent: "center" }}
        >
          <Col onClick={handleSubmit(submit)} sm={3} xs={8} className="btn-11">
            <span className="btn-11__content">
              {" "}
              {!tempalte || tempalte === "empty" ? "Tạo" : "Cập nhật"}
            </span>
          </Col>
          {tempalte && tempalte !== "empty" && (
            <Col
              sm={3}
              xs={8}
              onClick={() => {
                if (!isActive) {
                  handleActiveTemplate();
                }
              }}
              className={`btn-11 ${isActive ? "disable" : ""}`}
            >
              <span className="btn-11__content">
                {isActive ? "Đang sử dụng" : "Sử dụng giao diện"}
              </span>
            </Col>
          )}
          {tempalte && tempalte !== "empty" && (
            <Col
              sm={3}
              xs={8}
              onClick={() => {
                if (!isActive) {
                  handleDeleteTemplate();
                }
              }}
              className={`btn-11 ${isActive ? "disable" : ""}`}
            >
              <span className="btn-11__content">xóa</span>
            </Col>
          )}
        </Row>
      </Form>
      {tempalte && tempalte !== "empty" && (
        <>
          <Row className="mt-5 justify-content-center">
            <h3 className="mt-3">Hình ảnh:</h3>
            <Col className="mt-3" sm={12} md={3}>
              <Form.Label>Hình ảnh giới thiệu ngắn:</Form.Label>
              <label htmlFor="img_shortIntro" className="dropzone">
                <input
                  className="d-none"
                  id="img_shortIntro"
                  type="file"
                  accept=".jpg, .jpeg, .png ,.html,.htm"
                  onChange={(e: any) => {
                    setImgPayload({
                      ...imgPayload,
                      0: e.target.files[0],
                    });
                    setImageURLShortIntro(e.target.files[0]);
                  }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Image src={uploadImg} alt="upload img"></Image>
                  <p className="pt-3">
                    Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg |
                    .html | .htm
                  </p>
                </div>
              </label>
            </Col>
            <Col className="mt-3" sm={12} md={9}>
              <Row>
                {imgEdit[0] && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được sử dụng:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={imgEdit[0]}
                      alt="hình ảnh hiện tại"
                    />
                  </Col>
                )}
                {imageURLShortIntro && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được chọn:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={URL.createObjectURL(imageURLShortIntro)}
                      alt="hình ảnh mới"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col>
              <div
                onClick={() => handleUpdateImg("img_intro_homePage", 0)}
                className="btn-11 mt-5"
              >
                <span className="btn-11__content">Cập nhật ảnh</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="mt-3" md={3}>
              <Form.Label>Hình ảnh Logo:</Form.Label>
              <label htmlFor="img_Logo" className="dropzone">
                <input
                  className="d-none"
                  id="img_Logo"
                  type="file"
                  accept=".jpg, .jpeg, .png ,.html,.htm"
                  onChange={(e: any) => {
                    setImgPayload({
                      ...imgPayload,
                      1: e.target.files[0],
                    });
                    setImageURLLogo(e.target.files[0]);
                  }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Image src={uploadImg} alt="upload img"></Image>
                  <p className="pt-3">
                    Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg |
                    .html | .htm
                  </p>
                </div>
              </label>
            </Col>
            <Col className="mt-3" md={9}>
              <Row>
                {imgEdit[1] && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được sử dụng:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={imgEdit[1]}
                      alt="hình ảnh hiện tại"
                    />
                  </Col>
                )}
                {imageURLLogo && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được chọn:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={URL.createObjectURL(imageURLLogo)}
                      alt="hình ảnh mới"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col>
              <div
                onClick={() => handleUpdateImg("img_logo", 1)}
                className="btn-11 mt-5"
              >
                <span className="btn-11__content">Cập nhật ảnh</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="mt-3" md={3}>
              <Form.Label>Hình ảnh mini logo:</Form.Label>
              <label htmlFor="img_MiniLogo" className="dropzone">
                <input
                  className="d-none"
                  id="img_MiniLogo"
                  type="file"
                  accept=".jpg, .jpeg, .png ,.html,.htm"
                  onChange={(e: any) => {
                    setImgPayload({
                      ...imgPayload,
                      2: e.target.files[0],
                    });
                    setImageURLMiniLogo(e.target.files[0]);
                  }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Image src={uploadImg} alt="upload img"></Image>
                  <p className="pt-3">
                    Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg |
                    .html | .htm
                  </p>
                </div>
              </label>
            </Col>
            <Col className="mt-3" md={9}>
              <Row>
                {imgEdit[2] && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được sử dụng:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={imgEdit[2]}
                      alt="hình ảnh hiện tại"
                    />
                  </Col>
                )}

                {imageURLMiniLogo && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được chọn:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={URL.createObjectURL(imageURLMiniLogo)}
                      alt="hình ảnh mới"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col>
              <div
                onClick={() => handleUpdateImg("img_mini_logo", 2)}
                className="btn-11 mt-5"
              >
                <span className="btn-11__content">Cập nhật ảnh</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="mt-3">
              <Form.Label>Hình ảnh breadcrum:</Form.Label>
              <label htmlFor="img_Breadcrum" className="dropzone">
                <input
                  className="d-none"
                  id="img_Breadcrum"
                  type="file"
                  accept=".jpg, .jpeg, .png ,.html,.htm"
                  onChange={(e: any) => {
                    setImgPayload({
                      ...imgPayload,
                      3: e.target.files[0],
                    });
                    setImageURLBreadcrum(e.target.files[0]);
                  }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Image src={uploadImg} alt="upload img"></Image>
                  <p className="pt-3">
                    Chỉ hỗ trợ các loại ảnh có định dạng .png | .jpg | .jpeg |
                    .html | .htm
                  </p>
                </div>
              </label>
            </Col>
            <Col md={9} className="mt-3">
              <Row>
                {imgEdit[3] && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được sử dụng:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={imgEdit[3]}
                      alt="hình ảnh hiện tại"
                    />
                  </Col>
                )}
                {imageURLBreadcrum && (
                  <Col sm={12} lg={6}>
                    <p>Hình ảnh đang được chọn:</p>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "350px",
                        objectFit: "contain",
                      }}
                      src={URL.createObjectURL(imageURLBreadcrum)}
                      alt="hình ảnh mới"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col>
              <div
                onClick={() => handleUpdateImg("img_breadcrum", 3)}
                className="btn-11 mt-5"
              >
                <span className="btn-11__content">Cập nhật ảnh</span>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default UiManagement;
