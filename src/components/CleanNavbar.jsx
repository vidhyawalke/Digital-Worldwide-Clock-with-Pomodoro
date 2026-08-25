import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Globe2, 
  X, 
  Search, 
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  RotateCcw
} from 'lucide-react';
import ShinyText from './ShinyText';
import { searchGlobalCitiesAPI } from '../services/citiesApi';

// Reusable Universal Country Flag
export function CountryFlag({ countryCode = 'un', name = '', size = 'sm' }) {
  const code = (countryCode || 'un').toLowerCase();
  const width = size === 'lg' ? 24 : size === 'md' ? 20 : 18;
  const height = size === 'lg' ? 16 : size === 'md' ? 14 : 12;

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={width}
      height={height}
      alt={name || code}
      className={`universal-country-flag flag-${size}`}
      loading="lazy"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

// Top Popular Global Hubs for Quick Selection
const POPULAR_HUBS = [
  { name: 'Tokyo', country: 'Japan', countryCode: 'jp', tz: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'London', country: 'United Kingdom', countryCode: 'gb', tz: 'Europe/London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', countryCode: 'us', tz: 'America/New_York', lat: 40.7128, lon: -74.0060 },
  { name: 'Dubai', country: 'UAE', countryCode: 'ae', tz: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Paris', country: 'France', countryCode: 'fr', tz: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Singapore', country: 'Singapore', countryCode: 'sg', tz: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney', country: 'Australia', countryCode: 'au', tz: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai', country: 'India', countryCode: 'in', tz: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777 },
];

// Curated Unsplash Wallpapers
const CURATED_WALLPAPERS = [
  { id: '1', title: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop' },
  { id: '2', title: 'Minimalist Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop' },
  { id: '3', title: 'Cozy Study Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2000&auto=format&fit=crop' },
  { id: '4', title: 'Tokyo Neon Night', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2000&auto=format&fit=crop' },
  { id: '5', title: 'Deep Forest Green', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop' },
  { id: '6', title: 'Sunset Ocean Wave', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' },
  { id: '7', title: 'Lofi Gradient Glow', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop' },
  { id: '8', title: 'Nordic Interior Study', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop' },
];

export default function CleanNavbar({ isDarkMode, onToggleDarkMode, customBg, onSelectBg }) {
  const [now, setNow] = useState(new Date());

  // 1. Local Location & Weather Info
  const [localPlace, setLocalPlace] = useState(() => {
    return localStorage.getItem('timora_local_place_name') || 'Local';
  });

  const [weather, setWeather] = useState({
    temp: '26°C',
    condition: 'Sunny',
    countryCode: 'in'
  });

  // 2. Up to 4 Addon Worldwide Clocks (Empty by default)
  const [foreignClocks, setForeignClocks] = useState(() => {
    const saved = localStorage.getItem('timora_foreign_clocks_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 4);
      } catch {}
    }
    return []; // Empty by default!
  });

  const [isAddClockModalOpen, setIsAddClockModalOpen] = useState(false);
  const [clockSearchQuery, setClockSearchQuery] = useState('');
  const [clockSearchResults, setClockSearchResults] = useState([]);

  // 3. Wallpaper Picker Modal
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState('');
  const fileInputRef = useRef(null);

  // Tick clock every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Save clocks to localStorage
  useEffect(() => {
    localStorage.setItem('timora_foreign_clocks_v3', JSON.stringify(foreignClocks));
  }, [foreignClocks]);

  // Weather fetcher from Open-Meteo
  const fetchWeatherForCoords = async (lat, lon, cityName, countryCode = 'in') => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const cw = data.current_weather;
      const wmoMap = { 
        0: 'Clear', 1: 'Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 80: 'Showers', 95: 'Storm' 
      };
      const cond = wmoMap[cw?.weathercode] || 'Clear';

      setWeather({
        temp: `${Math.round(cw.temperature)}°C`,
        condition: cond,
        countryCode: countryCode || 'in'
      });
      setLocalPlace(cityName);
      localStorage.setItem('timora_local_place_name', cityName);
    } catch (e) {
      console.warn('Weather fetch failed:', e);
    }
  };

  // Automatic Seamless Local Location & Weather Detection on Mount
  useEffect(() => {
    const detectAutoLocation = async () => {
      try {
        const geoRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en');
        if (geoRes.ok) {
          const data = await geoRes.json();
          const city = data.city || data.locality || data.principalSubdivision || 'Local';
          const code = (data.countryCode || 'in').toLowerCase();
          const lat = data.latitude || 15.5937;
          const lon = data.longitude || 73.8142;
          fetchWeatherForCoords(lat, lon, city, code);
          return;
        }
      } catch {}

      // Fallback
      fetchWeatherForCoords(15.5937, 73.8142, 'Assagao', 'in');
    };

    detectAutoLocation();
  }, []);

  // World clock search debounced
  useEffect(() => {
    if (!clockSearchQuery.trim() || clockSearchQuery.length < 2) {
      setClockSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchGlobalCitiesAPI(clockSearchQuery);
      setClockSearchResults(res);
    }, 280);
    return () => clearTimeout(timer);
  }, [clockSearchQuery]);

  // Times formatting
  const localTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
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

  // Add clock handler (max 4)
  const handleAddClock = (cityItem) => {
    if (foreignClocks.length >= 4) return;
    const newClock = {
      id: Date.now().toString(),
      label: cityItem.name,
      country: cityItem.country,
      countryCode: cityItem.countryCode || 'un',
      tz: cityItem.timezone || cityItem.tz || 'UTC'
    };
    setForeignClocks(prev => [...prev, newClock]);
    setIsAddClockModalOpen(false);
    setClockSearchQuery('');
  };

  const handleRemoveClock = (id, e) => {
    e.stopPropagation();
    setForeignClocks(prev => prev.filter(c => c.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSelectBg(event.target.result);
        setIsBgModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBgSubmit = (e) => {
    e.preventDefault();
    if (!customBgUrl.trim()) return;
    onSelectBg(customBgUrl.trim());
    setCustomBgUrl('');
    setIsBgModalOpen(false);
  };

  return (
    <>
      <header className="timora-clean-navbar">
        {/* Left: Brand Logo & Title */}
        <div className="navbar-brand-section">
          <img src="/Timora_Logo_landing.png" alt="Timora Logo" className="navbar-logo-img" />
          <h1 className="timora-clean-logo">
            <ShinyText
              text="Timora"
              color={isDarkMode ? '#FAF8F5' : '#1F1D1B'}
              shineColor="var(--primary)"
              speed={2.6}
              spread={110}
            />
          </h1>
        </div>

        {/* Center: Real-Time Info Bar */}
        <div className="top-info-bar">
          {/* 1. Local Live Time, Date, Location Name & Weather Combined */}
          <div className="top-widget local-time-widget" title={`Your local live time in ${localPlace}`}>
            <div className="top-widget-title-row">
              <span className="top-widget-time">{localTime}</span>
              <CountryFlag countryCode={weather.countryCode || 'in'} name={localPlace} size="sm" />
            </div>
            <div className="top-widget-sub-row">
              <span className="top-widget-sub">
                {localDate} · {localPlace} · {weather.temp} {weather.condition}
              </span>
            </div>
          </div>

          {/* 2. + Add City Clock Button */}
          {foreignClocks.length < 4 && (
            <button
              className="top-widget-add-clock-btn"
              onClick={() => setIsAddClockModalOpen(true)}
              title={`Add worldwide city clock (${foreignClocks.length}/4)`}
            >
              <Globe2 size={13} color="var(--primary)" />
              <span>+ Add City Clock</span>
            </button>
          )}

          {/* 3. User Selected Worldwide Clocks (Up to 4) */}
          {foreignClocks.map((clock) => (
            <div key={clock.id} className="top-widget foreign-clock-widget">
              <div className="top-widget-title-row">
                <span className="top-widget-time">{getForeignTime(clock.tz)}</span>
                <CountryFlag countryCode={clock.countryCode} name={clock.country} size="sm" />
              </div>
              <div className="top-widget-sub-row">
                <span className="top-widget-sub">{clock.label}</span>
                <button
                  className="top-widget-remove-btn"
                  onClick={(e) => handleRemoveClock(clock.id, e)}
                  title="Remove clock"
                  aria-label="Remove clock"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Choose BG & Theme Toggle */}
        <div className="navbar-controls-section">
          <button
            className="navbar-text-toggle-btn navbar-bg-btn"
            onClick={() => setIsBgModalOpen(true)}
            title="Choose Background Wallpaper"
            aria-label="Choose background"
          >
            <ImageIcon size={14} />
            <span>Choose BG</span>
          </button>

          <button
            className="navbar-text-toggle-btn"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          ADD WORLDWIDE CLOCK MODAL (Supports Up to 4 Clocks)
         ══════════════════════════════════════════════════════════════════════ */}
      {isAddClockModalOpen && (
        <div className="timora-modal-overlay" onClick={() => setIsAddClockModalOpen(false)}>
          <div className="timora-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="timora-modal-header">
              <div className="modal-title-wrap">
                <Globe2 size={18} color="var(--primary)" />
                <h3>Add Place Clock ({foreignClocks.length}/4)</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddClockModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="timora-modal-body">
              <div className="modal-search-input-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search any country, city, village or place..."
                  value={clockSearchQuery}
                  onChange={(e) => setClockSearchQuery(e.target.value)}
                  autoFocus
                />
                {clockSearchQuery && (
                  <button className="search-clear-btn" onClick={() => setClockSearchQuery('')}>
                    <X size={12} />
                  </button>
                )}
              </div>

              {clockSearchResults.length > 0 ? (
                <div className="modal-city-list">
                  {clockSearchResults.map((city) => (
                    <button
                      key={city.id}
                      className="modal-city-item"
                      onClick={() => handleAddClock(city)}
                    >
                      <CountryFlag countryCode={city.countryCode} name={city.country} size="md" />
                      <div className="city-item-info">
                        <span className="city-item-name">{city.name}</span>
                        <span className="city-item-country">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</span>
                      </div>
                      <span className="city-item-time">{getForeignTime(city.timezone)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="modal-presets-section">
                  <span className="presets-label">Top Global Hubs:</span>
                  <div className="modal-preset-grid">
                    {POPULAR_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        className="modal-preset-chip"
                        onClick={() => handleAddClock(hub)}
                      >
                        <CountryFlag countryCode={hub.countryCode} name={hub.name} size="sm" />
                        <span className="preset-chip-name">{hub.name}</span>
                        <span className="preset-chip-time">{getForeignTime(hub.tz)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CHOOSE BACKGROUND / WALLPAPER MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {isBgModalOpen && (
        <div className="timora-modal-overlay" onClick={() => setIsBgModalOpen(false)}>
          <div className="timora-modal-dialog bg-picker-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="timora-modal-header">
              <div className="modal-title-wrap">
                <ImageIcon size={18} color="var(--primary)" />
                <h3>Choose Background</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsBgModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="timora-modal-body bg-modal-body">
              <div className="bg-modal-section">
                <span className="presets-label">Upload from PC:</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button 
                  className="bg-upload-pc-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  <span>Choose Image File from Your Device</span>
                </button>
              </div>

              <div className="bg-modal-section">
                <span className="presets-label">Paste Image / Unsplash Link:</span>
                <form onSubmit={handleCustomBgSubmit} className="bg-url-form">
                  <div className="modal-search-input-wrap" style={{ flex: 1 }}>
                    <LinkIcon size={14} className="search-icon" />
                    <input
                      type="url"
                      placeholder="Paste https://images.unsplash.com/... or image URL"
                      value={customBgUrl}
                      onChange={(e) => setCustomBgUrl(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="bg-apply-btn">Apply</button>
                </form>
              </div>

              <div className="bg-modal-section">
                <span className="presets-label">Curated Unsplash Wallpapers:</span>
                <div className="bg-curated-grid">
                  {CURATED_WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      className={`bg-thumb-card ${customBg === wp.url ? 'active' : ''}`}
                      onClick={() => {
                        onSelectBg(wp.url);
                        setIsBgModalOpen(false);
                      }}
                    >
                      <img src={wp.url} alt={wp.title} className="bg-thumb-img" loading="lazy" />
                      <span className="bg-thumb-title">{wp.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {customBg && (
                <button
                  className="bg-reset-default-btn"
                  onClick={() => {
                    onSelectBg(null);
                    setIsBgModalOpen(false);
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Reset to Default Theme Background</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
