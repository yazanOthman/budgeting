"use client";
import React from "react";
import { Chart, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: [1250, 2500, 3750],
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
    labels: ["Maybank", "Hong Leong Bank", "test"],
  };
  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
      }}
    />
  );
};

export default DoughnutChart;
