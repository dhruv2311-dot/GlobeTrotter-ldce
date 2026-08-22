import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { 
  Globe, Home, Map, Search, Users, BarChart3, User, 
  LogOut, Menu, X, Plus, Calendar, Compass, Bell, Settings
} from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
  { to: '/trips', icon: <Map size={18} />, label: 'My Trips' },
  { to: '/cities', icon: <Compass size={18} />, label: 'Explore' },
  { to: '/community', icon: <Users size={18} />, label: 'Community' },
  { to: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          {/* Logo */}
          <Link to="/dashboard" className="navbar-logo">
            <div className="logo-icon">
              <Globe size={22} />
            </div>
            <span className="logo-text">Globe<span>Trotter</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                <BarChart3 size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/trips/create')}>
              <Plus size={16} />
              Plan Trip
            </button>

            {/* Profile dropdown */}
            <div className="profile-wrapper">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <img 
                  src={user?.profileImage} 
                  alt={user?.firstName}
                  className="avatar avatar-sm"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E88E5&color=fff`; }}
                />
                <span className="profile-name">{user?.firstName}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-header">
                      <img
                        src={user?.profileImage}
                        alt={user?.firstName}
                        className="avatar avatar-md"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E88E5&color=fff`; }}
                      />
                      <div>
                        <p className="dropdown-name">{user?.firstName} {user?.lastName}</p>
                        <p className="dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <hr className="divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/profile?tab=settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                        <BarChart3 size={16} /> Admin Panel
                      </Link>
                    )}
                    <hr className="divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                  <BarChart3 size={18} /> Admin
                </Link>
              )}
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                <User size={18} /> Profile
              </Link>
              <button className="mobile-nav-link danger" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {profileOpen && <div className="nav-backdrop" onClick={() => setProfileOpen(false)} />}
    </>
  );
}
