import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Leaflet from "./component/leaflet";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MyComplaintsPage from "./pages/MyComplaintsPage/MyComplaintsPage";

import "./styles/App.css";

import CitizenProfile from "./pages/CitizenProfile/CitizenProfile";
import HelpSupport from "./pages/HelpSupport/HelpSupport";
import About from "./pages/About/About";

// inside <Routes>
// inside <Routes>

// inside <Routes> in App.js


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main layout */}
        <div className="main">
          {sidebarOpen && <Sidebar />}

          <div className="map">
            <Routes>
              {/* Home (Map) */}
              <Route path="/" element={<Leaflet />} />

              {/* Complaint page */}
              <Route path="/complaints" element={<MyComplaintsPage />} />

              {/* Auth pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/citizen/:id" element={<CitizenProfile />} />
              <Route path="/support" element={<HelpSupport />} />
              <Route path="/about" element={<About />} />



            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;