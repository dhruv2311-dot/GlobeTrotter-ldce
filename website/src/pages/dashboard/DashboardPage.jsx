import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Map, MapPin, TrendingUp, Clock, Users, Compass, ArrowRight, Star, Globe, Sparkles, Calendar, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import TripCard from '../../components/trips/TripCard';
import CityCard from '../../components/cities/CityCard';
import { SkeletonCard } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './Dashboard.css';

const staggerParent = {
  animate: { transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripsRes, citiesRes] = await Promise.all([
          api.get('/trips?sortBy=createdAt&order=desc'),
          api.get('/cities?limit=10&sortBy=popularityScore'),
        ]);
        
        const tripsData = tripsRes.data.data?.trips || tripsRes.data.data || tripsRes.data.trips || [];
        const citiesData = citiesRes.data.data?.cities || citiesRes.data.data || citiesRes.data.cities || [];
        
        setTrips(Array.isArray(tripsData) ? tripsData.map((trip) => ({
          ...trip,
          tripName: trip.tripName || trip.name,
          totalBudget: trip.totalBudget ?? trip.budgetAmount ?? 0,
          isPublic: trip.isPublic ?? trip.visibility === 'PUBLIC',
          status: trip.status?.toLowerCase(),
        })) : []);
        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (err) {
        console.error('Dashboard fetching error:', err);
        setError(err.message || 'Failed to connect to backend server');
        setTrips([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cities?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const recentTrips = trips?.slice(0, 3) || [];
  const ongoingTrips = trips?.filter((t) => t.status === 'ongoing') || [];
  const upcomingTrips = trips?.filter((t) => t.status === 'upcoming') || [];
  const upcomingTrip = upcomingTrips[0];
  const plannedBudget = trips.reduce((total, trip) => total + (trip.totalBudget || 0), 0);
  const averageDailyBudget = upcomingTrip?.startDate && upcomingTrip?.endDate
    ? Math.round((upcomingTrip.totalBudget || 0) / Math.max(1, Math.ceil((new Date(upcomingTrip.endDate) - new Date(upcomingTrip.startDate)) / 86400000)))
    : 0;

  const stats = [
    { icon: <Map size={24} />, label: 'Total Trips', value: trips?.length || 0, color: 'cyan' },
    { icon: <TrendingUp size={24} />, label: 'Ongoing', value: ongoingTrips?.length || 0, color: 'emerald' },
    { icon: <Clock size={24} />, label: 'Upcoming', value: upcomingTrips?.length || 0, color: 'amber' },
    { icon: <Compass size={24} />, label: 'Cities Visited', value: [...new Set(trips?.flatMap(t => t.stops?.map(s => s.city?.name || s.city) || []) || [])].length, color: 'violet' },
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Header */}
      <section className="dashboard-hero">
        <img src="/world-map.svg" alt="" aria-hidden="true" className="hero-world-map" />
        <div className="hero-overlay" />
        
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge-pill">
              <Sparkles size={15} color="#714B67" />
              <span>Odoo Hackathon Premium Travel Suite</span>
            </div>

            <p className="hero-greeting">
              Welcome back, {user?.firstName || 'Traveler'} ✈️
            </p>
            <h1 className="hero-title">
              Ready for your next <span className="text-gradient-cyan">adventure?</span>
            </h1>
            <p className="hero-subtitle">Organize, customize, and share your dream travel itineraries seamlessly.</p>
            
            {/* Quick Destination Search */}
            <form onSubmit={handleSearchSubmit} className="hero-search-box">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Search cities, countries, or attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search <ArrowRight size={16} />
              </button>
            </form>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
                <Plus size={20} /> Plan New Trip
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/cities')}>
                <Compass size={20} /> Explore Destinations
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container dashboard-body">
        {upcomingTrip && (
          <section className="upcoming-trip-panel glass-card">
            <div>
              <span className="panel-eyebrow">Upcoming Trip</span>
              <h2>{upcomingTrip.tripName}</h2>
              <p>{upcomingTrip.stops?.map((stop) => stop.city?.name || stop.city).join(' → ') || 'Add destinations to your itinerary'}</p>
              <span className="upcoming-trip-date">
                {upcomingTrip.startDate ? new Date(upcomingTrip.startDate).toLocaleDateString() : 'Flexible'}
                {' – '}
                {upcomingTrip.endDate ? new Date(upcomingTrip.endDate).toLocaleDateString() : 'Flexible'}
              </span>
            </div>
            <div className="upcoming-trip-side">
              <strong>${(upcomingTrip.totalBudget || 0).toLocaleString()}</strong>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/trips/${upcomingTrip.id || upcomingTrip._id}/itinerary`)}>View Itinerary <ArrowRight size={15} /></button>
            </div>
          </section>
        )}

        {!loading && !error && (
          <section className="budget-highlight-grid">
            <div className="budget-highlight-card">
              <span className="panel-eyebrow">Budget Highlights</span>
              <strong>${plannedBudget.toLocaleString()}</strong>
              <span>Planned across all trips</span>
            </div>
            <div className="budget-highlight-card">
              <span className="panel-eyebrow">Next Trip Daily Average</span>
              <strong>${averageDailyBudget.toLocaleString()}</strong>
              <span>{upcomingTrip ? 'Estimated daily spend' : 'Create a trip to see this'}</span>
            </div>
          </section>
        )}

        {/* Connection Notice / Error state if backend fails */}
        {error && (
          <div className="empty-state error-state">
            <span className="badge badge-rose">Connection Status</span>
            <h3 style={{ color: 'var(--accent)', margin: '0.5rem 0' }}>Backend Server Offline or Disconnected</h3>
            <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', color: '#495057' }}>
              We could not reach the backend API. Please make sure the server process is active.
            </p>
          </div>
        )}

        {/* Stats Row */}
        {!error && (
          <motion.section 
            variants={staggerParent} 
            initial="initial" 
            animate="animate" 
            className="stats-section"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className={`dash-stat-card stat-${stat.color}`}>
                <div className={`dash-stat-icon icon-${stat.color}`}>{stat.icon}</div>
                <div className="dash-stat-info">
                  <div className="dash-stat-number">{stat.value}</div>
                  <div className="dash-stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* AI Trip Assistant Banner */}
        <motion.div 
          className="ai-banner glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="ai-banner-left">
            <div className="ai-banner-icon">
              <Sparkles size={28} />
            </div>
            <div>
              <h3>AI Itinerary Planner & Smart Recommender</h3>
              <p>Let AI craft customized daily activities, budget allocations, and optimal flight routes in seconds.</p>
            </div>
          </div>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/trips/create')}>
            <Sparkles size={18} /> Launch AI Builder
          </button>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ marginTop: '2rem' }}>
            <h2 className="section-title">Loading Your Dashboard...</h2>
            <SkeletonCard count={3} />
          </div>
        )}

        {/* Recent Trips Section */}
        {!loading && recentTrips.length > 0 && (
          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Recent Travel Plans</h2>
                <p className="section-subtitle">Resume your active and upcoming trips</p>
              </div>
              <Link to="/trips" className="btn btn-ghost btn-sm">
                View All Trips <ArrowRight size={16} />
              </Link>
            </div>
            <motion.div className="trips-grid" variants={staggerParent} initial="initial" animate="animate">
              {recentTrips.map((trip) => (
                <motion.div key={trip.id || trip._id} variants={fadeUp}>
                  <TripCard trip={trip} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Empty Trips State */}
        {!loading && trips.length === 0 && !error && (
          <motion.div className="dash-empty-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img src="/empty-trips.svg" alt="No Trips" className="dash-empty-img" />
            <h3>No Travel Itineraries Found</h3>
            <p>You haven't planned any trips yet. Create your first itinerary or let AI draft one for you!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
              <Plus size={20} /> Plan New Trip
            </button>
          </motion.div>
        )}

        {/* Popular Worldwide Destinations */}
        {!loading && cities.length > 0 && (
          <section className="dashboard-section popular-cities-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">🌍 Popular Destinations Worldwide</h2>
                <p className="section-subtitle">Handpicked cities with top ratings and budget insights</p>
              </div>
              <Link to="/cities" className="btn btn-ghost btn-sm">
                Explore All Cities <ArrowRight size={16} />
              </Link>
            </div>

            {/* Featured top 2 cities */}
            <motion.div className="cities-featured-grid" variants={staggerParent} initial="initial" animate="animate">
              {cities.slice(0, 2).map((city, idx) => (
                <motion.div key={city.id || city._id} variants={fadeUp} className="featured-city-card glass-card" onClick={() => navigate(`/cities`)}>
                  <div className="featured-city-img">
                    <img src={city.image} alt={city.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'; }} />
                    <div className="featured-city-overlay" />
                    <div className="featured-city-rank">#{idx + 1} Featured</div>
                    <div className="featured-city-info">
                      <h3>{city.name}</h3>
                      <p><MapPin size={14} /> {city.country?.name || city.country}</p>
                      <p className="featured-city-desc">{city.description}</p>
                      <div className="featured-city-meta">
                        <span className="badge badge-amber">${city.avgDailyBudget}/day</span>
                        <span className="badge badge-cyan">Popularity {city.popularityScore}%</span>
                        {city.bestTimeToVisit && <span className="badge badge-emerald">Best: {city.bestTimeToVisit}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Grid of other cities */}
            <motion.div className="cities-grid-popular" variants={staggerParent} initial="initial" animate="animate">
              {cities.slice(2).map((city) => (
                <motion.div key={city.id || city._id} variants={fadeUp}>
                  <CityCard city={city} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Community Banner */}
        <motion.section 
          className="community-cta glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="cta-content">
            <div className="cta-icon-wrap">
              <Users size={36} />
            </div>
            <h2>Join the Traveler Community</h2>
            <p>Connect with fellow adventurers, clone shared itineraries, and get authentic travel tips.</p>
            <Link to="/community" className="btn btn-accent btn-lg">
              <Star size={18} /> Browse Public Itineraries
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
