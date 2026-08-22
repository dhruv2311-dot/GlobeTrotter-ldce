import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Map, MapPin, TrendingUp, Clock, Users, Compass, ArrowRight, Star, Globe } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import TripCard from '../../components/trips/TripCard';
import CityCard from '../../components/cities/CityCard';
import toast from 'react-hot-toast';
import './Dashboard.css';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&q=80',
];

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
  const [heroIdx] = useState(0);
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
        setTrips(tripsRes.data.trips);
        setCities(citiesRes.data.cities);
      } catch (err) {
        console.error('Dashboard fetching error:', err);
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentTrips = trips.slice(0, 3);
  const ongoingTrips = trips.filter((t) => t.status === 'ongoing');
  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');

  const stats = [
    { icon: <Map size={22} />, label: 'Total Trips', value: trips.length, color: 'primary' },
    { icon: <TrendingUp size={22} />, label: 'Ongoing', value: ongoingTrips.length, color: 'success' },
    { icon: <Clock size={22} />, label: 'Upcoming', value: upcomingTrips.length, color: 'accent' },
    { icon: <Compass size={22} />, label: 'Cities Visited', value: [...new Set(trips.flatMap(t => t.stops?.map(s => s.city) || []))].length, color: 'warning' },
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <section className="dashboard-hero">
        <img src={HERO_IMAGES[heroIdx]} alt="Travel" className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="hero-greeting">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.firstName} ✈️</p>
            <h1 className="hero-title">
              Where will you <span className="gradient-text">explore next?</span>
            </h1>
            <p className="hero-subtitle">Plan, organize, and share your dream itineraries</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
                <Plus size={20} /> Plan a Trip
              </button>
              <button className="btn btn-ghost btn-lg" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',color:'white'}} onClick={() => navigate('/cities')}>
                <Compass size={20} /> Explore Cities
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container dashboard-body">
        {error && (
          <div className="empty-state error-state" style={{ border: '1px solid rgba(229, 57, 53, 0.2)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(229, 57, 53, 0.05)', marginBottom: '2rem' }}>
            <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>Connection Error</div>
            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Failed to Load Dashboard Data</h3>
            <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
              The frontend application was unable to fetch trips and popular destinations from the backend server.
              If this site is deployed, please verify your frontend <strong>VITE_API_URL</strong> and backend CORS configurations (e.g. <strong>CLIENT_URL</strong>).
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', textAlign: 'left' }}>
              <strong>Base API URL:</strong> {api.defaults.baseURL}<br />
              <strong>Error Details:</strong> {error}
            </div>
          </div>
        )}

        {/* Stats */}
        {!error && (
          <motion.section variants={staggerParent} initial="initial" animate="animate" className="stats-section">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className={`stat-card stat-card-${stat.color}`}>
                <div className={`stat-icon stat-icon-${stat.color}`}>{stat.icon}</div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Recent Trips</h2>
                <p className="section-subtitle">Pick up where you left off</p>
              </div>
              <Link to="/trips" className="btn btn-ghost btn-sm">View All <ArrowRight size={16} /></Link>
            </div>
            <motion.div className="trips-grid" variants={staggerParent} initial="initial" animate="animate">
              {recentTrips.map((trip) => (
                <motion.div key={trip._id} variants={fadeUp}>
                  <TripCard trip={trip} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {trips.length === 0 && !loading && !error && (
          <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Globe size={64} className="empty-icon" />
            <h3>No trips yet!</h3>
            <p>Start planning your first adventure</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/create')}>
              <Plus size={20} /> Create Your First Trip
            </button>
          </motion.div>
        )}

        {/* Popular Cities Worldwide */}
        {cities.length > 0 && (
          <section className="dashboard-section popular-cities-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">🌍 Popular Cities Worldwide</h2>
                <p className="section-subtitle">Trending destinations loved by travelers around the globe</p>
              </div>
              <Link to="/cities" className="btn btn-ghost btn-sm">Explore All <ArrowRight size={16} /></Link>
            </div>

            {/* Featured top 2 cities */}
            <motion.div className="cities-featured-grid" variants={staggerParent} initial="initial" animate="animate">
              {cities.slice(0, 2).map((city, idx) => (
                <motion.div key={city._id} variants={fadeUp} className="featured-city-card glass-card" onClick={() => navigate(`/cities`)}>
                  <div className="featured-city-img">
                    <img src={city.image} alt={city.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'; }} />
                    <div className="featured-city-overlay" />
                    <div className="featured-city-rank">#{idx + 1}</div>
                    <div className="featured-city-info">
                      <h3>{city.name}</h3>
                      <p><MapPin size={14} /> {city.country}</p>
                      <p className="featured-city-desc">{city.description}</p>
                      <div className="featured-city-meta">
                        <span className="badge badge-accent">${city.avgDailyBudget}/day</span>
                        <span className="badge badge-primary">{'⭐'.repeat(Math.min(Math.round(city.popularityScore / 20), 5))}</span>
                        {city.bestTimeToVisit && <span className="badge badge-muted">Best: {city.bestTimeToVisit}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Remaining cities grid */}
            <motion.div className="cities-grid-popular" variants={staggerParent} initial="initial" animate="animate">
              {cities.slice(2).map((city, idx) => (
                <motion.div key={city._id} variants={fadeUp}>
                  <CityCard city={city} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Community CTA */}
        <motion.section className="community-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="cta-content">
            <Users size={40} className="cta-icon" />
            <h2>Join the Community</h2>
            <p>Discover and share travel itineraries with adventurers worldwide</p>
            <Link to="/community" className="btn btn-accent btn-lg">
              <Star size={18} /> Explore Community
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
