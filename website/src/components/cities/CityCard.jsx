import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, TrendingUp, Plus, Sparkles, Compass } from 'lucide-react';
import './CityCard.css';

export default function CityCard({ city, showAddToTrip = false, onAddToTrip }) {
  return (
    <motion.div
      className="city-card glass-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="city-cover">
        <img
          src={city.image}
          alt={city.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=70'; }}
        />
        <div className="city-cover-overlay" />
        
        <div className="city-badge-top">
          <span className="badge badge-amber"><Sparkles size={11} /> {city.region || 'Top Destination'}</span>
        </div>

        <div className="city-info-overlay">
          <h3 className="city-name">{city.name}</h3>
          <div className="city-country">
            <MapPin size={13} color="#714B67" /> {city.country?.name || city.country}
          </div>
        </div>
      </div>

      <div className="city-content">
        {city.description && <p className="city-desc">{city.description}</p>}

        <div className="city-stats-row">
          <div className="city-stat-box">
            <DollarSign size={16} className="city-stat-icon" />
            <div>
              <span className="city-stat-val">${city.avgDailyBudget}/day</span>
              <span className="city-stat-lbl">Daily Cost</span>
            </div>
          </div>

          <div className="city-stat-box">
            <TrendingUp size={16} className="city-stat-icon amber" />
            <div>
              <span className="city-stat-val">{city.popularityScore || 95}%</span>
              <span className="city-stat-lbl">Rating</span>
            </div>
          </div>
        </div>

        <div className="cost-bar-wrap">
          <div className="cost-bar-header">
            <span>Cost Score</span>
            <span>{city.costIndex || 7}/10</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(city.costIndex || 7) * 10}%` }} />
          </div>
        </div>

        {city.tags?.length > 0 && (
          <div className="city-tags">
            {city.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="city-tag-chip">{tag}</span>
            ))}
          </div>
        )}

        {showAddToTrip && (
          <button className="btn btn-primary w-full btn-sm city-add-btn" onClick={() => onAddToTrip?.(city)}>
            <Plus size={15} /> Add to Itinerary
          </button>
        )}
      </div>
    </motion.div>
  );
}
