import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FocusTimerCard from './components/FocusTimerCard';
import QuickClockStack from './components/QuickClockStack';
import TasksWidget from './components/TasksWidget';
import RightSidebar from './components/RightSidebar';
import StudyFocusCard from './components/StudyFocusCard';
import SummaryBar from './components/SummaryBar';
import WorldClock from './components/WorldClock';
import YouTubePlayer from './components/YouTubePlayer';
import DailyReportModal from './components/DailyReportModal';
import MethodModal from './components/MethodModal';
import BackgroundPicker from './components/BackgroundPicker';
import InstallModal from './components/InstallModal';
import ShortcutsModal from './components/ShortcutsModal';
import { WALLPAPER_CATEGORIES } from './data/wallpapers';

export default function App() {
  // 1. Current active tab: 'dashboard' | 'worldClock' | 'youtube'
  const [currentTab, setCurrentTab] = useState('dashboard');

  // 2. Theme State (Light Warm Minimalist vs Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('timora_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 3. 12-hour vs 24-hour preference
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('is24Hour_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 4. Wallpaper background
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    const saved = localStorage.getItem('app_wallpaper');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDailyRefresh, setIsDailyRefresh] = useState(() => {
    const saved = localStorage.getItem('daily_refresh_pref');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // 5. Modals State
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // 6. Global Stats & Records
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    return saved ? JSON.parse(saved) : { completedToday: 4, totalMinutes: 100, streak: 12 };
  });

  const [taskCompletionPercent, setTaskCompletionPercent] = useState(85);

  // Catch PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('timora_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('is24Hour_pref', JSON.stringify(is24Hour));
  }, [is24Hour]);

  useEffect(() => {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === '1') setCurrentTab('dashboard');
      else if (e.key === '2') setCurrentTab('worldClock');
      else if (e.key === '3') setCurrentTab('youtube');
      else if (e.key.toLowerCase() === 'b') setIsBgPickerOpen(prev => !prev);
      else if (e.key.toLowerCase() === 'd') setIsInstallModalOpen(prev => !prev);
      else if (e.key === '?') setIsShortcutsModalOpen(prev => !prev);
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
    // optional granular tracking
  };

  const handleTasksChange = (tasksList) => {
    if (tasksList.length === 0) {
      setTaskCompletionPercent(0);
      return;
    }
    const completed = tasksList.filter(t => t.completed).length;
    setTaskCompletionPercent(Math.round((completed / tasksList.length) * 100));
  };

  const getThemeClass = () => {
    if (isDarkMode) return 'theme-dark';
    if (currentWallpaper) return 'theme-custom-bg';
    return 'theme-warm-light';
  };

  return (
    <div className={`timora-app-root ${getThemeClass()}`}>
      <div className="timora-main-container">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenAnalytics={() => setIsDailyReportOpen(true)}
          onOpenMethod={() => setIsMethodModalOpen(true)}
          onOpenBackgroundPicker={() => setIsBgPickerOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />

        {/* ── MAIN CONTENT VIEW ── */}
        <main className="timora-content-body">
          {/* TAB 1: MAIN DASHBOARD (Exact match to reference screenshot) */}
          {currentTab === 'dashboard' && (
            <div className="timora-dashboard-grid-layout">
              {/* Column 1: Focus Timer Card */}
              <div className="grid-area-timer">
                <FocusTimerCard 
                  onSessionComplete={handleSessionComplete}
                  onTimeTracked={handleTimeTracked}
                />
              </div>

              {/* Column 2: Quick Clock Stack (Live Clock, Weather, World Clock) */}
              <div className="grid-area-clocks">
                <QuickClockStack 
                  is24Hour={is24Hour}
                  setIs24Hour={setIs24Hour}
                  onOpenWorldClockTab={() => setCurrentTab('worldClock')}
                />
              </div>

              {/* Column 3: Daily Routine Tasks */}
              <div className="grid-area-tasks">
                <TasksWidget onTasksChange={handleTasksChange} />
              </div>

              {/* Column 4: Right Sidebar (Google Account, Calendar, Progress) */}
              <div className="grid-area-sidebar">
                <RightSidebar 
                  onOpenAnalytics={() => setIsDailyReportOpen(true)}
                />
              </div>

              {/* Middle Section: Study With Focus banner (Spans cols 1-3) */}
              <div className="grid-area-study">
                <StudyFocusCard 
                  onOpenFullYouTube={() => setCurrentTab('youtube')}
                />
              </div>

              {/* Bottom Section: Summary Bar (Full width) */}
              <div className="grid-area-summary">
                <SummaryBar 
                  completedSessions={stats.completedToday}
                  targetSessions={8}
                  focusMinutes={stats.totalMinutes}
                  taskCompletionPercent={taskCompletionPercent}
                  streakDays={stats.streak}
                  onOpenAnalytics={() => setIsDailyReportOpen(true)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: FULL WORLD CLOCK VIEW */}
          {currentTab === 'worldClock' && (
            <div className="world-clock-full-view">
              <div className="view-header-row">
                <button 
                  className="back-to-dash-btn"
                  onClick={() => setCurrentTab('dashboard')}
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="view-title">Worldwide Timezones Explorer</h2>
              </div>
              <WorldClock is24Hour={is24Hour} />
            </div>
          )}

          {/* TAB 3: FULL YOUTUBE FOCUS PLAYER VIEW */}
          {currentTab === 'youtube' && (
            <div className="youtube-full-view">
              <div className="view-header-row">
                <button 
                  className="back-to-dash-btn"
                  onClick={() => setCurrentTab('dashboard')}
                >
                  &larr; Back to Dashboard
                </button>
                <h2 className="view-title">Focus & Study Audio Lounge</h2>
              </div>
              <YouTubePlayer />
            </div>
          )}
        </main>

        {/* ── MODALS ── */}
        {/* Method Modal */}
        <MethodModal
          isOpen={isMethodModalOpen}
          onClose={() => setIsMethodModalOpen(false)}
        />

        {/* Analytics & Daily Progress Report Modal */}
        <DailyReportModal
          isOpen={isDailyReportOpen}
          onClose={() => setIsDailyReportOpen(false)}
          records={[]}
        />

        {/* Wallpaper Background Customizer */}
        <BackgroundPicker
          isOpen={isBgPickerOpen}
          onClose={() => setIsBgPickerOpen(false)}
          currentWallpaper={currentWallpaper}
          onSelectWallpaper={setCurrentWallpaper}
          onResetDefault={() => { setCurrentWallpaper(null); setIsDailyRefresh(false); }}
          isDailyRefresh={isDailyRefresh}
          setIsDailyRefresh={setIsDailyRefresh}
        />

        {/* Install Modal */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          installPrompt={installPrompt}
          onInstallSuccess={() => setInstallPrompt(null)}
        />

        {/* Shortcuts Modal */}
        <ShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
      </div>
    </div>
  );
}
