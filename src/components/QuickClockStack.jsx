import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Cloud, 
  Globe2, 
  Plus, 
  Settings, 
  ArrowRight, 
  X,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { fetchLiveWeather, getBrowserGeolocation, reverseGeocode, DEFAULT_WEATHER_INFO } from '../services/weatherApi';

export default function QuickClockStack({ is24Hour, setIs24Hour, onOpenWorldClockTab }) {
  // 1. Live Clock State
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMainTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let period = '';

    if (!is24Hour) {
      period = hours >= 12 ? 'AM' : 'AM';
      // In JS: hours >= 12 is PM
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    return {
      timeDigits: `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`,
      period: period
    };
  };

  const { timeDigits, period } = formatMainTime();
  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // 2. Weather State
  const [weather, setWeather] = useState(DEFAULT_WEATHER_INFO);
  const [locationName, setLocationName] = useState('Goa, India');
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const loadLiveWeather = async (useFah = isFahrenheit) => {
    setIsWeatherLoading(true);
    try {
      const pos = await getBrowserGeolocation();
      const geo = await reverseGeocode(pos.lat, pos.lon);
      if (geo) {
        setLocationName(`${geo.city}${geo.country ? `, ${geo.country}` : ''}`);
      }
      const data = await fetchLiveWeather(pos.lat, pos.lon, useFah);
      if (data) setWeather(data);
    } catch {
      // Fallback
      const data = await fetchLiveWeather(15.4989, 73.8278, useFah); // Goa
      if (data) setWeather(data);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadLiveWeather();
  }, []);

  const toggleWeatherUnit = () => {
    const nextUnit = !isFahrenheit;
    setIsFahrenheit(nextUnit);
    loadLiveWeather(nextUnit);
  };

  // 3. Pinned Cities State
  const [pinnedCities, setPinnedCities] = useState(() => {
    const saved = localStorage.getItem('world_clock_cities');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed.slice(0, 3);
    }
    return [
      { id: 'ny', name: 'New York', timezone: 'America/New_York' },
      { id: 'ldn', name: 'London', timezone: 'Europe/London' },
      { id: 'tky', name: 'Tokyo', timezone: 'Asia/Tokyo' }
    ];
  });

  const getCityFormattedTime = (tz) => {
    try {
      const cityDate = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      }).format(cityDate);

      const dayStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(cityDate);

      return { timeStr, dayStr };
    } catch {
      return { timeStr: '--:--', dayStr: '---' };
    }
  };

  return (
    <div className="quick-clock-stack">
      {/* ── 1. LIVE CLOCK CARD ── */}
      <div className="compact-glass-card live-clock-card">
        <div className="compact-card-header">
          <div className="compact-header-title">
            <Clock size={14} color="var(--primary)" />
            <span>LIVE CLOCK</span>
          </div>
          <button className="compact-close-btn" title="Live status active">
            <span className="live-pulse-dot"></span>
          </button>
        </div>

        <div className="live-clock-body">
          <div className="live-time-row">
            <span className="live-time-digits">{timeDigits}</span>
            {!is24Hour && <span className="live-time-period">{period}</span>}
          </div>
          <div className="live-date-text">{dateString}</div>
        </div>

        <div className="live-clock-footer">
          <button 
            className="compact-action-link"
            onClick={() => setIs24Hour(!is24Hour)}
          >
            <Settings size={13} />
            <span>Customize ({is24Hour ? '24h' : '12h'})</span>
          </button>
        </div>
      </div>

      {/* ── 2. WEATHER CARD ── */}
      <div className="compact-glass-card weather-compact-card">
        <div className="compact-card-header">
          <div className="compact-header-title">
            <CloudSun size={15} color="var(--primary)" />
            <span>WEATHER</span>
          </div>
          <button 
            className="compact-close-btn"
            onClick={() => loadLiveWeather()}
            title="Refresh weather"
          >
            <RefreshCw size={12} className={isWeatherLoading ? 'spin-anim' : ''} />
          </button>
        </div>

        <div className="weather-compact-body">
          <div className="weather-temp-row">
            <span className="weather-big-temp">
              {weather.temp}{isFahrenheit ? '°F' : '°C'}
            </span>
            <button 
              className="weather-unit-toggle-pill"
              onClick={toggleWeatherUnit}
              title="Toggle Celsius/Fahrenheit"
            >
              {isFahrenheit ? 'Switch to °C' : 'Switch to °F'}
            </button>
          </div>
          <div className="weather-condition-text">{weather.condition || 'Partly Cloudy'}</div>
          <div className="weather-loc-tag">
            <MapPin size={11} color="var(--primary)" />
            <span>{locationName}</span>
          </div>
        </div>
      </div>

      {/* ── 3. WORLD CLOCK CARD ── */}
      <div className="compact-glass-card world-clock-compact-card">
        <div className="compact-card-header">
          <div className="compact-header-title">
            <Globe2 size={14} color="var(--primary)" />
            <span>WORLD CLOCK</span>
          </div>
          <div className="compact-header-actions">
            <button 
              className="compact-icon-btn" 
              onClick={onOpenWorldClockTab} 
              title="Add cities"
            >
              <Plus size={13} />
            </button>
            <button 
              className="compact-icon-btn" 
              onClick={onOpenWorldClockTab} 
              title="Configure timezones"
            >
              <Settings size={13} />
            </button>
          </div>
        </div>

        <div className="world-clock-cities-list">
          {pinnedCities.map((city) => {
            const { timeStr, dayStr } = getCityFormattedTime(city.timezone);
            return (
              <div key={city.id} className="world-city-row">
                <div className="world-city-info">
                  <span className="world-city-name">{city.name}</span>
                  <span className="world-city-date">{dayStr}</span>
                </div>
                <div className="world-city-time">{timeStr}</div>
              </div>
            );
          })}
        </div>

        <div className="world-clock-footer">
          <button 
            className="compact-action-link"
            onClick={onOpenWorldClockTab}
          >
            <span>View all timezones</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
