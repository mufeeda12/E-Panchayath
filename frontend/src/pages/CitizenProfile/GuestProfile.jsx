import React from "react";
import { Link } from "react-router-dom";
import "./CitizenProfile.css";

const GuestProfile = () => {
  return (
    <div className="profile-card">
      <header className="profile-header">
        <h2>Guest User</h2>
        <span className="status pending">Unregistered</span>
      </header>

      <section className="profile-info" style={{ textAlign: "center", padding: "2rem" }}>
        <h3>Unlock Digital Seva Portal Services</h3>
        <p style={{ margin: "1rem 0" }}>
          You are currently browsing as a guest. To access personalized services, 
          track your complaints, and manage your citizen profile, please register 
          or log in to your account.
        </p>
      </section>

      <section className="actions" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button style={{ background: "#2e7d32", color: "white", cursor: "pointer" }}>Register Now</button>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button style={{ background: "#ffffff", color: "#2e7d32", border: "1px solid #2e7d32", cursor: "pointer" }}>Login to Account</button>
        </Link>
      </section>
    </div>
  );
};

export default GuestProfile;
