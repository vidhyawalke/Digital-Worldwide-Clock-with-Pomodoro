import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings, 
  CheckCircle2, 
  Flame, 
  History, 
  Trash2, 
  BookmarkPlus, 
  Clock,
  Repeat
} from 'lucide-react';
import { soundFx } from '../utils/audio';

/**
 * Pomodoro Component
 * 
 * Beginner React Concepts:
 * 1. Managing multiple related states (secondsLeft, isRunning, mode, isAutoLoop, stats, records).
 * 2. Auto-Loop Continuous Timer: Automatically transitions between Focus and Breaks without stopping.
 * 3. SVG Stroke Dasharray math for smooth circular countdown animation.
 * 4. Persisting session records and auto-loop preferences to browser `localStorage`.
 */

export default function Pomodoro() {
  // Preset durations in minutes (customizable)
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('pomodoro_durations');
    return saved ? JSON.parse(saved) : { pomodoro: 25, shortBreak: 5, longBreak: 15 };
  });

  // Current active mode: 'pomodoro' | 'shortBreak' | 'longBreak'
  const [mode, setMode] = useState('pomodoro');
  
  // Remaining time in seconds
  const [secondsLeft, setSecondsLeft] = useState(durations.pomodoro * 60);
  
  // Timer running status
  const [isRunning, setIsRunning] = useState(false);

  // Auto Loop Continuous Mode: keeps playing and looping until explicitly paused
  const [isAutoLoop, setIsAutoLoop] = useState(() => {
    const saved = localStorage.getItem('pomodoro_autoloop');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Settings toggle
  const [showSettings, setShowSettings] = useState(false);

  // Focus statistics
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    return saved ? JSON.parse(saved) : { completedToday: 0, totalMinutes: 0, streak: 0 };
  });

  // Session Records List (persisted in localStorage)
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('pomodoro_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep a ref to previous mode to detect changes
  const prevModeRef = useRef(mode);

  // Sync remaining seconds when mode or duration changes (if not running)
  useEffect(() => {
    if (!isRunning || prevModeRef.current !== mode) {
      setSecondsLeft(durations[mode] * 60);
      prevModeRef.current = mode;
    }
  }, [mode, durations]);

  // Persist settings, stats, and loop mode
  useEffect(() => {
    localStorage.setItem('pomodoro_durations', JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('pomodoro_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('pomodoro_autoloop', JSON.stringify(isAutoLoop));
  }, [isAutoLoop]);

  // Helper to add a session record to the list
  const addRecord = (type, durationMins, label = 'Completed') => {
    const newRecord = {
      id: Date.now().toString(),
      type: type, // 'pomodoro' | 'shortBreak' | 'longBreak' | 'manual'
      duration: durationMins,
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateString: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      label: label,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Timer interval countdown & Auto-Loop logic
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      // Current session reached zero!
      soundFx.playChime('complete');

      if (mode === 'pomodoro') {
        // Log completed Pomodoro session
        setStats((prev) => ({
          completedToday: prev.completedToday + 1,
          totalMinutes: prev.totalMinutes + durations.pomodoro,
          streak: prev.streak + 1,
        }));
        addRecord('pomodoro', durations.pomodoro, 'Focus Session');

        // Determine next break mode
        const nextBreak = (stats.completedToday + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextBreak);
        setSecondsLeft(durations[nextBreak] * 60);

        // If Auto Loop is ON, continue running without pausing!
        if (!isAutoLoop) {
          setIsRunning(false);
        }
      } else {
        // Break finished
        addRecord(mode, durations[mode], mode === 'shortBreak' ? 'Short Break' : 'Long Break');
        setMode('pomodoro');
        setSecondsLeft(durations.pomodoro * 60);

        // If Auto Loop is ON, continue running focus session!
        if (!isAutoLoop) {
          setIsRunning(false);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, durations, isAutoLoop, stats.completedToday]);

  // Play / Pause Toggle
  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning) {
      soundFx.playChime('start');
    }
    setIsRunning(!isRunning);
  };

  // Reset current mode timer
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  // Skip to next mode
  const handleSkip = () => {
    if (mode === 'pomodoro') {
      const nextBreak = (stats.completedToday + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextBreak);
      setSecondsLeft(durations[nextBreak] * 60);
    } else {
      setMode('pomodoro');
      setSecondsLeft(durations.pomodoro * 60);
    }
  };

  // Manual record bookmark button
  const handleRecordCurrentInterval = () => {
    const elapsedSeconds = durations[mode] * 60 - secondsLeft;
    const elapsedMins = Math.max(1, Math.round(elapsedSeconds / 60));
    addRecord(mode, elapsedMins, `${mode === 'pomodoro' ? 'Focus Lap' : 'Break Lap'}`);
  };

  // Delete a record item
  const handleDeleteRecord = (idToRemove) => {
    setRecords((prev) => prev.filter((r) => r.id !== idToRemove));
  };

  // Clear all records
  const handleClearAllRecords = () => {
    setRecords([]);
  };

  // Switch mode manually
  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(durations[newMode] * 60);
  };

  // Format MM:SS for display
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular progress calculation
  const totalSeconds = durations[mode] * 60;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  return (
    <section className="glass-card pomodoro-card">
      {/* Mode Selector Tabs */}
      <div className="pomo-modes">
        <button
          className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => switchMode('pomodoro')}
        >
          Pomodoro ({durations.pomodoro}m)
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break ({durations.shortBreak}m)
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break ({durations.longBreak}m)
        </button>
      </div>

      {/* Clean Circular Timer with Timora Coral Rose Accent */}
      <div className="timer-circle-container">
        <svg className="timer-svg" viewBox="0 0 240 240">
          <circle
            className="timer-circle-bg"
            cx="120"
            cy="120"
            r={radius}
          />
          <circle
            className="timer-circle-progress"
            cx="120"
            cy="120"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        <div className="timer-inner">
          <div className="pomo-time-text">{formattedTime}</div>
          <div className="pomo-status-label">
            {isRunning 
              ? (mode === 'pomodoro' ? 'Focusing' : 'Resting') 
              : 'Paused'}
          </div>
        </div>
      </div>

      {/* Normal, Decent Control Action Buttons */}
      <div className="pomo-actions">
        <button 
          className="btn-icon-action" 
          onClick={handleReset}
          title="Reset timer (Press R)"
        >
          <RotateCcw size={17} />
        </button>

        <button 
          className="btn-primary-action" 
          onClick={togglePlay}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button 
          className="btn-icon-action" 
          onClick={handleSkip}
          title="Skip to next session (Press S)"
        >
          <SkipForward size={17} />
        </button>

        {/* Auto Loop Continuous Mode Button */}
        <button 
          className={`btn-icon-action ${isAutoLoop ? 'active' : ''}`}
          onClick={() => setIsAutoLoop(!isAutoLoop)}
          title={isAutoLoop ? 'Auto Loop: ON (Plays continuously until paused)' : 'Auto Loop: OFF'}
        >
          <Repeat size={17} />
        </button>

        <button 
          className="btn-icon-action" 
          onClick={handleRecordCurrentInterval}
          title="Record current interval/lap"
        >
          <BookmarkPlus size={17} />
        </button>

        <button 
          className="btn-icon-action" 
          onClick={() => setShowSettings(!showSettings)}
          title="Custom Durations"
        >
          <Settings size={17} />
        </button>
      </div>

      {/* Custom Duration Settings */}
      {showSettings && (
        <div className="settings-drawer" style={{ width: '100%', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Customize Durations (Minutes)</h4>
          <div className="settings-grid">
            <div className="setting-field">
              <label>Pomodoro</label>
              <input
                type="number"
                min="1"
                max="90"
                value={durations.pomodoro}
                onChange={(e) => setDurations({ ...durations, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
            <div className="setting-field">
              <label>Short Break</label>
              <input
                type="number"
                min="1"
                max="30"
                value={durations.shortBreak}
                onChange={(e) => setDurations({ ...durations, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
            <div className="setting-field">
              <label>Long Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={durations.longBreak}
                onChange={(e) => setDurations({ ...durations, longBreak: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Session Focus Statistics */}
      <div className="pomo-stats-row">
        <div className="stat-item">
          <div className="stat-val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={16} />
            <span>{stats.completedToday}</span>
          </div>
          <span className="stat-label">Sessions Done</span>
        </div>

        <div className="stat-item">
          <div className="stat-val">{stats.totalMinutes}m</div>
          <span className="stat-label">Total Focus</span>
        </div>

        <div className="stat-item">
          <div className="stat-val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Flame size={16} />
            <span>{stats.streak}</span>
          </div>
          <span className="stat-label">Daily Streak</span>
        </div>
      </div>

      {/* Session Records History List */}
      <div className="pomo-records-section">
        <div className="records-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <History size={16} color="var(--primary)" />
            <h4>Session Records ({records.length})</h4>
          </div>

          {records.length > 0 && (
            <button 
              className="clear-records-btn"
              onClick={handleClearAllRecords}
              title="Clear all records"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="empty-records-msg">
            <Clock size={16} style={{ opacity: 0.6, marginBottom: '0.25rem' }} />
            <p>No records logged yet. Complete a session or tap bookmark.</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((rec, index) => {
              const isPomo = rec.type === 'pomodoro';
              const isShort = rec.type === 'shortBreak';
              const badgeClass = isPomo ? 'badge-pomo' : isShort ? 'badge-short' : 'badge-long';

              return (
                <div key={rec.id} className="record-item">
                  <div className="record-left">
                    <span className="record-index">#{records.length - index}</span>
                    <span className={`record-badge ${badgeClass}`}>{rec.label}</span>
                    <span className="record-duration">{rec.duration} min</span>
                  </div>

                  <div className="record-right">
                    <span className="record-timestamp">{rec.dateString} {rec.timeString}</span>
                    <button 
                      className="delete-record-btn" 
                      onClick={() => handleDeleteRecord(rec.id)}
                      title="Delete record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
