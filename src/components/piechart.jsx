import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";

const PieChart = () => {
  const [options, setOptions] = useState({});

  const getData = () => [
    { asset: "Closed", amount: 600 },
    { asset: "In Progress", amount: 5000 },
    { asset: "New", amount: 3000 },
  ];

  useEffect(() => {
    const commonOptions = {
      background: {
        fill: "#fff",
      },
      legend: {
        position: "bottom",
        item: {
          label: {
            color: "black",
            fontSize: 13,
            fontFamily: "Arial",
          },
        },
      },
      series: [
        {
          type: "pie",
          angleKey: "amount",
          calloutLabelKey: "asset",
          calloutLabel: {
            color: "black",
          },
          legendItemKey: "asset",
          fills: ["#39D300", "#E94A4A", "#75B9DD", "#FFB013", "#F7F700"],
        },
      ],
    };

    setOptions({ ...commonOptions, data: getData() });
  }, []);

  return (
    <div className="flex justify-center items-center h-full mt-20 md:mt-24 md:ml-56 md:px-8">
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full h-screen flex flex-col items-center">
          <AgCharts options={options} className="w-full h-[70%]" />
          <h1 className="mt-4 text-lg font-semibold text-center">
            Clients Chart
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
