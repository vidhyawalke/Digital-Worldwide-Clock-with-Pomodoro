import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Timer, 
  LayoutDashboard, 
  Hourglass, 
  Image as ImageIcon,
  Download,
  Maximize,
  Minimize,
  Keyboard
} from 'lucide-react';
import timoraLogo from '../assets/timora-logo.jpg';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  is24Hour, 
  setIs24Hour, 
  onOpenBackgroundPicker,
  onOpenInstallModal,
  onOpenShortcutsModal
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      {/* Brand Logo */}
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
          title="Dashboard View (Press 1)"
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

      {/* Controls */}
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
          title={isFullscreen ? 'Exit Fullscreen (Press F)' : 'Fullscreen (Press F)'}
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
      </div>
    </header>
  );
}
