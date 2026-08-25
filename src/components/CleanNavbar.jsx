import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Globe2,
  X
} from 'lucide-react';
import ShinyText from './ShinyText';

// Compact top info bar showing local time, date, weather, and optional foreign clock
function TopInfoBar({ isDarkMode }) {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '--', condition: '...', location: 'Locating...' });
  const [foreignClock, setForeignClock] = useState(() => {
    const saved = sessionStorage.getItem('timora_foreign_clock');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAddClock, setShowAddClock] = useState(false);
  const [tzSearch, setTzSearch] = useState('');

  // Close dropdown on click outside
  useEffect(() => {
    if (!showAddClock) return;
    const handleClick = (e) => {
      if (!e.target.closest('.tz-picker-dropdown') && !e.target.closest('.top-widget-add-clock-btn')) {
        setShowAddClock(false);
        setTzSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddClock]);


  // Real-time clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Save foreign clock to sessionStorage
  useEffect(() => {
    if (foreignClock) {
      sessionStorage.setItem('timora_foreign_clock', JSON.stringify(foreignClock));
    } else {
      sessionStorage.removeItem('timora_foreign_clock');
    }
  }, [foreignClock]);

  // Fetch weather once
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            try {
              const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`
              );
              const data = await res.json();
              const cw = data.current_weather;
              const wmoMap = { 0:'Clear', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast', 45:'Foggy', 51:'Light drizzle', 61:'Rain', 71:'Snow', 80:'Showers', 95:'Thunderstorm' };
              const cond = wmoMap[cw?.weathercode] || 'Clear';
              
              // Reverse geocode
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
              const geoData = await geoRes.json();
              const city = geoData?.address?.city || geoData?.address?.town || geoData?.address?.village || 'Your Location';
              
              setWeather({ temp: Math.round(cw.temperature), condition: cond, location: city });
            } catch {
              setWeather({ temp: '--', condition: 'Unavailable', location: 'Location' });
            }
          }, () => setWeather({ temp: '--', condition: 'No permission', location: '—' }));
        }
      } catch {
        setWeather({ temp: '--', condition: 'Error', location: '—' });
      }
    };
    fetchWeather();
  }, []);

  // Formatted local time
  const localTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const localDate = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Foreign clock time
  const getForeignTime = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(now);
    } catch {
      return '--:--';
    }
  };

  // Common timezone quick-picks
  const QUICK_ZONES = [
    { label: 'New York', tz: 'America/New_York' },
    { label: 'London', tz: 'Europe/London' },
    { label: 'Dubai', tz: 'Asia/Dubai' },
    { label: 'Tokyo', tz: 'Asia/Tokyo' },
    { label: 'Sydney', tz: 'Australia/Sydney' },
    { label: 'Paris', tz: 'Europe/Paris' },
    { label: 'Los Angeles', tz: 'America/Los_Angeles' },
    { label: 'Singapore', tz: 'Asia/Singapore' },
    { label: 'Chicago', tz: 'America/Chicago' },
    { label: 'São Paulo', tz: 'America/Sao_Paulo' },
    { label: 'Toronto', tz: 'America/Toronto' },
    { label: 'Berlin', tz: 'Europe/Berlin' },
    { label: 'Mumbai', tz: 'Asia/Kolkata' },
    { label: 'Moscow', tz: 'Europe/Moscow' },
    { label: 'Seoul', tz: 'Asia/Seoul' },
    { label: 'Cairo', tz: 'Africa/Cairo' },
  ];

  const filteredZones = tzSearch.trim()
    ? QUICK_ZONES.filter(z => z.label.toLowerCase().includes(tzSearch.toLowerCase()))
    : QUICK_ZONES;

  return (
    <div className="top-info-bar">
      {/* Widget 1: Local Time + Date */}
      <div className="top-widget local-time-widget">
        <span className="top-widget-time">{localTime}</span>
        <span className="top-widget-sub">{localDate} · Local</span>
      </div>

      {/* Widget 2: Weather */}
      <div className="top-widget weather-widget-top">
        <span className="top-widget-time">{weather.temp !== '--' ? `${weather.temp}°C` : '—'}</span>
        <span className="top-widget-sub">{weather.condition} · {weather.location}</span>
      </div>

      {/* Widget 3: Foreign Clock (user-added) */}
      <div className="top-widget foreign-clock-widget">
        {foreignClock ? (
          <>
            <span className="top-widget-time">{getForeignTime(foreignClock.tz)}</span>
            <div className="top-widget-sub-row">
              <span className="top-widget-sub">{foreignClock.label}</span>
              <button
                className="top-widget-remove-btn"
                onClick={() => setForeignClock(null)}
                title="Remove foreign clock"
              >
                <X size={10} />
              </button>
            </div>
          </>
        ) : (
          <button
            className="top-widget-add-clock-btn"
            onClick={() => setShowAddClock(prev => !prev)}
            title="Add a foreign timezone clock"
          >
            <Globe2 size={13} />
            <span>+ Add City Clock</span>
          </button>
        )}

        {/* Timezone picker dropdown — fixed to always render above all content */}
        {showAddClock && (
          <div
            className="tz-picker-dropdown"
            style={{
              position: 'fixed',
              top: '60px',
              right: '200px',
              zIndex: 9000,
            }}
          >
            <input
              className="tz-search-input"
              placeholder="Search city..."
              value={tzSearch}
              onChange={e => setTzSearch(e.target.value)}
              autoFocus
            />
            <div className="tz-list">
              {filteredZones.map(z => (
                <button
                  key={z.tz}
                  className="tz-list-item"
                  onClick={() => {
                    setForeignClock(z);
                    setShowAddClock(false);
                    setTzSearch('');
                  }}
                >
                  <span>{z.label}</span>
                  <span className="tz-list-time">{getForeignTime(z.tz)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CleanNavbar({
  isDarkMode,
  onToggleDarkMode,
}) {

  return (
    <header className="timora-clean-navbar">
      {/* Left: Logo */}
      <div className="navbar-brand-section">
        <img src="./Timora_Logo_landing.png" alt="Timora" className="navbar-logo-img" />
        <h1 className="timora-clean-logo">
          <ShinyText
            text="Timora"
            color={isDarkMode ? '#FBF9F5' : '#1F1D1B'}
            shineColor="var(--primary)"
            speed={2.5}
            spread={100}
          />
        </h1>
      </div>

      {/* Center: 3 Real-Time Info Widgets */}
      <TopInfoBar isDarkMode={isDarkMode} />

      {/* Right: Light/Dark */}
      <div className="navbar-controls-section">
        <button
          className="navbar-text-toggle-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
          <span>{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}
