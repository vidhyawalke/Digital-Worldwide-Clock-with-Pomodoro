/**
 * Weather & Geolocation API Service
 * Uses Open-Meteo API (free, open, no API key required) and Browser Geolocation.
 */

// WMO Weather interpretation codes
export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'sun', iconNight: 'moon' },
  1: { label: 'Mainly clear', icon: 'sun-cloud', iconNight: 'moon-cloud' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun', iconNight: 'cloud-moon' },
  3: { label: 'Overcast', icon: 'cloud', iconNight: 'cloud' },
  45: { label: 'Foggy', icon: 'fog', iconNight: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog', iconNight: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle', iconNight: 'drizzle' },
  53: { label: 'Moderate drizzle', icon: 'drizzle', iconNight: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle', iconNight: 'drizzle' },
  61: { label: 'Slight rain', icon: 'rain', iconNight: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain', iconNight: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain-heavy', iconNight: 'rain-heavy' },
  71: { label: 'Slight snow', icon: 'snow', iconNight: 'snow' },
  73: { label: 'Moderate snow', icon: 'snow', iconNight: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow', iconNight: 'snow' },
  80: { label: 'Rain showers', icon: 'rain', iconNight: 'rain' },
  81: { label: 'Moderate showers', icon: 'rain', iconNight: 'rain' },
  82: { label: 'Violent showers', icon: 'rain-heavy', iconNight: 'rain-heavy' },
  95: { label: 'Thunderstorm', icon: 'thunder', iconNight: 'thunder' },
  96: { label: 'Thunderstorm with hail', icon: 'thunder', iconNight: 'thunder' },
  99: { label: 'Heavy thunderstorm', icon: 'thunder', iconNight: 'thunder' },
};

export const DEFAULT_WEATHER_INFO = {
  city: 'Detected Location',
  country: '',
  temp: 29,
  tempUnit: '°C',
  apparentTemp: 31,
  minTemp: 26,
  maxTemp: 29,
  condition: 'Partly sunny',
  weatherCode: 2,
  isDay: true,
  daily: [
    { day: 'Wed', code: 95, maxTemp: 30, minTemp: 25 },
    { day: 'Thu', code: 61, maxTemp: 30, minTemp: 26 },
  ]
};

// Major City Coordinates Lookup Cache
const CITY_COORDS = {
  'mapusa': { lat: 15.5937, lon: 73.8142, name: 'Mapusa', country: 'India' },
  'margao': { lat: 15.2832, lon: 73.9862, name: 'Margao', country: 'India' },
  'panaji': { lat: 15.4909, lon: 73.8278, name: 'Panaji', country: 'India' },
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai', country: 'India' },
  'new delhi': { lat: 28.6139, lon: 77.2090, name: 'New Delhi', country: 'India' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', country: 'India' },
  'new york': { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'United States' },
  'london': { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
  'tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo', country: 'Japan' },
  'paris': { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'France' },
  'dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai', country: 'UAE' },
  'singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore', country: 'Singapore' },
  'sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney', country: 'Australia' },
  'maputo': { lat: -25.9692, lon: 32.5732, name: 'Maputo', country: 'Mozambique' },
};

/**
 * Fetch live weather data from Open-Meteo
 */
export async function fetchLiveWeather(lat, lon, isFahrenheit = false) {
  try {
    const tempParam = isFahrenheit ? '&temperature_unit=fahrenheit' : '';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto${tempParam}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();

    const current = data.current;
    const daily = data.daily;
    const weatherInfo = WEATHER_CODES[current.weather_code] || { label: 'Clear', icon: 'sun' };

    // Format 2-day forecast
    const forecastDays = [];
    if (daily && daily.time && daily.time.length >= 3) {
      for (let i = 1; i <= 2; i++) {
        const dateObj = new Date(daily.time[i]);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        forecastDays.push({
          day: dayName,
          code: daily.weather_code[i],
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
        });
      }
    }

    return {
      temp: Math.round(current.temperature_2m),
      apparentTemp: Math.round(current.apparent_temperature),
      minTemp: Math.round(daily.temperature_2m_min[0]),
      maxTemp: Math.round(daily.temperature_2m_max[0]),
      weatherCode: current.weather_code,
      condition: weatherInfo.label,
      isDay: current.is_day === 1,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      daily: forecastDays,
      timezone: data.timezone,
    };
  } catch (error) {
    console.warn('Using offline weather fallback:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to location name
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        city: data.city || data.locality || data.principalSubdivision || 'Local Area',
        country: data.countryName || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
  } catch (e) {
    // fallback
  }

  // Local fallback
  return {
    city: 'Local Area',
    country: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0] || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Request user's live browser geolocation
 */
export function getBrowserGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
}
