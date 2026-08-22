import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, TrendingUp, Plus } from 'lucide-react';
import './CityCard.css';

export default function CityCard({ city, showAddToTrip = false, onAddToTrip }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="city-card card"
      whileHover={{ scale: 1.02, translateY: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="city-cover">
        <img
          src={city.image}
          alt={city.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=60'; }}
        />
        <div className="city-cover-overlay" />
        <div className="city-info-overlay">
          <h3 className="city-name">{city.name}</h3>
          <div className="city-country">
            <MapPin size={12} /> {city.country}
          </div>
        </div>
      </div>

      <div className="city-content">
        {city.description && <p className="city-desc">{city.description}</p>}

        <div className="city-stats">
          <div className="city-stat">
            <DollarSign size={14} />
            <div>
              <span className="city-stat-value">${city.avgDailyBudget}/day</span>
              <span className="city-stat-label">Avg Budget</span>
            </div>
          </div>
          <div className="city-stat">
            <TrendingUp size={14} />
            <div>
              <span className="city-stat-value">{'⭐'.repeat(Math.min(Math.round(city.popularityScore / 20), 5))}</span>
              <span className="city-stat-label">Popularity</span>
            </div>
          </div>
        </div>

        <div className="city-meta">
          <div className="cost-bar">
            <span className="cost-label">Cost</span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${city.costIndex * 10}%` }} />
            </div>
            <span className="cost-value">{city.costIndex}/10</span>
          </div>
        </div>

        <div className="city-tags">
          {city.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>

        {showAddToTrip && (
          <button className="btn btn-primary w-full btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => onAddToTrip?.(city)}>
            <Plus size={14} /> Add to Trip
          </button>
        )}
      </div>
    </motion.div>
  );
}
