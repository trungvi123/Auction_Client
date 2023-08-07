import React, { useEffect, useState } from "react";
import './CurrentTime.css'

const CurrentTime = () => {
  const [time, setTime]: any = useState();
  const [time2, setTime2]: any = useState();

  function formatDate(date: Date) {
    if (!date) return "";

    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    const d = date.getDay();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();


    var dn: string[] = new Array(
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7"
      );
      var date_pro =
        dn[d] +
        ", " +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "/" +
        (m < 10 ? "0" : "") +
        m +
        "/" +
        y;
        
        setTime2(date_pro)

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();

      const newTimeString = formatDate(now);
      setTime(newTimeString);

      
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);


  return (
      <div className="codepro-time">
        <div id="codepro-hour">{time}</div>
        <div id="codepro-date">{time2}</div>
      </div>
  );
};

export default CurrentTime;
