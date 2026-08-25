import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export default function CenterPomodoroCard({ onSessionComplete, onTimeTracked }) {
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('pomodoro_durations');
    return saved ? JSON.parse(saved) : { pomodoro: 25, shortBreak: 5, longBreak: 15 };
  });

  const [mode, setMode] = useState('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(durations.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(1); // 1 to 4
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

  // Countdown timer loop
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) return 0;
          if (mode === 'pomodoro' && onTimeTracked) {
            onTimeTracked(1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (!isMuted) soundFx.playChime('complete');

      if (mode === 'pomodoro') {
        if (onSessionComplete) onSessionComplete(durations.pomodoro);
        
        // Progress session dot
        setCurrentSessionIndex(prev => (prev % 4) + 1);
        
        const nextBreak = currentSessionIndex === 4 ? 'longBreak' : 'shortBreak';
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
  }, [isRunning, secondsLeft, mode, durations, isMuted, currentSessionIndex, onSessionComplete, onTimeTracked]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning && !isMuted) soundFx.playChime('start');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      const nextBreak = currentSessionIndex === 4 ? 'longBreak' : 'shortBreak';
      setMode(nextBreak);
      setSecondsLeft(durations[nextBreak] * 60);
    } else {
      setMode('pomodoro');
      setSecondsLeft(durations.pomodoro * 60);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = durations[mode] * 60;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - secondsLeft / totalSeconds);

  return (
    <div className="clean-center-pomodoro-card">
      {/* Mode Segmented Switcher Tabs */}
      <div className="clean-pomo-tabs-header">
        <button
          className={`clean-tab-btn ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('pomodoro'); }}
        >
          Pomodoro
        </button>
        <button
          className={`clean-tab-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('shortBreak'); }}
        >
          Short Break
        </button>
        <button
          className={`clean-tab-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => { setIsRunning(false); setMode('longBreak'); }}
        >
          Long Break
        </button>
      </div>

      {/* Large Circular Timer Ring with 🍅 Tomato icon */}
      <div className="clean-timer-circle-wrap">
        <svg className="clean-timer-svg" viewBox="0 0 240 240">
          <circle
            className="clean-ring-bg"
            cx="120"
            cy="120"
            r={radius}
          />
          <circle
            className="clean-ring-progress"
            cx="120"
            cy="120"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="clean-timer-center-info">
          {/* Tomato Icon */}
          <div className="clean-tomato-icon-wrap">
            <span className="clean-tomato-emoji">🍅</span>
          </div>

          {/* Bold Digits */}
          <div className="clean-timer-digits">{formattedTime}</div>

          {/* Mode Label */}
          <div className="clean-timer-mode-name">
            {mode === 'pomodoro' ? 'Pomodoro' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
      </div>

      {/* Action Buttons: Reset, Pause/Start, Skip */}
      <div className="clean-pomo-actions-row">
        <button 
          className="clean-btn-outline"
          onClick={handleReset}
          title="Reset timer"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>

        <button 
          className="clean-btn-primary"
          onClick={togglePlay}
          title={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={17} /> : <Play size={17} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button 
          className="clean-btn-outline"
          onClick={handleSkip}
          title="Skip to next session"
        >
          <SkipForward size={15} />
          <span>Skip</span>
        </button>
      </div>

      {/* Session Progress Indicator */}
      <div className="clean-session-indicator-wrap">
        <div className="clean-session-label">Session {currentSessionIndex} of 4</div>
        <div className="clean-session-dots-row">
          {[1, 2, 3, 4].map((dotIndex) => (
            <span 
              key={dotIndex} 
              className={`clean-session-dot ${dotIndex <= currentSessionIndex ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
