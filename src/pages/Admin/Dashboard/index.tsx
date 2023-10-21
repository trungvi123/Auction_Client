import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import userApi from "../../../api/userApi";
import AuctionChart from "../../../components/Admin/AuctionChart";
import StatisticTable from "../../../components/Admin/StatisticTable";

const Dashboard = () => {
  const [yearSelect, setYearSelect] = useState<string>("2023");
  const [showChart, setShowChart] = useState<boolean>(false);

  const statistic = useQuery({
    queryKey: ["statistic"],
    queryFn: async () => {
      const res: any = await userApi.getAllStatistic();
      return res.data;
    },
    staleTime: 1000 * 600,
  });

  const handleSelectYear = useCallback(
    (year: string) => {
      setYearSelect(year);
      setShowChart(!showChart);
    },
    [showChart]
  );

  return (
    <Container>
      <Row
        style={{ minHeight: `${showChart ? "unset" : "450px"}` }}
        className="justify-content-center mt-5"
      >
        <Col>
          <StatisticTable
            handleSelectYear={handleSelectYear}
            data={statistic?.data}
          ></StatisticTable>
        </Col>
      </Row>
      {showChart && (
        <Row className="mt-5 justify-content-center">
          <Col sm={12}>
            <AuctionChart yearSelect={yearSelect}></AuctionChart>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
