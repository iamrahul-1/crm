import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";

const Dashboard = () => {
  const [options1, setOptions1] = useState({});
  const [options2, setOptions2] = useState({});

  // First chart data
  const getData1 = () => [
    { asset: "Hot", amount: 4 },
    { asset: "Warm", amount: 46 },
    { asset: "Cold", amount: 38 },
  ];

  // Second chart data (Different from first chart)
  const getData2 = () => [
    { asset: "Today", amount: 50 },
    { asset: "Missed", amount: 15 },
    { asset: "Favourite", amount: 15 },
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
          legendItemKey: "asset",
          fills: ["#39D300", "#E94A4A", "#75B9DD"],
        },
      ],
    };
    setOptions1({
      ...commonOptions,
      data: getData1(),
      series: [
        {
          ...commonOptions.series[0],
          fills: ["#ED2100", "#FFA500", "#008FFB"],
        },
      ],
    });

    // Second chart with a different set of colors
    setOptions2({
      ...commonOptions,
      data: getData2(),
      series: [
        {
          ...commonOptions.series[0],
          fills: ["#047857", "#6B7280", "#EC4899"], // Blue, Yellow, Red
        },
      ],
    });
  });

  return (
    <div className="md:ml-52 mt-[60px] md:mt-[120px] flex flex-col h-full md:px-8">
      {/* Dashboard Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* New Leads Section */}
      <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full mb-6">
        {/* <h2 className="text-gray-700 font-bold text-lg mb-4">New Leads</h2> */}
        <div className="flex justify-between">
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-emerald-700 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">Today</span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-emerald-700 text-white text-lg rounded-md">
              50
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-gray-500 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">
                Missed
              </span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-gray-500 text-white text-lg rounded-md">
              50
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-pink-500 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">
                Favourite
              </span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-pink-500 text-white text-lg rounded-md">
              50
            </div>
          </div>
        </div>
      </div>

      {/* Hot, Warm, Cold Leads + Charts Side by Side */}
      <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl gap-6">
        {/* Left - Hot, Warm, Cold Leads */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-80">
          <h2 className="text-gray-700 font-bold text-lg mb-4">Type Of Lead</h2>

          {/* Hot Lead */}
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 mb-2 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-red-500 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">
                Hot Lead
              </span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-red-500 text-white text-lg rounded-md">
              4
            </div>
          </div>

          {/* Warm Lead */}
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 mb-2 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-orange-500 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">
                Warm Lead
              </span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-orange-500 text-white text-lg rounded-md">
              46
            </div>
          </div>

          {/* Cold Lead */}
          <div className="flex items-center justify-between bg-white shadow rounded-lg p-3 w-72">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-blue-500 rounded-full" />
              <span className="text-gray-800 font-semibold text-lg">
                Cold Lead
              </span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center bg-blue-500 text-white text-lg rounded-md">
              38
            </div>
          </div>
        </div>

        {/* Right - Two Different Charts */}
        <div className="flex justify-around items-center h-full w-full">
          <div className="flex flex-col items-center">
            <AgCharts options={options1} className="w-full h-[70%]" />
            <h1 className="text-xl">Leads Status</h1>
          </div>
          <div className="flex flex-col items-center">
            <AgCharts options={options2} className="w-full h-[70%]" />
            <h1 className="text-xl">Chart 2</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
