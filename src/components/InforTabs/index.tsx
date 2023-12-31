import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./InforTabs.css";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { BiUser } from "react-icons/bi";
import formatDateTime from "../../utils/formatDay";
import formatMoney from "../../utils/formatMoney";
import { Link } from "react-router-dom";

function InforTabs({
  data,
  socket,
  joined,
  freeProduct = false,
}: {
  data: any;
  socket?: any;
  joined?: boolean;
  freeProduct?: boolean;
}) {
  const [bidsDetail, setBidsDetail] = useState<any[]>();
  useEffect(() => {
    if (data?._id && !freeProduct) {
      const fetchBids = async () => {
        const res: any = await productApi.getBidsById(data._id);
        if (res?.status === "success") {
          setBidsDetail(res.data.bids);
        }
      };
      fetchBids();
    }
  }, [data, freeProduct]);

  useEffect(() => {
    if (socket) {
      socket.on("respone_bids", (result: any) => {
        setBidsDetail(result);
      });
    }
  }, [socket]);

  return (
    <>
      {!freeProduct ? (
        <Tabs
          defaultActiveKey="description"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="description" title="Mô tả tài sản">
            <div className="tabs-content">
              <p>
                Tên tài sản đấu giá: <b>{data?.name}</b>
              </p>
              <p>
                Tên chủ tài sản:{" "}
                <b>{data?.owner.firstName + "" + data?.owner.lastName}</b>{" "}
              </p>
              <p>
                Email chủ tài sản: <b>{data?.owner.email}</b>
              </p>
              <Link className="btn-11" to={`/cua-hang?user=${data?.owner.email}`}>
                <span className="btn-11__content"> Đi đến cửa hàng </span>
              </Link>
              {data?.description && (
                <>
                  <hr></hr>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(data?.description),
                    }}
                  ></div>
                </>
              )}
            </div>
          </Tab>
          <Tab eventKey="detail" title="Chi tiết đấu giá">
            {joined ? (
              <div className="tabs-content tabs-detail-bid">
                {bidsDetail &&
                  bidsDetail?.reverse().map((e: any) => {
                    return (
                      <div key={e._id} className="tabs-content__item">
                        <div className="tabs-content__item_avt">
                          <BiUser className="search__icon"></BiUser>
                        </div>
                        <div className="">
                          <div className="tabs-content__infor">
                            <p className="tabs-content__infor__name">
                              {e.lastName}
                            </p>
                            <p className="tabs-content__infor__time">
                              {formatDateTime(e.time)}
                            </p>
                          </div>
                          <p className="tabs-content__infor__bid">
                            Đã ra giá {formatMoney(e?.price?.$numberDecimal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              "Tham gia đấu giá để xem chi tiết cuộc đấu giá này!"
            )}
          </Tab>
        </Tabs>
      ) : (
        <div>
          <Tabs
            defaultActiveKey="description"
            id="fill-tab-example"
            className="mb-3 w-50"
            fill
          >
            <Tab eventKey="description" title="Mô tả tài sản">
            <div className="tabs-content">
              <p>
                Tên tài sản đấu giá: <b>{data?.name}</b>
              </p>
              <p>
                Tên chủ tài sản:{" "}
                <b>{data?.owner.firstName + "" + data?.owner.lastName}</b>{" "}
              </p>
              
              <p>
                Email chủ tài sản: <b>{data?.owner.email}</b>
              </p>
              <Link className="btn-11" to={`/cua-hang?user=${data?.owner.email}`}>
                <span className="btn-11__content"> Đi đến cửa hàng </span>
              </Link>
              {data?.description && (
                <>
                  <hr></hr>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(data?.description),
                    }}
                  ></div>
                </>
              )}
            </div>
            </Tab>
           
          </Tabs>
        </div>
      )}
    </>
  );
}

export default React.memo(InforTabs);
