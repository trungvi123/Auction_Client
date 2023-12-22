import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import userApi from "../../../api/userApi";
import AuctionChart from "../../../components/Admin/AuctionChart";
import ProfitChart from "../../../components/Admin/ProfitChart";
import StatisticTable from "../../../components/Admin/StatisticTable";
import formatMoney from "../../../utils/formatMoney";

const Dashboard = () => {
  const [yearSelect, setYearSelect] = useState<string>("2023");
  const [showChart, setShowChart] = useState<boolean>(false);
  const [profitTotal, setProfitTotal] = useState<string>("");

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

  const handleProfitTotal = useCallback((state: string) => {
    setProfitTotal(formatMoney(state));
  }, []);

  return (
    <Container>
      <Row className="mt-5">
        <Col sm={12}>
          <h3>Tổng lợi nhuận: {profitTotal}</h3>
        </Col>
        <Col sm={12}>
          <ProfitChart handleProfitTotal={handleProfitTotal}></ProfitChart>
        </Col>
        <div className="d-flex justify-content-center mt-3">
        <a
          href="http://localhost:5000/admin/handleExportProfit/2023"
          target={"_blank"}
          rel="noreferrer"
          className="btn-11"
          style={{ width: "250px" }}
        >
          <span className="btn-11__content">Xuất Excel</span>
        </a>
      </div>
      </Row>
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
