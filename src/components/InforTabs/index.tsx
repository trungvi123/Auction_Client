import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./InforTabs.css";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import productApi from "../../api/productApi";
import { BiUser } from "react-icons/bi";
import formatDateTime from "../../utils/formatDay";
import formatMoney from "../../utils/formatMoney";
import * as io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

function InforTabs({ data,inforBids }: { data: any ,inforBids?:any[]}) {
  const [bidsDetail, setBidsDetail] = useState<any[]>();
  useEffect(() => {
    if (data?._id) {
      const fetchBids = async () => {
        const res: any = await productApi.getBidsById(data._id);
        if (res?.status === "success") {
          setBidsDetail(res.data.bids);
        }
      };
      fetchBids();
    }
  }, [data]);

  useEffect(()=>{
    socket.on('respone_bids',(result)=>{
      setBidsDetail(result)
    })
  },[])


  return (
    <Tabs defaultActiveKey="detail" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="description" title="Mô tả tài sản">
        <div
          className="tabs-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data?.description),
          }}
        ></div>
      </Tab>
      <Tab eventKey="profile" title="Thông tin đấu giá">
        <div className="tabs-content">Tab content for Profile</div>
      </Tab>
      <Tab eventKey="detail" title="Chi tiết đấu giá">
        <div className="tabs-content tabs-detail-bid">
          {bidsDetail && bidsDetail?.reverse().map((e:any)=>{
            return <div key={e._id} className="tabs-content__item">
            <div className="tabs-content__item_avt">
              <BiUser className="search__icon"></BiUser>
            </div>
            <div className="">
              <div className="tabs-content__infor">
                <p className="tabs-content__infor__name">{e.lastName}</p>
                <p className="tabs-content__infor__time">{formatDateTime(e.time)}</p>
              </div>
              <p className="tabs-content__infor__bid">Đã ra giá {formatMoney(e.price.$numberDecimal)}</p>
            </div>
          </div>
          })}
          
        </div>
      </Tab>
    </Tabs>
  );
}

export default React.memo(InforTabs) ;
