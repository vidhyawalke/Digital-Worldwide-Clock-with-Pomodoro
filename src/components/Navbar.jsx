import React from 'react';
import { Clock, Timer, LayoutDashboard, Palette, Hourglass, Image as ImageIcon } from 'lucide-react';

/**
 * Navbar Component
 * 
 * Beginner React Concepts:
 * - Props: Passing state and setter functions from parent (App.jsx) to child (Navbar.jsx)
 * - Event Handling: onClick triggers callback functions
 */
export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  is24Hour, 
  setIs24Hour, 
  theme, 
  setTheme,
  onOpenBackgroundPicker
}) {
  const themes = [
    { id: 'default', label: 'Default' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'emerald', label: 'Emerald' },
    { id: 'sunset', label: 'Sunset' },
  ];

  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].id);
  };

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="logo-group">
        <div className="logo-icon">
          <Clock size={24} color="#ffffff" />
        </div>
        <div className="logo-text">
          <h1>ChronoFocus</h1>
          <span>Worldwide Clock & Pomodoro</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
          title="Combined View"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`tab-btn ${currentTab === 'clock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('clock')}
          title="World Clock Focus"
        >
          <Clock size={16} />
          <span>World Clock</span>
        </button>

        <button
          className={`tab-btn ${currentTab === 'pomodoro' ? 'active' : ''}`}
          onClick={() => setCurrentTab('pomodoro')}
          title="Pomodoro Timer"
        >
          <Timer size={16} />
          <span>Pomodoro</span>
        </button>
      </nav>

      {/* Controls: 12h/24h toggle, Background Picker, and Theme Cycler */}
      <div className="nav-controls">
        <button 
          className="control-btn"
          onClick={() => setIs24Hour(!is24Hour)}
          title="Switch 12h / 24h format"
        >
          <Hourglass size={15} />
          <span>{is24Hour ? '24 Hour' : '12 Hour'}</span>
        </button>

        <button 
          className="control-btn"
          onClick={onOpenBackgroundPicker}
          title="Change background wallpaper"
        >
          <ImageIcon size={15} />
          <span>Background</span>
        </button>

        <button 
          className="control-btn"
          onClick={cycleTheme}
          title="Change accent theme"
        >
          <Palette size={15} />
          <span style={{ textTransform: 'capitalize' }}>{theme}</span>
        </button>
      </div>
    </header>
  );
}
