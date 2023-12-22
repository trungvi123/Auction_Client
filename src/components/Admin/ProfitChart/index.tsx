import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto"; // Sử dụng chart.js/auto để hỗ trợ TypeScript
import { useQuery } from "@tanstack/react-query";
import userApi from "../../../api/userApi";
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
const ProfitChart = ({
  handleProfitTotal,
}: {
  handleProfitTotal: (state: string) => void;
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [monthData, setMonthData] = useState<any[]>([]);

  const dataChart = useQuery({
    queryKey: ["getProfitByYear", { year: "2023" }],
    queryFn: async () => {
      const res: any = await userApi.getProfitByYear("2023");
      return res;
    },
  });

  const createChar = (ctxx: any, typee: any, labell: string, dataa: any) => {
    return new Chart(ctxx, {
      type: "line",
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

  console.log(dataChart);

  useEffect(() => {
    if (dataChart?.data) {
      const monthDataTemp: any = [];
      let profitTemp: number = 0;

      for (let i = 1; i <= 12; i++) {
        monthDataTemp.push({
          month: `Tháng ${i.toString()}`,
          color: colorChart[i - 1],
          count: dataChart?.data?.monthlyProfits[i].monthlyTotalProfit * 24000,
        });
        profitTemp +=
          dataChart?.data?.monthlyProfits[i].monthlyTotalProfit * 24000;
      }

      setMonthData(monthDataTemp);
      handleProfitTotal(profitTemp.toString())
    }
  }, [dataChart?.data, handleProfitTotal]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (!ctx) return;

    const label = "Lợi nhuận qua các tháng";
    const type = "bar";
    const data = monthData || [];

    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [monthData]);

  return (
    <div>
      <TitleH2 title={`Lợi nhuận qua các tháng của năm 2023`}></TitleH2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ProfitChart;
