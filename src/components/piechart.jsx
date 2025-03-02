import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AgCharts } from "ag-charts-react";

const PieChart = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [options, setOptions] = useState({});
  const [options2, setOptions2] = useState({});

  const getData = () => [
    { asset: "Closed", amount: 600 },
    { asset: "In Progress", amount: 5000 },
    { asset: "New", amount: 3000 },
  ];

  const getData2 = () => [
    { asset: "Closed", amount: 6000 },
    { asset: "In Progress", amount: 5000 },
    { asset: "New", amount: 3000 },
  ];

  useEffect(() => {
    const commonOptions = {
      background: {
        fill: darkMode ? "#101828" : "#fff",
      },
      legend: {
        position: "bottom",
        item: {
          label: {
            color: darkMode ? "white" : "black",
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
            color: darkMode ? "white" : "black",
          },
          legendItemKey: "asset",
          fills: ["#39D300", "#E94A4A", "#75B9DD", "#FFB013", "#F7F700"],
        },
      ],
    };

    setOptions({ ...commonOptions, data: getData() });
    setOptions2({ ...commonOptions, data: getData2() });
  }, [darkMode]);

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
