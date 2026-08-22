import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Edit2, Trash2, Camera, Lock, Eye, EyeOff, Map, Sparkles, Shield, Key } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import { getAvatarUrl } from '../../utils/avatarUtils';
import TripCard from '../../components/trips/TripCard';
import { ButtonSpinner } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [trips, setTrips] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    firstName: user?.firstName || '', 
    lastName: user?.lastName || '', 
    phone: user?.phone || '', 
    city: user?.city || '', 
    country: user?.country || '', 
    bio: user?.bio || '' 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/trips').then(({ data }) => {
      const tripsData = data.data?.trips || data.data || data.trips || [];
      setTrips(Array.isArray(tripsData) ? tripsData.map((trip) => ({
        ...trip,
        tripName: trip.tripName || trip.name,
        totalBudget: trip.totalBudget ?? trip.budgetAmount ?? 0,
        isPublic: trip.isPublic ?? trip.visibility === 'PUBLIC',
        status: trip.status?.toLowerCase(),
      })) : []);
    }).catch(() => {
      setTrips([]);
    });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (profileImage) fd.append('profileImage', profileImage);
    const result = await updateProfile(fd);
    if (result.success) { 
      toast.success('Profile details saved!'); 
      setEditing(false); 
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { 
      toast.error('Passwords do not match'); 
      return; 
    }
    try {
      await api.put('/auth/change-password', { 
        currentPassword: passwordForm.currentPassword, 
        newPassword: passwordForm.newPassword 
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to change password'); 
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account?')) return;
    try {
      await api.delete('/auth/account');
      logout();
      toast.success('Account deactivated');
    } catch { 
      toast.error('Failed to deactivate account'); 
    }
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) { setProfileImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const TABS = [
    { key: 'profile', label: 'User Profile' },
    { key: 'trips', label: `My Trips (${(trips || []).length})` },
    { key: 'settings', label: 'Account Settings' },
  ];

  return (
    <div className="profile-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Profile Header */}
      <motion.div className="profile-header glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar-wrapper">
          <img 
            src={preview || getAvatarUrl(user?.firstName, user?.lastName, user?.profilePhoto || user?.profileImage)} 
            className="avatar-xl profile-main-avatar" 
            alt={user?.firstName} 
          />
          {editing && (
            <label className="avatar-edit-btn">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <div className="profile-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="profile-user-name">{user?.firstName} {user?.lastName}</h1>
            <span className={`badge ${user?.role === 'admin' ? 'badge-violet' : 'badge-cyan'}`}>
              {user?.role === 'admin' ? <Shield size={11} /> : <Sparkles size={11} />} {user?.role || 'Traveler'}
            </span>
          </div>

          <p className="profile-email"><Mail size={14} color="#714B67" /> {user?.email}</p>
          {user?.city && <p className="profile-location"><MapPin size={14} color="#714B67" /> {user?.city}, {user?.country}</p>}
          {user?.bio && <p className="profile-bio">{user?.bio}</p>}

          <div className="profile-stats-row">
            <div className="profile-stat-box">
              <span className="stat-val">{(trips || []).length}</span>
              <span className="stat-lbl">Total Trips</span>
            </div>
            <div className="profile-stat-box">
              <span className="stat-val">{(trips || []).filter(t => t.isPublic).length}</span>
              <span className="stat-lbl">Public Plans</span>
            </div>
            <div className="profile-stat-box">
              <span className="stat-val">{(trips || []).reduce((s,t) => s + (t.stops?.length || 0), 0)}</span>
              <span className="stat-lbl">Stops Added</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="profile-tabs glass-card">
        {TABS.map(t => (
          <button key={t.key} className={`profile-tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Details Tab */}
      {tab === 'profile' && (
        <motion.div className="profile-content glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="profile-content-header">
            <div>
              <h2 className="section-title">Personal Details</h2>
              <p className="section-subtitle">Update your personal preferences and contact details</p>
            </div>
            {!editing ? (
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
                <Edit2 size={14} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <ButtonSpinner /> : 'Save Changes'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

          <div className="profile-form-grid">
            {[
              { key: 'firstName', label: 'First Name', icon: <User size={16} /> },
              { key: 'lastName', label: 'Last Name', icon: <User size={16} /> },
              { key: 'phone', label: 'Phone Number', icon: <Phone size={16} /> },
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
              <label className="form-label">Bio & Personal Intro</label>
              {editing ? (
                <textarea className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
              ) : (
                <p className="profile-field-value">{user?.bio || 'No bio written yet.'}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* My Trips Tab */}
      {tab === 'trips' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {((trips || []).length === 0) ? (
            <div className="empty-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Map size={56} color="#714B67" />
              <h3 style={{ margin: '0.75rem 0', color: '#212529' }}>No Trips Created Yet</h3>
            </div>
          ) : (
            <div className="trips-grid-full">
              {(trips || []).map(trip => (
                <TripCard key={trip.id || trip._id} trip={trip} onDelete={(id) => setTrips(prev => prev.filter(t => (t.id || t._id) !== id))} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Account Settings Tab */}
      {tab === 'settings' && (
        <motion.div className="profile-settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card settings-section">
            <h2 className="section-title"><Key size={20} color="#714B67" /> Change Password</h2>
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
                      style={{ paddingRight: '3rem' }} required />
                    <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>Update Password</button>
            </form>
          </div>

          <div className="glass-card settings-section danger-zone">
            <h2 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trash2 size={20} /> Deactivate Account</h2>
            <p style={{ color: '#495057', fontSize: '0.9rem', margin: '0.5rem 0 1.25rem 0' }}>
              Deactivating your account will hide your public itineraries and user profile.
            </p>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Deactivate Account</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
