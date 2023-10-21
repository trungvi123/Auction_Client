import React, { useEffect, useState } from "react";
import "./CurrentTime.css";

const CurrentTime = () => {
  const [time, setTime]: any = useState();
  const [time2, setTime2]: any = useState();
  const [isVisible, setIsVisible] = useState(true);

  function formatDate(date: Date) {
    if (!date) return "";

    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds() + 1}`.slice(-2);
    const d = date.getDay();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    const dn: string[] = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    let date_pro =
      dn[d] +
      ", " +
      (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      "/" +
      (m < 10 ? "0" : "") +
      m +
      "/" +
      y;

    setTime2(date_pro);

    return `${hours}:${minutes}:${seconds}`;
  }
  const updateVisibility = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 850) {
      setIsVisible(false); // Ẩn component khi màn hình có chiều ngang dưới 850px
    } else {
      setIsVisible(true);
    }
  };
  useEffect(() => {
    // Gọi hàm cập nhật hiển thị khi màn hình thay đổi kích thước
    window.addEventListener("resize", updateVisibility);

    // Gọi hàm cập nhật hiển thị ban đầu
    updateVisibility();
    let clockInterval:any = null;
    if (isVisible) {
      clockInterval = setInterval(() => {
        const now = new Date();

        const newTimeString = formatDate(now);
        setTime(newTimeString);
      }, 1000);
    }

    return () => {
      clearInterval(clockInterval);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [isVisible]);

  return isVisible ? (
    <div className="codepro-time">
      <div id="codepro-hour">{time}</div>
      <div id="codepro-date">{time2}</div>
    </div>
  ) : null;
};

export default CurrentTime;
