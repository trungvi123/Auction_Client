import { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes } from "date-fns";
import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi";
import DropImages from "../../components/DropImages";
import TextEditor from "../../components/TextEditor";
import { IRootState } from "../../interface";
import "./CreateAuction.css";

interface ICate {
  _id: string;
  name: string;
}

function CreateAuction() {
  const refForm: any = useRef();
  const [validated, setValidated] = useState(false);
  const [cateList, setCateList] = useState<ICate[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const prodDescription = useSelector(
    (e: IRootState) => e.utils.prodDescription
  );
  const idOwner = useSelector((e: IRootState) => e.auth._id);

  const [payload, setPayload] = useState<any>({
    name: "",
    description: "",
    basePrice: 0,
    price: 0,
    stepPrice: 0,
    startTime: "",
    duration: "",
    category: "",
    owner: "",
  });

  const [startDate, setStartDate] = useState(new Date());

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };


  const auctionEndTime = addMinutes(startDate, payload.duration);

  const handleImageUpload = (images: File[]) => {
    // Nhận dữ liệu ảnh từ DropImages và cập nhật state của Form
    setUploadedImages(images);
  };

  useEffect(() => {
    const fetchcate = async () => {
      const resCate: any = await categoryApi.getAllCategory();

      if (resCate.status === "success") {
        setCateList(resCate.category);
      }
    };
    fetchcate();
  }, []);

  const handleSubmit = () => {
    const form = refForm.current;

    if (form.checkValidity() === true) {
      const formData = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      formData.append("name", payload.name);
      formData.append("description", prodDescription);
      formData.append("basePrice", payload.basePrice);
      formData.append("price", payload.price);
      formData.append("category", payload.category);
      formData.append("stepPrice", payload.stepPrice);
      formData.append("owner", idOwner);
      formData.append("duration", payload.duration);
      formData.append("startTime", startDate.toLocaleString());
      formData.append("endTime", auctionEndTime.toLocaleString());


      for (let i = 0; i < uploadedImages.length; i++) {
        formData.append("images", uploadedImages[i]);
      }

      const createProd = async () => {
        const result: any = await productApi.createProducts(formData, config);
        if (result?.status === "success") {
          toast.success("Tạo cuộc đấu giá thành công!");
          toast.success(
            "Bạn có thể bắt đầu cuộc đấu giá ngay sau khi được hệ thống của chúng tôi thông qua!"
          );
          setPayload({
            name: "",
            description: "",
            basePrice: 0,
            price: 0,
            stepPrice: 0,
            startTime: "",
            duration: "",
            category: "",
            owner: "",
          });
        }
      };
      createProd();
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="w-100 d-flex justify-content-center">
        <Col xl={10} lg={8} md={10}>
          <div className="reg__wrapper">
            <div className="reg__title">
              <h1>Tạo cuộc đấu giá</h1>
            </div>

            <Form ref={refForm} noValidate validated={validated}>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Sách, quần áo, ..."
                    value={payload.name}
                    onChange={(e) =>
                      setPayload({ ...payload, name: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập tên sản phẩm!
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Giá khởi điểm (VND)</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="100000"
                    value={payload?.basePrice}
                    onChange={(e: any) =>
                      setPayload({ ...payload, basePrice: e.target.value })
                    }
                  />
                  <Form.Control.Feedback>
                    Vui lòng nhập giá khởi điểm
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationCustom022">
                  <Form.Label>Giá mua ngay (VND)</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="1000000"
                    value={payload?.price}
                    onChange={(e: any) =>
                      setPayload({ ...payload, price: e.target.value })
                    }
                  />
                  <Form.Control.Feedback>
                    Vui lòng nhập giá mua ngay
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Bước giá (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="50000"
                    required
                    value={payload?.stepPrice}
                    onChange={(e: any) =>
                      setPayload({ ...payload, stepPrice: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập bước giá!
                  </Form.Control.Feedback>
                </Form.Group>
                <Col md={6}>
                  <Form.Label>Loại sản phẩm</Form.Label>
                  <Form.Select
                    aria-label="Chọn loại sản phẩm"
                    onChange={(e) =>
                      setPayload({ ...payload, category: e.target.value })
                    }
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
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom033">
                  <Form.Label>
                    Thời gian dự kiến bắt đầu cuộc đấu giá
                  </Form.Label>
                  {/* <Form.Control
                    type="date"
                    required
                    value={payload?.startTime}
                    onChange={(e: any) =>
                      setPayload({ ...payload, startTime: e.target.value })
                    }
                  /> */}

                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy HH:mm"
                  />
                  <div>
                    <p>Thời gian kết thúc: {auctionEndTime.toLocaleString()}</p>
                  </div>

                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập thời gian dự kiến bắt đầu cuộc đấu giá!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom0333">
                  <Form.Label>Thời gian của cuộc đấu giá (PHÚT)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Dưới 2880 phút"
                    min={1}
                    max={2880}
                    value={payload?.duration}
                    onChange={(e: any) =>
                      setPayload({ ...payload, duration: e.target.value })
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập thời gian của cuộc đấu giá!
                  </Form.Control.Feedback>
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
                  <DropImages onImagesUpload={handleImageUpload}></DropImages>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  required
                  label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá) , Chính sách bảo mật thông tin khách hàng , Cơ chế giải quyết tranh chấp , Quy chế hoạt động tại website đấu giá trực tuyến"
                  feedback="Bạn phải đồng ý với các điều khoản của chúng tôi!"
                  feedbackType="invalid"
                />
              </Form.Group>

              <div onClick={handleSubmit} className="btn-11 btn-createAuction">
                <span className="btn-11__content">Tạo cuộc đấu giá</span>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateAuction;
