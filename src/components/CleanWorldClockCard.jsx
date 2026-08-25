import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

const DEFAULT_PINNED_CITIES = [
  { id: '1', name: 'New York', timezone: 'America/New_York' },
  { id: '2', name: 'London', timezone: 'Europe/London' },
  { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo' },
];

export default function CleanWorldClockCard({ is24Hour = false, onOpenFullWorldClock }) {
  const [cities] = useState(DEFAULT_PINNED_CITIES);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityFormatted = (tz) => {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      }).format(now);

      const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now);

      return { timeStr, dateStr };
    } catch {
      return { timeStr: '--:--', dateStr: '---' };
    }
  };

  return (
    <div className="clean-right-widget-card clean-world-clock-widget compact-widget">
      {/* Header */}
      <div className="clean-widget-header">
        <h3 className="clean-widget-title">World Clock</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button className="clean-header-link-btn" onClick={onOpenFullWorldClock}>
            <Plus size={12} />
            <span>Add</span>
          </button>
          <button className="clean-header-link-btn" onClick={onOpenFullWorldClock} title="All timezones">
            <span>All →</span>
          </button>
        </div>
      </div>

      {/* Cities List */}
      <div className="clean-world-cities-stack">
        {cities.map((city) => {
          const { timeStr, dateStr } = getCityFormatted(city.timezone);
          return (
            <div key={city.id} className="clean-world-city-item">
              <div className="city-info-col">
                <span className="city-name-text">{city.name}</span>
                <span className="city-date-sub">{dateStr}</span>
              </div>
              <div className="city-time-col">{timeStr}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
