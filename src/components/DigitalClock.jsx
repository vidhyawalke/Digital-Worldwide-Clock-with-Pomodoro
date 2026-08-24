import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Clock } from 'lucide-react';

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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const getFormattedTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let period = '';

    if (!is24Hour) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    const formattedHours = String(hours).padStart(2, '0');

    return {
      hoursStr: `${formattedHours}:${minutes}`,
      secondsStr: seconds,
      periodStr: period
    };
  };

  const { hoursStr, secondsStr, periodStr } = getFormattedTime();

  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timezoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const secondsProgress = (time.getSeconds() / 60) * 100;

  return (
    <section className="glass-card clock-hero">
      <div className="clock-content">
        {/* Live Status Badge */}
        <div className="clock-badge">
          <span className="live-dot"></span>
          <span>Local Time</span>
        </div>

        {/* Clean, Crisp Digital Time Readout */}
        <div className="time-display">
          <span>{hoursStr}</span>
          <span className="time-seconds">:{secondsStr}</span>
          {!is24Hour && <span className="time-period">{periodStr}</span>}
        </div>

        {/* Date Display */}
        <div className="date-display">
          {dateStr}
        </div>

        {/* Subtle Seconds Linear Progress */}
        <div className="seconds-bar-container" title={`${time.getSeconds()} seconds`}>
          <div 
            className="seconds-bar-fill"
            style={{ width: `${secondsProgress}%` }}
          ></div>
        </div>

        {/* Clock Metadata Chips */}
        <div className="clock-meta-tags">
          <div className="meta-chip">
            <Globe size={14} color="var(--primary)" />
            <span>{timezoneStr}</span>
          </div>
          <div className="meta-chip">
            <Calendar size={14} color="var(--primary)" />
            <span>Day {Math.ceil((time - new Date(time.getFullYear(), 0, 1)) / 86400000)} of {time.getFullYear()}</span>
          </div>
          <div className="meta-chip">
            <Clock size={14} color="var(--primary)" />
            <span>{is24Hour ? '24h Mode' : '12h Mode'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
