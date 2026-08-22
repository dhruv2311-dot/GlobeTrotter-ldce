import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Map, Sparkles, Filter, Calendar } from 'lucide-react';
import api from '../../lib/api';
import TripCard from '../../components/trips/TripCard';
import { SkeletonCard } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './TripsPage.css';

const TABS = [
  { key: 'all', label: 'All Trips' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

export default function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab.toUpperCase();
      if (search) params.search = search;
      const { data } = await api.get('/trips', { params });
      const tripsData = data.data?.trips || data.data || data.trips || [];
      setTrips(Array.isArray(tripsData) ? tripsData.map((trip) => ({
        ...trip,
        tripName: trip.tripName || trip.name,
        totalBudget: trip.totalBudget ?? trip.budgetAmount ?? 0,
        isPublic: trip.isPublic ?? trip.visibility === 'PUBLIC',
        status: trip.status?.toLowerCase(),
      })) : []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError(err.message || 'Failed to fetch trips');
      toast.error('Failed to load trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [activeTab, search]);

  const handleDelete = (id) => setTrips((prev) => prev.filter((t) => (t.id || t._id) !== id));

  return (
    <div className="trips-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="page-header trips-page-header">
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={12} /> Itinerary Manager
          </div>
          <h1 className="page-title">My Travel Journeys ✈️</h1>
          <p className="page-subtitle">Manage, customize, and share all your adventure itineraries</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
          <Plus size={20} /> Plan New Trip
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="trips-toolbar glass-card">
        <div className="trips-search-bar">
          <Search size={18} className="search-bar-icon" />
          <input
            placeholder="Search trips by destination, name, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="trips-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`trips-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <SkeletonCard count={6} />
        </div>
      ) : error ? (
        <div className="empty-state error-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="badge badge-rose">API Error</span>
          <h3 style={{ color: 'var(--accent)', margin: '0.75rem 0' }}>Failed to Load Your Trips</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: '#495057' }}>
            Please check your server connection and environment parameters.
          </p>
        </div>
      ) : trips.length === 0 ? (
        <motion.div className="empty-trips-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <img src="/empty-trips.svg" alt="No Trips" className="empty-trips-svg" />
          <h3>{search ? 'No Matching Trips Found' : 'No Trips Created Yet'}</h3>
          <p>{search ? 'Try adjusting your search criteria or filters.' : 'Get started by creating your very first travel itinerary!'}</p>
          {!search && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
              <Plus size={20} /> Create Your First Trip
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="trips-grid-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.06 }}
        >
          {trips.map((trip, i) => (
            <motion.div key={trip.id || trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <TripCard trip={trip} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
