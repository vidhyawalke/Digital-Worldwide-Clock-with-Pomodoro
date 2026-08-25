import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX,
  User
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import ShinyText from './ShinyText';

const FOCUS_PRESETS = [
  { id: 'work', label: 'WORK', minutes: 25 },
  { id: 'study', label: 'STUDY', minutes: 45 },
  { id: 'read', label: 'READ', minutes: 30 },
  { id: 'code', label: 'CODE', minutes: 50 },
  { id: 'shortBreak', label: 'SHORT BREAK', minutes: 5, isBreak: true },
  { id: 'longBreak', label: 'LONG BREAK', minutes: 15, isBreak: true },
];

export default function CenterPomodoroCard({ onSessionComplete, onTimeTracked }) {
  const [selectedPresetId, setSelectedPresetId] = useState('work');
  const [activeMinutes, setActiveMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Session-based state (lives in active browser session)
  const [currentSessionIndex, setCurrentSessionIndex] = useState(() => {
    const saved = sessionStorage.getItem('timora_active_session_idx');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    sessionStorage.setItem('timora_active_session_idx', currentSessionIndex.toString());
  }, [currentSessionIndex]);

  // Switch preset
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setActiveMinutes(preset.minutes);
    setSecondsLeft(preset.minutes * 60);
    setIsRunning(false);
  };

  // Live countdown
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) return 0;
          if (!selectedPresetId.includes('Break') && onTimeTracked) {
            onTimeTracked(1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (!isMuted) soundFx.playChime('complete');

      if (!selectedPresetId.includes('Break')) {
        if (onSessionComplete) onSessionComplete(activeMinutes);
        
        // Progress to next session in 1-4 cycle
        const nextIndex = (currentSessionIndex % 4) + 1;
        setCurrentSessionIndex(nextIndex);

        // Auto transition to appropriate break
        const nextBreakId = currentSessionIndex === 4 ? 'longBreak' : 'shortBreak';
        const breakPreset = FOCUS_PRESETS.find(p => p.id === nextBreakId);
        if (breakPreset) {
          setSelectedPresetId(breakPreset.id);
          setActiveMinutes(breakPreset.minutes);
          setSecondsLeft(breakPreset.minutes * 60);
        }
      } else {
        // Break finished -> return to WORK
        const workPreset = FOCUS_PRESETS.find(p => p.id === 'work');
        if (workPreset) {
          setSelectedPresetId(workPreset.id);
          setActiveMinutes(workPreset.minutes);
          setSecondsLeft(workPreset.minutes * 60);
        }
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedPresetId, activeMinutes, isMuted, currentSessionIndex, onSessionComplete, onTimeTracked]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning && !isMuted) soundFx.playChime('start');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(activeMinutes * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (!selectedPresetId.includes('Break')) {
      const nextIndex = (currentSessionIndex % 4) + 1;
      setCurrentSessionIndex(nextIndex);
      const breakPreset = FOCUS_PRESETS.find(p => p.id === (currentSessionIndex === 4 ? 'longBreak' : 'shortBreak'));
      if (breakPreset) handleSelectPreset(breakPreset);
    } else {
      const workPreset = FOCUS_PRESETS.find(p => p.id === 'work');
      if (workPreset) handleSelectPreset(workPreset);
    }
  };

  // Format time
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Live estimated completion time
  const getEstimatedCompletion = () => {
    const completionDate = new Date(Date.now() + secondsLeft * 1000);
    return completionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const currentPreset = FOCUS_PRESETS.find(p => p.id === selectedPresetId) || FOCUS_PRESETS[0];
  const sessionTag = `SESSION_0${currentSessionIndex}/04`;

  return (
    <div className="hero-analog-pomodoro-stage">
      {/* Subtle blueprint grid overlay */}
      <div className="analog-blueprint-grid"></div>

      {/* Top Technical Status Header with Session Indicator */}
      <div className="analog-stage-top-bar">
        {/* Left: User & Session Tag (inspired by Analog Lab) */}
        <div className="analog-user-session-col">
          <span className="analog-session-tag">{sessionTag}</span>
        </div>

        {/* Center: Live Monospace System Status */}
        <div className="analog-status-pill">
          <span className={`status-indicator-dot ${isRunning ? 'active' : ''}`}></span>
          <span className="status-mono-text">
            SYSTEM_STATUS: {isRunning ? (currentPreset.isBreak ? 'BREAK_ACTIVE' : 'FOCUS_RUNNING') : 'STANDBY'}
          </span>
        </div>

        {/* Right: Sound Chime Toggle */}
        <button 
          className="analog-sound-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute timer chimes' : 'Mute timer chimes'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Preset Category Switcher (WORK, STUDY, READ, CODE, BREAK) */}
      <div className="analog-preset-tabs-row">
        {FOCUS_PRESETS.map((preset) => {
          const isActive = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              className={`analog-preset-btn ${isActive ? 'active' : ''} ${preset.isBreak ? 'break-tab' : ''}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <span>{preset.label}</span>
              {isActive && <span className="analog-tab-underline"></span>}
            </button>
          );
        })}
      </div>

      {/* Grand Hero Timer Stage with Technical Framing Brackets */}
      <div className="analog-hero-timer-box">
        {/* Top-Left and Top-Right Framing Brackets */}
        <div className="corner-bracket top-left"></div>
        <div className="corner-bracket top-right"></div>

        {/* Massive Timer Digits */}
        <div className="analog-big-digits-display">
          <ShinyText
            text={formattedTime}
            color="var(--text-main)"
            shineColor="var(--primary)"
            speed={4}
            spread={120}
          />
        </div>

        {/* Estimated Completion Timestamp */}
        <div className="analog-estimated-row">
          <span className="estimated-mono-label">
            ESTIMATED_COMPLETION: {getEstimatedCompletion()}
          </span>
        </div>

        {/* Bottom-Left and Bottom-Right Framing Brackets */}
        <div className="corner-bracket bottom-left"></div>
        <div className="corner-bracket bottom-right"></div>
      </div>

      {/* Primary Technical Start Button */}
      <div className="analog-primary-action-wrap">
        <button 
          className={`analog-start-btn ${isRunning ? 'running' : ''}`}
          onClick={togglePlay}
        >
          <span>{isRunning ? 'P A U S E' : 'S T A R T'}</span>
        </button>
      </div>

      {/* Secondary Controls: Reset & Skip */}
      <div className="analog-secondary-controls-row">
        <button className="analog-ghost-control-btn" onClick={handleReset}>
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>
        <button className="analog-ghost-control-btn" onClick={handleSkip}>
          <span>SKIP SESSION</span>
          <SkipForward size={13} />
        </button>
      </div>
    </div>
  );
}
