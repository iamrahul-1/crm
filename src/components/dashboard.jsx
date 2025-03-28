import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import {
  FiUsers,
  FiClock,
  FiStar,
  FiThermometer,
  FiSun,
  FiCloud,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";

const Dashboard = () => {
  const [options1, setOptions1] = useState({});
  const [options2, setOptions2] = useState({});

  // First chart data
  const getData1 = () => [
    { asset: "Rejected", amount: 4 },
    { asset: "Favourite", amount: 46 },
    { asset: "Site Visited", amount: 38 },
  ];

  // Second chart data
  const getData2 = () => [
    { asset: "Today", amount: 98 },
    { asset: "Missed", amount: 55 },
    { asset: "Weekend", amount: 112 },
  ];

  useEffect(() => {
    const commonOptions = {
      background: {
        fill: "transparent",
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20,
      },
      legend: {
        position: "bottom",
        item: {
          label: {
            color: "#4B5563",
            fontSize: 12,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 500,
          },
          marker: {
            padding: 6,
            shape: "circle",
            size: 8,
          },
          paddingY: 15,
        },
        spacing: 24,
      },
      series: [
        {
          type: "pie",
          angleKey: "amount",
          legendItemKey: "asset",
          innerRadius: 0.7,
          cornerRadius: 6,
          strokeWidth: 0,
          calloutLabel: {
            enabled: true,
          },
          sectorLabel: {
            color: "white",
            fontWeight: 600,
            fontSize: 12,
          },
          highlightStyle: {
            item: {
              fillOpacity: 0.8,
              stroke: "#FFF",
              strokeWidth: 2,
            },
          },
        },
      ],
    };

    setOptions1({
      ...commonOptions,
      data: getData1(),
      series: [
        {
          ...commonOptions.series[0],
          fills: ["#EF4444", "#F59E0B", "#3B82F6"],
          tooltip: {
            renderer: ({ datum }) => {
              return {
                content: `${datum.asset}: ${datum.amount} leads`,
              };
            },
          },
        },
      ],
    });

    setOptions2({
      ...commonOptions,
      data: getData2(),
      series: [
        {
          ...commonOptions.series[0],
          fills: ["#10B981", "#6B7280", "#EC4899"],
          tooltip: {
            renderer: ({ datum }) => {
              return {
                content: `${datum.asset}: ${datum.amount} leads`,
              };
            },
          },
        },
      ],
    });
  }, []);

  const StatCard = ({ icon: Icon, color, label, value }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 ${color} rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm text-gray-600 font-medium">{label}</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  const LeadTypeCard = ({ icon: Icon, color, label, value }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div
        className={`h-7 w-7 rounded-full ${color} flex items-center justify-center`}
      >
        <span className="text-white text-xs font-medium">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Dashboard Overview
          </h1>

          <div className="grid gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                icon={FiUsers}
                color="bg-blue-600"
                label="Today's Leads"
                value="50"
              />
              <StatCard
                icon={FiClock}
                color="bg-gray-600"
                label="Missed Leads"
                value="45"
              />
              <StatCard
                icon={FiStar}
                color="bg-purple-600"
                label="Favorite Leads"
                value="50"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lead Types */}
              <div className="lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <FiUsers className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-base font-medium text-gray-800">
                    Lead Stages
                  </h2>
                </div>
                <div className="pt-8">
                  <LeadTypeCard
                    icon={FiThermometer}
                    color="bg-red-500"
                    label="Hot Lead"
                    value="4"
                  />
                  <LeadTypeCard
                    icon={FiSun}
                    color="bg-orange-500"
                    label="Warm Lead"
                    value="46"
                  />
                  <LeadTypeCard
                    icon={FiCloud}
                    color="bg-blue-500"
                    label="Cold Lead"
                    value="38"
                  />
                </div>
              </div>

              {/* Charts */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-red-50 rounded-lg">
                      <FiPieChart className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-base font-medium text-gray-800">
                      Leads Status
                    </h2>
                  </div>
                  <div className="h-[280px] relative">
                    <AgCharts options={options1} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-purple-50 rounded-lg">
                      <FiBarChart2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-base font-medium text-gray-800">
                      Lead Management
                    </h2>
                  </div>
                  <div className="h-[280px] relative">
                    <AgCharts options={options2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
