import React, { useEffect, useState } from "react";

import "./CountDownTime.css";

interface IProps {
  time: {
    time: any;
    type: string;
  };
  bidsTime: (notify: any, type: string) => any;
}

const CountDownTime = ({ time, bidsTime }: IProps) => {
  const [hour, setHour]: any = useState();
  const [minute, setMinute]: any = useState();
  const [second, setSecond]: any = useState();
  const [downLoop, setDownLoop] = useState(false);

  useEffect(() => {
    if (!downLoop) {
      const clockInterval = setInterval(() => {
        // Tính khoảng thời gian giữa thời gian hiện tại và thời gian cụ thể
        const countTime = new Date(time.time).getTime() - new Date().getTime();

        //   const secondsLocal = Math.floor((countTime % (1000 * 60)) / 1000);
        //   const minutesLocal = Math.floor(
        //     (countTime % (1000 * 60 * 60)) / (1000 * 60)
        //   );
        //   const hoursLocal = Math.floor(
        //     (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        //   );
        if (countTime <= 0 && time.type === "start") {
          bidsTime(true, "start");
        } else if (countTime <= 0 && time.type === "end") {
          bidsTime(true, "end");
          setDownLoop(true);
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
  }, [bidsTime, downLoop, time]);

  return (
    <>
      {!downLoop && (
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
