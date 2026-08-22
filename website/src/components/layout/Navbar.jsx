import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { getAvatarUrl } from '../../utils/avatarUtils';
import NotificationPopup from '../common/NotificationPopup';
import { 
  Globe, Home, Map, Users, BarChart3, User, 
  LogOut, Menu, X, Plus, Calendar, Compass, Bell, Settings, Sparkles, Shield
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
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          {/* Brand Logo */}
          <Link to="/dashboard" className="navbar-logo">
            <div className="logo-icon-wrapper">
              <img src="/logo.svg" alt="GlobeTrotter" className="logo-svg-img" />
            </div>
            <span className="logo-text">Globe<span className="logo-highlight">Trotter</span></span>
            <span className="badge badge-cyan logo-badge">PRO</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive && <motion.div layoutId="navIndicator" className="nav-active-pill" />}
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                <Shield size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="navbar-right">
            {/* Notification Bell */}
            <div className="notif-wrapper">
              <button 
                className={`nav-icon-btn ${notifOpen ? 'active' : ''}`} 
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                title="Notifications"
              >
                <Bell size={20} />
                <span className="notif-indicator" />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <NotificationPopup onClose={() => setNotifOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Plan Trip CTA */}
            <button className="btn btn-primary nav-plan-btn" onClick={() => navigate('/trips/create')}>
              <Plus size={18} />
              <span>Plan Trip</span>
            </button>

            {/* Profile Avatar & Dropdown */}
            <div className="profile-wrapper">
              <button 
                className={`profile-btn ${profileOpen ? 'active' : ''}`} 
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <img 
                  src={getAvatarUrl(user?.firstName, user?.lastName, user?.profilePhoto || user?.profileImage)}
                  alt={user?.firstName}
                  className="avatar avatar-sm profile-avatar-img"
                />
                <span className="profile-name">{user?.firstName || 'Traveler'}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <div className="dropdown-header">
                      <img
                        src={getAvatarUrl(user?.firstName, user?.lastName, user?.profilePhoto || user?.profileImage)}
                        alt={user?.firstName}
                        className="avatar avatar-md"
                      />
                      <div className="dropdown-user-info">
                        <p className="dropdown-name">{user?.firstName} {user?.lastName}</p>
                        <p className="dropdown-email">{user?.email}</p>
                        <span className="badge badge-amber dropdown-badge">
                          <Sparkles size={12} /> Globe Trotter Level 5
                        </span>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider" />
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/profile?tab=settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Settings size={16} /> Account Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-item" onClick={() => setProfileOpen(false)}>
                        <BarChart3 size={16} /> Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="dropdown-divider" />
                    
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
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
                  <Shield size={18} /> Admin Panel
                </Link>
              )}
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                <User size={18} /> Profile Settings
              </Link>
              <button className="mobile-nav-link danger" onClick={handleLogout}>
                <LogOut size={18} /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {(profileOpen || notifOpen) && (
        <div className="nav-backdrop" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </>
  );
}
