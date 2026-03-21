import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MapDashboard = lazy(() => import('./pages/MapDashboard'));
const MyComplaints = lazy(() => import('./pages/MyComplaints'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MyProfile = lazy(() => import('./pages/MyProfile'));

// We also need a layout component that includes the Navbar and Footer
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

// Fallback empty component for pages before they are ready
const PlaceholderPage = ({title}) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h1 className="text-2xl text-gray-500 font-semibold">{title} Page Under Construction</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="map" element={<ProtectedRoute><MapDashboard /></ProtectedRoute>} />
          <Route path="my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
