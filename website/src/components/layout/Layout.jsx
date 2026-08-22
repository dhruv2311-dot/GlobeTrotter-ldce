import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion as Motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <AnimatePresence mode="wait">
        <Motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ flex: 1, paddingBottom: '3rem' }}
        >
          <Outlet />
        </Motion.main>
      </AnimatePresence>

      <footer className="app-footer">
        <div className="app-footer-inner container">
          <div className="app-footer-divider" />
          <p>This platform provied by team dvlper21</p>
        </div>
      </footer>
    </div>
  );
}
