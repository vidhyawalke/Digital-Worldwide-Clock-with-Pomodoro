import React, { useState, useEffect } from 'react';
import CleanNavbar from './components/CleanNavbar';
import SlidingSidebar from './components/SlidingSidebar';
import CenterPomodoroCard from './components/CenterPomodoroCard';
import CleanTasksCard from './components/CleanTasksCard';
import CleanWorldClockCard from './components/CleanWorldClockCard';
import CleanWeatherCard from './components/CleanWeatherCard';
import CleanYouTubeCard from './components/CleanYouTubeCard';
import WorldClock from './components/WorldClock';
import YouTubePlayer from './components/YouTubePlayer';
import DailyReportModal from './components/DailyReportModal';
import MethodModal from './components/MethodModal';
import BackgroundPicker from './components/BackgroundPicker';
import InstallModal from './components/InstallModal';
import ShortcutsModal from './components/ShortcutsModal';

export default function App() {
  // 1. Sliding Sidebar Open/Close Window state (default open, sliding window)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('timora_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // 2. Active Tab: 'timer' | 'tasks' | 'worldClock' | 'youtube'
  const [currentTab, setCurrentTab] = useState('timer');

  // 3. Theme Mode (Light by default as shown in image)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('timora_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 4. Custom Wallpaper Background
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    const saved = localStorage.getItem('app_wallpaper');
    return saved ? JSON.parse(saved) : null;
  });

  // 5. Modals State
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // 6. Stats
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    return saved ? JSON.parse(saved) : { completedToday: 4, totalMinutes: 100, streak: 12 };
  });

  // Save preferences
  useEffect(() => {
    localStorage.setItem('timora_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('timora_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (currentWallpaper) {
      localStorage.setItem('app_wallpaper', JSON.stringify(currentWallpaper));
    } else {
      localStorage.removeItem('app_wallpaper');
    }
  }, [currentWallpaper]);

  useEffect(() => {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  // Dynamic Background Wallpaper Style
  const getAppBackgroundStyle = () => {
    if (!currentWallpaper) return {};
    if (currentWallpaper.isColor) {
      return {
        backgroundColor: currentWallpaper.value,
        backgroundImage: 'none',
      };
    }
    if (currentWallpaper.url) {
      const overlay = isDarkMode
        ? 'linear-gradient(rgba(18, 16, 14, 0.78), rgba(18, 16, 14, 0.88))'
        : 'linear-gradient(rgba(250, 248, 245, 0.78), rgba(250, 248, 245, 0.88))';
      return {
        backgroundImage: `${overlay}, url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    return {};
  };

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Keyboard Shortcuts: `[` toggles sliding sidebar window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === '[') {
        setIsSidebarOpen(prev => !prev);
      } else if (e.key === '1') {
        setCurrentTab('timer');
      } else if (e.key === '2') {
        setCurrentTab('worldClock');
      } else if (e.key === '3') {
        setCurrentTab('youtube');
      } else if (e.key.toLowerCase() === 'b') {
        setIsBgPickerOpen(prev => !prev);
      } else if (e.key === '?') {
        setIsShortcutsModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSessionComplete = (minutes) => {
    setStats(prev => ({
      ...prev,
      completedToday: prev.completedToday + 1,
      totalMinutes: prev.totalMinutes + minutes,
      streak: prev.streak + 1
    }));
  };

  const handleTimeTracked = (seconds) => {
    // tracking
  };

  return (
    <div 
      className={`timora-app-root ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
      style={getAppBackgroundStyle()}
    >
      {/* Top Navbar */}
      <CleanNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenBackgroundPicker={() => setIsBgPickerOpen(true)}
      />

      {/* Main Workspace Frame with Sliding Window Layout */}
      <div className={`timora-workspace-layout ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        {/* Left Sliding Sidebar Panel */}
        <SlidingSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          completedSessions={stats.completedToday}
          totalTargetSessions={8}
          onOpenSettings={() => setIsBgPickerOpen(true)}
          onOpenAnalytics={() => setIsDailyReportOpen(true)}
        />

        {/* Center & Right Main Content Area */}
        <main className="timora-main-content-window">
          {/* Main Dashboard / Timer View */}
          {currentTab === 'timer' && (
            <div className="timora-two-column-stage">
              {/* Center Column: Big Pomodoro Card + Tasks Card */}
              <div className="stage-center-column">
                <CenterPomodoroCard
                  onSessionComplete={handleSessionComplete}
                  onTimeTracked={handleTimeTracked}
                />
                <CleanTasksCard />
              </div>

              {/* Right Column: World Clock, Weather, YouTube Study Player */}
              <div className="stage-right-column">
                <CleanWorldClockCard 
                  onOpenFullWorldClock={() => setCurrentTab('worldClock')}
                />
                <CleanWeatherCard />
                <CleanYouTubeCard />
              </div>
            </div>
          )}

          {/* Tasks Full View */}
          {currentTab === 'tasks' && (
            <div className="tab-full-view-container">
              <div className="view-header-bar">
                <button className="back-link-btn" onClick={() => setCurrentTab('timer')}>
                  &larr; Back to Dashboard
                </button>
                <h2>Daily Tasks & Goals</h2>
              </div>
              <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                <CleanTasksCard />
              </div>
            </div>
          )}

          {/* Full World Clock View */}
          {currentTab === 'worldClock' && (
            <div className="tab-full-view-container">
              <div className="view-header-bar">
                <button className="back-link-btn" onClick={() => setCurrentTab('timer')}>
                  &larr; Back to Dashboard
                </button>
                <h2>Worldwide Timezones Explorer</h2>
              </div>
              <WorldClock is24Hour={false} />
            </div>
          )}

          {/* Full YouTube Audio Lounge View */}
          {currentTab === 'youtube' && (
            <div className="tab-full-view-container">
              <div className="view-header-bar">
                <button className="back-link-btn" onClick={() => setCurrentTab('timer')}>
                  &larr; Back to Dashboard
                </button>
                <h2>Focus & Study Audio Lounge</h2>
              </div>
              <YouTubePlayer />
            </div>
          )}

          {/* Bottom Motivational Quote */}
          <footer className="timora-bottom-quote-bar">
            <p className="timora-quote-text">
              &ldquo;Discipline is choosing between what you want now and what you want most.&rdquo;
            </p>
          </footer>
        </main>
      </div>

      {/* ── MODALS ── */}
      <MethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
      />

      <DailyReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        records={[]}
      />

      {/* Custom Background Image & Wallpaper Picker Modal */}
      <BackgroundPicker
        isOpen={isBgPickerOpen}
        onClose={() => setIsBgPickerOpen(false)}
        currentWallpaper={currentWallpaper}
        onSelectWallpaper={(wp) => setCurrentWallpaper(wp)}
        onResetDefault={() => setCurrentWallpaper(null)}
        isDailyRefresh={false}
        setIsDailyRefresh={() => {}}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        installPrompt={installPrompt}
        onInstallSuccess={() => setInstallPrompt(null)}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
