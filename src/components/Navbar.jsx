import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  Timer, 
  Globe2, 
  PlaySquare, 
  BarChart3, 
  BookOpen,
  Sparkles,
  Download,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isDarkMode, 
  setIsDarkMode,
  onOpenAnalytics,
  onOpenMethod,
  onOpenBackgroundPicker,
  onOpenInstallModal
}) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="timora-top-navbar">
      {/* ── Brand Logo ── */}
      <div className="timora-brand-group" onClick={() => setCurrentTab('dashboard')}>
        <div className="timora-logo-mark">
          {/* Stylized circle & rays icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="var(--primary)" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="3.5" fill="var(--primary)" />
            <line x1="12" y1="3" x2="12" y2="6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="21" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="6" y2="12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="12" x2="21" y2="12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="timora-brand-name">Timora</span>
      </div>

      {/* ── Center Nav Tabs (Timer, World Clock, YouTube, Analytics, Method) ── */}
      <nav className="timora-center-nav">
        <button
          className={`nav-pill-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <span>Timer</span>
        </button>

        <button
          className={`nav-pill-btn ${currentTab === 'worldClock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('worldClock')}
        >
          <span>World Clock</span>
        </button>

        <button
          className={`nav-pill-btn ${currentTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setCurrentTab('youtube')}
        >
          <span>YouTube</span>
        </button>

        <button
          className={`nav-pill-btn ${currentTab === 'analytics' ? 'active' : ''}`}
          onClick={() => {
            onOpenAnalytics();
          }}
        >
          <span>Analytics</span>
        </button>

        <button
          className="nav-pill-btn"
          onClick={() => {
            onOpenMethod();
          }}
        >
          <span>Method</span>
        </button>
      </nav>

      {/* ── Right Action Controls ── */}
      <div className="timora-right-actions">
        {/* Theme Toggle (Sun/Moon) */}
        <button 
          className="nav-icon-action-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun size={17} /> : <Sun size={17} />}
        </button>

        {/* User Profile Avatar Pill with Dropdown */}
        <div className="profile-pill-wrapper">
          <button 
            className="user-profile-pill"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="profile-avatar-circle">V</div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown-popup" onClick={(e) => e.stopPropagation()}>
              <div className="profile-dropdown-user-info">
                <div className="profile-avatar-circle lg">V</div>
                <div>
                  <div className="user-name">Vidhya Walke</div>
                  <div className="user-email">vidhya@gmail.com</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              
              <button 
                className="profile-menu-item"
                onClick={() => {
                  onOpenBackgroundPicker();
                  setShowProfileDropdown(false);
                }}
              >
                <ImageIcon size={14} color="var(--primary)" />
                <span>Change Wallpaper / Theme</span>
              </button>

              <button 
                className="profile-menu-item"
                onClick={() => {
                  onOpenInstallModal();
                  setShowProfileDropdown(false);
                }}
              >
                <Download size={14} color="var(--primary)" />
                <span>Install Desktop App</span>
              </button>

              <div className="dropdown-divider"></div>
              <div className="profile-menu-item synced-status">
                <CheckCircle2 size={14} color="#386641" />
                <span>Google Cloud Sync Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
