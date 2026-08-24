import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Pomodoro from './components/Pomodoro';
import WeatherWidget from './components/WeatherWidget';
import YouTubePlayer from './components/YouTubePlayer';
import BackgroundPicker from './components/BackgroundPicker';
import InstallModal from './components/InstallModal';
import ShortcutsModal from './components/ShortcutsModal';
import { WALLPAPER_CATEGORIES } from './data/wallpapers';

// Helper to calculate if a background color is dark or light
function isColorDark(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return true;
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return true;
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 140;
}

export default function App() {
  // 1. Current active view tab: 'dashboard' | 'clock' | 'pomodoro'
  const [currentTab, setCurrentTab] = useState('dashboard');

  // 2. 12-hour vs 24-hour display format preference
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('is24Hour_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 3. Wallpaper Background Customizer
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    const saved = localStorage.getItem('app_wallpaper');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDailyRefresh, setIsDailyRefresh] = useState(() => {
    const saved = localStorage.getItem('daily_refresh_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 4. Modals: Install & Shortcuts
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // Catch PWA beforeinstallprompt event for desktop app download
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === '1') {
        setCurrentTab('dashboard');
      } else if (e.key === '2') {
        setCurrentTab('clock');
      } else if (e.key === '3') {
        setCurrentTab('pomodoro');
      } else if (e.key.toLowerCase() === 'b') {
        setIsBgPickerOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'd') {
        setIsInstallModalOpen(prev => !prev);
      } else if (e.key === '?') {
        setIsShortcutsModalOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('is24Hour_pref', JSON.stringify(is24Hour));
  }, [is24Hour]);

  useEffect(() => {
    if (currentWallpaper) {
      localStorage.setItem('app_wallpaper', JSON.stringify(currentWallpaper));
    } else {
      localStorage.removeItem('app_wallpaper');
    }
  }, [currentWallpaper]);

  useEffect(() => {
    localStorage.setItem('daily_refresh_pref', JSON.stringify(isDailyRefresh));
  }, [isDailyRefresh]);

  // Handle daily refresh wallpaper rotation on mount
  useEffect(() => {
    if (isDailyRefresh) {
      const imageCategories = WALLPAPER_CATEGORIES.filter(c => c.type !== 'color');
      const randomCategory = imageCategories[Math.floor(Math.random() * imageCategories.length)];
      const randomItem = randomCategory.items[Math.floor(Math.random() * randomCategory.items.length)];
      setCurrentWallpaper(randomItem);
    }
  }, [isDailyRefresh]);

  // Dynamic Background Style
  const getAppBackgroundStyle = () => {
    if (!currentWallpaper) return {};

    if (currentWallpaper.isColor) {
      return {
        backgroundColor: currentWallpaper.value,
        backgroundImage: 'none',
      };
    }

    if (currentWallpaper.url) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.38)), url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

    return {};
  };

  const getThemeClass = () => {
    if (!currentWallpaper) return 'theme-default';
    if (currentWallpaper.isColor) {
      return isColorDark(currentWallpaper.value) ? 'theme-solid-dark' : 'theme-solid-light';
    }
    if (currentWallpaper.url) {
      return 'theme-image-wallpaper';
    }
    return 'theme-default';
  };

  const handleSelectWallpaper = (wallpaper) => {
    setCurrentWallpaper(wallpaper);
  };

  const handleResetDefaultBackground = () => {
    setCurrentWallpaper(null);
    setIsDailyRefresh(false);
  };

  return (
    <div className={`app-root-bg ${getThemeClass()}`} style={getAppBackgroundStyle()}>
      <div className="app-wrapper">
        {/* Top Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          is24Hour={is24Hour}
          setIs24Hour={setIs24Hour}
          onOpenBackgroundPicker={() => setIsBgPickerOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        />

        <main>
          {/* Main Digital Clock Banner (Only on Dashboard & World Clock tabs) */}
          {currentTab !== 'pomodoro' && (
            <DigitalClock is24Hour={is24Hour} />
          )}

          {/* Tab 1: Combined High-Efficiency Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="dashboard-grid">
              {/* Left Column: World Clock & Live Weather */}
              <div className="dashboard-col">
                <WorldClock is24Hour={is24Hour} />
                <WeatherWidget />
              </div>

              {/* Right Column: Pomodoro Focus Station & YouTube Study Music */}
              <div className="dashboard-col">
                <Pomodoro />
                <YouTubePlayer />
              </div>
            </div>
          )}

          {/* Tab 2: Dedicated World Clock View */}
          {currentTab === 'clock' && (
            <div className="clock-view-layout">
              <div className="world-clock-main-col">
                <WorldClock is24Hour={is24Hour} />
              </div>
              <div className="world-clock-side-col">
                <WeatherWidget />
              </div>
            </div>
          )}

          {/* Tab 3: Dedicated Pure Pomodoro Focus Screen (Strictly Pomodoro) */}
          {currentTab === 'pomodoro' && (
            <div className="pomodoro-view-layout">
              <div className="pomodoro-focus-container">
                <Pomodoro />
                <div style={{ marginTop: '1.25rem' }}>
                  <YouTubePlayer />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-logo-text">Timora</span>
              <span className="footer-tagline">Focus. Time. Anywhere.</span>
            </div>
            <div className="footer-links">
              <a
                href="https://timora-digital-worldwide-clock-with.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Live App
              </a>
              <a
                href="https://github.com/vidhyawalke/Timora-Digital-Worldwide-Clock-with-Pomodoro"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
            </div>
            <div className="footer-copy">
              <span>
                &copy; {new Date().getFullYear()} Vidhya Walke. All rights reserved.
              </span>
              <span className="footer-legal">
                Proprietary software &mdash; unauthorized reproduction or distribution is prohibited.
              </span>
            </div>
          </div>
        </footer>

        {/* Google Chrome Style Wallpaper Customizer Modal */}
        <BackgroundPicker
          isOpen={isBgPickerOpen}
          onClose={() => setIsBgPickerOpen(false)}
          currentWallpaper={currentWallpaper}
          onSelectWallpaper={handleSelectWallpaper}
          onResetDefault={handleResetDefaultBackground}
          isDailyRefresh={isDailyRefresh}
          setIsDailyRefresh={setIsDailyRefresh}
        />

        {/* Desktop App Download & Install Modal */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          installPrompt={installPrompt}
          onInstallSuccess={() => setInstallPrompt(null)}
        />

        {/* Keyboard Shortcuts Modal */}
        <ShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
      </div>
    </div>
  );
}
