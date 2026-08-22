import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe } from 'lucide-react';
import api from '../../lib/api';
import CityCard from '../../components/cities/CityCard';
import './CitiesPage.css';

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Middle East', 'Africa', 'Oceania'];

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit: 24 };
        if (search) params.search = search;
        if (region !== 'All') params.region = region;
        const { data } = await api.get('/cities', { params });
        setCities(data.cities);
        setTotal(data.total);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setError(err.message || 'Failed to fetch cities');
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [search, region]);

  return (
    <div className="cities-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Globe size={32} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary)' }} />Explore Cities</h1>
          <p className="page-subtitle">{total} destinations waiting to be discovered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="cities-filters">
        <div className="search-bar" style={{ flex: 1, maxWidth: 480 }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search cities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="region-tabs">
          {REGIONS.map(r => (
            <button key={r} className={`tab-btn ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : error ? (
        <div className="empty-state error-state" style={{ border: '1px solid rgba(229, 57, 53, 0.2)', padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'rgba(229, 57, 53, 0.05)' }}>
          <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>Connection Error</div>
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Failed to Load Cities</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
            We couldn't connect to the backend server. If this is a deployed website, make sure your <strong>VITE_API_URL</strong> environment variable is correctly configured in your deployment settings (e.g. Vercel) to point to your deployed backend API URL instead of localhost.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', textAlign: 'left' }}>
            <strong>Attempted URL:</strong> {api.defaults.baseURL}/cities<br />
            <strong>Error Details:</strong> {error}
          </div>
        </div>
      ) : cities.length === 0 ? (
        <div className="empty-state">
          <Globe size={64} className="empty-icon" />
          <h3>No cities found</h3>
          <p>Try a different search or region</p>
        </div>
      ) : (
        <motion.div className="cities-grid-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.04 }}>
          {cities.map((city, i) => (
            <motion.div key={city._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CityCard city={city} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
