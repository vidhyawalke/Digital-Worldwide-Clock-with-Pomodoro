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
import DailyReportModal from './components/DailyReportModal';
import { WALLPAPER_CATEGORIES } from './data/wallpapers';

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

  // 4. Modals: Install, Shortcuts, and Daily Progress Report
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
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
      } else if (e.key.toLowerCase() === 'p') {
        setIsDailyReportOpen(prev => !prev);
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.3)), url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

    return {};
  };

  const handleSelectWallpaper = (wallpaper) => {
    setCurrentWallpaper(wallpaper);
  };

  const handleResetDefaultBackground = () => {
    setCurrentWallpaper(null);
    setIsDailyRefresh(false);
  };

  return (
    <div className="app-root-bg" style={getAppBackgroundStyle()}>
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
          onOpenDailyReport={() => setIsDailyReportOpen(true)}
        />

        <main>
          {/* Main Digital Clock Banner (Compact Header) */}
          <div style={{ display: (currentTab === 'dashboard' || currentTab === 'clock') ? 'block' : 'none' }}>
            <DigitalClock is24Hour={is24Hour} />
          </div>

          {/* Tab 1: Combined High-Efficiency Dashboard (No Deep Scrolling) */}
          <div style={{ display: currentTab === 'dashboard' ? 'block' : 'none' }}>
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
          </div>

          {/* Tab 2: World Clock Focus View */}
          <div style={{ display: currentTab === 'clock' ? 'block' : 'none', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', alignItems: 'start' }}>
              <WorldClock is24Hour={is24Hour} />
              <div>
                <WeatherWidget />
                <YouTubePlayer />
              </div>
            </div>
          </div>

          {/* Tab 3: Pomodoro Focus View */}
          <div style={{ display: currentTab === 'pomodoro' ? 'block' : 'none', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <Pomodoro />
              <YouTubePlayer />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Timora &bull; Focus. Time. Anywhere.</p>
        </footer>

        {/* Daily Progress Report Modal (Print & Save as Image PNG) */}
        <DailyReportModal
          isOpen={isDailyReportOpen}
          onClose={() => setIsDailyReportOpen(false)}
        />

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
