import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate('/');          // always return to public home after logout
  };

  /**
   * Render the right-side auth section of the navbar.
   *
   * During the initial token-validation request (loading === true) we render
   * nothing in the auth slot.  This prevents any flash of "Admin User /
   * Logout" on cold page loads while the server check is in flight.
   *
   * Guest       → Login  +  Register
   * Logged-in User  → Dashboard  +  Profile (name)  +  Logout
   * Logged-in Admin → Dashboard  +  Admin Dashboard  +  name  +  Logout
   */
  const renderDesktopAuth = () => {
    if (loading) return null; // no flash while validating token

    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
          >
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Register
          </Link>
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-gray-700 font-medium">
              <FaUserShield className="text-primary-600" />
              <span>{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </>
      );
    }

    // Regular user
    return (
      <>
        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-primary-600 transition-colors"
        >
          Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className="flex items-center space-x-1.5 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <FaUser />
            <span>{user.name}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-red-600 hover:text-red-700 transition-colors font-medium"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </>
    );
  };

  const renderMobileAuth = () => {
    if (loading) return null;

    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
            onClick={closeMobile}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
            onClick={closeMobile}
          >
            Register
          </Link>
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
            onClick={closeMobile}
          >
            Dashboard
          </Link>
          <span className="block text-gray-500 text-sm py-1 font-medium">
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-600 hover:text-red-700 transition-colors py-1"
          >
            Logout
          </button>
        </>
      );
    }

    // Regular user
    return (
      <>
        <Link
          to="/dashboard"
          className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
          onClick={closeMobile}
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
          onClick={closeMobile}
        >
          Profile
        </Link>
        <span className="block text-gray-500 text-sm py-1 font-medium">
          {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="block w-full text-left text-red-600 hover:text-red-700 transition-colors py-1"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaCalendarAlt className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">Smart Event</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-primary-600 transition-colors">
              Events
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
            {renderDesktopAuth()}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
              onClick={closeMobile}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
              onClick={closeMobile}
            >
              Events
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
              onClick={closeMobile}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
              onClick={closeMobile}
            >
              Contact
            </Link>
            {renderMobileAuth()}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
