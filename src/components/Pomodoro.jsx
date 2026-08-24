import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings, CheckCircle2, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';

/**
 * Pomodoro Component
 * 
 * Beginner React Concepts:
 * 1. Managing multiple related states (secondsLeft, isRunning, mode, stats).
 * 2. SVG Stroke Dasharray math for smooth circular countdown animation.
 * 3. Side effects triggered by timer expiration (playing sound, switching mode).
 * 4. Persisting session counts to browser `localStorage`.
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
  
  // Settings toggle
  const [showSettings, setShowSettings] = useState(false);

  // Focus statistics
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    return saved ? JSON.parse(saved) : { completedToday: 0, totalMinutes: 0, streak: 0 };
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

  // Persist durations and stats
  useEffect(() => {
    localStorage.setItem('pomodoro_durations', JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  // Timer interval countdown
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      // Timer finished!
      soundFx.playChime('complete');
      setIsRunning(false);

      if (mode === 'pomodoro') {
        // Increment completed sessions
        setStats((prev) => ({
          completedToday: prev.completedToday + 1,
          totalMinutes: prev.totalMinutes + durations.pomodoro,
          streak: prev.streak + 1,
        }));
        // Switch to break
        const nextBreak = (stats.completedToday + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextBreak);
      } else {
        // Break finished, back to pomodoro
        setMode('pomodoro');
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, durations, stats.completedToday]);

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
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setMode('shortBreak');
    } else {
      setMode('pomodoro');
    }
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
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  return (
    <section className="glass-card pomodoro-card">
      {/* Mode Selector Tabs */}
      <div className={`pomo-modes ${mode === 'shortBreak' ? 'break-short' : mode === 'longBreak' ? 'break-long' : ''}`}>
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

      {/* Circular Animated Timer */}
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
              stroke: mode === 'pomodoro' ? 'var(--accent-cyan)' : mode === 'shortBreak' ? 'var(--accent-emerald)' : 'var(--accent-purple)'
            }}
          />
        </svg>

        <div className="timer-inner">
          <div className="pomo-time-text">{formattedTime}</div>
          <div className="pomo-status-label">
            {isRunning ? (mode === 'pomodoro' ? 'Focus Time' : 'Relax & Rest') : 'Paused'}
          </div>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="pomo-actions">
        <button 
          className="btn-icon-action" 
          onClick={handleReset}
          title="Reset timer"
        >
          <RotateCcw size={18} />
        </button>

        <button 
          className="btn-primary-action" 
          onClick={togglePlay}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button 
          className="btn-icon-action" 
          onClick={handleSkip}
          title="Skip session"
        >
          <SkipForward size={18} />
        </button>

        <button 
          className="btn-icon-action" 
          onClick={() => setShowSettings(!showSettings)}
          title="Configure custom durations"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Custom Duration Settings */}
      {showSettings && (
        <div className="settings-drawer" style={{ width: '100%', borderTop: '1px solid var(--card-border)' }}>
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
            <CheckCircle2 size={16} color="var(--accent-cyan)" />
            <span>{stats.completedToday}</span>
          </div>
          <span className="stat-label">Sessions Done</span>
        </div>

        <div className="stat-item">
          <div className="stat-val">{stats.totalMinutes}m</div>
          <span className="stat-label">Focus Time</span>
        </div>

        <div className="stat-item">
          <div className="stat-val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)' }}>
            <Flame size={16} />
            <span>{stats.streak}</span>
          </div>
          <span className="stat-label">Daily Streak</span>
        </div>
      </div>
    </section>
  );
}
