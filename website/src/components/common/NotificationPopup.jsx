import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, MapPin, Calendar, Sparkles, X, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import './NotificationPopup.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Trip to Tokyo Confirmed',
    message: 'Your 7-day Tokyo itinerary is ready with 12 planned activities.',
    time: '10m ago',
    type: 'trip',
    read: false,
    icon: MapPin,
    color: '#714B67',
  },
  {
    id: 2,
    title: 'Weather Update for Paris',
    message: 'Sunny skies expected for your upcoming trip to France next week.',
    time: '2h ago',
    type: 'trip',
    read: false,
    icon: Compass,
    color: '#017E84',
  },
  {
    id: 3,
    title: 'Odoo Hackathon Feature Ready',
    message: 'New AI Itinerary Generator module has been unlocked!',
    time: '1d ago',
    type: 'system',
    read: true,
    icon: Sparkles,
    color: '#714B67',
  },
  {
    id: 4,
    title: 'New Community Like',
    message: 'Alex liked your "Swiss Alps Expedition" itinerary.',
    time: '2d ago',
    type: 'social',
    read: true,
    icon: Calendar,
    color: '#10B981',
  },
];

export default function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Cleared all notifications');
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'trips') return n.type === 'trip';
    return true;
  });

  return (
    <div className="notif-dropdown">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-title-wrap">
          <div className="notif-bell-icon">
            <Bell size={18} />
          </div>
          <h3>Notifications</h3>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount} new</span>}
        </div>
        <div className="notif-actions">
          {unreadCount > 0 && (
            <button className="notif-action-btn" onClick={markAllRead} title="Mark all read">
              <CheckCheck size={16} />
            </button>
          )}
          {notifications.length > 0 && (
            <button className="notif-action-btn danger" onClick={clearAll} title="Clear all">
              <Trash2 size={16} />
            </button>
          )}
          <button className="notif-action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notif-tabs">
        <button
          className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`notif-tab ${filter === 'trips' ? 'active' : ''}`}
          onClick={() => setFilter('trips')}
        >
          Trips
        </button>
      </div>

      {/* List */}
      <div className="notif-list">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <Bell size={36} opacity={0.3} />
            <p>No notifications yet</p>
            <span>You're all caught up!</span>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`notif-item ${!item.read ? 'unread' : ''}`}
                onClick={() => toggleRead(item.id)}
              >
                <div
                  className="notif-item-icon"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="notif-item-content">
                  <div className="notif-item-head">
                    <span className="notif-item-title">{item.title}</span>
                    <span className="notif-item-time">{item.time}</span>
                  </div>
                  <p className="notif-item-msg">{item.message}</p>
                </div>
                {!item.read && <span className="notif-dot" style={{ background: item.color }} />}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="notif-footer">
        <span>GlobeTrotter Travel Alerts</span>
      </div>
    </div>
  );
}
