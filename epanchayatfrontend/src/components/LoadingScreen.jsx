import { MapPin } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-primary-bg flex flex-col items-center justify-center z-50">
      <div className="animate-bounce mb-4 flex items-center justify-center bg-primary rounded-full p-6 text-white shadow-xl">
        <MapPin size={48} />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">e-Panchayat System</h2>
      <p className="text-gray-600 animate-pulse">Loading Map Data and System Analytics...</p>
    </div>
  );
};

export default LoadingScreen;
