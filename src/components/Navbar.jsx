import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Timer, 
  LayoutDashboard, 
  Palette, 
  Hourglass, 
  Image as ImageIcon,
  Download,
  Maximize,
  Minimize,
  Keyboard
} from 'lucide-react';
import timoraLogo from '../assets/timora-logo.jpg';

/**
 * Navbar Component
 * 
 * Beginner React Concepts:
 * - Props: Passing state and setter functions from parent (App.jsx) to child (Navbar.jsx)
 * - Fullscreen API: document.documentElement.requestFullscreen()
 */
export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  is24Hour, 
  setIs24Hour, 
  theme, 
  setTheme,
  onOpenBackgroundPicker,
  onOpenInstallModal,
  onOpenShortcutsModal
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="navbar">
      {/* Brand Logo with Official Timora Icon */}
      <div className="logo-group">
        <img 
          src={timoraLogo} 
          alt="Timora Logo" 
          className="brand-logo-img" 
        />
        <div className="logo-text">
          <h1>Timora</h1>
          <span>Focus. Time. Anywhere.</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
          title="Combined View (Press 1)"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`tab-btn ${currentTab === 'clock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('clock')}
          title="World Clock Focus (Press 2)"
        >
          <Clock size={16} />
          <span>World Clock</span>
        </button>

        <button
          className={`tab-btn ${currentTab === 'pomodoro' ? 'active' : ''}`}
          onClick={() => setCurrentTab('pomodoro')}
          title="Pomodoro Timer (Press 3)"
        >
          <Timer size={16} />
          <span>Pomodoro</span>
        </button>
      </nav>

      {/* Controls: 12h/24h toggle, Background Picker, Desktop Download, Fullscreen & Shortcuts */}
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
          title="Change background wallpaper (Press B)"
        >
          <ImageIcon size={15} />
          <span>Background</span>
        </button>

        <button 
          className="control-btn download-app-btn"
          onClick={onOpenInstallModal}
          title="Download Timora as Desktop App (Press D)"
        >
          <Download size={15} />
          <span>Download App</span>
        </button>

        <button 
          className="control-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen (Press F)' : 'Fullscreen Focus (Press F)'}
        >
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>

        <button 
          className="control-btn"
          onClick={onOpenShortcutsModal}
          title="Keyboard Shortcuts (Press ?)"
        >
          <Keyboard size={15} />
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
