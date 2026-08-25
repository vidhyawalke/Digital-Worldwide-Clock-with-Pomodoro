import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  ArrowRight, 
  Flame, 
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle2,
  LogOut,
  Sparkles
} from 'lucide-react';

const INITIAL_EVENTS = [
  { id: '1', title: 'Project Deadline', time: '11:00 AM', color: '#D95D39', date: 24 },
  { id: '2', title: 'Client Call', time: '3:00 PM', color: '#3A86FF', date: 24 },
  { id: '3', title: 'Gym', time: '6:30 PM', color: '#386641', date: 24 },
];

export default function RightSidebar({ onOpenAnalytics, userEmail = 'vidhya@gmail.com' }) {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 24)); // May 2025 default or today
  const [selectedDay, setSelectedDay] = useState(24);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('timora_calendar_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventColor, setNewEventColor] = useState('#D95D39');

  const saveEvents = (newEvs) => {
    setEvents(newEvs);
    localStorage.setItem('timora_calendar_events', JSON.stringify(newEvs));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Generate calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  // Convert so Mon is 0, Sun is 6
  const adjustedFirstDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  // Prev month padding
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }
  // Next month padding to fill grid
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= (remaining > 0 ? remaining : 42 - calendarDays.length); i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEv = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      time: newEventTime.trim() || '12:00 PM',
      color: newEventColor,
      date: selectedDay
    };
    saveEvents([...events, newEv]);
    setNewEventTitle('');
    setNewEventTime('');
    setIsAddingEvent(false);
  };

  const handleDeleteEvent = (id, e) => {
    e.stopPropagation();
    saveEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="right-sidebar-stack">
      {/* ── 1. GOOGLE ACCOUNT CONNECTION CARD ── */}
      <div 
        className="sidebar-account-card"
        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
      >
        <div className="account-card-left">
          {/* Google G Logo SVG */}
          <div className="google-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27A7.17 7.17 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <div className="account-text-wrap">
            <span className="account-connected-label">Connected with Google</span>
            <span className="account-email-sub">{userEmail}</span>
          </div>
        </div>
        <ChevronDown size={15} color="var(--text-muted)" />

        {/* Dropdown Menu */}
        {showAccountDropdown && (
          <div className="account-dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <div className="account-dropdown-header">
              <div className="account-avatar-sm">V</div>
              <div>
                <strong>Vidhya Walke</strong>
                <p>{userEmail}</p>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item">
              <Sparkles size={14} color="var(--primary)" />
              <span>Cloud Auto-Sync: Active</span>
            </div>
            <div className="dropdown-item">
              <CheckCircle2 size={14} color="#386641" />
              <span>Timora Pro License</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. INTERACTIVE CALENDAR & TODAY'S EVENTS ── */}
      <div className="sidebar-calendar-card">
        {/* Calendar Month Header */}
        <div className="calendar-month-header">
          <span className="calendar-month-title">{monthName}</span>
          <div className="calendar-nav-arrows">
            <button className="cal-nav-btn" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={14} />
            </button>
            <button className="cal-nav-btn" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="calendar-weekdays-grid">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>

        {/* Days Grid */}
        <div className="calendar-days-grid">
          {calendarDays.map((item, idx) => {
            const isSelected = item.isCurrentMonth && item.day === selectedDay;
            const hasEvents = item.isCurrentMonth && events.some(ev => ev.date === item.day);

            return (
              <div 
                key={idx}
                className={`cal-day-cell ${item.isCurrentMonth ? 'in-month' : 'out-month'} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (item.isCurrentMonth) setSelectedDay(item.day);
                }}
              >
                <span>{item.day}</span>
                {hasEvents && !isSelected && <span className="cal-event-dot"></span>}
              </div>
            );
          })}
        </div>

        {/* Today's Events Divider & List */}
        <div className="calendar-events-section">
          <div className="events-header">
            <span className="events-title">Today's Events</span>
            <button 
              className="events-add-btn" 
              onClick={() => setIsAddingEvent(!isAddingEvent)}
              title="Add new event"
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>

          {/* Add Event Form */}
          {isAddingEvent && (
            <form onSubmit={handleAddEvent} className="add-event-mini-form">
              <input
                type="text"
                placeholder="Event name (e.g. Design Review)"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="11:00 AM"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  style={{ width: '90px' }}
                />
                <select 
                  value={newEventColor} 
                  onChange={(e) => setNewEventColor(e.target.value)}
                  style={{ borderRadius: '6px', padding: '0.3rem' }}
                >
                  <option value="#D95D39">Coral</option>
                  <option value="#3A86FF">Blue</option>
                  <option value="#386641">Green</option>
                  <option value="#8338EC">Purple</option>
                </select>
                <button type="submit" className="task-submit-btn" style={{ padding: '0.3rem 0.6rem' }}>
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Events List */}
          <div className="events-list">
            {events.map((ev) => (
              <div key={ev.id} className="event-item-row">
                <div className="event-item-left">
                  <span className="event-color-dot" style={{ backgroundColor: ev.color }}></span>
                  <span className="event-name">{ev.title}</span>
                </div>
                <div className="event-item-right">
                  <span className="event-time">{ev.time}</span>
                  <button 
                    className="event-del-btn" 
                    onClick={(e) => handleDeleteEvent(ev.id, e)}
                    title="Delete event"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. YOUR PROGRESS CARD ── */}
      <div className="sidebar-progress-card">
        <div className="progress-card-header">
          <span className="progress-card-title">Your Progress</span>
          <button 
            className="progress-view-all-link"
            onClick={onOpenAnalytics}
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Weekly Focus Bar */}
        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Weekly Focus</span>
            <span className="metric-percentage">85%</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-fill" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Monthly Focus Bar */}
        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Monthly Focus</span>
            <span className="metric-percentage">72%</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-fill" style={{ width: '72%' }}></div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="progress-streak-row">
          <div className="streak-left">
            <span className="streak-fire">🔥</span>
            <span className="streak-label">Current Streak</span>
          </div>
          <div className="streak-number">
            <span className="streak-dot">●</span>
            <span>12 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
