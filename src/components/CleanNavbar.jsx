import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Globe2, 
  X, 
  CloudSun
} from 'lucide-react';
import ShinyText from './ShinyText';
import { searchGlobalCitiesAPI } from '../services/citiesApi';

// Top timezone destinations
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
  { label: 'San Francisco', tz: 'America/Los_Angeles' },
  { label: 'Bangkok', tz: 'Asia/Bangkok' },
  { label: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { label: 'Zurich', tz: 'Europe/Zurich' },
];

export default function CleanNavbar({ isDarkMode, onToggleDarkMode }) {
  const [now, setNow] = useState(new Date());

  // Weather state
  const [weather, setWeather] = useState({
    temp: '26°C',
    condition: 'Sunny',
    location: 'Assagao'
  });

  // Foreign clock state
  const [foreignClock, setForeignClock] = useState(() => {
    const saved = localStorage.getItem('timora_foreign_clock');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAddClock, setShowAddClock] = useState(false);
  const [tzSearch, setTzSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showAddClock) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !e.target.closest('.top-widget-add-clock-btn')) {
        setShowAddClock(false);
        setTzSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddClock]);

  // Tick clock every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Save foreign clock to localStorage
  useEffect(() => {
    if (foreignClock) {
      localStorage.setItem('timora_foreign_clock', JSON.stringify(foreignClock));
    } else {
      localStorage.removeItem('timora_foreign_clock');
    }
  }, [foreignClock]);

  // Fetch weather helper with coordinates
  const fetchWeather = (lat, lon) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
      .then(res => res.json())
      .then(async (data) => {
        const cw = data.current_weather;
        const wmoMap = { 0:'Clear', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast', 45:'Foggy', 51:'Light drizzle', 61:'Rain', 71:'Snow', 80:'Showers', 95:'Thunderstorm' };
        const cond = wmoMap[cw?.weathercode] || 'Clear';

        let city = 'Local Area';
        try {
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city || geoData.locality || geoData.principalSubdivision || 'Local Area';
          }
        } catch {
          // fallback
        }

        setWeather({ temp: `${Math.round(cw.temperature)}°C`, condition: cond, location: city });
      })
      .catch(() => {});
  };

  // Weather click handler: asks browser for permission again on demand
  const handleWeatherClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          // If denied, try fallback or show state
          if (err.code === 1) {
            alert('Location permission is currently blocked in your browser. Please click the 🔒 icon in your browser address bar to allow location.');
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  };

  // Initial weather load
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Default fallback to local timezone
          fetchWeather(15.5937, 73.8142); // Goa / India default
        },
        { timeout: 6000 }
      );
    } else {
      fetchWeather(15.5937, 73.8142);
    }
  }, []);

  // Debounced search for global cities in dropdown
  useEffect(() => {
    if (!tzSearch.trim() || tzSearch.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchGlobalCitiesAPI(tzSearch);
      setSearchResults(results);
    }, 250);
    return () => clearTimeout(timer);
  }, [tzSearch]);

  const localTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const localDate = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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

  const filteredQuickZones = tzSearch.trim()
    ? QUICK_ZONES.filter(z => z.label.toLowerCase().includes(tzSearch.toLowerCase()))
    : QUICK_ZONES;

  return (
    <header className="timora-clean-navbar">
      {/* Left: Brand Logo & Title */}
      <div className="navbar-brand-section">
        <img src="/Timora_Logo_landing.png" alt="Timora" className="navbar-logo-img" />
        <h1 className="timora-clean-logo">
          <ShinyText
            text="Timora"
            color={isDarkMode ? '#FAF8F5' : '#1F1D1B'}
            shineColor="var(--primary)"
            speed={2.5}
            spread={100}
          />
        </h1>
      </div>

      {/* Center: 3 Real-Time Info Widgets */}
      <div className="top-info-bar">
        {/* Widget 1: Local Time + Date */}
        <div className="top-widget local-time-widget">
          <span className="top-widget-time">{localTime}</span>
          <span className="top-widget-sub">{localDate} · Local</span>
        </div>

        {/* Widget 2: Weather (Clickable to request GPS permission again) */}
        <div 
          className="top-widget weather-widget-top clickable-widget"
          onClick={handleWeatherClick}
          title="Click to refresh or grant location permission"
        >
          <span className="top-widget-time">{weather.temp}</span>
          <span className="top-widget-sub">{weather.condition} · {weather.location}</span>
        </div>

        {/* Widget 3: Foreign Clock */}
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
                  aria-label="Remove clock"
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

          {/* Timezone picker dropdown */}
          {showAddClock && (
            <div
              ref={dropdownRef}
              className="tz-picker-dropdown"
              style={{
                position: 'fixed',
                top: '56px',
                right: '180px',
                zIndex: 9999,
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
                {searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <button
                      key={city.id}
                      className="tz-list-item"
                      onClick={() => {
                        setForeignClock({ label: city.name, tz: city.timezone });
                        setShowAddClock(false);
                        setTzSearch('');
                      }}
                    >
                      <span>{city.name} ({city.country})</span>
                      <span className="tz-list-time">{getForeignTime(city.timezone)}</span>
                    </button>
                  ))
                ) : (
                  filteredQuickZones.map(z => (
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
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle */}
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
