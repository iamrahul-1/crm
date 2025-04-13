import React, { useState, useEffect, useCallback } from "react";
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
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import LoadingButton from "./LoadingButton";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    tomorrow: 0,
    weekend: 0,
    missed: 0,
    favorite: 0,
  });
  const [loading, setLoading] = useState(true);

  const [options1, setOptions1] = useState({});
  const [options2, setOptions2] = useState({});
  const [leadCounts, setLeadCounts] = useState({
    rejected: 0,
    favourite: 0,
    siteVisited: 0,
    today: 0,
    missed: 0,
    weekend: 0,
  });

  const calculateDates = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;

    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowYear = tomorrow.getFullYear();
    const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowDate = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

    // Get weekend dates in YYYY-MM-DD format
    const weekend = new Date();
    const weekendDay = weekend.getDay();
    let saturday, sunday;
    if (weekendDay === 6) {
      // Today is Saturday
      saturday = new Date(weekend);
      sunday = new Date(weekend);
      sunday.setDate(sunday.getDate() + 1);
    } else if (weekendDay === 0) {
      // Today is Sunday
      saturday = new Date(weekend);
      saturday.setDate(saturday.getDate() - 1);
      sunday = new Date(weekend);
    } else {
      // Any other day
      const daysUntilSaturday = 6 - weekendDay;
      saturday = new Date(weekend);
      saturday.setDate(saturday.getDate() + daysUntilSaturday);
      sunday = new Date(saturday);
      sunday.setDate(sunday.getDate() + 1);
    }

    const saturdayYear = saturday.getFullYear();
    const saturdayMonth = String(saturday.getMonth() + 1).padStart(2, "0");
    const saturdayDay = String(saturday.getDate()).padStart(2, "0");
    const saturdayDate = `${saturdayYear}-${saturdayMonth}-${saturdayDay}`;

    const sundayYear = sunday.getFullYear();
    const sundayMonth = String(sunday.getMonth() + 1).padStart(2, "0");
    const sundayDay = String(sunday.getDate()).padStart(2, "0");
    const sundayDate = `${sundayYear}-${sundayMonth}-${sundayDay}`;

    return {
      todayDate,
      tomorrowDate,
      saturdayDate,
      sundayDate,
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get dates once
        const dates = calculateDates();

        // Combine all API calls into one Promise.all
        const [
          totalRes,
          hotRes,
          warmRes,
          coldRes,
          todayRes,
          tomorrowRes,
          saturdayRes,
          sundayRes,
          missedRes,
          favoriteRes,
        ] = await Promise.all([
          api.get("/leads/all"),
          api.get(`/leads/potential/Hot`),
          api.get(`/leads/potential/Warm`),
          api.get(`/leads/potential/Cold`),
          api.get(`/leads/schedule/custom/${dates.todayDate}`),
          api.get(`/leads/schedule/custom/${dates.tomorrowDate}`),
          api.get(`/leads/schedule/custom/${dates.saturdayDate}`),
          api.get(`/leads/schedule/custom/${dates.sundayDate}`),
          api.get(`/leads/autostatus/missed`),
          api.get(`/leads/status/favorite`),
        ]);

        // Calculate lead counts
        const total = totalRes.data.totalLeads ?? 0;
        const todayLeads = todayRes.data.leads.length;
        const tomorrowLeads = tomorrowRes.data.leads.length;
        const weekendLeads =
          saturdayRes.data.leads.length + sundayRes.data.leads.length;
        const missed = missedRes.data.totalLeads ?? 0;
        const favorite = favoriteRes.data.totalLeads ?? 0;

        // Update stats
        setStats({
          total,
          today: todayLeads,
          tomorrow: tomorrowLeads,
          weekend: weekendLeads,
          missed,
          favorite,
        });

        // Update lead counts
        setLeadCounts({
          rejected: hotRes.data.leads.length,
          favourite: warmRes.data.leads.length,
          siteVisited: coldRes.data.leads.length,
          today: todayLeads,
          missed,
          weekend: weekendLeads,
        });

        // Update chart data
        setOptions1({
          data: [
            { asset: "Hot Lead", amount: hotRes.data.leads.length },
            { asset: "Warm Lead", amount: warmRes.data.leads.length },
            { asset: "Cold Lead", amount: coldRes.data.leads.length },
          ],
          series: [
            {
              type: "pie",
              angleKey: "amount",
              legendItemKey: "asset",
              fills: ["#EF4444", "#F59E0B", "#3B82F6"],
              tooltip: {
                renderer: ({ datum }) => ({
                  content: `${datum.asset}: ${datum.amount} leads`,
                }),
              },
            },
          ],
        });

        setOptions2({
          data: [
            { asset: "Today", amount: todayLeads },
            { asset: "Missed", amount: missed },
            { asset: "Weekend", amount: weekendLeads },
          ],
          series: [
            {
              type: "pie",
              angleKey: "amount",
              legendItemKey: "asset",
              fills: ["#10B981", "#6B7280", "#EC4899"],
              tooltip: {
                renderer: ({ datum }) => ({
                  content: `${datum.asset}: ${datum.amount} leads`,
                }),
              },
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // First chart data
  const getData1 = useCallback(
    () => [
      { asset: "Hot Lead", amount: leadCounts.rejected },
      { asset: "Warm Lead", amount: leadCounts.favourite },
      { asset: "Cold Lead", amount: leadCounts.siteVisited },
    ],
    [leadCounts]
  );

  // Second chart data
  const getData2 = useCallback(
    () => [
      { asset: "Today", amount: leadCounts.today },
      { asset: "Missed", amount: leadCounts.missed },
      { asset: "Weekend", amount: leadCounts.weekend },
    ],
    [leadCounts]
  );

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
      enabled: true,
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

  const StatCard = ({ icon: Icon, color, label, value, onClick }) => (
    <button onClick={onClick} className="relative group">
      <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-lg ${color} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">{label}</h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {value}
        </p>
      </div>
    </button>
  );

  StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onClick: PropTypes.func,
  };

  const LeadTypeCard = ({
    icon: Icon,
    color,
    label,
    value,
    onClick = () => {},
  }) => (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
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

  LeadTypeCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onClick: PropTypes.func,
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="md:ml-64 pt-20 md:pt-28 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Dashboard Overview
          </h1>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingButton isLoading={true} className="w-auto">
                Loading...
              </LoadingButton>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  icon={FiUsers}
                  color="bg-blue-600"
                  label="Total Leads"
                  value={stats.total}
                  onClick={() => navigate("/leads/all")}
                />
                <StatCard
                  icon={FiClock}
                  color="bg-green-600"
                  label="Today's Leads"
                  value={stats.today}
                  onClick={() => navigate("/leads/schedule/today")}
                />
                <StatCard
                  icon={FiClock}
                  color="bg-green-500"
                  label="Tomorrow's Leads"
                  value={stats.tomorrow}
                  onClick={() => navigate("/leads/schedule/tomorrow")}
                />
                <StatCard
                  icon={FiCalendar}
                  color="bg-purple-600"
                  label="Weekend Leads"
                  value={stats.weekend}
                  onClick={() => navigate("/leads/schedule/weekend")}
                />
                <StatCard
                  icon={FiAlertCircle}
                  color="bg-red-600"
                  label="Missed Leads"
                  value={stats.missed}
                  onClick={() => navigate("/leads/missed")}
                />
                <StatCard
                  icon={FiStar}
                  color="bg-yellow-600"
                  label="Favorite Leads"
                  value={stats.favorite}
                  onClick={() => navigate("/leads/favourite")}
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
                      Lead Potential
                    </h2>
                  </div>
                  <div className="pt-8">
                    <LeadTypeCard
                      icon={FiThermometer}
                      color="bg-red-500"
                      label="Hot Lead"
                      value={leadCounts.rejected}
                      onClick={() => navigate("/leads/potential/Hot")}
                    />
                    <LeadTypeCard
                      icon={FiSun}
                      color="bg-orange-500"
                      label="Warm Lead"
                      value={leadCounts.favourite}
                      onClick={() => navigate("/leads/potential/Warm")}
                    />
                    <LeadTypeCard
                      icon={FiCloud}
                      color="bg-blue-500"
                      label="Cold Lead"
                      value={leadCounts.siteVisited}
                      onClick={() => navigate("/leads/potential/Cold")}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
