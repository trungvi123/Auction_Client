import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto"; // Sử dụng chart.js/auto để hỗ trợ TypeScript
import productApi from "../../../api/productApi";
import userApi from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";

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
function AuctionChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartUserRef = useRef<HTMLCanvasElement | null>(null);
  const [productsLocal, setProductsLocal] = useState();
  const [usersLocal, setUsersLocal] = useState();

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

  useQuery({
    queryKey: ["productsQuatity"],
    queryFn: async () => {
      const res = await productApi.getQuatityProduct();
      setProductsLocal(res.data);
      return res;
    },
  });

  useQuery({
    queryKey: ["usersQuatity"],
    queryFn: async () => {
      const res = await userApi.getQuatityUser();
      setUsersLocal(res.data);
      return res;
    },
  });

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (!ctx) return;
    let arr: any;
    if (productsLocal) {
      const keyList = Object.keys(productsLocal).sort();

      arr = keyList.map((item: any, index: number) => {
        return {
          month: `Tháng ${index + 1}`,
          count: productsLocal[item],
          color: colorChart[index],
        };
      });
    }
    const label = "Số cuộc đấu giá được đăng trong tháng";
    const type = "bar";
    const data = arr || [];

    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [productsLocal]);

  useEffect(() => {
    if (!chartUserRef.current) return;

    const ctx = chartUserRef.current.getContext("2d");

    if (!ctx) return;
    let arr: any;
    if (usersLocal) {
      const keyList = Object.keys(usersLocal).sort();

      arr = keyList.map((item: any, index: number) => {
        return {
          month: `Tháng ${index + 1}`,
          count: usersLocal[item],
          color: colorChart[index],
        };
      });
    }
    const label = "Số lượng tài khoản được tạo trong tháng";
    const type = "line";
    const data = arr || [];
    const mychart = createChar(ctx, type, label, data);

    return () => {
      mychart.destroy();
    };
  }, [usersLocal]);

  return (
    <>
      <h3>Số cuộc đấu giá được đăng trong tháng</h3>
      <canvas className="my-5" ref={chartRef} />
      <h3>Số lượng tài khoản được tạo trong tháng</h3>
      <canvas className="my-5" ref={chartUserRef}></canvas>
    </>
  );
}

export default AuctionChart;
