import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle, Activity, MapPin, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, Popup } from 'react-leaflet';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWard, setNewWard] = useState({ wardnumber: '', boundary: '' });
  const [wardSubmitStatus, setWardSubmitStatus] = useState('');
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [deletingWard, setDeletingWard] = useState(null);

  // Sub-component to track clicks
  const MapClickDrawer = () => {
    useMapEvents({
      click(e) {
        setDrawingPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    });
    return null;
  };

  useEffect(() => {
    if (drawingPoints.length > 2) {
      // GeoJSON requires longitude, latitude ordering
      const geoJsonCoords = drawingPoints.map(p => [p[1], p[0]]);
      // Close the polygon ring by pushing the first point to the end
      geoJsonCoords.push([...geoJsonCoords[0]]);
      
      const geoJsonBoundary = {
        type: "Polygon",
        coordinates: [geoJsonCoords]
      };
      
      setNewWard(prev => ({ ...prev, boundary: JSON.stringify(geoJsonBoundary, null, 2) }));
    } else {
      setNewWard(prev => ({ ...prev, boundary: '' }));
    }
  }, [drawingPoints]);

  const handleAddWard = async (e) => {
    e.preventDefault();
    setWardSubmitStatus('loading');
    try {
      const boundaryObj = JSON.parse(newWard.boundary);
      // Based on the Python signature: `def create_ward(db: Session, wardnumber: int, boundary: dict)`
      // FastAPI natively interprets scalar types (int) as Query Parameters and complex types (dict) as Body!
      await api.post(`/admin/wards?wardnumber=${newWard.wardnumber}`, boundaryObj);
      setWardSubmitStatus('success');
      setNewWard({ wardnumber: '', boundary: '' });
      setDrawingPoints([]);
      setTimeout(() => setWardSubmitStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setWardSubmitStatus('error');
      setTimeout(() => setWardSubmitStatus(''), 3000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/complaints/stats');
        setStats(statsRes.data);
        
        const complaintsRes = await api.get('/admin/complaints');
        setComplaints(complaintsRes.data);

        const wardsRes = await api.get('/admin/wards');
        if (wardsRes.data.features) {
          setWards(wardsRes.data.features);
        }
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/complaints/${id}/status`, { status: newStatus });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteWard = async (wardnumber) => {
    if (!window.confirm(`Are you sure you want to delete Ward ${wardnumber}? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingWard(wardnumber);
    try {
      await api.delete(`/admin/wards/number/${wardnumber}`);
      setWards(wards.filter(w => w.properties.wardnumber !== wardnumber));
      alert(`Ward ${wardnumber} deleted successfully!`);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to delete ward';
      alert(`Error: ${errorMsg}`);
      console.error(error);
    } finally {
      setDeletingWard(null);
    }
  };

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('500', '100')}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-10">Loading analytics...</div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total" value={stats.total} icon={<BarChart3 className="text-blue-600 h-6 w-6"/>} colorClass="text-blue-600" />
              <StatCard title="Pending" value={stats.pending} icon={<Clock className="text-red-600 h-6 w-6"/>} colorClass="text-red-600" />
              <StatCard title="In Progress" value={stats.inProgress} icon={<Activity className="text-orange-500 h-6 w-6"/>} colorClass="text-orange-500" />
              <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle className="text-green-600 h-6 w-6"/>} colorClass="text-green-600" />
            </div>

            {/* Create New Ward Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Register New Ward Boundary</h2>
              <p className="text-sm text-gray-600 mb-4">Click on the map to draw the boundary vertices. A minimum of 3 points is required.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Drawing Area */}
                <div className="lg:col-span-2 h-96 relative rounded-xl overflow-hidden border-2 border-primary-light z-0">
                  <MapContainer center={[9.46094, 76.43826]} zoom={14} className="h-full w-full">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapClickDrawer />
                    {drawingPoints.map((pt, idx) => (
                      <Marker key={idx} position={pt} icon={DefaultIcon}>
                        <Popup>Vertex {idx + 1}</Popup>
                      </Marker>
                    ))}
                    {drawingPoints.length > 2 && (
                      <Polygon positions={drawingPoints} pathOptions={{ color: '#2E7D32', fillColor: '#66BB6A', fillOpacity: 0.4 }} />
                    )}
                  </MapContainer>
                  <button 
                    type="button"
                    onClick={() => { setDrawingPoints([]); setNewWard(prev => ({ ...prev, boundary: '' })); }}
                    className="absolute top-4 right-4 z-[400] bg-white text-red-600 px-3 py-1 rounded-md shadow-md font-bold text-sm hover:bg-red-50"
                  >
                    Clear Map
                  </button>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleAddWard} className="space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                      <input 
                        type="number" 
                        required
                        value={newWard.wardnumber}
                        onChange={e => setNewWard({...newWard, wardnumber: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border"
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Generated GeoJSON</label>
                      <textarea 
                        required
                        readOnly
                        rows="8"
                        value={newWard.boundary}
                        className="w-full rounded-md border-gray-300 bg-gray-50 shadow-inner focus:outline-none text-xs font-mono px-3 py-2 border text-gray-500"
                        placeholder='Click the map 3 times to generate boundary JSON...'
                      />
                    </div>
                    {drawingPoints.length > 0 && drawingPoints.length < 3 && (
                      <p className="text-xs text-orange-600 mt-1 font-semibold">Click {3 - drawingPoints.length} more times to close structural ring</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {wardSubmitStatus === 'success' && <div className="text-sm text-green-600 font-medium p-2 bg-green-50 rounded-md">Ward registered successfully!</div>}
                    {wardSubmitStatus === 'error' && <div className="text-sm text-red-600 font-medium p-2 bg-red-50 rounded-md">Failed to register boundary. Check backend logs.</div>}
                    <button 
                      type="submit" 
                      disabled={wardSubmitStatus === 'loading' || drawingPoints.length < 3 || !newWard.wardnumber}
                      className="w-full py-3 bg-primary text-white rounded-md font-bold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {wardSubmitStatus === 'loading' ? 'Saving to Database...' : 'Register physical ward'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Complaints Management Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Manage Wards</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wards.length > 0 ? (
                      wards.map((ward) => (
                        <tr key={ward.properties.wardnumber} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Ward {ward.properties.wardnumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Polygon Boundary
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteWard(ward.properties.wardnumber)}
                              disabled={deletingWard === ward.properties.wardnumber}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingWard === ward.properties.wardnumber ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                          No wards registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complaints Management Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Recent Complaints</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{c.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.ward}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            c.status === 'Pending' ? 'bg-red-100 text-red-800' :
                            c.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select 
                            value={c.status}
                            onChange={(e) => updateStatus(c.id, e.target.value)}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
