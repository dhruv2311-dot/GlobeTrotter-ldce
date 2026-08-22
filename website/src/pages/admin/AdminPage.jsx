import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Map, Globe, TrendingUp, AlertTriangle, Trash2, ToggleLeft, ToggleRight, Database, Sparkles, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ButtonSpinner } from '../../components/common/Loader';
import './AdminPage.css';

const COLORS = ['#714B67', '#017E84', '#10B981', '#017E84', '#714B67', '#714B67', '#017E84', '#714B67'];

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/users'),
    ]).then(([anlRes, usrRes]) => {
      setAnalytics(anlRes.data.analytics || anlRes.data.data?.analytics);
      setUsers(usrRes.data.users || usrRes.data.data?.users || []);
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => (u.id || u._id) === id ? (data.user || data.data?.user) : u));
      toast.success('User status updated');
    } catch { toast.error('Failed to update user'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user and all their itineraries?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => (u.id || u._id) !== id));
      toast.success('User deleted successfully');
    } catch { toast.error('Failed to delete user'); }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const { data } = await api.post('/admin/seed');
      toast.success(`Successfully seeded destination database!`);
    } catch { toast.error('Seeding process failed'); }
    finally { setSeeding(false); }
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
      <ButtonSpinner />
      <p style={{ marginTop: '1rem', color: '#495057' }}>Loading Admin Control Center...</p>
    </div>
  );

  const TABS = ['overview', 'users'];

  const statCards = [
    { label: 'Total Platform Users', value: analytics?.totalUsers || users.length || 0, icon: <Users size={24} />, color: 'cyan' },
    { label: 'Total Itineraries', value: analytics?.totalTrips || 0, icon: <Map size={24} />, color: 'emerald' },
    { label: 'Public Community Plans', value: analytics?.publicTrips || 0, icon: <Globe size={24} />, color: 'amber' },
    { label: 'Cities Cataloged', value: analytics?.totalCities || 0, icon: <TrendingUp size={24} />, color: 'violet' },
  ];

  return (
    <div className="admin-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="badge badge-violet" style={{ marginBottom: '0.6rem' }}>
            <Shield size={12} /> System Admin Workspace
          </div>
          <h1 className="page-title">Admin Dashboard 🛡</h1>
          <p className="page-subtitle">GlobeTrotter system analytics, user management, and dataset seeding</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleSeedData} disabled={seeding}>
            <Database size={16} /> {seeding ? 'Seeding Database...' : 'Seed Sample Database'}
          </button>
          
          <div className="admin-tabs glass-card">
            {TABS.map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <motion.div className="admin-stats-grid" variants={stagger} initial="initial" animate="animate">
        {statCards.map(sc => (
          <motion.div key={sc.label} variants={fadeUp} className={`admin-stat-card card-${sc.color}`}>
            <div className={`admin-stat-icon icon-${sc.color}`}>{sc.icon}</div>
            <div>
              <div className="admin-stat-number">{sc.value.toLocaleString()}</div>
              <div className="admin-stat-label">{sc.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div className="admin-charts-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Top Cities */}
          {analytics?.topCities?.length > 0 && (
            <div className="admin-chart-card glass-card">
              <h3 className="chart-title">🏙 Top Cities by Trip Count</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.topCities.map(c => ({ name: c._id || c.name, count: c.count }))}>
                  <XAxis dataKey="name" stroke="#6C757D" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6C757D" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px', color: '#212529' }} />
                  <Bar dataKey="count" fill="#714B67" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Activities by Category */}
          {analytics?.activitiesByCategory?.length > 0 && (
            <div className="admin-chart-card glass-card">
              <h3 className="chart-title">🎯 Activities by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={analytics.activitiesByCategory.map(a => ({ name: a._id || a.name, value: a.count }))}
                    dataKey="value" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name}>
                    {analytics.activitiesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Users List */}
          <div className="admin-chart-card glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="chart-title">👤 Recently Registered Users</h3>
            <div className="recent-users-list">
              {analytics?.recentUsers?.map(u => (
                <div key={u._id || u.id} className="recent-user-row">
                  <div className="user-avatar-circle">{(u.firstName || 'U')[0]}</div>
                  <div style={{ flex: 1 }}>
                    <span className="user-row-name">{u.firstName} {u.lastName}</span>
                    <span className="user-row-email">{u.email}</span>
                  </div>
                  <span className="user-row-date">{u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : 'Recent'}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-users-table glass-card">
            <h3 className="chart-title" style={{ marginBottom: '1.25rem' }}>User Directory ({users.length})</h3>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id || u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-circle">{(u.firstName || 'U')[0]}</div>
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td style={{ color: '#495057', fontSize: '0.875rem' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-violet' : 'badge-cyan'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-emerald' : 'badge-rose'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{ color: '#6C757D', fontSize: '0.85rem' }}>{u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : 'Recent'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleToggleUser(u.id || u._id)}>
                            {u.isActive ? <ToggleRight size={18} color="#10B981" /> : <ToggleLeft size={18} color="#495057" />}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id || u._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
