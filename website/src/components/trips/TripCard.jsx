import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Eye, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import './TripCard.css';

export default function TripCard({ trip, onDelete, compact = false }) {
  const navigate = useNavigate();

  const statusColors = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'muted',
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${trip._id}`);
      toast.success('Trip deleted');
      onDelete?.(trip._id);
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  const totalActivities = trip.stops?.reduce((sum, s) => sum + (s.activities?.length || 0), 0) || 0;

  return (
    <motion.div
      className="trip-card card"
      whileHover={{ scale: 1.02, translateY: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/trips/${trip._id}`)}
    >
      {/* Cover Image */}
      <div className="trip-cover">
        <img
          src={trip.coverPhoto}
          alt={trip.tripName}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60'; }}
        />
        <div className="trip-cover-overlay" />
        <div className="trip-badges">
          <span className={`badge badge-${statusColors[trip.status]}`}>{trip.status}</span>
          {trip.isPublic ? <span className="badge badge-muted"><Globe size={10} /> Public</span>
            : <span className="badge badge-muted"><Lock size={10} /> Private</span>}
        </div>
        <div className="trip-actions-hover">
          <button className="btn btn-ghost btn-sm trip-action-btn" onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip._id}/edit`); }}>
            <Edit size={14} />
          </button>
          <button className="btn btn-danger btn-sm trip-action-btn" onClick={handleDelete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="trip-content">
        <h3 className="trip-name">{trip.tripName}</h3>
        {trip.description && <p className="trip-desc">{trip.description}</p>}

        <div className="trip-meta">
          <div className="trip-meta-item">
            <Calendar size={14} />
            <span>{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
          </div>
          {trip.stops?.length > 0 && (
            <div className="trip-meta-item">
              <MapPin size={14} />
              <span>{trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}</span>
            </div>
          )}
        </div>

        <div className="trip-footer">
          <div className="trip-budget">
            <DollarSign size={14} />
            <span>${(trip.totalBudget || 0).toLocaleString()}</span>
          </div>
          <div className="trip-cities">
            {trip.stops?.slice(0, 3).map((s, i) => (
              <span key={i} className="city-chip">{s.city}</span>
            ))}
            {trip.stops?.length > 3 && <span className="city-chip">+{trip.stops.length - 3}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
