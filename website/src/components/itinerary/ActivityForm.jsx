import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import api from '../../lib/api';
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
      onSuccess(data.trip);
      toast.success('Activity added!');
    } catch { toast.error('Failed to add activity'); }
    finally { setLoading(false); }
  };

  return (
    <motion.form
      className="activity-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="activity-form-inner">
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>+ New Activity</h4>
        <div className="act-form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Name *</label>
            <input className="form-control" placeholder="e.g. Eiffel Tower" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="act-form-row">
          <div className="form-group">
            <label className="form-label">Cost ($)</label>
            <input type="number" className="form-control" min={0} value={form.cost}
              onChange={e => setForm({ ...form, cost: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (hrs)</label>
            <input type="number" className="form-control" min={0.5} step={0.5} value={form.duration}
              onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-control" value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })} />
          </div>
        </div>
        <div className="act-form-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            <Check size={14} /> Add
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    </motion.form>
  );
}
