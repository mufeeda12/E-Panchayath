import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons based on status
const createStatusIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  Pending: createStatusIcon('red'),
  'In Progress': createStatusIcon('orange'),
  Resolved: createStatusIcon('green')
};

const MapClickComponent = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const FlyToComponent = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 16, { animate: true });
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ onLocationSelect, externalCenter, selectedLocation }) => {
  const [wards, setWards] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // Fetch Wards (GeoJSON) from backend
        try {
          const wardsRes = await api.get('/map/wards');
          console.log("Wards fetched from backend:", wardsRes.data);
          
          if (Array.isArray(wardsRes.data)) {
            // Transform whatever Pydantic/SQLAlchemy model array the backend returns
            // into a strict GeoJSON FeatureCollection that Leaflet demands.
            const features = wardsRes.data.map(ward => {
              if (ward.type === 'Feature') return ward;
              return {
                type: "Feature",
                properties: { ...ward, boundary: undefined, geometry: undefined },
                // Hunt for where the backend placed the GeoJSON geometry Dict
                geometry: ward.boundary || ward.geometry || ward
              };
            });
            setWards({ type: "FeatureCollection", features });
          } else {
            setWards(wardsRes.data);
          }
        } catch (err) {
          console.warn('Could not fetch wards geometry bounds');
        }
        
        // Fetch Complaints
        const complaintsRes = await api.get('/map/home');
        setComplaints(complaintsRes.data);
        
      } catch (error) {
        console.error("Error loading map data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  const getMarkerIcon = (status) => {
    return icons[status] || icons['Pending'];
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;

  return (
    <MapContainer center={[9.46094, 76.43826]} zoom={15} className="h-full w-full rounded-xl shadow-lg border-2 border-primary-light/50 z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <FlyToComponent center={externalCenter} />
      
      {wards && (
        <GeoJSON 
          key={`wards-${JSON.stringify(wards).slice(0, 50)}`} 
          data={wards} 
          style={{ color: '#2E7D32', weight: 2, fillOpacity: 0.1, interactive: false }}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const wardNumber = feature.properties.wardnumber ?? feature.properties.wardNo ?? feature.properties.ward_number ?? feature.properties.ward_no ?? feature.properties.name;
              const memberName = feature.properties.member_name || feature.properties.memberName || '';
              const memberPhone = feature.properties.member_phone || feature.properties.memberPhone || '';
              const tooltipText = `Ward ${wardNumber}${memberName ? ` · ${memberName}` : ''}`;

              layer.bindTooltip(tooltipText, { sticky: true, interactive: false });

              const popupContent = `
                <div style="font-size:14px; line-height:1.4;">
                  <strong>Ward ${wardNumber}</strong>
                  ${memberName ? `<div>Member: ${memberName}</div>` : ''}
                  ${memberPhone ? `<div>Phone: ${memberPhone}</div>` : ''}
                </div>
              `;
              layer.bindPopup(popupContent);
            }
          }}
        />
      )}

      {complaints.map(complaint => (
        <Marker 
          key={complaint.id} 
          position={[complaint.latitude, complaint.longitude]}
          icon={getMarkerIcon(complaint.status)}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm mb-1">{complaint.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{complaint.description}</p>
              <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-200">
                <span className="font-semibold px-2 py-1 rounded bg-gray-100">Ward: {complaint.wardnumber}</span>
                <span className={`font-semibold px-2 py-1 rounded ${
                  complaint.status === 'Pending' ? 'bg-red-100 text-red-700' :
                  complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedLocation && (
        <Marker 
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={DefaultIcon}
        >
          <Popup>Selected Location for New Complaint</Popup>
        </Marker>
      )}

      {onLocationSelect && <MapClickComponent onMapClick={onLocationSelect} />}
    </MapContainer>
  );
};

export default MapComponent;
