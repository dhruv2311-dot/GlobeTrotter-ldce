import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Calendar, Map, Trash2, Eye, Edit, SlidersHorizontal } from 'lucide-react';
import api from '../../lib/api';
import TripCard from '../../components/trips/TripCard';
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
      if (activeTab !== 'all') params.status = activeTab;
      if (search) params.search = search;
      const { data } = await api.get('/trips', { params });
      setTrips(data.trips);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError(err.message || 'Failed to fetch trips');
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [activeTab, search]);

  const handleDelete = (id) => setTrips((prev) => prev.filter((t) => t._id !== id));

  return (
    <div className="trips-page container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">My Trips ✈️</h1>
          <p className="page-subtitle">Manage all your travel itineraries</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
          <Plus size={20} /> Plan New Trip
        </button>
      </div>

      {/* Search + Filter */}
      <div className="trips-toolbar">
        <div className="search-bar" style={{ flex: 1, maxWidth: '480px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs-row">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="tab-count">
                  {trips.filter(t => tab.key === 'all' || t.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          <p style={{ color: 'var(--text-secondary)' }}>Loading trips...</p>
        </div>
      ) : error ? (
        <div className="empty-state error-state" style={{ border: '1px solid rgba(229, 57, 53, 0.2)', padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(229, 57, 53, 0.05)' }}>
          <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>Connection Error</div>
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Failed to Load Your Trips</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
            We couldn't connect to the backend server to fetch your trips. Ensure your backend server is online, allows CORS, and that your <strong>VITE_API_URL</strong> is configured correctly on the hosting platform.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', textAlign: 'left' }}>
            <strong>Attempted URL:</strong> {api.defaults.baseURL}/trips<br />
            <strong>Error Details:</strong> {error}
          </div>
        </div>
      ) : trips.length === 0 ? (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Map size={64} className="empty-icon" />
          <h3>{search ? 'No trips found' : 'No trips yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Create your first travel itinerary'}</p>
          {!search && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
              <Plus size={20} /> Create Trip
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
            <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <TripCard trip={trip} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
