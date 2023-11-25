import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import productApi from "../../api/productApi";
import "./CountDownTime.css";
import {socket} from '../Header'
interface IProps {
  time: {
    time: any;
    type: string;
  };
  productId: string;
  idClient: string;
  stop: boolean;
  refreshProductCb: (state: string) => void;
}

const CountDownTime = ({
  time,
  stop = false,
  productId,
  idClient,
  refreshProductCb,
}: IProps) => {
  const [hour, setHour]: any = useState();
  const [minute, setMinute]: any = useState();
  const [second, setSecond]: any = useState();
  const [downLoop, setDownLoop] = useState(false);

  useEffect(() => {
    if (!downLoop && !stop) {
      const clockInterval = setInterval(() => {
        // Tính khoảng thời gian giữa thời gian hiện tại và thời gian cụ thể
        const countTime = new Date(time?.time).getTime() - new Date().getTime();

        if (countTime <= 0 && time.type === "start") { // hết thời gian -> đang diễn ra
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionStarted(
              productId
            );
            if (result?.status === "success") {
              refreshProductCb("finishStart");
              socket.emit('refreshProductState',{
                productId,
                type: 'addHappenningProduct'  // thêm vào mục đang diễn ra
              })
            }
          };
          fectProduct();
        } else if (countTime <= 0 && time.type === "end") { // hết thời gian -> kết thúc
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionEnded({
              id: productId,
              idUser: idClient,
              type: "bid",
            });
            if (result?.status === "success") {
              refreshProductCb("finishEnd");
              socket.emit('refreshProductState',{
                productId,
                type: 'removeHappenningProduct' // xóa khỏi mục đang diễn ra
              })
              setDownLoop(true);
            }
          };
          fectProduct();
        } else {
          const secondsLocal = Math.floor((countTime % 60000) / 1000);
          const minutesLocal = Math.floor((countTime % 3600000) / 60000);
          const hoursLocal = Math.floor((countTime % 86400000) / 3600000);
          setHour(hoursLocal.toString().padStart(2, "0"));
          setMinute(minutesLocal.toString().padStart(2, "0"));
          setSecond(secondsLocal.toString().padStart(2, "0"));
        }
      }, 1000);

      return () => {
        clearInterval(clockInterval);
      };
    }
  }, [downLoop, idClient, productId, refreshProductCb, stop, time?.time, time?.type]);

  return (
    <>
      {!downLoop && time?.time && !stop && (
        <div className="countdown-time-box">
          <div className="countdown-time-item">
            <span id="countdown-time-hour" className="countdown-time">
              {hour}
            </span>
            <span className="countdown-text">Giờ</span>
          </div>
          <div className="countdown-time-item">
            <span id="countdown-time-minute" className="countdown-time">
              {minute}
            </span>
            <span className="countdown-text">Phút</span>
          </div>
          <div className="countdown-time-item">
            <span id="countdown-time-second" className="countdown-time">
              {second}
            </span>
            <span className="countdown-text">Giây</span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CountDownTime);
