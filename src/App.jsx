import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Clients from "./pages/clients";
import PieChart from "./components/dashboard";
import Agents from "./pages/agents";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen bg-gray-100 text-gray-900 ${
          darkMode ? "dark:bg-gray-900 dark:text-white" : "bg-white text-black"
        }`}
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
