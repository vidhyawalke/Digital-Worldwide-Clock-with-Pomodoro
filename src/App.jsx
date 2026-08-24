import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Pomodoro from './components/Pomodoro';
import YouTubePlayer from './components/YouTubePlayer';
import BackgroundPicker from './components/BackgroundPicker';
import InstallModal from './components/InstallModal';
import ShortcutsModal from './components/ShortcutsModal';
import { WALLPAPER_CATEGORIES } from './data/wallpapers';

/**
 * Main App Component
 * 
 * Beginner React Concepts:
 * 1. Persistent DOM mounting: Keeping media players (YouTube) mounted permanently in the DOM 
 *    so video/audio playback does not reset or pause when switching between tabs.
 * 2. PWA Installation Event Listener (`beforeinstallprompt`).
 * 3. Global Keyboard Shortcuts Listener with event target filtering (ignoring when typing in inputs).
 * 4. CSS-based view toggling (`display: block/none`) to preserve component state.
 */
export default function App() {
  // 1. Current active view tab: 'dashboard' | 'clock' | 'pomodoro'
  const [currentTab, setCurrentTab] = useState('dashboard');

  // 2. 12-hour vs 24-hour display format preference
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('is24Hour_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 3. Theme selection: 'default' | 'cyberpunk' | 'emerald' | 'sunset'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'default';
  });

  // 4. Wallpaper Background Customizer
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    const saved = localStorage.getItem('app_wallpaper');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDailyRefresh, setIsDailyRefresh] = useState(() => {
    const saved = localStorage.getItem('daily_refresh_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 5. Desktop App Install State & Shortcuts Modal
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
      // Ignore shortcut keys if user is typing in an input or textarea
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
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
        backgroundImage: `linear-gradient(rgba(10, 14, 23, 0.72), rgba(10, 14, 23, 0.85)), url(${currentWallpaper.url})`,
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
          theme={theme}
          setTheme={setTheme}
          onOpenBackgroundPicker={() => setIsBgPickerOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        />

        <main>
          {/* Main Digital Clock Banner (visible in dashboard and clock tabs) */}
          <div style={{ display: (currentTab === 'dashboard' || currentTab === 'clock') ? 'block' : 'none' }}>
            <DigitalClock is24Hour={is24Hour} />
          </div>

          {/* Tab 1: Combined Dashboard */}
          <div style={{ display: currentTab === 'dashboard' ? 'block' : 'none' }}>
            <div className="dashboard-grid">
              <div>
                <WorldClock is24Hour={is24Hour} />
              </div>
              <div>
                <Pomodoro />
              </div>
            </div>
          </div>

          {/* Tab 2: World Clock Focus View */}
          <div style={{ display: currentTab === 'clock' ? 'block' : 'none', maxWidth: '1000px', margin: '0 auto' }}>
            <WorldClock is24Hour={is24Hour} />
          </div>

          {/* Tab 3: Pomodoro Focus View */}
          <div style={{ display: currentTab === 'pomodoro' ? 'block' : 'none', maxWidth: '640px', margin: '0 auto' }}>
            <Pomodoro />
          </div>

          {/* Persistent YouTube Media Player */}
          <div className="persistent-yt-section">
            <YouTubePlayer />
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Timora &bull; Focus. Time. Anywhere.</p>
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
