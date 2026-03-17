// pages/About/About.jsx
import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h2> About</h2>
        <p>Digital Seva Portal – Gram Panchayat</p>
      </header>

      <section className="about-intro">
        <p>
          The Digital Seva Portal empowers citizens of a panchayat to register and track civic complaints directly with the Gram Panchayat. It promotes transparent and accountable local governance, ensuring every citizen’s voice is heard.
        </p>
      </section>

      <section className="section-box">
        <h3><i className="fas fa-lightbulb"></i> Key Features</h3>
        <ul>
          <li><i className="fas fa-map-marker-alt"></i> <strong>Location-Based Complaints:</strong>Pin exact complaint locations on the map for faster resolution.</li>
          <li><i className="fas fa-mobile-alt"></i> <strong>Mobile Friendly:</strong> Works seamlessly on smartphones, tablets, and desktops.</li>
          <li><i className="fas fa-users"></i> <strong>Citizen Empowerment:</strong> Direct channel between citizens and Panchayat officials.</li>
          <li><i className="fas fa-search"></i> <strong>Transparent Process:</strong> Track complaint status in real-time from submission to resolution.</li>
        </ul>
      </section>

      <section className="section-box">
        <h3><i className="fas fa-university"></i> Panchayat Information</h3>
        <p><i className="fas fa-home"></i> <strong>Panchayat Name:</strong> Gram Panchayat Pulincunnoo</p>
        <p><i className="fas fa-map"></i> <strong>District:</strong> Alappuzha, Kerala</p>
        <p><i className="fas fa-th-large"></i> <strong>Total Wards:</strong> 13 Wards</p>
        <p><i className="fas fa-users"></i> <strong>Population:</strong> ~15,200 Citizens</p>
      </section>
    </div>
  );
};

export default About;