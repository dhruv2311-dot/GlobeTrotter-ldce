import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Calendar, Globe, Lock, Tag, FileText, Image } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import './CreateTrip.css';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tripName: '', startDate: '', endDate: '', description: '', isPublic: false, currency: 'USD', tags: '',
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setCoverPhoto(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverPhoto) fd.append('coverPhoto', coverPhoto);
      const { data } = await api.post('/trips', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Trip created! Now build your itinerary 🗺');
      navigate(`/trips/${data.trip._id}/itinerary`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="create-trip-layout">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="page-header">
            <h1 className="page-title">Plan a New Trip ✈️</h1>
            <p className="page-subtitle">Fill in the details to start building your itinerary</p>
          </div>

          <form onSubmit={handleSubmit} className="create-trip-form glass-card">
            <div className="form-group">
              <label className="form-label">Trip Name *</label>
              <div className="input-wrapper">
                <Globe size={16} className="input-icon" />
                <input type="text" className="form-control" placeholder="e.g. European Summer Adventure"
                  value={form.tripName} onChange={(e) => setForm({ ...form, tripName: e.target.value })} required />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input type="date" className="form-control" value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input type="date" className="form-control" value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <div className="input-wrapper">
                <FileText size={16} className="input-icon" style={{ top: '1rem' }} />
                <textarea className="form-control" placeholder="What's the plan? Any special occasions?"
                  rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-control" value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <div className="input-wrapper">
                  <Tag size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="beach, adventure, culture"
                    value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-toggle">
                <button type="button" className={`vis-btn ${!form.isPublic ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, isPublic: false })}>
                  <Lock size={16} /> Private
                </button>
                <button type="button" className={`vis-btn ${form.isPublic ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, isPublic: true })}>
                  <Globe size={16} /> Public
                </button>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="form-group">
              <label className="form-label">Cover Photo</label>
              <label className="upload-zone" style={{ cursor: 'pointer' }}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                {preview ? (
                  <img src={preview} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem', color: 'var(--text-muted)' }}>
                    <Image size={32} />
                    <span>Click to upload a cover photo</span>
                    <span style={{ fontSize: '0.75rem' }}>JPG, PNG, WebP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}} /> : '🗺 Create Trip & Build Itinerary'}
            </button>
          </form>
        </motion.div>

        {/* Preview card */}
        <motion.div
          className="trip-preview-aside"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="preview-card glass-card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</h3>
            <div className="preview-cover">
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              ) : (
                <div className="preview-cover-placeholder">🗺</div>
              )}
            </div>
            <div style={{ padding: '1rem 0' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{form.tripName || 'Your Trip Name'}</h2>
              {form.startDate && form.endDate && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  📅 {new Date(form.startDate).toLocaleDateString()} → {new Date(form.endDate).toLocaleDateString()}
                </p>
              )}
              {form.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{form.description}</p>
              )}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {form.isPublic ? <span className="badge badge-primary"><Globe size={10}/> Public</span> : <span className="badge badge-muted"><Lock size={10}/> Private</span>}
                {form.currency && <span className="badge badge-accent">{form.currency}</span>}
                {form.tags && form.tags.split(',').slice(0,3).map((t,i) => <span key={i} className="tag">{t.trim()}</span>)}
              </div>
            </div>
          </div>

          <div className="trip-tips glass-card" style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>💡 Tips</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {['Give your trip a catchy name', 'Add cities as stops in the itinerary builder', 'Set activities with costs for auto budget', 'Make it public to share with the community'].map((tip, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)' }}>→</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
