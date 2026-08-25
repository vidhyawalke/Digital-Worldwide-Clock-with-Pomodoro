import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown
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
  { id: 'custom',     label: 'SET TIMER',   minutes: 20, isCustom: true },
];

export default function CenterPomodoroCard({ isDarkMode }) {
  const [selectedPresetId, setSelectedPresetId] = useState('work');
  
  // Custom Time Pickers (Hours, Minutes, Seconds)
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);

  const [activeTotalSeconds, setActiveTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync custom time changes to timer when not running
  const updateCustomTimer = (h, m, s) => {
    const total = h * 3600 + m * 60 + s;
    const finalTotal = Math.max(1, total);
    setActiveTotalSeconds(finalTotal);
    setSecondsLeft(finalTotal);
    setIsRunning(false);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    if (preset.id === 'custom') {
      updateCustomTimer(customHours, customMinutes, customSeconds);
    } else {
      setActiveTotalSeconds(preset.minutes * 60);
      setSecondsLeft(preset.minutes * 60);
    }
    setIsRunning(false);
  };

  const adjustCustom = (type, delta) => {
    if (type === 'hours') {
      const nextH = (customHours + delta + 24) % 24;
      setCustomHours(nextH);
      updateCustomTimer(nextH, customMinutes, customSeconds);
    } else if (type === 'minutes') {
      const nextM = (customMinutes + delta + 60) % 60;
      setCustomMinutes(nextM);
      updateCustomTimer(customHours, nextM, customSeconds);
    } else if (type === 'seconds') {
      const nextS = (customSeconds + delta + 60) % 60;
      setCustomSeconds(nextS);
      updateCustomTimer(customHours, customMinutes, nextS);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (!isMuted) soundFx.playChime('complete');

      if (!selectedPresetId.includes('Break') && selectedPresetId !== 'custom') {
        const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
        if (breakPreset) {
          setSelectedPresetId(breakPreset.id);
          setActiveTotalSeconds(breakPreset.minutes * 60);
          setSecondsLeft(breakPreset.minutes * 60);
        }
      } else if (selectedPresetId === 'custom') {
        setSecondsLeft(activeTotalSeconds);
      } else {
        const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
        if (workPreset) {
          setSelectedPresetId(workPreset.id);
          setActiveTotalSeconds(workPreset.minutes * 60);
          setSecondsLeft(workPreset.minutes * 60);
        }
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedPresetId, activeTotalSeconds, isMuted]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning && !isMuted) soundFx.playChime('start');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(activeTotalSeconds);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (!selectedPresetId.includes('Break') && selectedPresetId !== 'custom') {
      const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
      if (breakPreset) handleSelectPreset(breakPreset);
    } else {
      const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
      if (workPreset) handleSelectPreset(workPreset);
    }
  };

  // Time calculations
  const displayHours = Math.floor(secondsLeft / 3600);
  const displayMinutes = Math.floor((secondsLeft % 3600) / 60);
  const displaySeconds = secondsLeft % 60;

  const formattedTime = displayHours > 0
    ? `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`
    : `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

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
              : selectedPresetId === 'custom'
                ? 'Set Timer'
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
              className={`analog-preset-btn ${isActive ? 'active' : ''} ${preset.isBreak ? 'break-tab' : ''} ${preset.isCustom ? 'custom-tab' : ''}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <span>{preset.label}</span>
              {isActive && <span className="analog-tab-underline"></span>}
            </button>
          );
        })}
      </div>

      {/* Hero Timer / Set a Timer Display */}
      <div className="analog-hero-timer-box">
        <div className="corner-bracket top-left"></div>
        <div className="corner-bracket top-right"></div>

        {/* If SET TIMER selected and NOT currently running: Show interactive Hours : Minutes : Seconds picker */}
        {selectedPresetId === 'custom' && !isRunning ? (
          <div className="set-timer-picker-container">
            {/* Hours Column */}
            <div className="time-picker-col">
              <span className="time-picker-label">Hours</span>
              <button 
                type="button" 
                className="time-picker-step-btn up" 
                onClick={() => adjustCustom('hours', 1)}
                title="Increase Hours"
              >
                <span className="faint-preview">{String((customHours + 1) % 24).padStart(2, '0')}</span>
              </button>
              <div className="time-picker-active-val">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={String(customHours).padStart(2, '0')}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
                    setCustomHours(v);
                    updateCustomTimer(v, customMinutes, customSeconds);
                  }}
                />
              </div>
              <button 
                type="button" 
                className="time-picker-step-btn down" 
                onClick={() => adjustCustom('hours', -1)}
                title="Decrease Hours"
              >
                <span className="faint-preview">{String((customHours + 23) % 24).padStart(2, '0')}</span>
              </button>
            </div>

            <span className="time-picker-colon">:</span>

            {/* Minutes Column */}
            <div className="time-picker-col">
              <span className="time-picker-label">Minutes</span>
              <button 
                type="button" 
                className="time-picker-step-btn up" 
                onClick={() => adjustCustom('minutes', 1)}
                title="Increase Minutes"
              >
                <span className="faint-preview">{String((customMinutes + 1) % 60).padStart(2, '0')}</span>
              </button>
              <div className="time-picker-active-val">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={String(customMinutes).padStart(2, '0')}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setCustomMinutes(v);
                    updateCustomTimer(customHours, v, customSeconds);
                  }}
                />
              </div>
              <button 
                type="button" 
                className="time-picker-step-btn down" 
                onClick={() => adjustCustom('minutes', -1)}
                title="Decrease Minutes"
              >
                <span className="faint-preview">{String((customMinutes + 59) % 60).padStart(2, '0')}</span>
              </button>
            </div>

            <span className="time-picker-colon">:</span>

            {/* Seconds Column */}
            <div className="time-picker-col">
              <span className="time-picker-label">Seconds</span>
              <button 
                type="button" 
                className="time-picker-step-btn up" 
                onClick={() => adjustCustom('seconds', 1)}
                title="Increase Seconds"
              >
                <span className="faint-preview">{String((customSeconds + 1) % 60).padStart(2, '0')}</span>
              </button>
              <div className="time-picker-active-val">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={String(customSeconds).padStart(2, '0')}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setCustomSeconds(v);
                    updateCustomTimer(customHours, customMinutes, v);
                  }}
                />
              </div>
              <button 
                type="button" 
                className="time-picker-step-btn down" 
                onClick={() => adjustCustom('seconds', -1)}
                title="Decrease Seconds"
              >
                <span className="faint-preview">{String((customSeconds + 59) % 60).padStart(2, '0')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Big Digits Display */
          <div className="analog-big-digits-display">
            <ShinyText
              text={formattedTime}
              color="var(--text-main)"
              shineColor="var(--primary)"
              speed={4}
              spread={120}
            />
          </div>
        )}

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
