import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Clock, CheckCircle, Activity, MapPin, Trash2, Edit2 } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, Popup, GeoJSON } from 'react-leaflet';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, by_ward: [] });
  const [complaints, setComplaints] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWard, setNewWard] = useState({ wardnumber: '', boundary: '', member_name: '', member_phone: '' });
  const [wardSubmitStatus, setWardSubmitStatus] = useState('');
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [deletingWard, setDeletingWard] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [filterWard, setFilterWard] = useState('');

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
      const encodedMemberName = encodeURIComponent(newWard.member_name);
      const encodedMemberPhone = encodeURIComponent(newWard.member_phone);
      const queryString = `?member_name=${encodedMemberName}&member_phone=${encodedMemberPhone}`;

      if (editMode) {
        await api.put(`/admin/wards/number/${newWard.wardnumber}${queryString}`, boundaryObj);
      } else {
        await api.post(`/admin/wards?wardnumber=${newWard.wardnumber}${queryString}`, boundaryObj);
      }
      setWardSubmitStatus('success');
      setNewWard({ wardnumber: '', boundary: '', member_name: '', member_phone: '' });
      setDrawingPoints([]);
      setEditMode(false);
      
      const wardsRes = await api.get('/admin/wards');
      if (wardsRes.data.features) setWards(wardsRes.data.features);
      
      setTimeout(() => setWardSubmitStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setWardSubmitStatus('error');
      setTimeout(() => setWardSubmitStatus(''), 3000);
    }
  };

  const handleEditWard = (ward) => {
    const coords = ward.geometry.coordinates[0];
    const latlngs = coords.slice(0, -1).map(c => [c[1], c[0]]);
    setNewWard({
      wardnumber: ward.properties.wardnumber,
      boundary: '',
      member_name: ward.properties.member_name || '',
      member_phone: ward.properties.member_phone || ''
    });
    setDrawingPoints(latlngs);
    setEditMode(true);
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

  const updatePriority = async (id, newPriority) => {
    try {
      await api.patch(`/admin/complaints/${id}/priority?priority=${newPriority}`);
      setComplaints(complaints.map(c => c.id === id ? { ...c, priority: newPriority } : c));
    } catch (error) {
      alert("Failed to update priority");
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
  
  const filteredComplaints = useMemo(() => {
    if (!filterWard) return complaints;
    return complaints.filter(c => c.wardnumber?.toString() === filterWard.toString());
  }, [complaints, filterWard]);

  const bestWard = stats.by_ward && stats.by_ward.length > 0 
      ? stats.by_ward.reduce((max, w) => (w.resolved > max.resolved ? w : max), stats.by_ward[0])
      : null;

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

            {/* Ward Resolution Charts */}
            {stats.by_ward && stats.by_ward.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Ward Resolution Comparison</h2>
                {bestWard && bestWard.resolved > 0 && (
                  <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg font-semibold border border-green-200 shadow-sm flex items-center gap-2">
                    🏆 Best Performing Ward: Ward {bestWard.wardnumber} with {bestWard.resolved} resolved issues!
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.by_ward}
                        dataKey="resolved"
                        nameKey="wardnumber"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={entry => `Ward ${entry.wardnumber}: ${entry.resolved}`}
                      >
                        {stats.by_ward.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value, name) => [`${value} Resolved`, `Ward ${name}`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.by_ward} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="wardnumber" tickFormatter={(v) => `Ward ${v}`} />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="pending" stackId="a" fill="#EF4444" name="Pending" />
                      <Bar dataKey="in_progress" stackId="a" fill="#F97316" name="In Progress" />
                      <Bar dataKey="resolved" stackId="a" fill="#10B981" name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Create / Edit Ward Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{editMode ? 'Edit' : 'Register New'} Ward Boundary</h2>
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
                    {wards.map((ward, idx) => (
                      <GeoJSON 
                        key={`ward-${ward.properties.wardnumber}-${idx}`} 
                        data={ward} 
                        style={() => ({
                          color: '#1976D2',
                          fillColor: '#64B5F6',
                          weight: 2,
                          fillOpacity: 0.3
                        })}
                        onEachFeature={(feature, layer) => {
                          const wardStat = stats.by_ward?.find(w => w.wardnumber === feature.properties.wardnumber);
                          const totalComplaints = wardStat ? wardStat.total : 0;
                          layer.bindTooltip(`Ward ${feature.properties.wardnumber} - ${totalComplaints} Complaints`, { sticky: true });
                          layer.bindPopup(`Existing Ward ${feature.properties.wardnumber}`);
                        }}
                      />
                    ))}
                  </MapContainer>
                  <button 
                    type="button"
                    onClick={() => { setDrawingPoints([]); setNewWard(prev => ({ ...prev, boundary: '' })); setEditMode(false); }}
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
                        disabled={editMode}
                        value={newWard.wardnumber}
                        onChange={e => setNewWard({...newWard, wardnumber: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border disabled:opacity-50"
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Member Name</label>
                      <input
                        type="text"
                        required
                        value={newWard.member_name}
                        onChange={e => setNewWard({...newWard, member_name: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Member Phone</label>
                      <input
                        type="tel"
                        required
                        value={newWard.member_phone}
                        onChange={e => setNewWard({...newWard, member_phone: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border"
                        placeholder="e.g. +911234567890"
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
                        placeholder='Click the map 3 times to generate boundary...'
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {wardSubmitStatus === 'success' && <div className="text-sm text-green-600 font-medium p-2 bg-green-50 rounded-md">Ward {editMode ? 'updated' : 'registered'} successfully!</div>}
                    <button 
                      type="submit" 
                      disabled={wardSubmitStatus === 'loading' || drawingPoints.length < 3 || !newWard.wardnumber}
                      className="w-full py-3 bg-primary text-white rounded-md font-bold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {wardSubmitStatus === 'loading' ? 'Saving...' : editMode ? 'Update Ward Boundary' : 'Register physical ward'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Manage Wards Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Manage Wards</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wards.map((ward) => (
                      <tr key={ward.properties.wardnumber} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ward {ward.properties.wardnumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ward.properties.member_name || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ward.properties.member_phone || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Polygon Boundary</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                          <button
                            onClick={() => handleEditWard(ward)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm"
                          >
                            <Edit2 className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteWard(ward.properties.wardnumber)}
                            disabled={deletingWard === ward.properties.wardnumber}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 font-medium text-sm"
                          >
                            <Trash2 className="h-4 w-4" /> {deletingWard === ward.properties.wardnumber ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manage Complaints Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-lg font-bold text-gray-800">Recent Complaints</h2>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Filter Ward:</label>
                  <select 
                    value={filterWard} 
                    onChange={e => setFilterWard(e.target.value)} 
                    className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary text-sm p-2 w-32 border"
                  >
                    <option value="">All Wards</option>
                    {stats.by_ward?.map(w => (
                      <option key={w.wardnumber} value={w.wardnumber}>Ward {w.wardnumber}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComplaints.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-6 text-gray-500">No complaints match.</td></tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{c.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.wardnumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select 
                              value={c.priority || 'Low'}
                              onChange={(e) => updatePriority(c.id, e.target.value)}
                              className={`text-sm rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 font-bold border px-2 py-1 ${
                                c.priority === 'High' ? 'text-red-700 bg-red-50 border-red-200' :
                                c.priority === 'Medium' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                                'text-green-700 bg-green-50 border-green-200'
                              }`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select 
                              value={c.status}
                              onChange={(e) => updateStatus(c.id, e.target.value)}
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary py-1 px-2 border"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
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
