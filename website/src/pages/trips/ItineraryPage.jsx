import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Plus, GripVertical, MapPin, Calendar, DollarSign, Trash2, ChevronDown, ChevronUp, Edit2, Check, X } from 'lucide-react';
import api from '../../lib/api';
import ActivityForm from '../../components/itinerary/ActivityForm';
import BudgetSummary from '../../components/itinerary/BudgetSummary';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './ItineraryPage.css';

function SortableStop({ stop, onDelete, onUpdate, tripId, onAddActivity, onDeleteActivity }) {
  const [expanded, setExpanded] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ city: stop.city, startDate: stop.startDate?.slice(0, 10), endDate: stop.endDate?.slice(0, 10) });
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/trips/${tripId}/stops/${stop._id}`, editData);
      onUpdate(data.trip);
      setEditing(false);
      toast.success('Stop updated');
    } catch { toast.error('Failed to update stop'); }
  };

  const handleDeleteActivity = async (actId) => {
    try {
      const { data } = await api.delete(`/trips/${tripId}/stops/${stop._id}/activities/${actId}`);
      onUpdate(data.trip);
      toast.success('Activity removed');
    } catch { toast.error('Failed to remove activity'); }
  };

  const activityTotal = stop.activities?.reduce((s, a) => s + (a.cost || 0), 0) || 0;

  return (
    <div ref={setNodeRef} style={style} className="stop-card glass-card">
      <div className="stop-header">
        <button className="drag-handle" {...attributes} {...listeners}><GripVertical size={18} /></button>
        <div className="stop-dot" />
        {editing ? (
          <div className="stop-edit-form">
            <input className="form-control" value={editData.city} onChange={e => setEditData({ ...editData, city: e.target.value })} placeholder="City" style={{ width: 140 }} />
            <input type="date" className="form-control" value={editData.startDate} onChange={e => setEditData({ ...editData, startDate: e.target.value })} style={{ width: 140 }} />
            <input type="date" className="form-control" value={editData.endDate} onChange={e => setEditData({ ...editData, endDate: e.target.value })} style={{ width: 140 }} />
            <button className="btn btn-success btn-sm" onClick={handleUpdate}><Check size={14} /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}><X size={14} /></button>
          </div>
        ) : (
          <div className="stop-info" onClick={() => setExpanded(!expanded)}>
            <div className="stop-city">
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <h3>{stop.city}</h3>
            </div>
            {stop.startDate && <span className="stop-dates">{format(new Date(stop.startDate), 'MMM d')} – {format(new Date(stop.endDate), 'MMM d, yyyy')}</span>}
          </div>
        )}
        <div className="stop-actions">
          <span className="stop-budget"><DollarSign size={14} />{activityTotal}</span>
          {!editing && <button className="btn btn-ghost btn-icon" onClick={() => setEditing(true)}><Edit2 size={14} /></button>}
          <button className="btn btn-ghost btn-icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button className="btn btn-danger btn-icon" onClick={() => onDelete(stop._id)}><Trash2 size={14} /></button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div className="stop-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            {/* Activities */}
            {stop.activities?.length > 0 && (
              <div className="activities-list">
                {stop.activities.map((act) => (
                  <div key={act._id} className="activity-item">
                    <div className="activity-category-dot" data-category={act.category} />
                    <div className="activity-details">
                      <span className="activity-name">{act.name}</span>
                      <span className="activity-meta">{act.category} • {act.duration}h</span>
                    </div>
                    <span className="activity-cost">${act.cost}</span>
                    <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }} onClick={() => handleDeleteActivity(act._id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showActivityForm ? (
              <ActivityForm
                tripId={tripId}
                stopId={stop._id}
                onSuccess={(trip) => { onUpdate(trip); setShowActivityForm(false); }}
                onCancel={() => setShowActivityForm(false)}
              />
            ) : (
              <button className="btn btn-ghost btn-sm add-activity-btn" onClick={() => setShowActivityForm(true)}>
                <Plus size={14} /> Add Activity
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStopForm, setShowStopForm] = useState(false);
  const [newStop, setNewStop] = useState({ city: '', startDate: '', endDate: '' });
  const [activeView, setActiveView] = useState('itinerary');
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(({ data }) => setTrip(data.trip))
      .catch(() => { toast.error('Trip not found'); navigate('/trips'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddStop = async () => {
    if (!newStop.city || !newStop.startDate || !newStop.endDate) {
      toast.error('Please fill all stop fields');
      return;
    }
    try {
      const { data } = await api.post(`/trips/${id}/stops`, newStop);
      setTrip(data.trip);
      setNewStop({ city: '', startDate: '', endDate: '' });
      setShowStopForm(false);
      toast.success(`Added stop: ${newStop.city}`);
    } catch { toast.error('Failed to add stop'); }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Remove this stop?')) return;
    try {
      const { data } = await api.delete(`/trips/${id}/stops/${stopId}`);
      setTrip(data.trip);
      toast.success('Stop removed');
    } catch { toast.error('Failed to remove stop'); }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = trip.stops.findIndex(s => s._id === active.id);
    const newIndex = trip.stops.findIndex(s => s._id === over.id);
    const newStops = arrayMove(trip.stops, oldIndex, newIndex);
    setTrip({ ...trip, stops: newStops });
    try {
      await api.put(`/trips/${id}/stops/reorder`, { orderedIds: newStops.map(s => s._id) });
    } catch { toast.error('Failed to save order'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!trip) return null;

  return (
    <div className="itinerary-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="itinerary-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/trips/${id}`)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="page-title">{trip.tripName}</h1>
          <p className="page-subtitle">
            {trip.stops?.length || 0} stops • ${trip.totalBudget?.toLocaleString() || 0} total budget
          </p>
        </div>
        <div className="view-tabs">
          {['itinerary', 'budget'].map(v => (
            <button key={v} className={`tab-btn ${activeView === v ? 'active' : ''}`} onClick={() => setActiveView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'budget' ? (
        <BudgetSummary trip={trip} />
      ) : (
        <div className="itinerary-layout">
          {/* Stops */}
          <div className="stops-section">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={trip.stops?.map(s => s._id) || []} strategy={verticalListSortingStrategy}>
                <div className="stops-list">
                  {trip.stops?.length === 0 && (
                    <div className="empty-state" style={{ padding: '3rem', marginBottom: 0 }}>
                      <MapPin size={48} className="empty-icon" />
                      <h3>No stops yet</h3>
                      <p>Add cities to start building your itinerary</p>
                    </div>
                  )}
                  {trip.stops?.map((stop) => (
                    <SortableStop key={stop._id} stop={stop} tripId={id} onDelete={handleDeleteStop} onUpdate={setTrip} onAddActivity={() => {}} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Stop */}
            {showStopForm ? (
              <motion.div className="add-stop-form glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h4><MapPin size={16} /> Add a Stop</h4>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-control" placeholder="e.g. Paris" value={newStop.city}
                      onChange={e => setNewStop({ ...newStop, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">From *</label>
                    <input type="date" className="form-control" value={newStop.startDate}
                      onChange={e => setNewStop({ ...newStop, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To *</label>
                    <input type="date" className="form-control" value={newStop.endDate}
                      onChange={e => setNewStop({ ...newStop, endDate: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" onClick={handleAddStop}><Check size={16} /> Add Stop</button>
                  <button className="btn btn-ghost" onClick={() => setShowStopForm(false)}><X size={16} /> Cancel</button>
                </div>
              </motion.div>
            ) : (
              <button className="btn btn-primary btn-lg add-stop-trigger" onClick={() => setShowStopForm(true)}>
                <Plus size={20} /> Add Stop
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="itinerary-sidebar">
            <BudgetSummary trip={trip} compact />
          </div>
        </div>
      )}
    </div>
  );
}
