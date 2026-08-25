import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Maximize2, 
  Minimize2, 
  PanelLeftClose, 
  PanelLeftOpen,
  Image as ImageIcon
} from 'lucide-react';
import ShinyText from './ShinyText';

export default function CleanNavbar({
  isSidebarOpen,
  onToggleSidebar,
  isDarkMode,
  setIsDarkMode,
  onOpenBackgroundPicker
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
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="timora-clean-navbar">
      {/* Left: Sidebar Toggle + Brand */}
      <div className="navbar-brand-section">
        <button
          className="sidebar-window-toggle-btn"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Close left panel (Slide left)' : 'Open left panel (Slide right)'}
        >
          {isSidebarOpen ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
        </button>
        <h1 className="timora-clean-logo">
          <ShinyText 
            text="Timora" 
            color={isDarkMode ? '#FBF9F5' : '#1F1D1B'} 
            shineColor="var(--primary)" 
            speed={2.5} 
            spread={100}
          />
        </h1>
      </div>

      {/* Right: Wallpaper, Light/Dark Mode & Fullscreen */}
      <div className="navbar-controls-section">
        {/* Custom Wallpaper Picker Button */}
        <button
          className="navbar-text-toggle-btn"
          onClick={onOpenBackgroundPicker}
          title="Change background image or upload your own"
        >
          <ImageIcon size={15} color="var(--primary)" />
          <span>Wallpaper</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          className="navbar-text-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
          <span>{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          className="navbar-text-toggle-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          <span>Fullscreen</span>
        </button>
      </div>
    </header>
  );
}
