import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Globe2, Check, Loader2, Trash2 } from 'lucide-react';
import { searchGlobalCitiesAPI } from '../services/citiesApi';

// ─── Analog Clock Face for each city ───────────────────────────────────────────
function CityAnalogClock({ timezone, size = 120 }) {
  const [now, setNow] = useState(() => {
    try { return new Date(new Date().toLocaleString('en-US', { timeZone: timezone })); }
    catch { return new Date(); }
  });

  useEffect(() => {
    const tick = setInterval(() => {
      try { setNow(new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))); }
      catch { setNow(new Date()); }
    }, 1000);
    return () => clearInterval(tick);
  }, [timezone]);

  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 3;
  const h  = now.getHours() % 12;
  const m  = now.getMinutes();
  const s  = now.getSeconds();

  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = h * 30 + m * 0.5;

  const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
  const pt    = (deg, len) => ({ x: cx + Math.cos(toRad(deg)) * len, y: cy + Math.sin(toRad(deg)) * len });

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isMajor = i % 5 === 0;
    const rad = toRad(i * 6);
    return {
      x1: cx + Math.cos(rad) * (isMajor ? r - 10 : r - 5),
      y1: cy + Math.sin(rad) * (isMajor ? r - 10 : r - 5),
      x2: cx + Math.cos(rad) * r,
      y2: cy + Math.sin(rad) * r,
      isMajor,
    };
  });

  const nums = [12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
    const rad = toRad(i * 30);
    const nr  = r - 19;
    return { n, x: cx + Math.cos(rad) * nr, y: cy + Math.sin(rad) * nr };
  });

  const secPt  = pt(secDeg,  r * 0.80);
  const minPt  = pt(minDeg,  r * 0.70);
  const hourPt = pt(hourDeg, r * 0.50);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="wc-analog-svg">
      <circle cx={cx} cy={cy} r={r} className="wc-face" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          className={t.isMajor ? 'wc-tick-major' : 'wc-tick-minor'} />
      ))}
      {nums.map(({ n, x, y }) => (
        <text key={n} x={x} y={y} className="wc-num" textAnchor="middle" dominantBaseline="central">{n}</text>
      ))}
      <line x1={cx} y1={cy} x2={hourPt.x} y2={hourPt.y} className="wc-hand-hour"   strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minPt.x}  y2={minPt.y}  className="wc-hand-minute" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={secPt.x}  y2={secPt.y}  className="wc-hand-second" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4.5} className="wc-center-dot" />
      <circle cx={cx} cy={cy} r={2} fill="white" />
    </svg>
  );
}

// ─── City time helpers ──────────────────────────────────────────────────────────
function getCityTime(timezone, is24Hour) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24Hour,
    }).format(new Date());
  } catch { return '--:--:--'; }
}

function getCityDay(timezone) {
  try { return new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(new Date()); }
  catch { return ''; }
}

// ─── Main WorldClock ────────────────────────────────────────────────────────────
export default function WorldClock({ is24Hour }) {
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('world_clock_cities');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    const OLD_DEFAULT_IDS = ['1','2','3','4','5','6','7','8','9'];
    if (parsed.every(c => OLD_DEFAULT_IDS.includes(c.id))) {
      localStorage.removeItem('world_clock_cities');
      return [];
    }
    return parsed;
  });

  const [, setTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityCountry, setNewCityCountry] = useState('');
  const [newCityTz, setNewCityTz] = useState('UTC');
  const [formSuggestions, setFormSuggestions] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showFormSuggestions, setShowFormSuggestions] = useState(false);

  const searchContainerRef = useRef(null);
  const formContainerRef   = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('world_clock_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const fn = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setIsSearchFocused(false);
      if (formContainerRef.current   && !formContainerRef.current.contains(e.target))   setShowFormSuggestions(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) { setSearchSuggestions([]); return; }
    const t = setTimeout(async () => {
      setIsSearchLoading(true);
      try { setSearchSuggestions(await searchGlobalCitiesAPI(searchQuery)); } catch { setSearchSuggestions([]); }
      setIsSearchLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (!newCityName.trim() || newCityName.length < 2) { setFormSuggestions([]); return; }
    const t = setTimeout(async () => {
      setIsFormLoading(true);
      try { setFormSuggestions(await searchGlobalCitiesAPI(newCityName)); } catch { setFormSuggestions([]); }
      setIsFormLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [newCityName]);

  const handleRemoveCity     = (id)   => setCities(p => p.filter(c => c.id !== id));
  const handleSelectFormCity = (item) => { setNewCityName(item.name); setNewCityCountry(item.country); setNewCityTz(item.timezone); setShowFormSuggestions(false); };
  const handleAddDirectCity  = (item) => {
    if (!cities.some(c => c.name.toLowerCase() === item.name.toLowerCase()))
      setCities(p => [...p, { id: Date.now().toString(), name: item.name, country: item.country, timezone: item.timezone }]);
    setSearchQuery(''); setIsSearchFocused(false);
  };
  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCityName || !newCityTz) return;
    setCities(p => [...p, { id: Date.now().toString(), name: newCityName.trim(), country: newCityCountry.trim() || 'Custom', timezone: newCityTz.trim() }]);
    setNewCityName(''); setNewCityCountry(''); setNewCityTz('UTC'); setShowAddCity(false);
  };

  const filtered = searchQuery.trim()
    ? cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cities;

  const inputStyle = { width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' };

  return (
    <section className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <Globe2 size={20} color="var(--primary)" /><span>World Clock</span>
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-input-wrapper" ref={searchContainerRef}>
            {isSearchLoading ? <Loader2 size={15} className="search-icon spin-anim" /> : <Search size={15} className="search-icon" />}
            <input type="text" className="search-input" placeholder="Search world database..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setIsSearchFocused(true); }}
              onFocus={() => setIsSearchFocused(true)} />
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {searchSuggestions.map((item, idx) => {
                  const added = cities.some(c => c.name.toLowerCase() === item.name.toLowerCase());
                  return (
                    <div key={idx} className="autocomplete-item" onClick={() => handleAddDirectCity(item)}>
                      <div className="autocomplete-left">
                        <span className="autocomplete-flag">{item.flag}</span>
                        <div><div className="autocomplete-city">{item.name}</div><div className="autocomplete-country">{item.country}</div></div>
                      </div>
                      <div className="autocomplete-right">
                        {added ? <span className="already-added-badge"><Check size={12} /> Active</span> : <span className="add-city-pill">+ Add</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button className="secondary-btn" onClick={() => setShowAddCity(!showAddCity)}>
            <Plus size={15} /><span>Add City</span>
          </button>
        </div>
      </div>

      {/* Add City Form */}
      {showAddCity && (
        <form onSubmit={handleAddCity} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Add New Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div ref={formContainerRef} style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>City Name</label>
              <input type="text" placeholder="e.g. Mapusa, London..." value={newCityName}
                onChange={(e) => { setNewCityName(e.target.value); setShowFormSuggestions(true); }}
                onFocus={() => setShowFormSuggestions(true)} required style={inputStyle} />
              {isFormLoading && <Loader2 size={14} className="spin-anim" style={{ position: 'absolute', right: '10px', top: '32px', color: 'var(--primary)' }} />}
              {showFormSuggestions && formSuggestions.length > 0 && (
                <div className="autocomplete-dropdown form-dropdown">
                  {formSuggestions.map((item, idx) => (
                    <div key={idx} className="autocomplete-item" onClick={() => handleSelectFormCity(item)}>
                      <div className="autocomplete-left">
                        <span className="autocomplete-flag">{item.flag}</span>
                        <div><div className="autocomplete-city">{item.name}</div><div className="autocomplete-country">{item.country}</div></div>
                      </div>
                      <span className="autocomplete-tz-tag">{item.timezone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Country / Region</label>
              <input type="text" placeholder="Auto-populated..." value={newCityCountry}
                onChange={(e) => setNewCityCountry(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>IANA Timezone</label>
              <input type="text" placeholder="Auto-populated..." value={newCityTz}
                onChange={(e) => setNewCityTz(e.target.value)} required style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <button type="button" className="secondary-btn" onClick={() => setShowAddCity(false)}>Cancel</button>
            <button type="submit" className="primary-btn">Save City</button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
          <Globe2 size={36} color="var(--border-color)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          <p style={{ fontWeight: '600', marginBottom: '0.3rem' }}>No cities added yet</p>
          <p style={{ fontSize: '0.82rem' }}>Search above or click "Add City" to build your personal world clock.</p>
        </div>
      )}

      {/* Analog Clock Grid */}
      {filtered.length > 0 && (
        <div className="wc-analog-grid">
          {filtered.map((city) => (
            <div key={city.id} className="wc-analog-card">
              <CityAnalogClock timezone={city.timezone} size={120} />
              <div className="wc-analog-info">
                <span className="wc-analog-city">{city.name}</span>
                <span className="wc-analog-time">{getCityDay(city.timezone)} {getCityTime(city.timezone, is24Hour)}</span>
              </div>
              <button className="wc-remove-btn" title={`Remove ${city.name}`} onClick={() => handleRemoveCity(city.id)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
