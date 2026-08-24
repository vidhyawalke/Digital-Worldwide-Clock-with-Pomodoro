import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Plus, Trash2, Globe2 } from 'lucide-react';

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
];

export default function WorldClock({ is24Hour }) {
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('world_clock_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityCountry, setNewCityCountry] = useState('');
  const [newCityTz, setNewCityTz] = useState('UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('world_clock_cities', JSON.stringify(cities));
  }, [cities]);

  const handleRemoveCity = (idToRemove) => {
    setCities(prev => prev.filter(city => city.id !== idToRemove));
  };

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

  const getTimeInZone = (timezone) => {
    try {
      const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour,
      };
      return new Intl.DateTimeFormat([], options).format(currentTime);
    } catch (e) {
      return '--:--';
    }
  };

  const getDateInZone = (timezone) => {
    try {
      const options = {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };
      return new Intl.DateTimeFormat([], options).format(currentTime);
    } catch (e) {
      return '';
    }
  };

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

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="world-clock-container">
      {/* Header and Filter */}
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <Globe2 size={20} color="var(--primary)" />
          <span>World Clock</span>
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            className="secondary-btn"
            onClick={() => setShowAddCity(!showAddCity)}
          >
            <Plus size={15} />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Add City Modal/Form */}
      {showAddCity && (
        <form onSubmit={handleAddCity} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '600' }}>Add New Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>City Name</label>
              <input
                type="text"
                placeholder="e.g. Seoul"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Country</label>
              <input
                type="text"
                placeholder="e.g. South Korea"
                value={newCityCountry}
                onChange={(e) => setNewCityCountry(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timezone</label>
              <input
                type="text"
                placeholder="e.g. Asia/Seoul"
                value={newCityTz}
                onChange={(e) => setNewCityTz(e.target.value)}
                required
                style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="secondary-btn" onClick={() => setShowAddCity(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save
            </button>
          </div>
        </form>
      )}

      {/* World Clock Cards Grid (Template Spec: New York, Sun, 09:30 AM, May 24, 2025) */}
      <div className="world-clock-grid">
        {filteredCities.map((city) => {
          const isDay = isDaytimeInZone(city.timezone);
          const timeString = getTimeInZone(city.timezone);
          const dateString = getDateInZone(city.timezone);

          return (
            <div key={city.id} className="world-clock-card">
              <div className="wc-header">
                <span className="wc-city">{city.name}</span>
                {isDay ? (
                  <Sun size={18} color="#F59E0B" />
                ) : (
                  <Moon size={18} color="#8B5CF6" />
                )}
              </div>

              <div className="wc-time">
                {timeString}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="wc-date">{dateString}</span>
                <button
                  onClick={() => handleRemoveCity(city.id)}
                  title={`Remove ${city.name}`}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
