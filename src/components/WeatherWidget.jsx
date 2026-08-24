import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog,
  Navigation,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { 
  fetchLiveWeather, 
  reverseGeocode, 
  getBrowserGeolocation, 
  DEFAULT_WEATHER_INFO 
} from '../services/weatherApi';

/**
 * Helper to render the appropriate weather icon based on WMO code and time of day
 */
function RenderWeatherIcon({ code = 2, isDay = true, size = 36 }) {
  if (code === 0) {
    return isDay ? <Sun size={size} color="#F59E0B" /> : <Moon size={size} color="#8B5CF6" />;
  }
  if (code === 1 || code === 2) {
    return isDay ? <CloudSun size={size} color="#F59E0B" /> : <CloudMoon size={size} color="#8B5CF6" />;
  }
  if (code === 3) {
    return <Cloud size={size} color="#94A3B8" />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog size={size} color="#94A3B8" />;
  }
  if (code >= 51 && code <= 55) {
    return <CloudDrizzle size={size} color="#38BDF8" />;
  }
  if (code >= 61 && code <= 65 || (code >= 80 && code <= 82)) {
    return <CloudRain size={size} color="#0EA5E9" />;
  }
  if (code >= 71 && code <= 75) {
    return <CloudSnow size={size} color="#E0F2FE" />;
  }
  if (code >= 95) {
    return <CloudLightning size={size} color="#F59E0B" />;
  }
  return isDay ? <Sun size={size} color="#F59E0B" /> : <Moon size={size} color="#8B5CF6" />;
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(DEFAULT_WEATHER_INFO);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 15.5937, lon: 73.8142 }); // Default / Goa / India Coordinates

  // Load weather when coords or temperature unit changes
  const loadWeather = async (lat, lon, useFahrenheit = isFahrenheit) => {
    setIsLoading(true);
    const data = await fetchLiveWeather(lat, lon, useFahrenheit);
    if (data) {
      setWeatherData(data);
    }
    setIsLoading(false);
  };

  // Detect user's live browser location
  const handleDetectLiveLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getBrowserGeolocation();
      setCoords(position);
      const geoInfo = await reverseGeocode(position.lat, position.lon);
      if (geoInfo) {
        setLocationName(`${geoInfo.city}${geoInfo.country ? `, ${geoInfo.country}` : ''}`);
      }
      await loadWeather(position.lat, position.lon, isFahrenheit);
    } catch (err) {
      console.warn('Geolocation prompt cancelled or failed, using local timezone.');
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityPart = localTz.split('/')[1]?.replace('_', ' ') || 'Local Location';
      setLocationName(cityPart);
      await loadWeather(coords.lat, coords.lon, isFahrenheit);
    }
    setIsLoading(false);
  };

  // Initial load on mount
  useEffect(() => {
    handleDetectLiveLocation();
  }, []);

  // Toggle °C / °F
  const toggleUnit = () => {
    const nextFahrenheit = !isFahrenheit;
    setIsFahrenheit(nextFahrenheit);
    loadWeather(coords.lat, coords.lon, nextFahrenheit);
  };

  const unitSymbol = isFahrenheit ? '°F' : '°C';

  return (
    <div className="glass-card weather-widget-card">
      {/* Widget Header */}
      <div className="weather-header">
        <div className="weather-title-wrap">
          <h3>Weather</h3>
          <span className="weather-location-sub">
            <MapPin size={12} color="var(--primary)" />
            {locationName}
          </span>
        </div>

        <div className="weather-controls">
          <button 
            className="weather-unit-btn" 
            onClick={toggleUnit}
            title={`Switch to ${isFahrenheit ? 'Celsius (°C)' : 'Fahrenheit (°F)'}`}
          >
            ⚙ {unitSymbol}
          </button>
          
          <button 
            className="weather-refresh-btn" 
            onClick={() => loadWeather(coords.lat, coords.lon, isFahrenheit)}
            title="Refresh Weather"
          >
            <RefreshCw size={13} className={isLoading ? 'spin-anim' : ''} />
          </button>

          <button 
            className="weather-gps-btn" 
            onClick={handleDetectLiveLocation}
            title="Detect Live GPS Location"
          >
            <Navigation size={13} />
          </button>
        </div>
      </div>

      {/* Main Temperature & Condition Row (Matching reference screenshot) */}
      <div className="weather-main-row">
        <div className="weather-temp-info">
          <div className="weather-current-temp">
            {weatherData.temp} {unitSymbol}
          </div>
          <div className="weather-condition-label">
            {weatherData.condition}.
          </div>
          <div className="weather-high-low">
            {weatherData.maxTemp} / {weatherData.minTemp} {unitSymbol}
          </div>
        </div>

        <div className="weather-icon-hero">
          <RenderWeatherIcon code={weatherData.weatherCode} isDay={weatherData.isDay} size={48} />
        </div>
      </div>

      {/* 2-Day Forecast List (Matching reference screenshot) */}
      <div className="weather-forecast-list">
        {weatherData.daily && weatherData.daily.map((item, idx) => (
          <div key={idx} className="weather-forecast-item">
            <span className="forecast-day">{item.day}.</span>
            <div className="forecast-icon">
              <RenderWeatherIcon code={item.code} isDay={true} size={20} />
            </div>
            <span className="forecast-temps">
              {item.maxTemp} / {item.minTemp} {unitSymbol}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Attribution */}
      <div className="weather-footer-note">
        <span>Live GPS & Weather via Open-Meteo</span>
      </div>
    </div>
  );
}
