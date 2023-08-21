import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./InforTabs.css";
import DOMPurify from 'dompurify';

function InforTabs({data}:{data:any}) {

  return (
    <Tabs
      defaultActiveKey="description"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="description" title="Mô tả tài sản">
        <div className="tabs-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.description)}}>
        </div>
      </Tab>
      <Tab eventKey="profile" title="Thông tin đấu giá">
        <div className="tabs-content">Tab content for Profile</div>
      </Tab>
      <Tab eventKey="detail" title="Chi tiết đấu giá">
        <div className="tabs-content">Tab content for Loooonger Tab</div>
      </Tab>
    </Tabs>
  );
}

export default InforTabs;
