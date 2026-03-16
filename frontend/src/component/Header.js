import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="title">Gram Panchayat Portal</h1>
      <NavLink to="/login">
        <button className="login-btn">Login</button>
      </NavLink>
    </header>
  );
};

export default Header;
