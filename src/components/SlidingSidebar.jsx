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
  Sparkles
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
          <span className="focus-sub-text">Target Sessions</span>
          <div className="focus-bar-track">
            <div className="focus-bar-fill" style={{ width: `${focusPercent}%` }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
