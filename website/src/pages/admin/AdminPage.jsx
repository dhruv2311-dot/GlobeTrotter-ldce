import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Map, Globe, TrendingUp, AlertTriangle, Trash2, ToggleLeft, ToggleRight, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './AdminPage.css';

const COLORS = ['#1E88E5', '#FFB300', '#43A047', '#E53935', '#9C27B0', '#FF5722', '#00BCD4', '#795548'];

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
      setAnalytics(anlRes.data.analytics);
      setUsers(usrRes.data.users);
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
      toast.success('User status updated');
    } catch { toast.error('Failed to update user'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user and all their trips?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const { data } = await api.post('/admin/seed');
      toast.success(`Seeded ${data.cities} cities + ${data.activities} activities!`);
    } catch { toast.error('Seeding failed'); }
    finally { setSeeding(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const TABS = ['overview', 'users', 'analytics'];

  const statCards = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: <Users size={22} />, color: 'primary' },
    { label: 'Total Trips', value: analytics?.totalTrips || 0, icon: <Map size={22} />, color: 'success' },
    { label: 'Public Trips', value: analytics?.publicTrips || 0, icon: <Globe size={22} />, color: 'accent' },
    { label: 'Cities', value: analytics?.totalCities || 0, icon: <TrendingUp size={22} />, color: 'warning' },
  ];

  return (
    <div className="admin-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="admin-header">
        <div>
          <h1 className="page-title"><BarChart3 size={28} style={{ display: 'inline', color: 'var(--primary)' }} /> Admin Panel</h1>
          <p className="page-subtitle">GlobeTrotter Platform Overview</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleSeedData} disabled={seeding}>
          <Database size={16} /> {seeding ? 'Seeding...' : 'Seed Sample Data'}
        </button>
        <div className="admin-tabs">
          {TABS.map(t => <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
        </div>
      </div>

      {/* Stats */}
      <motion.div className="admin-stats" variants={stagger} initial="initial" animate="animate">
        {statCards.map(sc => (
          <motion.div key={sc.label} variants={fadeUp} className={`stat-card stat-card-${sc.color}`}>
            <div className={`stat-icon stat-icon-${sc.color}`}>{sc.icon}</div>
            <div className="stat-number">{sc.value.toLocaleString()}</div>
            <div className="stat-label">{sc.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <motion.div className="admin-charts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Top Cities */}
          {analytics?.topCities?.length > 0 && (
            <div className="admin-chart-card glass-card">
              <h3>🏙 Top Cities by Trip Count</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.topCities.map(c => ({ name: c._id, count: c.count }))} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Activities by category */}
          {analytics?.activitiesByCategory?.length > 0 && (
            <div className="admin-chart-card glass-card">
              <h3>🎯 Activities by Category</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.activitiesByCategory.map(a => ({ name: a._id, value: a.count }))}
                    dataKey="value" cx="50%" cy="50%" outerRadius={100} label={({ name }) => name}>
                    {analytics.activitiesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Trip status pie */}
          {analytics?.tripsByStatus?.length > 0 && (
            <div className="admin-chart-card glass-card">
              <h3>📊 Trips by Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.tripsByStatus.map(s => ({ name: s._id, value: s.count }))}
                    dataKey="value" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                    {analytics.tripsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent users */}
          <div className="admin-chart-card glass-card">
            <h3>👤 Recently Joined Users</h3>
            <div className="recent-users-list">
              {analytics?.recentUsers?.map(u => (
                <div key={u._id} className="recent-user-row">
                  <img src={u.profileImage} className="avatar avatar-sm" alt="" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${u.firstName}&background=1E88E5&color=fff`} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.firstName} {u.lastName}</span>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{u.email}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-users-table glass-card">
            <h3><Users size={18} /> User Management ({users.length})</h3>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <img src={u.profileImage} className="avatar avatar-sm" alt="" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${u.firstName}&background=1E88E5&color=fff`} />
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-muted'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{format(new Date(u.createdAt), 'MMM d, yy')}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-ghost btn-sm" onClick={() => handleToggleUser(u._id)}>
                            {u.isActive ? <ToggleRight size={16} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={16} />}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
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
