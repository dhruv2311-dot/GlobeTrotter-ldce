import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Edit2, Trash2, Camera, Lock, Eye, EyeOff, Map, Calendar } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import TripCard from '../../components/trips/TripCard';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [trips, setTrips] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '', city: user?.city || '', country: user?.country || '', bio: user?.bio || '' });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/trips').then(({ data }) => setTrips(data.trips)).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (profileImage) fd.append('profileImage', profileImage);
    const result = await updateProfile(fd);
    if (result.success) { toast.success('Profile updated!'); setEditing(false); }
    else toast.error(result.message);
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will deactivate your account.')) return;
    try {
      await api.delete('/auth/account');
      logout();
    } catch { toast.error('Failed to deactivate account'); }
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) { setProfileImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'trips', label: `My Trips (${trips.length})` },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="profile-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Profile Header */}
      <motion.div className="profile-header glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar-wrapper">
          <img src={preview || user?.profileImage} className="avatar-xl" alt={user?.firstName}
            onError={e => e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E88E5&color=fff`} />
          {editing && (
            <label className="avatar-edit-btn">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>
        <div className="profile-info">
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p className="profile-email"><Mail size={14} /> {user?.email}</p>
          {user?.city && <p className="profile-location"><MapPin size={14} /> {user?.city}, {user?.country}</p>}
          {user?.bio && <p className="profile-bio">{user?.bio}</p>}
          <div className="profile-stats">
            <div className="profile-stat"><span>{trips.length}</span><small>Trips</small></div>
            <div className="profile-stat"><span>{trips.filter(t => t.isPublic).length}</span><small>Public</small></div>
            <div className="profile-stat"><span>{trips.reduce((s,t) => s + (t.stops?.length || 0), 0)}</span><small>Cities</small></div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-muted'}`}>{user?.role}</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(t => <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>)}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <motion.div className="profile-content glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="profile-content-header">
            <h2>Personal Information</h2>
            {!editing ? (
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}><Edit2 size={14} /> Edit</button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleSaveProfile} disabled={saving}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

          <div className="profile-form">
            {[
              { key: 'firstName', label: 'First Name', icon: <User size={16} /> },
              { key: 'lastName', label: 'Last Name', icon: <User size={16} /> },
              { key: 'phone', label: 'Phone', icon: <Phone size={16} /> },
              { key: 'city', label: 'City', icon: <MapPin size={16} /> },
              { key: 'country', label: 'Country', icon: <Globe size={16} /> },
            ].map(field => (
              <div key={field.key} className="form-group">
                <label className="form-label">{field.label}</label>
                {editing ? (
                  <div className="input-wrapper">
                    <span className="input-icon">{field.icon}</span>
                    <input className="form-control" value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
                  </div>
                ) : (
                  <p className="profile-field-value">{user?.[field.key] || '—'}</p>
                )}
              </div>
            ))}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Bio</label>
              {editing ? (
                <textarea className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
              ) : (
                <p className="profile-field-value">{user?.bio || '—'}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Trips Tab */}
      {tab === 'trips' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {trips.length === 0 ? (
            <div className="empty-state"><Map size={64} className="empty-icon" /><h3>No trips yet</h3></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {trips.map(trip => <TripCard key={trip._id} trip={trip} onDelete={(id) => setTrips(prev => prev.filter(t => t._id !== id))} />)}
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <motion.div className="profile-settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card settings-section">
            <h2><Lock size={18} /> Change Password</h2>
            <form onSubmit={handlePasswordChange} className="settings-form">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirmPassword', label: 'Confirm New Password' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input type={showPassword ? 'text' : 'password'} className="form-control"
                      value={passwordForm[f.key]} onChange={e => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
                      style={{ paddingRight: '3rem' }} />
                    <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>

          <div className="glass-card settings-section danger-zone">
            <h2 style={{ color: 'var(--danger)' }}><Trash2 size={18} /> Danger Zone</h2>
            <p>Deactivating your account will hide your profile and trips from public view.</p>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Deactivate Account</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
