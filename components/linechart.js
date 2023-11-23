import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const currentYear = new Date().getFullYear();

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Revenue and Orders " + currentYear,
    },
  },
  scales: {
    y1: {
      position: "left",
      ticks: {
        callback: function (value, index, values) {
          return this.getLabelForValue(value);
        },
      },
      beginAtZero: true,
    },
    y2: {
      position: "right",
      ticks: {
        callback: function (value, index, values) {
          return this.getLabelForValue(value);
        },
      },
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function LineChart({ orders }) {
  const month = new Date().getMonth();
  let revenuePerMonth = new Array(month + 1).fill(0);
  let ordersPerMonth = new Array(month + 1).fill(0);

  orders.map((order) => {
    const month = new Date(order.createdAt).getMonth();
    ordersPerMonth[month] += 1;
    revenuePerMonth[month] += order.total / 100 || 0;
    return new Date(order.createdAt);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue (£)",
        data: revenuePerMonth,
        borderColor: "rgb(40, 200, 40)",
        backgroundColor: "rgba(40, 200, 40, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Number of Orders",
        data: ordersPerMonth,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y2",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
