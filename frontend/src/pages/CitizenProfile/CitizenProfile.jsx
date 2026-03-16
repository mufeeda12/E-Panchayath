// pages/CitizenProfile/CitizenProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CitizenProfile.css";

const CitizenProfile = () => {
  const { id } = useParams(); // grabs citizen ID from route
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your backend endpoint
    fetch(`https://your-api-server.com/api/citizens/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCitizen(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching citizen data:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!citizen) return <p>No data available.</p>;

  return (
    <div className="profile-card">
      <header className="profile-header">
        <h2>{citizen.name}</h2>
        <span className={`status ${citizen.status?.toLowerCase()}`}>
          {citizen.status}
        </span>
      </header>

      <section className="profile-info">
        <p><strong>Citizen ID:</strong> {citizen.id}</p>
        <p><strong>Village & Ward:</strong> {citizen.village}, Ward {citizen.ward}</p>
        <p><strong>Mobile:</strong> {citizen.mobile}</p>
      </section>

      <section className="complaints">
        <h3>Complaint Statistics</h3>
        <ul>
          <li>Total Complaints: {citizen.complaints?.total}</li>
          <li>Resolved: {citizen.complaints?.resolved}</li>
          <li>Pending: {citizen.complaints?.pending}</li>
          <li>In Progress: {citizen.complaints?.inProgress}</li>
        </ul>
      </section>

      <section className="actions">
        <button>Edit Profile Information</button>
        <button>Update Mobile Number</button>
      </section>
    </div>
  );
};

export default CitizenProfile;