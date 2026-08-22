import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Calendar, Globe, Lock, Tag, FileText, Image, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { ButtonSpinner } from '../../components/common/Loader';
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
      toast.success('Trip itinerary initialized! Now add destinations & activities 🗺');
      const tripId = data.data?.trip?.id || data.data?.trip?._id || data.trip?._id || data.trip?.id;
      navigate(`/trips/${tripId}/itinerary`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Trips
      </button>

      <div className="create-trip-layout">
        {/* Form Column */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="page-header" style={{ marginBottom: '1.75rem' }}>
            <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={12} /> New Travel Journey
            </div>
            <h1 className="page-title">Create Travel Itinerary ✈️</h1>
            <p className="page-subtitle">Define dates, budget currency, and privacy preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="create-trip-form glass-card">
            <div className="form-group">
              <label className="form-label"><Globe size={15} /> Trip Title *</label>
              <div className="input-wrapper">
                <Globe size={16} className="input-icon" />
                <input type="text" className="form-control" placeholder="e.g. European Summer Getaway 2026"
                  value={form.tripName} onChange={(e) => setForm({ ...form, tripName: e.target.value })} required />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label"><Calendar size={15} /> Start Date *</label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input type="date" className="form-control" value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><Calendar size={15} /> End Date *</label>
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input type="date" className="form-control" value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><FileText size={15} /> Description & Highlights</label>
              <div className="input-wrapper">
                <textarea className="form-control" placeholder="Add trip goals, notes, or special highlights..."
                  rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ paddingLeft: '1rem', paddingTop: '0.85rem' }} />
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
                <label className="form-label"><Tag size={15} /> Tags (Comma separated)</label>
                <div className="input-wrapper">
                  <Tag size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="beach, adventure, food"
                    value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Visibility Settings</label>
              <div className="visibility-toggle">
                <button type="button" className={`vis-btn ${!form.isPublic ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, isPublic: false })}>
                  <Lock size={16} /> Private (Only Me)
                </button>
                <button type="button" className={`vis-btn ${form.isPublic ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, isPublic: true })}>
                  <Globe size={16} /> Public (Community)
                </button>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="form-group">
              <label className="form-label"><Image size={15} /> Cover Photo</label>
              <label className="upload-zone">
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                {preview ? (
                  <img src={preview} alt="Cover" className="cover-preview-img" />
                ) : (
                  <div className="upload-zone-inner">
                    <Image size={36} color="#714B67" />
                    <span>Upload custom cover photo</span>
                    <span style={{ fontSize: '0.75rem', color: '#6C757D' }}>JPG, PNG, WebP up to 10MB</span>
                  </div>
                )}
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full create-trip-submit" disabled={loading}>
              {loading ? (
                <>
                  <ButtonSpinner /> Initializing Trip...
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          </form>
        </motion.div>

        {/* Live Preview Side Column */}
        <motion.div
          className="trip-preview-aside"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="preview-card glass-card">
            <h3 className="preview-title">Live Preview Card</h3>
            <div className="preview-cover">
              {preview ? (
                <img src={preview} alt="Preview" className="preview-cover-img" />
              ) : (
                <div className="preview-cover-placeholder">
                  <Globe size={40} color="#714B67" />
                </div>
              )}
            </div>
            <div style={{ padding: '1rem 0 0 0' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#212529', marginBottom: '0.4rem' }}>
                {form.tripName || 'Your Trip Title'}
              </h2>
              {form.startDate && form.endDate && (
                <p style={{ color: '#495057', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  📅 {new Date(form.startDate).toLocaleDateString()} → {new Date(form.endDate).toLocaleDateString()}
                </p>
              )}
              {form.description && (
                <p style={{ color: '#DEE2E6', fontSize: '0.85rem', lineHeight: 1.4 }}>{form.description}</p>
              )}
              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {form.isPublic ? <span className="badge badge-cyan"><Globe size={11}/> Public</span> : <span className="badge badge-violet"><Lock size={11}/> Private</span>}
                {form.currency && <span className="badge badge-amber">{form.currency}</span>}
                {form.tags && form.tags.split(',').slice(0,3).map((t,i) => <span key={i} className="city-chip">{t.trim()}</span>)}
              </div>
            </div>
          </div>

          <div className="trip-tips glass-card" style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>💡 Pro Planning Tips</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Provide clear start and end dates to enable day-by-day itinerary views',
                'Upload a high quality cover photo to make your itinerary pop in the community',
                'Select Public to allow other travelers to clone your itinerary',
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: '0.825rem', color: '#495057', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)' }}>✦</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
