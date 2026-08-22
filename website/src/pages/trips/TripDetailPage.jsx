import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, DollarSign, Globe, Lock, Heart, MessageSquare, Share2, Eye, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import BudgetSummary from '../../components/itinerary/BudgetSummary';
import { PageLoader } from '../../components/common/Loader';
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
        const fetched = data.data?.trip || data.data || data.trip;
        setTrip(fetched);
        if (fetched?.likes) {
          setLiked(fetched.likes.includes(user?.id || user?._id));
        }
      })
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/trips/${id}/like`);
      setLiked(data.liked);
      setTrip(prev => ({ ...prev, likes: Array(data.likes).fill(null) }));
    } catch { toast.error('Failed to update reaction'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const { data } = await api.post(`/trips/${id}/comments`, { text: comment });
      setTrip(prev => ({ ...prev, comments: data.comments }));
      setComment('');
      toast.success('Comment added!');
    } catch { toast.error('Failed to post comment'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Itinerary link copied to clipboard!');
  };

  if (loading) return <PageLoader message="Loading trip details..." />;
  if (!trip) return null;

  const isOwner = trip.userId?._id === user?.id || trip.userId === user?.id || trip.userId === user?._id;

  return (
    <div className="trip-detail-page">
      {/* Hero Banner */}
      <div className="trip-hero">
        <img 
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=70'} 
          alt={trip.tripName}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=70'; }} 
        />
        <div className="trip-hero-overlay" />
        <div className="container trip-hero-content">
          <button className="btn btn-ghost" style={{ background: 'rgba(0, 0, 0, 0.1)', color: 'white', marginBottom: '1.25rem' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back to Trips
          </button>
          
          <div className="flex items-center gap-3" style={{ marginBottom: '0.85rem' }}>
            <span className="badge badge-amber">{trip.status}</span>
            {trip.isPublic ? (
              <span className="badge badge-cyan"><Globe size={11} /> Public Itinerary</span>
            ) : (
              <span className="badge badge-violet"><Lock size={11} /> Private</span>
            )}
          </div>
          
          <h1 className="trip-detail-title">{trip.tripName}</h1>
          {trip.description && <p className="trip-detail-desc">{trip.description}</p>}

          <div className="trip-hero-meta">
            <div className="hero-meta-item"><Calendar size={16} color="#714B67" /> {trip.startDate ? format(new Date(trip.startDate), 'MMM d') : ''} – {trip.endDate ? format(new Date(trip.endDate), 'MMM d, yyyy') : ''}</div>
            <div className="hero-meta-item"><MapPin size={16} color="#714B67" /> {trip.stops?.length || 0} Destination Stops</div>
            <div className="hero-meta-item"><DollarSign size={16} color="#10B981" /> ${(trip.totalBudget || 0).toLocaleString()} Total Budget</div>
            <div className="hero-meta-item"><Eye size={16} color="#017E84" /> {trip.views || 1} Views</div>
          </div>
        </div>
      </div>

      <div className="container trip-detail-body">
        {/* Navigation Tabs & Actions */}
        <div className="trip-detail-actions glass-card">
          <div className="detail-tabs">
            {['overview', 'itinerary', 'budget'].map(t => (
              <button key={t} className={`detail-tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            {isOwner && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/trips/${id}/itinerary`)}>
                Edit & Build Itinerary
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleShare}>
              <Share2 size={16} /> Share
            </button>
            {trip.isPublic && (
              <button className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-ghost'}`} onClick={handleLike}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {trip.likes?.length || 0}
              </button>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div className="trip-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="detail-section glass-card">
              <h2 className="section-title">Timeline Overview</h2>
              <div className="timeline">
                {trip.stops?.map((stop) => (
                  <div key={stop._id || stop.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="stop-timeline-header">
                        <h3>{stop.city?.name || stop.city}</h3>
                        <span className="stop-dates">{format(new Date(stop.startDate), 'MMM d')} – {format(new Date(stop.endDate), 'MMM d')}</span>
                      </div>
                      {stop.activities?.length > 0 && (
                        <div className="stop-activities-preview">
                          {stop.activities.map((act, j) => (
                            <div key={j} className="activity-preview-chip">
                              <span>{act.name}</span>
                              <span style={{ marginLeft: 'auto', color: '#10B981', fontWeight: 700 }}>${act.cost}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Comments */}
            {trip.isPublic && (
              <div className="detail-section glass-card" style={{ marginTop: '2rem' }}>
                <h2 className="section-title"><MessageSquare size={20} /> Community Comments</h2>
                <form onSubmit={handleComment} className="comment-form">
                  <input className="form-control" placeholder="Share your feedback or ask a question..." value={comment}
                    onChange={e => setComment(e.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
                </form>
                
                <div className="comments-list">
                  {trip.comments?.slice().reverse().map((c, i) => (
                    <div key={i} className="comment-item">
                      <div className="comment-avatar">
                        {c.userId?.firstName ? c.userId.firstName[0] : 'U'}
                      </div>
                      <div>
                        <p className="comment-author">{c.userId?.firstName} {c.userId?.lastName}</p>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {trip.comments?.length === 0 && <p style={{ color: '#495057', fontSize: '0.875rem' }}>No comments yet. Be the first to start the conversation!</p>}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Detailed Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="detail-itinerary-grid">
              {trip.stops?.map((stop) => (
                <div key={stop._id || stop.id} className="detail-stop-card glass-card">
                  <div className="detail-stop-header">
                    <MapPin size={18} color="#714B67" />
                    <h3>{stop.city?.name || stop.city}</h3>
                    <span style={{ marginLeft: 'auto', color: '#495057', fontSize: '0.85rem' }}>
                      {format(new Date(stop.startDate), 'MMM d')} – {format(new Date(stop.endDate), 'MMM d')}
                    </span>
                  </div>
                  <div className="detail-activities">
                    {stop.activities?.map((act, i) => (
                      <div key={i} className="activity-item">
                        <div className="activity-details">
                          <span className="activity-name">{act.name}</span>
                          <span className="activity-meta">{act.category} • {act.duration}h</span>
                        </div>
                        <span className="activity-cost">${act.cost}</span>
                      </div>
                    ))}
                    {(!stop.activities || stop.activities.length === 0) && (
                      <p style={{ color: '#6C757D', fontSize: '0.85rem' }}>No activities planned for this stop</p>
                    )}
                  </div>
                  <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#495057' }}>Stop total budget:</span>
                    <span style={{ fontWeight: 800, color: '#10B981', fontFamily: 'Outfit' }}>${stop.sectionBudget?.toLocaleString() || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Budget Breakdown Tab */}
        {activeTab === 'budget' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BudgetSummary trip={trip} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
