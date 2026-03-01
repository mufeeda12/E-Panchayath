import React from "react";
import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="title">Gram Panchayat Portal</h1>
      <button className="login-btn">Login</button>
    </header>
  );
};

export default Header;
