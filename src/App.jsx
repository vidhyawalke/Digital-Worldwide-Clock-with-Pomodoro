import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Pomodoro from './components/Pomodoro';
import AmbientSound from './components/AmbientSound';

/**
 * Main App Component
 * 
 * Beginner React Concepts:
 * 1. Root State Management: Storing global settings (tab, format, theme) at the top level.
 * 2. Lifting State Up: Passing state and functions down to child components via props.
 * 3. Conditional Rendering: Rendering specific components based on active tab state.
 * 4. CSS Data Attributes: Applying themes with `document.documentElement.setAttribute('data-theme', theme)`.
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

  // Save 12h/24h preference
  useEffect(() => {
    localStorage.setItem('is24Hour_pref', JSON.stringify(is24Hour));
  }, [is24Hour]);

  // Apply theme to document root
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-wrapper">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        theme={theme}
        setTheme={setTheme}
      />

      <main>
        {/* Main Digital Clock Banner (always visible in dashboard and clock tabs) */}
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
              <AmbientSound />
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
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Pomodoro />
            <AmbientSound />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Digital Worldwide Clock & Pomodoro Focus Timer</p>
      </footer>
    </div>
  );
}
