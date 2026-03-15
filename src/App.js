import React, { useState } from "react";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Leaflet from "./component/leaflet"; // your map component
import "./styles/App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <Leaflet />
        </div>
      </div>
    </div>
  );
}

export default App;
