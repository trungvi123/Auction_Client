import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto"; // Sử dụng chart.js/auto để hỗ trợ TypeScript
import productApi from "../../../api/productApi";
import userApi from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import TitleH2 from "../../TitleH2";

const colorChart = [
  "rgb(201,37,25)",
  "rgb(250,122,53)",
  "rgb(245,189,2)",
  "rgb( 250,229,0)",
  "rgb(209,226,49)",
  "rgb(167,252,0)",
  "rgb(99,183,183)",
  "rgb(79,134,247)",
  "rgb(218,24,132)",
  "rgb( 102,51,153)",
  "rgb(112,128,144)",
  "rgb(36,47,120)",
];

interface IDataCreateChart {
  month: string;
  color: string;
  count: string;
}

interface ITotalData {
  product: IDataCreateChart[];
  freeProduct: IDataCreateChart[];
  user: IDataCreateChart[];
}

function AuctionChart({ yearSelect }: { yearSelect: string }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartUserRef = useRef<HTMLCanvasElement | null>(null);
  const chartFreeProductRef = useRef<HTMLCanvasElement | null>(null);

  const [totalData, setTotalData] = useState<ITotalData>();

  const createChar = (ctxx: any, typee: any, labell: string, dataa: any) => {
    return new Chart(ctxx, {
      type: typee,
      data: {
        labels: dataa.map((entry: any) => entry.month),
        datasets: [
          {
            label: labell,
            data: dataa.map((entry: any) => entry.count),
            backgroundColor: dataa.map((entry: any) => entry.color),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const dataChart = useQuery({
    queryKey: ["getStatisticByYear", { year: yearSelect }],
    queryFn: async () => {
      
        const res = await userApi.getStatisticByYear(yearSelect);
        return res.data;
      
    },
  });

  useEffect(() => {
    if (dataChart?.data?.months) {
      const productTemp = [];
      const freeProductTemp = [];
      const userTemp = [];

      for (let i = 1; i <= 12; i++) {
        const check = dataChart?.data.months?.find(
          (item: any) => item.month === i.toString()
        );

        productTemp.push({
          month: `Tháng ${i.toString()}`,
          color: colorChart[i - 1],
          count: check ? check.auctionCountInMonth : 0,
        });
        freeProductTemp.push({
          month: `Tháng ${i.toString()}`,
          color: colorChart[i - 1],
          count: check ? check.freeProductCountInMonth : 0,
        });

        userTemp.push({
          month: `Tháng ${i.toString()}`,
          color: colorChart[i - 1],
          count: check ? check.userCountInMonth : 0,
        });
      }
      setTotalData({
        freeProduct: freeProductTemp,
        product: productTemp,
        user: userTemp,
      });
    }
  }, [dataChart?.data]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (!ctx) return;

    const label = "Số cuộc đấu giá được đăng trong tháng";
    const type = "bar";
    const data = totalData?.product || [];

    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [totalData?.product]);

  useEffect(() => {
    if (!chartFreeProductRef.current) return;

    const ctx = chartFreeProductRef.current.getContext("2d");

    if (!ctx) return;

    const label = "Số tài sản chia sẻ được đăng trong tháng";
    const type = "bar";
    const data = totalData?.freeProduct || [];

    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [totalData?.freeProduct]);

  useEffect(() => {
    if (!chartUserRef.current) return;

    const ctx = chartUserRef.current.getContext("2d");

    if (!ctx) return;

    const label = "Số tài khoản được tạo trong tháng";
    const type = "bar";
    const data = totalData?.user || [];

    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [totalData?.user]);

  return (
    <>
      <TitleH2
        title={`Số cuộc đấu giá được đăng trong các tháng của năm ${yearSelect}`}
      ></TitleH2>
      <canvas ref={chartRef} />
      <TitleH2
        title={`Số tài sản chia sẻ được tạo trong các tháng của năm ${yearSelect}`}
      ></TitleH2>
      <canvas ref={chartFreeProductRef}></canvas>
      <TitleH2
        title={`Số lượng tài khoản được tạo trong các tháng của năm ${yearSelect}`}
      ></TitleH2>
      <canvas ref={chartUserRef}></canvas>
    </>
  );
}

export default AuctionChart;
