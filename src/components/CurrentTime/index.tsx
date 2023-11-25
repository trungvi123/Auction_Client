import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IRootState } from "../../interface";

import "./CurrentTime.css";

const CurrentTime = ({
  milestones,
  socket,
  clientId,
}: {
  milestones: any;
  socket: any;
  clientId: string;
}) => {
  const location = useLocation();
  const happenningProduct = useSelector(
    (e: IRootState) => e.product?.happenningProduct
  );
  const upcomingProduct = useSelector(
    (e: IRootState) => e.product?.upcomingProduct
  );
  let url = location.pathname;
  // let arrUpdateProductRealtime = updateProductRealtime;
  let outTimeId:any[] = [];
  let upcomingList = upcomingProduct;
  

  let arrMilestones = milestones;
  const [time, setTime]: any = useState();
  const [time2, setTime2]: any = useState();

  const formatDate = useCallback(
    (date: Date) => {
      if (!date) return "";

      const hours = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);
      const seconds = `0${date.getSeconds() + 1}`.slice(-2);
      const d = date.getDay();
      const m = date.getMonth() + 1;
      const y = date.getFullYear();

      arrMilestones.forEach((element: any) => {
        if (element.time <= date.getTime()) {
          socket.emit("milestone", {
            productId: element.productId,
            clientId,
            timeInput: element.timeInput,
            milestoneId: element._id,
            type: element.type,
          });

          // eslint-disable-next-line react-hooks/exhaustive-deps
          arrMilestones = arrMilestones.filter(
            (item: any) => item._id !== element._id
          );
        }
      });
      if (url.split("/")[1].trim() !== "chi-tiet-dau-gia") {
        happenningProduct?.forEach((item: any) => {
          if (!item.auctionEnded && !outTimeId.includes(item._id) ) {
            if (new Date(item.endTime).getTime() <= date.getTime()) {
              //cal api
              socket.emit("updateProductRealTime", {
                productId: item._id,
                type: "endTime",
              });
              socket.emit("refreshProductState", {
                productId: item._id,
                type: "removeHappenningProduct",
              });
              outTimeId.push(item._id)
            }
          }
        });
        upcomingList?.forEach((item: any) => {
          if (!item.auctionStarted && !outTimeId.includes(item._id)) {
            if (new Date(item.startTime).getTime() <= date.getTime()) {
              //call api
              socket.emit("updateProductRealTime", {
                productId: item._id,
                type: "startTime",
              });
              socket.emit("refreshProductState", {
                productId: item._id,
                type: "addHappenningProduct",
              });
              outTimeId.push(item._id)
            }
          }
        });

        // arrUpdateProductRealtime?.forEach((item: any) => {
        //   if (item.auctionStarted && !item.auctionEnded) {
        //     if (new Date(item.endTime).getTime() <= date.getTime()) {
        //       //cal api
        //       socket.emit("updateProductRealTime", {
        //         productId: item._id,
        //         type: "endTime",
        //       });
        //       socket.emit("refreshProductState", {
        //         productId: item._id,
        //         type: "removeHappenningProduct",
        //       });
        //       // eslint-disable-next-line react-hooks/exhaustive-deps
        //       arrUpdateProductRealtime = arrUpdateProductRealtime.filter(
        //         (item2: any) => item2._id !== item._id
        //       );
        //     }
        //   } else if (!item.auctionStarted) {
        //     if (new Date(item.startTime).getTime() <= date.getTime()) {
        //       //call api
        //       socket.emit("updateProductRealTime", {
        //         productId: item._id,
        //         type: "startTime",
        //       });
        //       socket.emit("refreshProductState", {
        //         productId: item._id,
        //         type: "addHappenningProduct",
        //       });
        //       // eslint-disable-next-line react-hooks/exhaustive-deps
        //       arrUpdateProductRealtime = arrUpdateProductRealtime.filter(
        //         (item2: any) => item2._id !== item._id
        //       );
        //     }
        //   }
        // });
      }

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
    },
    [milestones, arrMilestones,happenningProduct,upcomingList]
  );

  useEffect(() => {
    let clockInterval: any = null;

    clockInterval = setInterval(() => {
      const now = new Date();

      const newTimeString = formatDate(now);
      setTime(newTimeString);
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, [formatDate]);

  return (
    <div className="codepro-time">
      <div id="codepro-hour">{time}</div>
      <div id="codepro-date">{time2}</div>
    </div>
  );
};

export default CurrentTime;
