import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import { AlertCircle, PlusCircle, X, LocateFixed } from 'lucide-react';
import api from '../services/api';

const MapDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formParams, setFormParams] = useState({ title: '', description: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
        setSelectedLocation(latlng);
        setMapCenter(latlng);
      },
      (error) => {
        alert("Unable to retrieve your location. Please ensure location services are enabled.");
      }
    );
  };

  const handleOpenForm = () => {
    if (!selectedLocation) {
      alert("Please select a location on the map first");
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      await api.post('/complaint/', { 
        ...formParams, 
        latitude: selectedLocation.lat, 
        longitude: selectedLocation.lng 
      });
      setSubmitStatus('success');
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
        setFormParams({ title: '', description: '' });
        setSelectedLocation(null);
      }, 2000);
    } catch (error) {
      console.error('Complaint submission error:', error);
      // Check if it's an auth error
      if (error.response?.status === 401) {
        setSubmitStatus(null);
        // The API interceptor will handle redirect to login
      } else {
        setSubmitStatus('error');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row relative bg-gray-50">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white shadow-xl z-10 hidden md:flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Issue Map</h2>
          <p className="text-sm text-gray-500">
            Click on the map to pinpoint an issue location, or use your current location.
          </p>
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          {selectedLocation ? (
            <div className="bg-primary-bg rounded-lg p-4 border border-primary-light/30 mb-4 animate-fade-in text-sm">
              <p className="font-semibold text-primary mb-1">Selected Coordinates:</p>
              <p className="text-gray-700 font-mono text-xs">Lat: {selectedLocation.lat.toFixed(5)}</p>
              <p className="text-gray-700 font-mono text-xs">Lng: {selectedLocation.lng.toFixed(5)}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 border-dashed mb-4 flex items-center justify-center text-center h-24">
              <span className="text-gray-400 text-sm">No location selected</span>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={handleGetCurrentLocation}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary-bg transition-colors"
            >
              <LocateFixed className="h-4 w-4" />
              Use My Location
            </button>

            <button 
              onClick={handleOpenForm}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                selectedLocation 
                  ? 'bg-primary text-white hover:bg-primary-light shadow-md shadow-primary/20 hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              Report Issue Here
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-600"></span><span className="text-sm text-gray-600">Pending</span></div>
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span className="text-sm text-gray-600">In Progress</span></div>
              <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-600"></span><span className="text-sm text-gray-600">Resolved</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-grow h-full p-2 md:p-4">
        <MapComponent onLocationSelect={handleLocationSelect} externalCenter={mapCenter} selectedLocation={selectedLocation} />
      </div>

      {/* Mobile Report Button Overlay */}
      <div className="md:hidden absolute bottom-6 right-6 flex flex-col gap-3 z-[1000]">
        <button 
          onClick={handleGetCurrentLocation}
          className="p-4 rounded-full bg-white text-primary shadow-xl border border-gray-100"
        >
          <LocateFixed className="h-6 w-6" />
        </button>
      </div>
      
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
         <button 
            onClick={handleOpenForm}
            className={`px-6 py-3 rounded-full font-bold flex items-center shadow-2xl gap-2 transition-all ${
              selectedLocation 
                ? 'bg-primary text-white scale-110' 
                : 'bg-gray-800/80 text-white backdrop-blur-sm'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            {selectedLocation ? 'Report Here' : 'Select Location'}
          </button>
      </div>

      {/* Complaint Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold tracking-wide flex items-center gap-2">
                <PlusCircle className="h-5 w-5"/> New Complaint
              </h3>
              <button onClick={() => setShowForm(false)} className="hover:text-primary-bg transition-colors">
                <X className="h-6 w-6"/>
              </button>
            </div>
            
            <div className="p-6">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Complaint Submitted!</h4>
                  <p className="text-gray-500 text-sm">Authorities have been notified and it is assigned to the ward.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g., Large pothole on Main St"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                      value={formParams.title}
                      onChange={e => setFormParams({...formParams, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      required
                      rows="4"
                      placeholder="Provide detailed description..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
                      value={formParams.description}
                      onChange={e => setFormParams({...formParams, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-500 font-mono">
                    Location: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                  </div>
                  
                   {submitStatus === 'error' && (
                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                       <p className="font-semibold mb-1">Failed to Submit</p>
                       <p>Please try again. If the problem persists, please log in again.</p>
                     </div>
                   )}
                  
                  <button 
                    type="submit" 
                    disabled={submitStatus === 'loading'}
                    className="w-full py-3 mt-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-light transition-colors disabled:opacity-50"
                  >
                    {submitStatus === 'loading' ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapDashboard;
