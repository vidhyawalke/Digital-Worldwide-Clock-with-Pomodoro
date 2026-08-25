import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings2,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export default function FocusTimerCard({ onSessionComplete, onTimeTracked }) {
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('pomodoro_durations');
    return saved ? JSON.parse(saved) : { pomodoro: 25, shortBreak: 5, longBreak: 15 };
  });

  const [mode, setMode] = useState('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(durations.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  // Main countdown loop
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          if (mode === 'pomodoro' && onTimeTracked) {
            onTimeTracked(1); // Track 1 second of focus time
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (!isMuted) {
        soundFx.playChime('complete');
      }

      if (mode === 'pomodoro') {
        if (onSessionComplete) {
          onSessionComplete(durations.pomodoro);
        }
        const nextBreak = 'shortBreak';
        setMode(nextBreak);
        setSecondsLeft(durations[nextBreak] * 60);
        setIsRunning(false);
      } else {
        setMode('pomodoro');
        setSecondsLeft(durations.pomodoro * 60);
        setIsRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, durations, isMuted, onSessionComplete, onTimeTracked]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning && !isMuted) {
      soundFx.playChime('start');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setMode('shortBreak');
      setSecondsLeft(durations.shortBreak * 60);
    } else {
      setMode('pomodoro');
      setSecondsLeft(durations.pomodoro * 60);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDurationStr = `${String(durations[mode]).padStart(2, '0')}:00`;

  const totalSeconds = durations[mode] * 60;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation (progress fills up or winds down smoothly)
  const strokeDashoffset = circumference * (1 - secondsLeft / totalSeconds);

  return (
    <div className="focus-session-card">
      {/* Category Tag */}
      <div className="focus-card-header">
        <div className="focus-badge">
          <span className="focus-badge-dot"></span>
          <span>FOCUS SESSION</span>
        </div>
        <div className="focus-header-actions">
          <button 
            className="icon-ghost-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Chimes' : 'Mute Chimes'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button 
            className="icon-ghost-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Configure Timer Durations"
          >
            <Settings2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Serif Catchphrase Title */}
      <div className="focus-title-wrap-with-sticker">
        <h2 className="focus-editorial-title">
          Stay present,<br />grow consistently
        </h2>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="focus-mode-pills">
        <button 
          className={`mode-pill ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('pomodoro'); }}
        >
          Pomodoro ({durations.pomodoro}m)
        </button>
        <button 
          className={`mode-pill ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('shortBreak'); }}
        >
          Short Break ({durations.shortBreak}m)
        </button>
        <button 
          className={`mode-pill ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('longBreak'); }}
        >
          Long Break ({durations.longBreak}m)
        </button>
      </div>

      {/* Large Circular Progress Timer */}
      <div className="focus-timer-ring-container">
        <svg className="focus-svg-ring" viewBox="0 0 240 240">
          {/* Subtle background track */}
          <circle
            className="focus-ring-track"
            cx="120"
            cy="120"
            r={radius}
          />
          {/* Active terracotta fill track */}
          <circle
            className="focus-ring-fill"
            cx="120"
            cy="120"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* Center Timer Digits */}
        <div className="focus-ring-center">
          <div className="focus-digits-display">{formattedTime}</div>
          <div className="focus-duration-subtext">of {totalDurationStr}</div>
        </div>
      </div>

      {/* Action Control Buttons (Reset, Pause/Start, Skip) */}
      <div className="focus-action-row">
        <button 
          className="focus-btn-outline" 
          onClick={handleReset}
          title="Reset timer"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        <button 
          className="focus-btn-primary" 
          onClick={togglePlay}
          title={isRunning ? 'Pause session' : 'Start focus session'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button 
          className="focus-btn-outline" 
          onClick={handleSkip}
          title="Skip to next session"
        >
          <SkipForward size={14} />
          <span>Skip</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="focus-settings-drawer">
          <div className="settings-drawer-title">Timer Lengths (Minutes)</div>
          <div className="settings-inputs-grid">
            <div>
              <label>Focus</label>
              <input
                type="number"
                min="1"
                max="90"
                value={durations.pomodoro}
                onChange={(e) => setDurations({ ...durations, pomodoro: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
            <div>
              <label>Short</label>
              <input
                type="number"
                min="1"
                max="30"
                value={durations.shortBreak}
                onChange={(e) => setDurations({ ...durations, shortBreak: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
            <div>
              <label>Long</label>
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
    </div>
  );
}
