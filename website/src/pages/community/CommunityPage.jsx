import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Heart, MessageSquare, Globe2, Copy, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './CommunityPage.css';

export default function CommunityPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      const { data } = await api.get('/community/posts', { params });
      const postsData = data.data?.items || data.data?.posts || data.data || data.items || data.posts || [];
      setTrips(Array.isArray(postsData) ? postsData : []);
      setTotalPages(data.meta?.totalPages || data.data?.meta?.totalPages || data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
      setError(err.message || 'Failed to fetch community posts');
      setTrips([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [search, page]);

  return (
    <div className="community-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div className="community-hero glass-card">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={12} /> Global Traveler Network
          </div>
          <h1 className="page-title">Community Travel Hub 🌍</h1>
          <p className="page-subtitle">Discover authentic travel itineraries & insider destination guides shared by real travelers</p>
        </motion.div>
        
        <div className="community-search-box">
          <Search size={18} className="search-icon" />
          <input 
            placeholder="Search community posts, places, or travel stories..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
          />
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <SkeletonCard count={6} />
        </div>
      ) : error ? (
        <div className="empty-state error-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="badge badge-rose">Connection Error</span>
          <h3 style={{ color: 'var(--accent)', margin: '0.75rem 0' }}>Failed to Load Community Hub</h3>
          <p style={{ maxWidth: '550px', margin: '0 auto 1.5rem', color: '#495057' }}>
            Backend API is unavailable.
          </p>
        </div>
      ) : trips.length === 0 ? (
        <div className="empty-community-card glass-card">
          <img src="/empty-community.svg" alt="Empty Community" className="empty-community-svg" />
          <h3>No Public Trips Found</h3>
          <p>Be the first traveler to publish an itinerary to the global community!</p>
        </div>
      ) : (
        <motion.div className="community-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {trips.map((post, i) => (
            <motion.div
              key={post.id || post._id}
              className="community-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => post.trip?.id ? navigate(`/trips/${post.trip.id}`) : null}
            >
              <div className="community-card-cover">
                <img 
                  src={post.image || post.coverPhoto || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=70'} 
                  alt={post.title || post.trip?.name || 'Community itinerary'}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=70'} 
                />
                <div className="community-cover-overlay" />
                <div className="community-card-badges">
                  <span className="badge badge-cyan"><Globe2 size={11} /> Community Guide</span>
                </div>
              </div>

              <div className="community-card-body">
                <div className="community-author">
                  <div className="author-avatar">
                    {(post.author?.firstName || post.user?.firstName || 'G')[0]}
                  </div>
                  <div>
                    <span className="author-name">{post.author?.firstName || post.user?.firstName || 'Traveler'} {post.author?.lastName || post.user?.lastName || ''}</span>
                    <span className="author-date">{post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Recent'}</span>
                  </div>
                </div>

                <h3 className="community-trip-name">{post.title || post.trip?.name || 'Shared itinerary'}</h3>
                {post.content && <p className="community-trip-desc">{post.content.substring(0, 140)}...</p>}
                {post.description && <p className="community-trip-desc">{post.description.substring(0, 140)}...</p>}
              </div>

              <div className="community-card-footer">
                <span className="comm-action-btn">
                  <MessageSquare size={14} /> Read Itinerary
                </span>
                <span className="comm-action-btn view-link">
                  View Guide <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
