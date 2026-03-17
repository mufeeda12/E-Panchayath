import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("https://api.example.com/user/123")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const displayUser = user || { name: "Guest User" };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="portal-title">Gram Panchayat</h2>
        <h3 className="portal-subtitle">Digital Seva Portal</h3>
        <div className="user-box">
          <span>{displayUser.name}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/map">Map</NavLink></li>
          <li><NavLink to="/complaints">My Complaints</NavLink></li>
          <li><NavLink to={`/citizen/${user?.id || "guest"}`}>Profile</NavLink></li>
          <li><NavLink to="/support">Help & Support</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p>Powered by <strong>Digital India</strong></p>
      </div>
    </aside>
  );
};

export default Sidebar;
