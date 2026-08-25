import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Globe2, 
  X, 
  CloudSun, 
  Sparkles,
  MapPin,
  Search,
  Navigation,
  RefreshCw,
  Clock,
  ChevronDown
} from 'lucide-react';
import ShinyText from './ShinyText';
import { searchGlobalCitiesAPI } from '../services/citiesApi';

// Reusable Universal Country Flag Component (Works on Windows, Mac, Linux, iOS & Android)
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
        // Fallback to globe icon if image fails
        e.target.style.display = 'none';
      }}
    />
  );
}

// Top 20 Global Hubs with exact 2-letter ISO Country Codes for FlagCDN
const PRESET_CITIES = [
  { name: 'New York', country: 'United States', countryCode: 'us', tz: 'America/New_York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'United Kingdom', countryCode: 'gb', tz: 'Europe/London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', countryCode: 'jp', tz: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai', country: 'UAE', countryCode: 'ae', tz: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Paris', country: 'France', countryCode: 'fr', tz: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Singapore', country: 'Singapore', countryCode: 'sg', tz: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney', country: 'Australia', countryCode: 'au', tz: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai', country: 'India', countryCode: 'in', tz: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777 },
  { name: 'New Delhi', country: 'India', countryCode: 'in', tz: 'Asia/Kolkata', lat: 28.6139, lon: 77.2090 },
  { name: 'San Francisco', country: 'United States', countryCode: 'us', tz: 'America/Los_Angeles', lat: 37.7749, lon: -122.4194 },
  { name: 'Toronto', country: 'Canada', countryCode: 'ca', tz: 'America/Toronto', lat: 43.6532, lon: -79.3832 },
  { name: 'Berlin', country: 'Germany', countryCode: 'de', tz: 'Europe/Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Seoul', country: 'South Korea', countryCode: 'kr', tz: 'Asia/Seoul', lat: 37.5665, lon: 126.9780 },
  { name: 'Hong Kong', country: 'Hong Kong', countryCode: 'hk', tz: 'Asia/Hong_Kong', lat: 22.3193, lon: 114.1694 },
  { name: 'São Paulo', country: 'Brazil', countryCode: 'br', tz: 'America/Sao_Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Chicago', country: 'United States', countryCode: 'us', tz: 'America/Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'Cairo', country: 'Egypt', countryCode: 'eg', tz: 'Africa/Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Amsterdam', country: 'Netherlands', countryCode: 'nl', tz: 'Europe/Amsterdam', lat: 52.3676, lon: 4.9041 },
  { name: 'Zurich', country: 'Switzerland', countryCode: 'ch', tz: 'Europe/Zurich', lat: 47.3769, lon: 8.5417 },
  { name: 'Bangkok', country: 'Thailand', countryCode: 'th', tz: 'Asia/Bangkok', lat: 13.7563, lon: 100.5018 },
];

export default function CleanNavbar({ isDarkMode, onToggleDarkMode }) {
  const [now, setNow] = useState(new Date());

  // ── 1. Weather State & Location Picker Modal ──
  const [weather, setWeather] = useState({
    temp: '26°C',
    condition: 'Sunny',
    location: 'Local Area',
    countryCode: 'in',
    hasGps: false
  });
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [weatherSearchQuery, setWeatherSearchQuery] = useState('');
  const [weatherSearchResults, setWeatherSearchResults] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);

  // ── 2. Foreign Clock State & City Picker Modal ──
  const [foreignClock, setForeignClock] = useState(() => {
    const saved = localStorage.getItem('timora_foreign_clock_pref');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      label: 'Tokyo',
      country: 'Japan',
      countryCode: 'jp',
      tz: 'Asia/Tokyo'
    };
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // Tick clock every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Save foreign clock changes
  useEffect(() => {
    if (foreignClock) {
      localStorage.setItem('timora_foreign_clock_pref', JSON.stringify(foreignClock));
    } else {
      localStorage.removeItem('timora_foreign_clock_pref');
    }
  }, [foreignClock]);

  // Weather fetcher helper
  const fetchWeatherForCoords = async (lat, lon, cityName, countryCode = 'in', isGps = false) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const cw = data.current_weather;
      const wmoMap = { 
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 51: 'Light Drizzle', 61: 'Rain', 71: 'Snow', 80: 'Showers', 95: 'Thunderstorm' 
      };
      const cond = wmoMap[cw?.weathercode] || 'Clear';

      const weatherObj = {
        temp: `${Math.round(cw.temperature)}°C`,
        condition: cond,
        location: cityName,
        countryCode: countryCode || 'in',
        hasGps: isGps
      };

      setWeather(weatherObj);
      localStorage.setItem('timora_weather_location', JSON.stringify({
        lat, lon, name: cityName, countryCode, isGps
      }));
      setGpsErrorMsg(null);
      return true;
    } catch (e) {
      console.warn('Weather fetch failed:', e);
      return false;
    }
  };

  // Request live browser GPS location
  const requestBrowserGeolocation = () => {
    setIsLocating(true);
    setGpsErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setGpsErrorMsg('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let detectedCity = 'My Location';
        let detectedCode = 'in';
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            detectedCity = geoData.city || geoData.locality || geoData.principalSubdivision || 'My Location';
            detectedCode = (geoData.countryCode || 'in').toLowerCase();
          }
        } catch {
          // fallback
        }

        await fetchWeatherForCoords(lat, lon, detectedCity, detectedCode, true);
        setIsLocating(false);
        setIsWeatherModalOpen(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setGpsErrorMsg('Location permission was denied. Please allow location in your browser address bar (🔒 icon), or search and select your city below.');
        } else {
          setGpsErrorMsg('Could not detect location. Please select your city below.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Initial Weather Load on Mount
  useEffect(() => {
    const savedLoc = localStorage.getItem('timora_weather_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        fetchWeatherForCoords(parsed.lat, parsed.lon, parsed.name, parsed.countryCode, parsed.isGps);
        return;
      } catch {
        // ignore
      }
    }

    // Default: detect timezone coordinates
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    const matchedCity = PRESET_CITIES.find(c => c.tz === userTz) || PRESET_CITIES[7]; // Mumbai
    fetchWeatherForCoords(matchedCity.lat, matchedCity.lon, matchedCity.name, matchedCity.countryCode, false);
  }, []);

  // Weather City Search debounced
  useEffect(() => {
    if (!weatherSearchQuery.trim() || weatherSearchQuery.length < 2) {
      setWeatherSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchGlobalCitiesAPI(weatherSearchQuery);
      setWeatherSearchResults(results);
    }, 280);
    return () => clearTimeout(timer);
  }, [weatherSearchQuery]);

  // World Clock City Search debounced
  useEffect(() => {
    if (!citySearchQuery.trim() || citySearchQuery.length < 2) {
      setCitySearchResults([]);
      setIsSearchingCity(false);
      return;
    }
    setIsSearchingCity(true);
    const timer = setTimeout(async () => {
      const results = await searchGlobalCitiesAPI(citySearchQuery);
      setCitySearchResults(results);
      setIsSearchingCity(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [citySearchQuery]);

  // Format local & foreign times
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

  const handleSelectForeignCity = (cityItem) => {
    setForeignClock({
      label: cityItem.name,
      country: cityItem.country,
      countryCode: cityItem.countryCode || 'un',
      tz: cityItem.timezone || cityItem.tz,
    });
    setIsCityModalOpen(false);
    setCitySearchQuery('');
  };

  const handleSelectWeatherCity = (cityItem) => {
    fetchWeatherForCoords(cityItem.lat, cityItem.lon, cityItem.name, cityItem.countryCode || 'in', false);
    setIsWeatherModalOpen(false);
    setWeatherSearchQuery('');
  };

  return (
    <>
      <header className="timora-clean-navbar">
        {/* Left: Brand Logo & Title */}
        <div className="navbar-brand-section">
          <img
            src="/Timora_Logo_landing.png"
            alt="Timora Logo"
            className="navbar-logo-img"
          />
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

        {/* Center: 3 Top Real-Time Widgets */}
        <div className="top-info-bar">
          {/* Widget 1: Local Clock & Date */}
          <div className="top-widget local-time-widget" title="Your Local Time">
            <span className="top-widget-time">{localTime}</span>
            <span className="top-widget-sub">{localDate} · Local</span>
          </div>

          {/* Widget 2: Live Weather (Click to change location or request GPS) */}
          <div 
            className="top-widget weather-widget-top clickable-widget"
            onClick={() => setIsWeatherModalOpen(true)}
            title="Click to change weather city or allow GPS location"
            role="button"
            tabIndex={0}
          >
            <div className="top-widget-title-row">
              <span className="top-widget-time">{weather.temp}</span>
              <CloudSun size={14} color="var(--primary)" />
            </div>
            <div className="top-widget-sub-row">
              <span className="top-widget-sub">
                {weather.condition} · {weather.location}
              </span>
            </div>
          </div>

          {/* Widget 3: World City Clock (Click to add or switch city) */}
          <div className="top-widget foreign-clock-widget">
            {foreignClock ? (
              <div 
                className="foreign-clock-active-box"
                onClick={() => setIsCityModalOpen(true)}
                title="Click to switch world city clock"
              >
                <div className="top-widget-title-row">
                  <span className="top-widget-time">{getForeignTime(foreignClock.tz)}</span>
                  <CountryFlag countryCode={foreignClock.countryCode} name={foreignClock.country} size="sm" />
                </div>
                <div className="top-widget-sub-row">
                  <span className="top-widget-sub">{foreignClock.label}</span>
                  <button
                    className="top-widget-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForeignClock(null);
                    }}
                    title="Remove foreign clock"
                    aria-label="Remove clock"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="top-widget-add-clock-btn"
                onClick={() => setIsCityModalOpen(true)}
                title="Add a foreign timezone clock"
              >
                <Globe2 size={14} color="var(--primary)" />
                <span>+ Add City Clock</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Theme Toggle */}
        <div className="navbar-controls-section">
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
          WEATHER LOCATION MODAL / POPUP (Allows GPS prompt + City search)
         ══════════════════════════════════════════════════════════════════════ */}
      {isWeatherModalOpen && (
        <div className="timora-modal-overlay" onClick={() => setIsWeatherModalOpen(false)}>
          <div className="timora-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="timora-modal-header">
              <div className="modal-title-wrap">
                <MapPin size={18} color="var(--primary)" />
                <h3>Weather Location</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsWeatherModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="timora-modal-body">
              {/* GPS Auto-detect Button */}
              <button 
                className="modal-gps-btn"
                onClick={requestBrowserGeolocation}
                disabled={isLocating}
              >
                <Navigation size={15} className={isLocating ? 'spin-anim' : ''} />
                <span>{isLocating ? 'Requesting GPS Permission...' : 'Detect My Live GPS Location'}</span>
              </button>

              {gpsErrorMsg && (
                <div className="modal-gps-notice">
                  <p>{gpsErrorMsg}</p>
                </div>
              )}

              <div className="modal-divider">
                <span>OR SEARCH ANY CITY</span>
              </div>

              {/* City Search Bar */}
              <div className="modal-search-input-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search city (e.g. Mumbai, New York, London)..."
                  value={weatherSearchQuery}
                  onChange={(e) => setWeatherSearchQuery(e.target.value)}
                  autoFocus
                />
                {weatherSearchQuery && (
                  <button className="search-clear-btn" onClick={() => setWeatherSearchQuery('')}>
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Live Search Results */}
              {weatherSearchResults.length > 0 ? (
                <div className="modal-city-list">
                  {weatherSearchResults.map((city) => (
                    <button
                      key={city.id}
                      className="modal-city-item"
                      onClick={() => handleSelectWeatherCity(city)}
                    >
                      <CountryFlag countryCode={city.countryCode} name={city.country} size="md" />
                      <div className="city-item-info">
                        <span className="city-item-name">{city.name}</span>
                        <span className="city-item-country">{city.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="modal-presets-section">
                  <span className="presets-label">Popular Locations:</span>
                  <div className="modal-preset-grid">
                    {PRESET_CITIES.slice(0, 12).map((city) => (
                      <button
                        key={city.name}
                        className="modal-preset-chip"
                        onClick={() => handleSelectWeatherCity(city)}
                      >
                        <CountryFlag countryCode={city.countryCode} name={city.name} size="sm" />
                        <span className="preset-chip-name">{city.name}</span>
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
          WORLD CITY CLOCK PICKER MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {isCityModalOpen && (
        <div className="timora-modal-overlay" onClick={() => setIsCityModalOpen(false)}>
          <div className="timora-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="timora-modal-header">
              <div className="modal-title-wrap">
                <Globe2 size={18} color="var(--primary)" />
                <h3>Add Worldwide City Clock</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCityModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="timora-modal-body">
              {/* City Search Bar */}
              <div className="modal-search-input-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search any global city or country..."
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  autoFocus
                />
                {citySearchQuery && (
                  <button className="search-clear-btn" onClick={() => setCitySearchQuery('')}>
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Dynamic Results from Open-Meteo Geocoding */}
              {citySearchResults.length > 0 ? (
                <div className="modal-city-list">
                  {citySearchResults.map((city) => (
                    <button
                      key={city.id}
                      className="modal-city-item"
                      onClick={() => handleSelectForeignCity(city)}
                    >
                      <CountryFlag countryCode={city.countryCode} name={city.country} size="md" />
                      <div className="city-item-info">
                        <span className="city-item-name">{city.name}</span>
                        <span className="city-item-country">{city.country} ({city.timezone})</span>
                      </div>
                      <span className="city-item-time">{getForeignTime(city.timezone)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="modal-presets-section">
                  <span className="presets-label">Top Global Hubs:</span>
                  <div className="modal-preset-grid">
                    {PRESET_CITIES.map((city) => (
                      <button
                        key={city.name}
                        className="modal-preset-chip"
                        onClick={() => handleSelectForeignCity(city)}
                      >
                        <CountryFlag countryCode={city.countryCode} name={city.name} size="sm" />
                        <span className="preset-chip-name">{city.name}</span>
                        <span className="preset-chip-time">{getForeignTime(city.tz)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
