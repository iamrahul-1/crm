import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Clients from "./pages/clients";
import PieChart from "./components/piechart";
import Agents from "./pages/agents";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

function App() {
  return (
    <div>
      <div
        className={`min-h-screen bg-gray-100 text-gray-900
        `}
      >
        <Router>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<PieChart />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Setting />} />
            {/* Add other routes */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
