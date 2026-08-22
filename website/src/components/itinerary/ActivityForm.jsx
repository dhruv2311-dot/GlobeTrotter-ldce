import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import api from '../../lib/api';
import { ButtonSpinner } from '../common/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'transport', 'accommodation', 'other'];

export default function ActivityForm({ tripId, stopId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '', category: 'sightseeing', cost: 0, duration: 1, description: '', startTime: '', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, form);
      onSuccess(data.data?.trip || data.trip);
      toast.success('Activity added to itinerary!');
    } catch { toast.error('Failed to add activity'); }
    finally { setLoading(false); }
  };

  return (
    <motion.form
      className="activity-form glass-card"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ padding: '1.25rem', borderRadius: '18px', marginTop: '0.5rem' }}
    >
      <div className="activity-form-inner">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: '#714B67' }}>+ Add Custom Activity & Budget</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">Activity Title *</label>
            <input className="form-control" placeholder="e.g. Guided Louvre Museum Tour" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Cost ($)</label>
            <input type="number" className="form-control" min={0} value={form.cost}
              onChange={e => setForm({ ...form, cost: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (Hrs)</label>
            <input type="number" className="form-control" min={0.5} step={0.5} value={form.duration}
              onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-control" value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? <ButtonSpinner /> : <><Check size={14} /> Add Activity</>}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    </motion.form>
  );
}
