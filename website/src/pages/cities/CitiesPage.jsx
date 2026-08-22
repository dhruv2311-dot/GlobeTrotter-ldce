import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Compass, Sparkles, MapPin } from 'lucide-react';
import api from '../../lib/api';
import CityCard from '../../components/cities/CityCard';
import { SkeletonCard } from '../../components/common/Loader';
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
        const citiesData = data.data?.cities || data.data || data.cities || [];
        setCities(Array.isArray(citiesData) ? citiesData : []);
        setTotal(data.meta?.total || data.data?.total || data.total || citiesData.length);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setError(err.message || 'Failed to fetch cities');
        setCities([]);
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [search, region]);

  return (
    <div className="cities-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="page-header cities-header">
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={12} /> Global Destination Catalog
          </div>
          <h1 className="page-title">Explore Destinations 🌍</h1>
          <p className="page-subtitle">{total || 'Global'} destinations with budget insights, top spots & ratings</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="cities-filters glass-card">
        <div className="cities-search-bar">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by city name, country, or tag (e.g. Paris, Japan, beach)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="region-tabs">
          {REGIONS.map(r => (
            <button key={r} className={`region-tab ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <SkeletonCard count={8} />
        </div>
      ) : error ? (
        <div className="empty-state error-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="badge badge-rose">Connection Error</span>
          <h3 style={{ color: 'var(--accent)', margin: '0.75rem 0' }}>Failed to Load Cities</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: '#495057' }}>
            Verify your backend API service is operational.
          </p>
        </div>
      ) : (cities || []).length === 0 ? (
        <div className="empty-cities-card glass-card">
          <img src="/empty-cities.svg" alt="Empty" className="empty-cities-svg" />
          <h3>No Destinations Found</h3>
          <p>Try searching for a different city or changing the region filter.</p>
        </div>
      ) : (
        <motion.div 
          className="cities-grid-page" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.04 }}
        >
          {cities.map((city, i) => (
            <motion.div key={city.id || city._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CityCard city={city} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
