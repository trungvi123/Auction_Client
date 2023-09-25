import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import freeProductApi from "../../api/freeProduct";
import { breadcrumbs } from "../../asset/images";
import Breadcrumbs from "../../components/Breadcrumbs";
import LuckyCircle from "../../components/LuckyCircle";
import ReceivedListTable from "../../components/ReceivedListTable";
import { IRootState } from "../../interface";

const ReceivedList = () => {
  const param = useParams();
  const idProduct: string | undefined = param.id;
  const next = useNavigate();
  const freeProductPermission = useSelector(
    (e: IRootState) => e.auth.freeProductPermission
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [winnerTemp, setWinnerTemp] = useState("");
  const [realWinner, setRealwinner] = useState("");
  const [showLuckyCircle, setShowLuckyCircle] = useState(false);

  const permission = freeProductPermission?.find((item) => item === param.id);
  useEffect(() => {
    if (!permission) {
      next("/");
    }
  }, [next, permission]);

  const dataReceived = useQuery({
    queryKey: ["participationList", { idProduct }],
    queryFn: async () => {
      const res = await freeProductApi.getParticipationList({ idProduct });
      return res.data;
    },
  });

  const segments = dataReceived?.data?.accepterList?.map((item: any) => {
    return item.email;
  });
  const segColors = [
    "rgb(201,37,25)",
    "rgb(250,122,53)",
    "rgb(245,189,2)",
    "rgb( 250,229,0)",
    "rgb(209,226,49)",
    "rgb(167,252,0)",
    "rgb(99,183,183)",
    "rgb(79,134,247)",
    "rgb(218,24,132)",
    "rgb( 102,51,153)",
    "rgb(112,128,144)",
    "rgb(36,47,120)",
    "rgb(201,37,25)",
    "rgb(250,122,53)",
    "rgb(245,189,2)",
    "rgb( 250,229,0)",
    "rgb(209,226,49)",
    "rgb(167,252,0)",
    "rgb(99,183,183)",
    "rgb(79,134,247)",
  ];
  const handleClose = () => setShowModal(false);
  const onFinished = (winner: any) => {
    setShowModal(true);
    setModalMsg(
      `Người may mắn lần này là ${winner}, bạn có muốn tặng "${dataReceived?.data?.name}" cho người này?`
    );
    setWinnerTemp(winner);
  };

  
  return (
    <>
      {permission && (
        <div>
          <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMsg}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setRealwinner(winnerTemp);
                  handleClose();
                }}
              >
                Tiếp tục
              </Button>
            </Modal.Footer>
          </Modal>
          <Container>
            <Breadcrumbs
              title={dataReceived?.data?.name}
              type={"danh-sach"}
              img={breadcrumbs}
            ></Breadcrumbs>
            <Row className="mt-5">
              <Col>
                <div className="reg__title">
                  <h1>Danh sách đăng ký nhận sản phẩm</h1>
                </div>
              </Col>
            </Row>
            {showLuckyCircle  && !dataReceived?.data?.receiver && (
              <Row>
                <Col>
                  <LuckyCircle
                    segments={segments}
                    segColors={segColors}
                    onFinished={(winner: any) => onFinished(winner)}
                    primaryColor="black"
                    contrastColor="white"
                    buttonText="Xoay"
                    isOnlyOnce={false}
                    size={230}
                    upDuration={100}
                    downDuration={1000}
                    fontFamily="Arial"
                  ></LuckyCircle>
                </Col>
              </Row>
            )}
            {dataReceived?.data?.accepterList.length > 0 && <Row className="justify-content-end my-5">
              <Col sm={3}>
                <div
                  className={`btn-11 btn-11__full ${
                    dataReceived?.data?.receiver ? "disable" : ""
                  }`}
                  onClick={() => {
                    if (!dataReceived?.data?.receiver) {
                      setShowLuckyCircle(!showLuckyCircle);
                    }
                  }}
                >
                  <span className="btn-11__content">Vòng xoay</span>
                </div>
              </Col>
            </Row>}
            
            <Row>
              <Col>
                <ReceivedListTable
                  userReceived={realWinner}
                  productInfor={{
                    owner: dataReceived?.data?.owner,
                    _id: dataReceived?.data?._id,
                    receiver: dataReceived?.data?.receiver,
                  }}
                  data={dataReceived?.data?.accepterList}
                ></ReceivedListTable>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ReceivedList;
