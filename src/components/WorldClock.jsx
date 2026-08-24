import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Plus, Trash2, Globe2, Check, Loader2 } from 'lucide-react';
import { searchGlobalCitiesAPI } from '../services/citiesApi';
import { WORLD_CITIES_DB } from '../data/cities';

const INITIAL_CITIES = [
  { id: '1', name: 'New York', country: 'United States, NY', timezone: 'America/New_York' },
  { id: '2', name: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { id: '3', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { id: '4', name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { id: '5', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
  { id: '6', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { id: '7', name: 'Sydney', country: 'Australia, NSW', timezone: 'Australia/Sydney' },
  { id: '8', name: 'Mapusa', country: 'Goa, India', timezone: 'Asia/Kolkata' },
  { id: '9', name: 'Mumbai', country: 'Maharashtra, India', timezone: 'Asia/Kolkata' },
];

export default function WorldClock({ is24Hour }) {
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('world_clock_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Search bar state & autocomplete from live API
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Add city modal state & autocomplete from live API
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityCountry, setNewCityCountry] = useState('');
  const [newCityTz, setNewCityTz] = useState('UTC');
  const [formSuggestions, setFormSuggestions] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showFormSuggestions, setShowFormSuggestions] = useState(false);

  const searchContainerRef = useRef(null);
  const formContainerRef = useRef(null);

  // Clock tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save active clocks to localStorage
  useEffect(() => {
    localStorage.setItem('world_clock_cities', JSON.stringify(cities));
  }, [cities]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (formContainerRef.current && !formContainerRef.current.contains(e.target)) {
        setShowFormSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time API search for main search bar (with debounce)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      const apiResults = await searchGlobalCitiesAPI(searchQuery);
      if (apiResults && apiResults.length > 0) {
        setSearchSuggestions(apiResults);
      } else {
        // Local fallback
        const localMatches = WORLD_CITIES_DB.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8);
        setSearchSuggestions(localMatches);
      }
      setIsSearchLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Real-time API search for "Add City" form (with debounce)
  useEffect(() => {
    if (!newCityName || newCityName.trim().length < 2) {
      setFormSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFormLoading(true);
      const apiResults = await searchGlobalCitiesAPI(newCityName);
      if (apiResults && apiResults.length > 0) {
        setFormSuggestions(apiResults);
      } else {
        const localMatches = WORLD_CITIES_DB.filter(c => 
          c.name.toLowerCase().includes(newCityName.toLowerCase()) ||
          c.country.toLowerCase().includes(newCityName.toLowerCase())
        ).slice(0, 8);
        setFormSuggestions(localMatches);
      }
      setIsFormLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [newCityName]);

  const handleRemoveCity = (idToRemove) => {
    setCities(prev => prev.filter(city => city.id !== idToRemove));
  };

  const handleSelectFormCity = (cityItem) => {
    setNewCityName(cityItem.name);
    setNewCityCountry(cityItem.country);
    setNewCityTz(cityItem.timezone);
    setShowFormSuggestions(false);
  };

  const handleAddDirectCity = (cityItem) => {
    const exists = cities.some(c => c.name.toLowerCase() === cityItem.name.toLowerCase());
    if (!exists) {
      const newCity = {
        id: Date.now().toString(),
        name: cityItem.name,
        country: cityItem.country,
        timezone: cityItem.timezone,
      };
      setCities(prev => [...prev, newCity]);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
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
    setNewCityTz('UTC');
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

  // Filter existing active clocks
  const filteredActiveCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="world-clock-container">
      {/* Header and Live Search with Autocomplete Dropdown */}
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <Globe2 size={20} color="var(--primary)" />
          <span>World Clock</span>
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Autocomplete Search Bar connected to live global geocoding API */}
          <div className="search-input-wrapper" ref={searchContainerRef}>
            {isSearchLoading ? (
              <Loader2 size={15} className="search-icon spin-anim" />
            ) : (
              <Search size={15} className="search-icon" />
            )}
            <input
              type="text"
              className="search-input"
              placeholder="Search world database..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
            />

            {/* Global API Search Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {searchSuggestions.map((item, idx) => {
                  const alreadyAdded = cities.some(c => c.name.toLowerCase() === item.name.toLowerCase());
                  return (
                    <div 
                      key={idx} 
                      className="autocomplete-item"
                      onClick={() => handleAddDirectCity(item)}
                    >
                      <div className="autocomplete-left">
                        <span className="autocomplete-flag">{item.flag}</span>
                        <div>
                          <div className="autocomplete-city">{item.name}</div>
                          <div className="autocomplete-country">{item.country}</div>
                        </div>
                      </div>
                      <div className="autocomplete-right">
                        {alreadyAdded ? (
                          <span className="already-added-badge"><Check size={12} /> Active</span>
                        ) : (
                          <span className="add-city-pill">+ Add</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* Add City Modal with Real-Time Database Autocomplete Filters */}
      {showAddCity && (
        <form onSubmit={handleAddCity} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
            Add New Location (Search Live Global Database)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* City Name with Real-Time Database Search */}
            <div style={{ position: 'relative' }} ref={formContainerRef}>
              <label style={{ fontSize: '0.775rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                City Name (Search worldwide)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Type any city (e.g. Mapusa, Maputo)..."
                  value={newCityName}
                  onChange={(e) => {
                    setNewCityName(e.target.value);
                    setShowFormSuggestions(true);
                  }}
                  onFocus={() => setShowFormSuggestions(true)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.55rem 0.75rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem'
                  }}
                />
                {isFormLoading && (
                  <Loader2 size={15} className="spin-anim" style={{ position: 'absolute', right: '10px', top: '12px', color: 'var(--primary)' }} />
                )}
              </div>

              {/* Real-Time Database Autocomplete Dropdown */}
              {showFormSuggestions && formSuggestions.length > 0 && (
                <div className="autocomplete-dropdown form-dropdown">
                  {formSuggestions.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="autocomplete-item"
                      onClick={() => handleSelectFormCity(item)}
                    >
                      <div className="autocomplete-left">
                        <span className="autocomplete-flag">{item.flag}</span>
                        <div>
                          <div className="autocomplete-city">{item.name}</div>
                          <div className="autocomplete-country">{item.country}</div>
                        </div>
                      </div>
                      <span className="autocomplete-tz-tag">{item.timezone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Country / Region */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Country / Region
              </label>
              <input
                type="text"
                placeholder="Auto-populated from API..."
                value={newCityCountry}
                onChange={(e) => setNewCityCountry(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.55rem 0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* IANA Timezone */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                IANA Timezone
              </label>
              <input
                type="text"
                placeholder="Auto-populated from API..."
                value={newCityTz}
                onChange={(e) => setNewCityTz(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.55rem 0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
            <button type="button" className="secondary-btn" onClick={() => setShowAddCity(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save City
            </button>
          </div>
        </form>
      )}

      {/* World Clock Cards Grid */}
      <div className="world-clock-grid">
        {filteredActiveCities.map((city) => {
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
