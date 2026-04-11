
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone_number: '',
    email: '',
    password: '',
    pincode: '',
    district: '',
    local_body_type: '',
    local_body_name: '',
    ward_number: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ward_number: parseInt(formData.ward_number)
      };

      await register(payload);
      navigate('/login');

    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.detail || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">

        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Citizen Registration
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullname"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone_number"
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                name="pincode"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                name="district"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ward Number
              </label>
              <input
                name="ward_number"
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.ward_number}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Body Type
              </label>
              <select
                name="local_body_type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                value={formData.local_body_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Panchayat">Panchayat</option>
                <option value="Municipality">Municipality</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Body Name
              </label>
              <input
                name="local_body_name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.local_body_name}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-white bg-blue-600 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;

