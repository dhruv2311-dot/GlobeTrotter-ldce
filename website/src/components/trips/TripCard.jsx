import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Edit, Trash2, Globe, Lock, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import './TripCard.css';

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();

  const statusBadge = {
    upcoming: { color: 'badge-amber', label: 'Upcoming' },
    ongoing: { color: 'badge-emerald', label: 'Ongoing' },
    completed: { color: 'badge-cyan', label: 'Completed' },
  }[trip.status] || { color: 'badge-cyan', label: trip.status || 'Active' };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await api.delete(`/trips/${trip.id || trip._id}`);
      toast.success('Trip deleted successfully');
      onDelete?.(trip.id || trip._id);
    } catch (err) {
      toast.error('Failed to delete trip');
    }
  };

  const formattedStart = trip.startDate ? format(new Date(trip.startDate), 'MMM d') : 'Flexible';
  const formattedEnd = trip.endDate ? format(new Date(trip.endDate), 'MMM d, yyyy') : '';

  return (
    <motion.div
      className="trip-card glass-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => navigate(`/trips/${trip.id || trip._id}`)}
    >
      {/* Cover Image */}
      <div className="trip-cover">
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=70'}
          alt={trip.tripName}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=70'; }}
        />
        <div className="trip-cover-overlay" />
        
        {/* Status and Visibility Badges */}
        <div className="trip-badges">
          <span className={`badge ${statusBadge.color}`}>{statusBadge.label}</span>
          {trip.isPublic ? (
            <span className="badge badge-cyan"><Globe size={11} /> Public</span>
          ) : (
            <span className="badge badge-violet"><Lock size={11} /> Private</span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="trip-actions-hover">
          <button 
            className="trip-action-btn edit" 
            onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id || trip._id}`); }}
            title="View & Edit Itinerary"
          >
            <Edit size={14} />
          </button>
          <button 
            className="trip-action-btn delete" 
            onClick={handleDelete}
            title="Delete Trip"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="trip-content">
        <h3 className="trip-name">{trip.tripName || trip.name}</h3>
        {trip.description && <p className="trip-desc">{trip.description}</p>}

        <div className="trip-meta-list">
          <div className="trip-meta-item">
            <Calendar size={15} className="meta-icon" />
            <span>{formattedStart} {formattedEnd ? `– ${formattedEnd}` : ''}</span>
          </div>
          {trip.stops?.length > 0 && (
            <div className="trip-meta-item">
              <MapPin size={15} className="meta-icon" />
              <span>{trip.stops.length} {trip.stops.length === 1 ? 'Destination Stop' : 'Destination Stops'}</span>
            </div>
          )}
        </div>

        <div className="trip-footer">
          <div className="trip-budget">
            <DollarSign size={15} />
            <span>${(trip.totalBudget || 0).toLocaleString()}</span>
          </div>
          <div className="trip-cities">
            {trip.stops?.slice(0, 2).map((s, i) => (
              <span key={i} className="city-chip">{s.city?.name || s.city}</span>
            ))}
            {trip.stops?.length > 2 && <span className="city-chip">+{trip.stops.length - 2} more</span>}
          </div>
        </div>
        <div className="trip-card-actions">
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id || trip._id}`); }}>
            View
          </button>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id || trip._id}/itinerary`); }}>
            Edit
          </button>
          <button className="btn btn-ghost btn-sm trip-delete-action" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
