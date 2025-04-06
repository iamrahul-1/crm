import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PieChart from "./components/dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import AddLeads from "./components/AddLeads";
import AddAgent from "./components/AddAgent";
import Leads from "./pages/Leads";
import Login2 from "./pages/Login2";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NewLeads from "./pages/NewLeads";
import RejectedLeads from "./pages/RejectedLeads";
import MissedLeads from "./pages/missed";
import FavoriteLeads from "./pages/fav";
import Agents from "./pages/Cp";
import UnderDevelopment from "./components/UnderDevelopment";
import LeadPotential from "./pages/LeadPotential";
import LeadStatus from "./pages/LeadStatus";

function App() {
  return (
    <div>
      <div className={"min-h-screen bg-gray-100 text-black"}>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
          />
          <Routes>
            <Route path="/login" element={<Login2 />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<PieChart />} />
                      <Route path="/leads/add" element={<AddLeads />} />
                      <Route path="/leads/all" element={<Leads />} />
                      <Route path="/leads/new" element={<NewLeads />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Setting />} />
                      <Route path="/leads/missed" element={<MissedLeads />} />
                      <Route
                        path="/leads/favourite"
                        element={<FavoriteLeads />}
                      />
                      <Route path="/cp" element={<Agents />} />
                      <Route
                        path="/leads/rejected"
                        element={<RejectedLeads />}
                      />
                      <Route path="/cp/add" element={<AddAgent />} />

                      {/* Lead Potential Routes */}
                      <Route
                        path="/leads/potential/hot"
                        element={<LeadPotential potential="Hot" />}
                      />
                      <Route
                        path="/leads/potential/warm"
                        element={<LeadPotential potential="Warm" />}
                      />
                      <Route
                        path="/leads/potential/cold"
                        element={<LeadPotential potential="Cold" />}
                      />

                      {/* Lead Status Routes */}
                      <Route
                        path="/leads/status/open"
                        element={<LeadStatus status="open" />}
                      />
                      <Route
                        path="/leads/status/in-progress"
                        element={<LeadStatus status="inprogress" />}
                      />
                      <Route
                        path="/leads/status/visit-scheduled"
                        element={<LeadStatus status="sitevisitscheduled" />}
                      />
                      <Route
                        path="/leads/status/visited"
                        element={<LeadStatus status="sitevisited" />}
                      />
                      <Route
                        path="/leads/status/closed"
                        element={<LeadStatus status="closed" />}
                      />
                      <Route
                        path="/leads/status/rejected"
                        element={<LeadStatus status="rejected" />}
                      />
                      <Route
                        path="/leads/status/missed"
                        element={<LeadStatus status="missed" />}
                      />
                      <Route
                        path="/leads/status/new"
                        element={<LeadStatus status="new" />}
                      />

                      {/* Schedule Visits Routes */}
                      <Route
                        path="/leads/schedule/today"
                        element={<UnderDevelopment />}
                      />
                      <Route
                        path="/leads/schedule/tomorrow"
                        element={<UnderDevelopment />}
                      />
                      <Route
                        path="/leads/schedule/weekend"
                        element={<UnderDevelopment />}
                      />
                    </Routes>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
