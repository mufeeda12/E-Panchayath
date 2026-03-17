import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  FeatureGroup,
  useMapEvents
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import "../styles/leaflet.css";
import ComplaintFormBox from "./ComplaintFormBox";

// Custom DivIcon using <i> tag (Font Awesome)
const customIcon = L.divIcon({
  html: '<i class="fa fa-map-marker" style="font-size:24px; color:red;"></i>',
  className: "custom-div-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});


/* Map Click Handler */
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

const Leaflet = () => {
  const position = [9.4628, 76.4422];
  const [clickedPos, setClickedPos] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreated = (e) => {
    console.log("Shape created:", e);
  };

  const handleAddComplaint = () => {
    setShowForm(true);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              marker: false,
              polyline: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>

        <MapClickHandler onClick={setClickedPos} />

        {clickedPos && (
          <Marker position={clickedPos} icon={customIcon}>
            <Popup>
              Selected Location <br />
              Lat: {clickedPos.lat.toFixed(5)} <br />
              Lng: {clickedPos.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Status legend overlay */}
      <div className="map-legend">
        <p>Status Legend</p>
        <ul>
          <li><span className="legend red"></span> Pending</li>
          <li><span className="legend yellow"></span> In Progress</li>
          <li><span className="legend green"></span> Resolved</li>
        </ul>
      </div>

      {/* Add Complaint button */}
      <button className="add-complaint-btn" onClick={handleAddComplaint}>
        +
      </button>

      {/* Complaint Form Box at bottom-right */}
      {showForm && clickedPos && (
        <div className="form-overlay-bottom">
          <ComplaintFormBox
            location={`${clickedPos.lat.toFixed(5)}, ${clickedPos.lng.toFixed(5)}`}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Leaflet;