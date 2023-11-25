import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import newsApi from "../../../api/newsApi";
import NewsTable from "../../../components/NewsTable";
import SEO from "../../../components/SEO";

const NewsManagement = () => {
  const [typeList, setTypeList] = useState("pending");

  const news_list = useQuery({
    queryKey: ["news-list__admin", { typeList }],
    queryFn: async () => {
      let result: any;
      if (typeList === "pending") {
        result = await newsApi.getNewsByStatus_admin("pending");
      } else if (typeList === "approve") {
        result = await newsApi.getNewsByStatus_admin("approve");
      } else if (typeList === "refuse") {
        result = await newsApi.getNewsByStatus_admin("refuse");
      } else {
        result = await newsApi.getReApproveNews();
      }
      return result;
    },
    staleTime: 240 * 1000,
  });

  return (
    <div>
      <Container>
        <SEO title={"Quản lí"}></SEO>
        <Row
          style={{ minHeight: "450px" }}
          className="mt-5 justify-content-end"
        >
          <Col sm={4} className={"my-4"}>
            <Form.Select
              onChange={(e: any) => setTypeList(e.target.value)}
              aria-label="Default select example"
            >
              <option value="pending">Bài viết chưa duyệt</option>
              <option value="approve">Bài viết đã duyệt</option>
              <option value="refuse">Bài viết đã từ chối</option>
              <option value="reApprove">Bài viết yêu cầu xem xét</option>
            </Form.Select>
          </Col>
          <Col sm={12}>
            <NewsTable
              typeList={typeList}
              data={news_list?.data?.data || []}
              isAdmin={true}
            ></NewsTable>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewsManagement;
