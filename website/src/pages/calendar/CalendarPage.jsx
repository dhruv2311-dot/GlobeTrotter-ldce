import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, List, Sparkles, MapPin } from 'lucide-react';
import api from '../../lib/api';
import './CalendarPage.css';

export default function CalendarPage() {
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('calendar');

  useEffect(() => {
    api.get('/trips').then(({ data }) => {
      const tripsData = data.data?.trips || data.trips || [];
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      const evts = [];
      tripsData.forEach(trip => {
        evts.push({
          id: trip.id || trip._id,
          title: `✈️ ${trip.tripName || trip.name}`,
          start: trip.startDate,
          end: trip.endDate,
          backgroundColor: trip.status === 'upcoming' ? '#017E84' : trip.status === 'ongoing' ? '#10B981' : '#714B67',
          borderColor: 'transparent',
          extendedProps: { trip },
        });
        trip.stops?.forEach(stop => {
          stop.activities?.forEach(act => {
            if (act.startTime) {
              evts.push({
                id: `${act.id || act._id}`,
                title: `📍 ${stop.city?.name || stop.city}: ${act.name}`,
                start: `${stop.startDate?.slice(0, 10)}T${act.startTime}`,
                backgroundColor: '#714B67',
                borderColor: 'transparent',
                extendedProps: { activity: act, city: stop.city?.name || stop.city, tripName: trip.tripName || trip.name },
              });
            }
          });
        });
      });
      setEvents(evts);
    }).catch(() => {
      setTrips([]);
    });
  }, []);

  const handleEventClick = ({ event }) => setSelectedEvent(event.extendedProps);

  return (
    <div className="calendar-page container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="calendar-header page-header">
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={12} /> Travel Schedule
          </div>
          <h1 className="page-title">Trip Calendar & Timeline 🗓</h1>
          <p className="page-subtitle">Visualize your upcoming destinations, departure dates, and daily itineraries</p>
        </div>

        <div className="calendar-tabs glass-card">
          <button className={`tab-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
            <Calendar size={15} /> Calendar
          </button>
          <button className={`tab-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <List size={15} /> Timeline
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        <motion.div className="calendar-container glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {view === 'calendar' ? (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
              height="auto"
              eventDisplay="block"
              eventClassNames="calendar-event"
            />
          ) : (
            <div className="timeline-view">
              {(trips || []).length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem' }}>
                  <Calendar size={48} className="empty-icon" />
                  <h3>No trips scheduled</h3>
                </div>
              ) : (
                <div className="timeline">
                  {(trips || []).map(trip => (
                    <div key={trip.id || trip._id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h3>{trip.tripName}</h3>
                          <span className={`badge badge-${trip.status === 'upcoming' ? 'amber' : trip.status === 'ongoing' ? 'emerald' : 'cyan'}`}>{trip.status}</span>
                        </div>
                        <p style={{ color: '#495057', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {trip.stops?.map((s, i) => <span key={i} className="city-chip">{s.city?.name || s.city}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {selectedEvent && (
          <motion.div className="event-detail glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem', marginLeft: 'auto', display: 'block' }} onClick={() => setSelectedEvent(null)}>× Close</button>
            {selectedEvent.trip ? (
              <>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>{selectedEvent.trip.tripName}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0', fontSize: '0.875rem' }}>{selectedEvent.trip.description}</p>
                <div className="flex gap-2 flex-wrap" style={{ marginTop: '0.75rem' }}>
                  {selectedEvent.trip.stops?.map((s, i) => <span key={i} className="city-chip">{s.city?.name || s.city}</span>)}
                </div>
              </>
            ) : (
              <>
                <span className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>{selectedEvent.city}</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>{selectedEvent.activity?.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Part of: {selectedEvent.tripName}</p>
                <p style={{ color: '#10B981', marginTop: '0.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>${selectedEvent.activity?.cost}</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
