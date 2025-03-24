import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PieChart from "./components/dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import AddLeads from "./pages/AddLeads";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NewLeads from "./pages/NewLeads";
import RejectedLeads from "./pages/RejectedLeads";
import MissedLeads from "./pages/missed";
import FavoriteLeads from "./pages/fav";
import Agents from "./pages/agents";
import UnderDevelopment from "./components/UnderDevelopment";

function App() {
  return (
    <div>
      <div className={"min-h-screen bg-gray-100 text-black"}>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
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
                      <Route path="/leads/favourite" element={<FavoriteLeads />} />
                      <Route path="/cp" element={<Agents />} />
                      <Route path="/leads/rejected" element={<RejectedLeads />} />
                      
                      {/* Lead Potential Routes */}
                      <Route path="/leads/potential/hot" element={<UnderDevelopment />} />
                      <Route path="/leads/potential/warm" element={<UnderDevelopment />} />
                      <Route path="/leads/potential/cold" element={<UnderDevelopment />} />
                      
                      {/* Lead Status Routes */}
                      <Route path="/leads/status/opened" element={<UnderDevelopment />} />
                      <Route path="/leads/status/in-progress" element={<UnderDevelopment />} />
                      <Route path="/leads/status/visit-scheduled" element={<UnderDevelopment />} />
                      <Route path="/leads/status/visited" element={<UnderDevelopment />} />
                      <Route path="/leads/status/closed" element={<UnderDevelopment />} />
                      
                      {/* Schedule Visits Routes */}
                      <Route path="/leads/schedule/today" element={<UnderDevelopment />} />
                      <Route path="/leads/schedule/tomorrow" element={<UnderDevelopment />} />
                      <Route path="/leads/schedule/weekend" element={<UnderDevelopment />} />
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
