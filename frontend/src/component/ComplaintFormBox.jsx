// ComplaintFormBox.jsx
import React, { useState } from "react";
import "../styles/ComplaintFormBox.css";

const ComplaintFormBox = ({ onClose }) => {
  const [formData, setFormData] = useState({
    location: "9.4606, 76.4394",
    complaintType: "Road Damage",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://your-backend-api.com/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Complaint submitted successfully!");
        onClose(); // close modal after success
      } else {
        alert("Failed to submit complaint.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Register New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              readOnly
            />
          </label>

          <label>
            Complaint Type:
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
            >
              <option>Road Damage</option>
              <option>Water Supply</option>
              <option>Sanitation</option>
              <option>Electricity</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormBox;