import React, { useState, useEffect } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { fetchLiveWeather, getBrowserGeolocation, reverseGeocode, DEFAULT_WEATHER_INFO } from '../services/weatherApi';

export default function CleanWeatherCard() {
  const [weather, setWeather] = useState(DEFAULT_WEATHER_INFO);
  const [locationName, setLocationName] = useState('Bardez, India');
  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async () => {
    setIsLoading(true);
    try {
      const pos = await getBrowserGeolocation();
      const geo = await reverseGeocode(pos.lat, pos.lon);
      if (geo) {
        setLocationName(`${geo.city}${geo.country ? `, ${geo.country}` : ''}`);
      }
      const data = await fetchLiveWeather(pos.lat, pos.lon, false);
      if (data) setWeather(data);
    } catch {
      const data = await fetchLiveWeather(15.4989, 73.8278, false);
      if (data) setWeather(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="clean-right-widget-card clean-weather-widget compact-widget">
      {/* Header */}
      <div className="clean-widget-header">
        <h3 className="clean-widget-title">Weather</h3>
        <button 
          className="clean-refresh-icon-btn" 
          onClick={loadWeather}
          title="Refresh live weather"
        >
          <RefreshCw size={11} className={isLoading ? 'spin-anim' : ''} />
        </button>
      </div>

      {/* Main Temperature & Stats Combined Row */}
      <div className="clean-weather-compact-content">
        <div className="clean-weather-main-row">
          <div className="clean-weather-icon-badge">
            <CloudSun size={26} color="#E07A5F" />
          </div>
          <div className="clean-weather-temp-number">{weather.temp}°C</div>
          <div className="clean-weather-condition-col">
            <span className="clean-weather-condition-name">{weather.condition || 'Light drizzle'}</span>
            <span className="clean-weather-location-name">{locationName}</span>
          </div>
        </div>

        <div className="clean-weather-inline-badges">
          <span className="weather-badge-item">💧 74%</span>
          <span className="weather-badge-item">💨 12 km/h</span>
          <span className="weather-badge-item">🌡️ 30°C</span>
        </div>
      </div>
    </div>
  );
}
