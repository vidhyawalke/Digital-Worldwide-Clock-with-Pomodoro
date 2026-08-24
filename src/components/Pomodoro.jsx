import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings, 
  TrendingUp, 
  History, 
  Trash2, 
  BookmarkPlus, 
  Repeat,
  Quote
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export default function Pomodoro() {
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('pomodoro_durations');
    return saved ? JSON.parse(saved) : { pomodoro: 25, shortBreak: 5, longBreak: 15 };
  });

  const [mode, setMode] = useState('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(durations.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [isAutoLoop, setIsAutoLoop] = useState(() => {
    const saved = localStorage.getItem('pomodoro_autoloop');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showSettings, setShowSettings] = useState(false);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoro_stats');
    return saved ? JSON.parse(saved) : { completedToday: 0, totalMinutes: 0, streak: 0 };
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('pomodoro_records');
    return saved ? JSON.parse(saved) : [];
  });

  const prevModeRef = useRef(mode);

  useEffect(() => {
    if (!isRunning || prevModeRef.current !== mode) {
      setSecondsLeft(durations[mode] * 60);
      prevModeRef.current = mode;
    }
  }, [mode, durations]);

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

  const addRecord = (type, durationMins, label = 'Completed') => {
    const newRecord = {
      id: Date.now().toString(),
      type: type,
      duration: durationMins,
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateString: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      label: label,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      soundFx.playChime('complete');

      if (mode === 'pomodoro') {
        setStats((prev) => ({
          completedToday: prev.completedToday + 1,
          totalMinutes: prev.totalMinutes + durations.pomodoro,
          streak: prev.streak + 1,
        }));
        addRecord('pomodoro', durations.pomodoro, 'Focus Session');

        const nextBreak = (stats.completedToday + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextBreak);
        setSecondsLeft(durations[nextBreak] * 60);

        if (!isAutoLoop) {
          setIsRunning(false);
        }
      } else {
        addRecord(mode, durations[mode], mode === 'shortBreak' ? 'Short Break' : 'Long Break');
        setMode('pomodoro');
        setSecondsLeft(durations.pomodoro * 60);

        if (!isAutoLoop) {
          setIsRunning(false);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, durations, isAutoLoop, stats.completedToday]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning) {
      soundFx.playChime('start');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

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

  const handleAdjustMinutes = (delta) => {
    const currentMins = durations[mode];
    const newMins = Math.max(1, Math.min(90, currentMins + delta));
    setDurations({ ...durations, [mode]: newMins });
    if (!isRunning) {
      setSecondsLeft(newMins * 60);
    }
  };

  const handleRecordCurrentInterval = () => {
    const elapsedSeconds = durations[mode] * 60 - secondsLeft;
    const elapsedMins = Math.max(1, Math.round(elapsedSeconds / 60));
    addRecord(mode, elapsedMins, `${mode === 'pomodoro' ? 'Focus Lap' : 'Break Lap'}`);
  };

  const handleDeleteRecord = (idToRemove) => {
    setRecords((prev) => prev.filter((r) => r.id !== idToRemove));
  };

  const handleClearAllRecords = () => {
    setRecords([]);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(durations[newMode] * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = durations[mode] * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  const elapsedMinutes = Math.floor((totalSeconds - secondsLeft) / 60);
  const elapsedSecondsRemaining = (totalSeconds - secondsLeft) % 60;
  const elapsedFormatted = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSecondsRemaining).padStart(2, '0')}`;

  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  return (
    <section className="glass-card pomodoro-card">
      {/* Mode Selector Tabs */}
      <div className="pomo-segmented-tabs">
        <button
          className={`pomo-segment-btn ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => switchMode('pomodoro')}
        >
          Pomodoro ({durations.pomodoro}m)
        </button>
        <button
          className={`pomo-segment-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break ({durations.shortBreak}m)
        </button>
        <button
          className={`pomo-segment-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break ({durations.longBreak}m)
        </button>
      </div>

      {/* Circular Timer Centerpiece */}
      <div className="timer-circle-wrap">
        <svg className="timer-svg" viewBox="0 0 220 220">
          <circle className="timer-circle-bg" cx="110" cy="110" r={radius} />
          <circle
            className="timer-circle-progress"
            cx="110"
            cy="110"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="timer-center-content">
          <div className="timer-digits">{formattedTime}</div>
          <div className="timer-mode-label">
            {isRunning 
              ? (mode === 'pomodoro' ? 'Focusing' : 'Resting') 
              : 'Paused'}
          </div>
        </div>
      </div>

      {/* Stepper Controls: - 1m / + 1m */}
      <div className="stepper-adjust-row">
        <button 
          className="stepper-btn" 
          onClick={() => handleAdjustMinutes(-1)} 
          title="Decrease duration by 1 minute"
        >
          &minus; 1 min
        </button>
        <button 
          className="stepper-btn" 
          onClick={() => handleAdjustMinutes(1)} 
          title="Increase duration by 1 minute"
        >
          + 1 min
        </button>
      </div>

      {/* Linear Progress Bar */}
      <div className="focus-linear-progress">
        <div className="focus-linear-header">
          <span>{mode === 'pomodoro' ? 'Focus Progress' : 'Break Progress'}</span>
          <span>{elapsedFormatted} / {durations[mode]}:00</span>
        </div>
        <div className="focus-linear-track">
          <div 
            className="focus-linear-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pomo-actions">
        <button 
          className="btn-icon-action" 
          onClick={handleReset}
          title="Reset timer (Press R)"
        >
          <RotateCcw size={16} />
        </button>

        <button 
          className="primary-btn" 
          onClick={togglePlay}
          style={{ minWidth: '120px' }}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button 
          className="btn-icon-action" 
          onClick={handleSkip}
          title="Skip to next session (Press S)"
        >
          <SkipForward size={16} />
        </button>

        <button 
          className={`btn-icon-action ${isAutoLoop ? 'active' : ''}`}
          onClick={() => setIsAutoLoop(!isAutoLoop)}
          title={isAutoLoop ? 'Auto Loop: ON (Continuous)' : 'Auto Loop: OFF'}
        >
          <Repeat size={16} />
        </button>

        <button 
          className="btn-icon-action" 
          onClick={handleRecordCurrentInterval}
          title="Bookmark interval/lap"
        >
          <BookmarkPlus size={16} />
        </button>

        <button 
          className="btn-icon-action" 
          onClick={() => setShowSettings(!showSettings)}
          title="Custom Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Customize Durations (Minutes)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Focus</label>
              <input
                type="number"
                min="1"
                max="90"
                value={durations.pomodoro}
                onChange={(e) => setDurations({ ...durations, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Short</label>
              <input
                type="number"
                min="1"
                max="30"
                value={durations.shortBreak}
                onChange={(e) => setDurations({ ...durations, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Long</label>
              <input
                type="number"
                min="1"
                max="60"
                value={durations.longBreak}
                onChange={(e) => setDurations({ ...durations, longBreak: Math.max(1, parseInt(e.target.value) || 1) })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Focus Stats & Quote Widget */}
      <div className="stats-and-quote-row">
        <div className="stat-card-widget">
          <div className="stat-card-title">Focus Sessions</div>
          <div className="stat-card-number">{stats.completedToday}</div>
          <div className="stat-trend-pill">
            <TrendingUp size={12} />
            <span>&uarr; 20% today</span>
          </div>
        </div>

        <div className="quote-card-widget">
          <Quote size={13} color="var(--primary)" style={{ marginBottom: '0.15rem' }} />
          <p>"The key is not to prioritize what's on your schedule, but to schedule your priorities."</p>
          <div className="quote-author">&mdash; Stephen Covey</div>
        </div>
      </div>

      {/* Session Records History List */}
      <div className="pomo-records-section">
        <div className="records-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <History size={15} color="var(--primary)" />
            <h4>Session Records ({records.length})</h4>
          </div>

          {records.length > 0 && (
            <button 
              className="clear-records-btn"
              onClick={handleClearAllRecords}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div style={{ fontSize: '0.775rem', color: 'var(--text-dim)', textAlign: 'center', padding: '0.85rem' }}>
            No sessions recorded yet. Start timer or bookmark lap.
          </div>
        ) : (
          <div className="records-list">
            {records.map((rec, index) => (
              <div key={rec.id} className="record-item">
                <div className="record-left">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                    #{records.length - index}
                  </span>
                  <span className="record-badge">{rec.label}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{rec.duration} min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rec.timeString}</span>
                  <button 
                    className="delete-record-btn" 
                    onClick={() => handleDeleteRecord(rec.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
