import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";

import "./CountDownTime.css";

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

        if (countTime <= 0 && time.type === "start") {
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionStarted(
              productId
            );
            if (result?.status === "success") {
              refreshProductCb("finishStart");
            }
          };
          fectProduct();
        } else if (countTime <= 0 && time.type === "end") {
          const fectProduct = async () => {
            const result: any = await productApi.updateAuctionEnded({
              id: productId,
              idUser: idClient,
              type: "bid",
            });
            if (result?.status === "success") {
              refreshProductCb("finishEnd");
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
  }, [downLoop, idClient, productId, refreshProductCb, stop, time]);

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
