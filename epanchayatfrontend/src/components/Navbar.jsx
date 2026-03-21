import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Map, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin' || user.is_admin || user.is_superuser);

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Map className="h-6 w-6" />
              e-Panchayat
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/map" className="hover:text-primary-bg transition-colors">Map Dashboard</Link>
            {token ? (
              <>
                {!isAdmin && (
                  <Link to="/my-complaints" className="hover:text-primary-bg transition-colors">My Complaints</Link>
                )}
                <Link to="/profile" className="hover:text-primary-bg transition-colors flex items-center gap-1"><User className="h-4 w-4"/> Profile</Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-primary-bg transition-colors">Admin</Link>
                )}
                <button onClick={logout} className="flex items-center gap-1 hover:text-red-300 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-bg transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-md font-semibold hover:bg-primary-bg transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
