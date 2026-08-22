import React from 'react';
import { Compass, Globe, Plane } from 'lucide-react';
import './Loader.css';

export const GlobeSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '64px',
    xl: '96px',
  };

  return (
    <div className={`globe-spinner-container size-${size}`}>
      <div className="globe-spinner-wrapper">
        <div className="globe-spinner-ring ring-1"></div>
        <div className="globe-spinner-ring ring-2"></div>
        <div className="globe-spinner-icon">
          <Globe size={size === 'sm' ? 18 : size === 'md' ? 28 : size === 'lg' ? 44 : 64} className="spinning-globe" />
        </div>
        <div className="orbiting-plane">
          <Plane size={14} className="plane-icon" />
        </div>
      </div>
      {text && <p className="globe-spinner-text">{text}</p>}
    </div>
  );
};

export const PageLoader = ({ message = 'Exploring destinations...' }) => {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-card">
        <img src="/logo.svg" alt="GlobeTrotter" className="page-loader-logo" />
        <GlobeSpinner size="lg" text="" />
        <h3 className="page-loader-title">{message}</h3>
        <p className="page-loader-subtitle">Preparing your luxury travel experience</p>
      </div>
    </div>
  );
};

export const ButtonSpinner = () => (
  <span className="btn-spinner">
    <Compass className="btn-spinner-icon" size={18} />
  </span>
);

export const SkeletonCard = ({ height = '220px', count = 1 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ height }}>
          <div className="skeleton-image"></div>
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-row">
              <div className="skeleton-pill"></div>
              <div className="skeleton-pill"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonTable = ({ rows = 4 }) => {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line flex-1"></div>
          <div className="skeleton-pill"></div>
          <div className="skeleton-pill"></div>
        </div>
      ))}
    </div>
  );
};
