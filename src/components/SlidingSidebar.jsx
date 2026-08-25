import React, { useState } from 'react';
import { 
  Timer, 
  CheckSquare, 
  Globe2, 
  PlaySquare, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export default function SlidingSidebar({
  isOpen,
  onToggle,
  currentTab,
  setCurrentTab,
  completedSessions = 4,
  totalTargetSessions = 8,
  onOpenSettings,
  onOpenAnalytics,
  userEmail = 'vidhya@gmail.com'
}) {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 24)); // May 2025
  const [selectedDay, setSelectedDay] = useState(24);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const adjustedFirstDay = (firstDayIndex + 6) % 7; // Mon is 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= (remaining > 0 ? remaining : 42 - calendarDays.length); i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  const navItems = [
    { id: 'timer', label: 'Timer', icon: <Timer size={17} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={17} /> },
    { id: 'worldClock', label: 'World Clock', icon: <Globe2 size={17} /> },
    { id: 'youtube', label: 'YouTube', icon: <PlaySquare size={17} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  const handleNavClick = (id) => {
    if (id === 'analytics') {
      onOpenAnalytics();
    } else if (id === 'settings') {
      onOpenSettings();
    } else {
      setCurrentTab(id);
    }
  };

  const focusPercent = Math.min(100, Math.round((completedSessions / totalTargetSessions) * 100));

  return (
    <aside className={`timora-sliding-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-inner-scroll">
        {/* Top Header / Toggle */}
        <div className="sidebar-top-row">
          <span className="sidebar-section-title">Navigation</span>
          <button 
            className="sidebar-close-toggle-btn"
            onClick={onToggle}
            title="Close sidebar panel (Slide left)"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* 1. Main Navigation Links */}
        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="sidebar-divider"></div>

        {/* 2. Mini Calendar Widget */}
        <div className="sidebar-calendar-widget">
          <div className="sidebar-cal-header">
            <button className="cal-arrow-btn" onClick={handlePrevMonth} title="Previous month">
              <ChevronLeft size={14} />
            </button>
            <span className="sidebar-cal-title">{monthName}</span>
            <button className="cal-arrow-btn" onClick={handleNextMonth} title="Next month">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="sidebar-weekdays-row">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          <div className="sidebar-days-matrix">
            {calendarDays.map((item, idx) => {
              const isSelected = item.isCurrentMonth && item.day === selectedDay;
              return (
                <div
                  key={idx}
                  className={`sidebar-day-cell ${item.isCurrentMonth ? 'in-month' : 'out-month'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (item.isCurrentMonth) setSelectedDay(item.day);
                  }}
                >
                  <span>{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Today's Focus Card */}
        <div className="sidebar-focus-stats-card">
          <span className="focus-card-label">Today's Focus</span>
          <div className="focus-numbers-row">
            <span className="focus-big-count">{completedSessions} / {totalTargetSessions}</span>
          </div>
          <span className="focus-sub-text">Sessions Completed</span>
          <div className="focus-bar-track">
            <div className="focus-bar-fill" style={{ width: `${focusPercent}%` }}></div>
          </div>
        </div>

        {/* 4. Signed In with Google Card */}
        <div className="sidebar-google-card">
          <div className="google-user-row">
            <div className="google-g-logo">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27A7.17 7.17 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <div className="google-details">
              <span className="google-status">Signed in with Google</span>
              <span className="google-email">{userEmail}</span>
            </div>
          </div>
          <button className="google-signout-btn" onClick={() => alert('Account synced.')}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
