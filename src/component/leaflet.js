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
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "../styles/leaflet.css"; // new CSS file for overlays

/* Fix default marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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

  /* Draw created event */
  const handleCreated = (e) => {
    console.log("Shape created:", e);
  };

  const handleAddComplaint = () => {
    alert("Add Complaint clicked!");
    // Replace with modal or navigation logic
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
        <Marker position={clickedPos}>
          <Popup>
            Selected Location <br />
            Lat: {clickedPos.lat.toFixed(5)} <br />
            Lng: {clickedPos.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>

    {/* Permanent status legend overlay */}
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
  </div>
);

};

export default Leaflet;
