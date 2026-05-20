import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaint/my_issues/');
        setComplaints(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('Failed to load complaints. Please try again.');
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Pending</span>;
      case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">In Progress</span>;
      case 'Resolved': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Complaints</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="mt-3 text-gray-500">Loading complaints...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 text-center">
            <p className="text-red-600 font-semibold mb-2">Unable to Load Complaints</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.wardnumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
