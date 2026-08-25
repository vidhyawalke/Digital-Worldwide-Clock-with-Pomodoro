import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import ShinyText from './ShinyText';

const FOCUS_PRESETS = [
  { id: 'work',       label: 'WORK',        hours: 0, minutes: 25, seconds: 0 },
  { id: 'study',      label: 'STUDY',       hours: 0, minutes: 45, seconds: 0 },
  { id: 'read',       label: 'READ',        hours: 0, minutes: 30, seconds: 0 },
  { id: 'code',       label: 'CODE',        hours: 0, minutes: 50, seconds: 0 },
  { id: 'shortBreak', label: 'SHORT BREAK', hours: 0, minutes: 5,  seconds: 0, isBreak: true },
  { id: 'longBreak',  label: 'LONG BREAK',  hours: 0, minutes: 15, seconds: 0, isBreak: true },
  { id: 'custom',     label: 'SET TIMER',   hours: 0, minutes: 25, seconds: 0, isCustom: true },
];

export default function CenterPomodoroCard({ isDarkMode }) {
  const [selectedPresetId, setSelectedPresetId] = useState('work');
  
  // Custom Time Pickers (Hours, Minutes, Seconds)
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);

  // Active duration in seconds
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Exact timestamp reference to avoid browser background throttling
  const endTimeRef = useRef(null);

  // Synchronize custom time setting
  const setCustomTime = (h, m, s) => {
    const safeH = Math.max(0, Math.min(23, Number(h) || 0));
    const safeM = Math.max(0, Math.min(59, Number(m) || 0));
    const safeS = Math.max(0, Math.min(59, Number(s) || 0));
    setCustomHours(safeH);
    setCustomMinutes(safeM);
    setCustomSeconds(safeS);

    const total = safeH * 3600 + safeM * 60 + safeS;
    const finalSec = total > 0 ? total : 60; // minimum 1 minute if all 0
    setTotalDurationSeconds(finalSec);
    setSecondsLeft(finalSec);
    setIsRunning(false);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setIsRunning(false);
    if (preset.id === 'custom') {
      const total = customHours * 3600 + customMinutes * 60 + customSeconds;
      const finalSec = total > 0 ? total : 25 * 60;
      setTotalDurationSeconds(finalSec);
      setSecondsLeft(finalSec);
    } else {
      const total = preset.hours * 3600 + preset.minutes * 60 + preset.seconds;
      setTotalDurationSeconds(total);
      setSecondsLeft(total);
    }
  };

  const adjustCustom = (type, delta) => {
    if (type === 'hours') {
      const nextH = (customHours + delta + 24) % 24;
      setCustomTime(nextH, customMinutes, customSeconds);
    } else if (type === 'minutes') {
      const nextM = (customMinutes + delta + 60) % 60;
      setCustomTime(customHours, nextM, customSeconds);
    } else if (type === 'seconds') {
      const nextS = (customSeconds + delta + 60) % 60;
      setCustomTime(customHours, customMinutes, nextS);
    }
  };

  // Accurate Wall-Clock Countdown Engine
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + secondsLeft * 1000;
      }

      interval = setInterval(() => {
        const remainingMs = endTimeRef.current - Date.now();
        const remSec = Math.max(0, Math.ceil(remainingMs / 1000));
        setSecondsLeft(remSec);

        if (remSec <= 0) {
          clearInterval(interval);
          endTimeRef.current = null;
          setIsRunning(false);
          if (!isMuted) soundFx.playChime('complete');

          // Auto switch to break or back
          if (!selectedPresetId.includes('Break') && selectedPresetId !== 'custom') {
            const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
            if (breakPreset) handleSelectPreset(breakPreset);
          } else if (selectedPresetId === 'custom') {
            setSecondsLeft(totalDurationSeconds);
          } else {
            const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
            if (workPreset) handleSelectPreset(workPreset);
          }
        }
      }, 250);
    } else {
      endTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedPresetId, totalDurationSeconds, isMuted]);

  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning) {
      if (secondsLeft <= 0) {
        setSecondsLeft(totalDurationSeconds);
        endTimeRef.current = Date.now() + totalDurationSeconds * 1000;
      } else {
        endTimeRef.current = Date.now() + secondsLeft * 1000;
      }
      if (!isMuted) soundFx.playChime('start');
      setIsRunning(true);
    } else {
      endTimeRef.current = null;
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    endTimeRef.current = null;
    setIsRunning(false);
    setSecondsLeft(totalDurationSeconds);
  };

  const handleSkip = () => {
    endTimeRef.current = null;
    setIsRunning(false);
    if (!selectedPresetId.includes('Break') && selectedPresetId !== 'custom') {
      const breakPreset = FOCUS_PRESETS.find((p) => p.id === 'shortBreak');
      if (breakPreset) handleSelectPreset(breakPreset);
    } else {
      const workPreset = FOCUS_PRESETS.find((p) => p.id === 'work');
      if (workPreset) handleSelectPreset(workPreset);
    }
  };

  // Formatted Time for Big Digits
  const displayHours = Math.floor(secondsLeft / 3600);
  const displayMinutes = Math.floor((secondsLeft % 3600) / 60);
  const displaySeconds = secondsLeft % 60;

  const formattedTime = displayHours > 0
    ? `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`
    : `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

  // Accurate Expected Completion Time Calculation
  const getEstimatedCompletion = () => {
    if (secondsLeft <= 0) return 'Completed';
    const targetMs = isRunning && endTimeRef.current 
      ? endTimeRef.current 
      : Date.now() + secondsLeft * 1000;
      
    const completionDate = new Date(targetMs);
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

        {/* If SET TIMER selected and NOT running: Show interactive Hours : Minutes : Seconds picker */}
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
                  onChange={(e) => setCustomTime(e.target.value, customMinutes, customSeconds)}
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
                  onChange={(e) => setCustomTime(customHours, e.target.value, customSeconds)}
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
                  onChange={(e) => setCustomTime(customHours, customMinutes, e.target.value)}
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
          <span className="estimated-mono-label">
            {secondsLeft <= 0 ? 'Session Complete' : `Done by ${getEstimatedCompletion()}`}
          </span>
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
