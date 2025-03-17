import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PieChart from "./components/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import AddLeads from "./pages/AddLeads";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NewLeads from "./pages/NewLeads";

function App() {
  return (
    <div>
      <div className={"min-h-screen bg-gray-100 text-black"}>
        <Router>
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
