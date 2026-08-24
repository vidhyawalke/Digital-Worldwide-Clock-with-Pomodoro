/**
 * Real-Time Global Cities & Timezone Geocoding API Service
 * Powered by Open-Meteo Geocoding API (100% Free, Public, No API Key Required)
 * Database contains millions of cities, towns, and regions worldwide.
 */

// Helper to convert 2-letter ISO country code to Flag Emoji (e.g. 'IN' -> '🇮🇳')
export function getCountryFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// In-memory cache to avoid duplicate API calls
const searchCache = new Map();

/**
 * Search global cities dynamically in real-time
 * @param {string} query City or location search term (e.g. 'mapu', 'new york', 'tokyo')
 * @returns {Promise<Array>} List of matching cities with country, timezone, coordinates, and flag
 */
export async function searchGlobalCitiesAPI(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  const cacheKey = cleanQuery.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      searchCache.set(cacheKey, []);
      return [];
    }

    const formattedCities = data.results.map((item) => {
      const region = item.admin1 ? `${item.admin1}, ` : '';
      const country = item.country || '';
      const flag = getCountryFlagEmoji(item.country_code);

      return {
        id: item.id ? item.id.toString() : `${item.name}-${item.latitude}`,
        name: item.name,
        country: `${region}${country}`.trim(),
        timezone: item.timezone || 'UTC',
        lat: item.latitude,
        lon: item.longitude,
        flag: flag,
        countryCode: item.country_code,
      };
    });

    searchCache.set(cacheKey, formattedCities);
    return formattedCities;
  } catch (error) {
    console.warn('Real-time geocoding API error:', error);
    return [];
  }
}
