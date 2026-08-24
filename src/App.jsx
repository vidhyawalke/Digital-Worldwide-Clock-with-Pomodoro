import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Pomodoro from './components/Pomodoro';
import YouTubePlayer from './components/YouTubePlayer';
import BackgroundPicker from './components/BackgroundPicker';
import { WALLPAPER_CATEGORIES } from './data/wallpapers';

/**
 * Main App Component
 * 
 * Beginner React Concepts:
 * 1. Root State Management: Storing global settings (tab, format, theme, wallpaper) at the top level.
 * 2. Lifting State Up: Passing state and functions down to child components via props.
 * 3. Conditional Rendering: Rendering specific components based on active tab state.
 * 4. CSS Custom Property updates and dynamic background rendering.
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
      // Pick a random landscape/art/city wallpaper
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
        />

        <main>
          {/* Main Digital Clock Banner (visible in dashboard and clock tabs) */}
          {(currentTab === 'dashboard' || currentTab === 'clock') && (
            <DigitalClock is24Hour={is24Hour} />
          )}

          {/* Tab: Combined Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div>
                <WorldClock is24Hour={is24Hour} />
              </div>
              <div>
                <Pomodoro />
                <YouTubePlayer />
              </div>
            </div>
          )}

          {/* Tab: World Clock Focus View */}
          {currentTab === 'clock' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <WorldClock is24Hour={is24Hour} />
            </div>
          )}

          {/* Tab: Pomodoro Focus View */}
          {currentTab === 'pomodoro' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <Pomodoro />
              <YouTubePlayer />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Digital Worldwide Clock & Pomodoro Focus Timer</p>
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
      </div>
    </div>
  );
}
