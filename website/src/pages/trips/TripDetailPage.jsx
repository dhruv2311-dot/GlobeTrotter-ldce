import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, DollarSign, Globe, Lock, Heart, MessageSquare, Share2, Eye, Copy } from 'lucide-react';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import BudgetSummary from '../../components/itinerary/BudgetSummary';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import './TripDetailPage.css';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(({ data }) => {
        setTrip(data.trip);
        setLiked(data.trip.likes?.includes(user?.id));
      })
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/trips/${id}/like`);
      setLiked(data.liked);
      setTrip(prev => ({ ...prev, likes: Array(data.likes).fill(null) }));
    } catch { toast.error('Failed to like'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const { data } = await api.post(`/trips/${id}/comments`, { text: comment });
      setTrip(prev => ({ ...prev, comments: data.comments }));
      setComment('');
      toast.success('Comment added!');
    } catch { toast.error('Failed to add comment'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!trip) return null;

  const isOwner = trip.userId?._id === user?.id || trip.userId === user?.id;

  return (
    <div className="trip-detail-page">
      {/* Hero */}
      <div className="trip-hero">
        <img src={trip.coverPhoto} alt={trip.tripName}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=60'; }} />
        <div className="trip-hero-overlay" />
        <div className="container trip-hero-content">
          <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3" style={{ marginBottom: '0.75rem' }}>
            <span className={`badge badge-${trip.status === 'upcoming' ? 'primary' : trip.status === 'ongoing' ? 'success' : 'muted'}`}>{trip.status}</span>
            {trip.isPublic ? <span className="badge badge-muted"><Globe size={10} /> Public</span> : <span className="badge badge-muted"><Lock size={10} /> Private</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'white', marginBottom: '0.5rem' }}>{trip.tripName}</h1>
          {trip.description && <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>{trip.description}</p>}
          <div className="trip-hero-meta">
            <div className="hero-meta-item"><Calendar size={16} /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</div>
            <div className="hero-meta-item"><MapPin size={16} /> {trip.stops?.length || 0} stops</div>
            <div className="hero-meta-item"><DollarSign size={16} /> ${(trip.totalBudget || 0).toLocaleString()}</div>
            <div className="hero-meta-item"><Eye size={16} /> {trip.views || 0} views</div>
          </div>
        </div>
      </div>

      <div className="container trip-detail-body">
        {/* Actions */}
        <div className="trip-detail-actions">
          <div className="detail-tabs">
            {['overview', 'itinerary', 'budget'].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/trips/${id}/itinerary`)}>
                Edit Itinerary
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleShare}><Share2 size={16} /> Share</button>
            {trip.isPublic && (
              <button className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-ghost'}`} onClick={handleLike}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {trip.likes?.length || 0}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div className="trip-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stops timeline */}
            <div className="detail-section">
              <h2>Itinerary Overview</h2>
              <div className="timeline">
                {trip.stops?.map((stop, i) => (
                  <div key={stop._id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="stop-timeline-header">
                        <h3>{stop.city}</h3>
                        <span className="stop-dates">{format(new Date(stop.startDate), 'MMM d')} – {format(new Date(stop.endDate), 'MMM d')}</span>
                      </div>
                      {stop.activities?.length > 0 && (
                        <div className="stop-activities-preview">
                          {stop.activities.map((act, j) => (
                            <div key={j} className="activity-preview-chip">
                              <span className="activity-category-dot" data-category={act.category} />
                              <span>{act.name}</span>
                              <span style={{ marginLeft: 'auto', color: 'var(--success)', fontSize: '0.75rem' }}>${act.cost}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            {trip.isPublic && (
              <div className="detail-section">
                <h2><MessageSquare size={20} /> Community Comments</h2>
                <form onSubmit={handleComment} className="comment-form">
                  <input className="form-control" placeholder="Share your thoughts..." value={comment}
                    onChange={e => setComment(e.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm">Post</button>
                </form>
                <div className="comments-list">
                  {trip.comments?.slice().reverse().map((c, i) => (
                    <div key={i} className="comment-item">
                      <img src={c.userId?.profileImage || `https://ui-avatars.com/api/?name=${c.userId?.firstName}`}
                        className="avatar avatar-sm" alt="" onError={e => e.target.src = 'https://ui-avatars.com/api/?bg=1E88E5&color=fff'} />
                      <div>
                        <p className="comment-author">{c.userId?.firstName} {c.userId?.lastName}</p>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {trip.comments?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No comments yet. Be the first!</p>}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'itinerary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="detail-itinerary-grid">
              {trip.stops?.map((stop) => (
                <div key={stop._id} className="detail-stop-card glass-card">
                  <div className="detail-stop-header">
                    <MapPin size={18} style={{ color: 'var(--primary)' }} />
                    <h3>{stop.city}</h3>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {format(new Date(stop.startDate), 'MMM d')} – {format(new Date(stop.endDate), 'MMM d')}
                    </span>
                  </div>
                  <div className="detail-activities">
                    {stop.activities?.map((act, i) => (
                      <div key={i} className="activity-item">
                        <div className="activity-category-dot" data-category={act.category} />
                        <div className="activity-details">
                          <span className="activity-name">{act.name}</span>
                          <span className="activity-meta">{act.category} • {act.duration}h{act.startTime ? ` • ${act.startTime}` : ''}</span>
                        </div>
                        <span className="activity-cost">${act.cost}</span>
                      </div>
                    ))}
                    {(!stop.activities || stop.activities.length === 0) && (<p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No activities added</p>)}
                  </div>
                  <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Stop total:</span>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>${stop.sectionBudget?.toLocaleString() || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BudgetSummary trip={trip} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
