import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Leaflet from "./component/leaflet";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/Homepage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MyComplaintsPage from "./pages/MyComplaintsPage/MyComplaintsPage";
import GuestProfile from "./pages/CitizenProfile/GuestProfile";

import "./styles/App.css";

import CitizenProfile from "./pages/CitizenProfile/CitizenProfile";
import HelpSupport from "./pages/HelpSupport/HelpSupport";
import About from "./pages/About/About";

// Separate component so useLocation works inside <Router>
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Close sidebar on every route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main layout */}
      <div className="main">
        {sidebarOpen && <Sidebar />}

        <div className="map">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<Leaflet />} />
            <Route path="/complaints" element={<MyComplaintsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/citizen/:id" element={<CitizenProfile />} />
            <Route path="/citizen/guest" element={<GuestProfile />} />
            <Route path="/support" element={<HelpSupport />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;