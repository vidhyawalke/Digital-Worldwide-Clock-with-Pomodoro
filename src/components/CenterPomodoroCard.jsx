import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import ShinyText from './ShinyText';

const FOCUS_PRESETS = [
  { id: 'work',       label: 'WORK',        minutes: 25 },
  { id: 'study',      label: 'STUDY',       minutes: 45 },
  { id: 'read',       label: 'READ',        minutes: 30 },
  { id: 'code',       label: 'CODE',        minutes: 50 },
  { id: 'shortBreak', label: 'SHORT BREAK', minutes: 5,  isBreak: true },
  { id: 'longBreak',  label: 'LONG BREAK',  minutes: 15, isBreak: true },
];

export default function CenterPomodoroCard({ isDarkMode }) {
  const [selectedPresetId, setSelectedPresetId] = useState('work');
  const [activeMinutes, setActiveMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setActiveMinutes(preset.minutes);
    setSecondsLeft(preset.minutes * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (!isMuted) soundFx.playChime('complete');

      if (!selectedPresetId.includes('Break')) {
        const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
        if (breakPreset) {
          setSelectedPresetId(breakPreset.id);
          setActiveMinutes(breakPreset.minutes);
          setSecondsLeft(breakPreset.minutes * 60);
        }
      } else {
        const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
        if (workPreset) {
          setSelectedPresetId(workPreset.id);
          setActiveMinutes(workPreset.minutes);
          setSecondsLeft(workPreset.minutes * 60);
        }
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedPresetId, isMuted]);

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
      const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
      if (breakPreset) handleSelectPreset(breakPreset);
    } else {
      const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
      if (workPreset) handleSelectPreset(workPreset);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getEstimatedCompletion = () => {
    const completionDate = new Date(Date.now() + secondsLeft * 1000);
    return completionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const currentPreset = FOCUS_PRESETS.find((p) => p.id === selectedPresetId) || FOCUS_PRESETS[0];

  return (
    <div className="hero-analog-pomodoro-stage">
      {/* Blueprint Grid Background */}
      <div className="analog-blueprint-grid"></div>

      {/* Top Status & Sound Controls */}
      <div className="analog-stage-top-bar">
        <div className="analog-status-pill">
          <span className={`status-indicator-dot ${isRunning ? 'active' : ''}`}></span>
          <span className="status-mono-text">
            {isRunning
              ? currentPreset.isBreak
                ? 'On a Break'
                : `Focusing (${currentPreset.label})`
              : 'Ready to Focus'}
          </span>
        </div>

        <button
          className="analog-sound-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute timer chimes' : 'Mute timer chimes'}
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Focus Mode Tabs */}
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

      {/* Hero Timer Display */}
      <div className="analog-hero-timer-box">
        <div className="corner-bracket top-left"></div>
        <div className="corner-bracket top-right"></div>

        {/* Big Digits Display */}
        <div className="analog-big-digits-display">
          <ShinyText
            text={formattedTime}
            color="var(--text-main)"
            shineColor="var(--primary)"
            speed={4}
            spread={120}
          />
        </div>

        {/* Estimated Completion */}
        <div className="analog-estimated-row">
          <span className="estimated-mono-label">Done by {getEstimatedCompletion()}</span>
        </div>

        <div className="corner-bracket bottom-left"></div>
        <div className="corner-bracket bottom-right"></div>
      </div>

      {/* Primary Action Button */}
      <div className="analog-primary-action-wrap">
        <button
          className={`analog-start-btn ${isRunning ? 'running' : ''}`}
          onClick={togglePlay}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          <span>{isRunning ? 'P A U S E' : 'S T A R T'}</span>
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="analog-secondary-controls-row">
        <button className="analog-ghost-control-btn" onClick={handleReset} title="Reset current session">
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>
        <button className="analog-ghost-control-btn" onClick={handleSkip} title="Skip to next session">
          <span>SKIP</span>
          <SkipForward size={13} />
        </button>
      </div>
    </div>
  );
}
