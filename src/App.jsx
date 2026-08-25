import React, { useState, useEffect } from 'react';
import CleanNavbar from './components/CleanNavbar';
import CenterPomodoroCard from './components/CenterPomodoroCard';
import CleanTasksCard from './components/CleanTasksCard';
import CleanYouTubeCard from './components/CleanYouTubeCard';
import DailyQuoteStrip from './components/DailyQuoteStrip';
import LandingScreen from './components/LandingScreen';

export default function App() {
  // Landing screen
  const [showLanding, setShowLanding] = useState(() => {
    // Only show landing once per session
    return !sessionStorage.getItem('timora_landing_shown');
  });

  const handleLandingComplete = () => {
    sessionStorage.setItem('timora_landing_shown', '1');
    setShowLanding(false);
  };

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('timora_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('timora_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);



  if (showLanding) {
    return <LandingScreen onComplete={handleLandingComplete} />;
  }

  return (
    <div className={`timora-app-root ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      {/* ── TOP NAVBAR (Logo + 3 Widgets + Controls) ── */}
      <CleanNavbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* ── SINGLE STATIC MAIN STAGE ── */}
      <main className="timora-main-content-window">
        <div className="timora-two-column-stage">
          {/* Primary: Hero Pomodoro + Session Tasks */}
          <div className="stage-center-column">
            <CenterPomodoroCard isDarkMode={isDarkMode} />
            <CleanTasksCard />
          </div>

          {/* Secondary: YouTube Study Player */}
          <div className="stage-right-column">
            <CleanYouTubeCard />
          </div>
        </div>

        {/* Bottom Daily Quote Strip */}
        <footer className="timora-bottom-quote-bar">
          <DailyQuoteStrip isDarkMode={isDarkMode} />
        </footer>
      </main>
    </div>
  );
}
