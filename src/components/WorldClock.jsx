import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Plus, Trash2, Globe2 } from 'lucide-react';

/**
 * WorldClock Component
 * 
 * Beginner React Concepts:
 * 1. Array State & Mapping: Storing an array of objects in state and rendering with `.map()`.
 * 2. Controlled Inputs: Binding input value to `searchQuery` state and `onChange` handler.
 * 3. Array Filtering: Creating derived lists for instant real-time searching.
 * 4. State Immutability: Adding and removing items without mutating original arrays.
 */

// Default worldwide cities list
const INITIAL_CITIES = [
  { id: '1', name: 'New York', country: 'United States', timezone: 'America/New_York' },
  { id: '2', name: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { id: '3', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { id: '4', name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { id: '5', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
  { id: '6', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { id: '7', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { id: '8', name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles' },
  { id: '9', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { id: '10', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { id: '11', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { id: '12', name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
];

export default function WorldClock({ is24Hour }) {
  const [cities, setCities] = useState(() => {
    // Load persisted cities from localStorage if available
    const saved = localStorage.getItem('world_clock_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityCountry, setNewCityCountry] = useState('');
  const [newCityTz, setNewCityTz] = useState('UTC');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage when cities change
  useEffect(() => {
    localStorage.setItem('world_clock_cities', JSON.stringify(cities));
  }, [cities]);

  // Remove a city card
  const handleRemoveCity = (idToRemove) => {
    setCities(prev => prev.filter(city => city.id !== idToRemove));
  };

  // Add a new custom city
  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCityName || !newCityTz) return;

    const newCity = {
      id: Date.now().toString(),
      name: newCityName.trim(),
      country: newCityCountry.trim() || 'Custom',
      timezone: newCityTz.trim(),
    };

    setCities(prev => [...prev, newCity]);
    setNewCityName('');
    setNewCityCountry('');
    setShowAddCity(false);
  };

  // Reset to default list
  const handleResetDefaults = () => {
    setCities(INITIAL_CITIES);
  };

  // Format time for specific timezone
  const getTimeInZone = (timezone) => {
    try {
      const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour,
      };
      return new Intl.DateTimeFormat([], options).format(currentTime);
    } catch (e) {
      return '--:--:--';
    }
  };

  // Check if target timezone is currently daytime (between 6 AM and 6 PM)
  const isDaytimeInZone = (timezone) => {
    try {
      const options = {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      };
      const hour = parseInt(new Intl.DateTimeFormat([], options).format(currentTime), 10);
      return hour >= 6 && hour < 18;
    } catch (e) {
      return true;
    }
  };

  // Compute UTC offset string (e.g. "+5:30", "-4:00")
  const getUtcOffset = (timezone) => {
    try {
      const dateInZone = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      const dateInUtc = new Date(currentTime.toLocaleString('en-US', { timeZone: 'UTC' }));
      const diffMinutes = Math.round((dateInZone - dateInUtc) / (1000 * 60));
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const mins = Math.abs(diffMinutes) % 60;
      const sign = diffMinutes >= 0 ? '+' : '-';
      return `UTC${sign}${hours}${mins ? `:${mins.toString().padStart(2, '0')}` : ''}`;
    } catch (e) {
      return 'UTC';
    }
  };

  // Filter cities by search term
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="world-clock-container">
      {/* Header and Filter */}
      <div className="section-header">
        <h2 className="section-title">
          <Globe2 size={22} color="#06b6d4" />
          <span>Worldwide Timezones</span>
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search world cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            className="control-btn"
            onClick={() => setShowAddCity(!showAddCity)}
            title="Add new city"
          >
            <Plus size={15} />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Add City Modal/Form */}
      {showAddCity && (
        <form onSubmit={handleAddCity} className="glass-card settings-drawer" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Add New Location</h3>
          <div className="settings-grid">
            <div className="setting-field">
              <label>City Name</label>
              <input
                type="text"
                placeholder="e.g. Seoul"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                required
              />
            </div>
            <div className="setting-field">
              <label>Country / Region</label>
              <input
                type="text"
                placeholder="e.g. South Korea"
                value={newCityCountry}
                onChange={(e) => setNewCityCountry(e.target.value)}
              />
            </div>
            <div className="setting-field">
              <label>IANA Timezone</label>
              <input
                type="text"
                placeholder="e.g. Asia/Seoul or Europe/Rome"
                value={newCityTz}
                onChange={(e) => setNewCityTz(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="control-btn" 
              onClick={() => setShowAddCity(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary-action" 
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              Save City
            </button>
          </div>
        </form>
      )}

      {/* Cities Grid */}
      <div className="world-clock-grid">
        {filteredCities.map((city) => {
          const isDay = isDaytimeInZone(city.timezone);
          const timeString = getTimeInZone(city.timezone);
          const offsetString = getUtcOffset(city.timezone);

          return (
            <div key={city.id} className={`glass-card city-card ${isDay ? 'day' : 'night'}`}>
              <div className="city-header">
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>{city.country}</p>
                </div>
                <div className="day-indicator">
                  {isDay ? (
                    <>
                      <Sun size={12} color="#f59e0b" />
                      <span>Day</span>
                    </>
                  ) : (
                    <>
                      <Moon size={12} color="#8b5cf6" />
                      <span>Night</span>
                    </>
                  )}
                </div>
              </div>

              <div className="city-time">
                {timeString}
              </div>

              <div className="city-footer">
                <span className="offset-tag">{offsetString}</span>
                <button
                  className="city-toggle-btn"
                  onClick={() => handleRemoveCity(city.id)}
                  title={`Remove ${city.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No cities found matching "{searchQuery}"</p>
          <button 
            className="control-btn" 
            onClick={handleResetDefaults} 
            style={{ margin: '1rem auto 0' }}
          >
            Restore Default Cities
          </button>
        </div>
      )}
    </section>
  );
}
