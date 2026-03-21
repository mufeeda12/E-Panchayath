import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Attempt to fetch full data from standard FastAPI /users/me endpoint
        const response = await api.get('/users/me'); 
        setProfileData(response.data);
      } catch (error) {
        console.warn('Could not fetch rich profile data from /users/me. Falling back to JWT payload.');
        // Fallback to minimal JWT payload data if backend endpoint doesn't exist
        setProfileData({
           email: user?.sub || 'Unknown',
           role: user?.role || 'USER',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen pt-20 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary px-8 py-10 text-center">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-4 text-primary">
              <User size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {profileData?.fullname || profileData?.email || 'Citizen Profile'}
            </h1>
            <p className="text-primary-bg mt-1 text-sm font-medium tracking-wide uppercase">
              {profileData?.role} ACCOUNT
            </p>
          </div>
          
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-primary"><Mail /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email / Username</p>
                  <p className="text-lg text-gray-900 font-medium">{profileData?.email || profileData?.username || profileData?.sub || 'Not Provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-primary"><Phone /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone Number</p>
                  <p className="text-lg text-gray-900 font-medium">{profileData?.phone_number || 'Not Provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-primary"><MapPin /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Location Info</p>
                  <p className="text-lg text-gray-900 font-medium">
                    {profileData?.district ? `${profileData.district}, Ward ${profileData.ward_number || ''}` : 'Not Provided'}
                  </p>
                  <p className="text-sm text-gray-500">{profileData?.local_body_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-primary"><Shield /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">System Role</p>
                  <p className="text-lg text-gray-900 font-medium">{profileData?.role || 'Citizen'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
