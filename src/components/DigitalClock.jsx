import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Zap } from 'lucide-react';

/**
 * DigitalClock Component
 * 
 * Beginner React Concepts:
 * 1. useState: Stores the current date object and updates it.
 * 2. useEffect: Runs a side-effect (a 1-second interval timer).
 * 3. Cleanup Function: Returning a function inside useEffect clears the timer
 *    when the component unmounts to prevent memory leaks.
 */
export default function DigitalClock({ is24Hour }) {
  // 1. Declare state for current time
  const [time, setTime] = useState(new Date());

  // 2. Set up interval with useEffect
  useEffect(() => {
    // This runs once when component mounts
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 3. Cleanup function when component unmounts
    return () => clearInterval(timerId);
  }, []); // Empty dependency array means run once on mount

  // Helper functions for formatting time strings
  const getFormattedTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let period = '';

    if (!is24Hour) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
    }

    const formattedHours = String(hours).padStart(2, '0');

    return {
      hoursStr: `${formattedHours}:${minutes}`,
      secondsStr: seconds,
      periodStr: period
    };
  };

  const { hoursStr, secondsStr, periodStr } = getFormattedTime();

  // Date formatting: e.g. "Monday, August 24, 2026"
  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Timezone string
  const timezoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Progress bar calculation for current second in a minute (0-60)
  const secondsProgress = (time.getSeconds() / 60) * 100;

  return (
    <section className="glass-card clock-hero">
      <div className="clock-content">
        {/* Live Status Badge */}
        <div className="clock-badge">
          <span className="live-dot"></span>
          <span>Live Local Time</span>
        </div>

        {/* Big Glow Digital Time Display */}
        <div className="time-display">
          <span>{hoursStr}</span>
          <span className="time-seconds">:{secondsStr}</span>
          {!is24Hour && <span className="time-period">{periodStr}</span>}
        </div>

        {/* Date Display */}
        <div className="date-display">
          {dateStr}
        </div>

        {/* Animated Seconds Linear Progress */}
        <div className="seconds-bar-container" title={`${time.getSeconds()} seconds`}>
          <div 
            className="seconds-bar-fill"
            style={{ width: `${secondsProgress}%` }}
          ></div>
        </div>

        {/* Clock Metadata Chips */}
        <div className="clock-meta-tags">
          <div className="meta-chip">
            <Globe size={14} />
            <span>{timezoneStr}</span>
          </div>
          <div className="meta-chip">
            <Calendar size={14} />
            <span>Day {Math.ceil((time - new Date(time.getFullYear(), 0, 1)) / 86400000)} of Year</span>
          </div>
          <div className="meta-chip">
            <Zap size={14} />
            <span>{is24Hour ? '24-Hour Format' : '12-Hour Format'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
