import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import newsApi from "../../api/newsApi";
import NewsTable from "../../components/NewsTable";
import SEO from "../../components/SEO";


const ManagementNews = () => {
  const [typeList, setTypeList] = useState("create");

  const news_list = useQuery({
    queryKey: ["news-list", { typeList }],
    queryFn: async () => {
      let result: any;
      if (typeList === "create") {
        result = await newsApi.getMyNews()
      } else if(typeList === "hide"){
        result = await newsApi.getHideNews()
      }else{
        result = await newsApi.getRefuseNews()
      }
      return result;
    },
    staleTime: 240 * 1000,
  });

  return (
    <div>
      <Container>
      <SEO title={'Quản lí'}></SEO>
        <Row   style={{ minHeight: "450px" }} className="mt-5 justify-content-end">
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeList(e.target.value)}
              aria-label="Default select example"
            >
              <option value="create">Bài viết bạn đã tạo</option>
              <option value="refuse">Bài viết bị từ chối</option>
              <option value="hide">Bài viết đã ẩn</option>

            </Form.Select>
          </Col>
          <Col sm={12}>
            <NewsTable
              typeList={typeList}
              data={news_list?.data?.data || []}
              
            ></NewsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagementNews;
