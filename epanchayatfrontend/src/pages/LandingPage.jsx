import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldAlert, BarChart3, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-bg py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6">
            e-Panchayat Citizen Issue Reporting System
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Empowering citizens to report local infrastructure problems directly through an interactive map. Your voice, our rapid response.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/map" className="px-8 py-3 rounded-md text-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors shadow-lg shadow-primary/30">
              Report Issue
            </Link>
            <Link to="/register" className="px-8 py-3 rounded-md text-lg font-bold bg-white text-primary border-2 border-primary hover:bg-primary-bg transition-colors shadow-lg">
              Register
            </Link>
            <Link to="/login" className="px-8 py-3 rounded-md text-lg font-bold text-gray-700 hover:text-primary transition-colors flex items-center justify-center">
              Login to Track
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Login / Register', desc: 'Create an account or login to access full features.' },
              { step: '2', title: 'Select Location', desc: 'Pinpoint the exact location of the issue on our GIS map.' },
              { step: '3', title: 'Submit Complaint', desc: 'Provide details and photos. The ward is auto-detected.' },
              { step: '4', title: 'Track Status', desc: 'Monitor the progress from Pending to Resolved in real-time.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Map-based Reporting</h3>
              <p className="text-gray-600 text-sm">Visual interface for pinpoint accuracy of reports.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <ShieldAlert className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Ward Management</h3>
              <p className="text-gray-600 text-sm">Automatic GIS routing of complaints to proper wards.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Complaint Tracking</h3>
              <p className="text-gray-600 text-sm">Complete lifecycle visibility for citizens and authorities.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Live Chatbot</h3>
              <p className="text-gray-600 text-sm">24/7 automated assistance and authority communication.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
