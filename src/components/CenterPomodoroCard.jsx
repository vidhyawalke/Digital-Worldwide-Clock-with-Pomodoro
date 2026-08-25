import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import ShinyText from './ShinyText';

// These are all the focus modes a user can pick from.
// Work and study/code/read are focus blocks; the break ones give the brain a rest.
const FOCUS_PRESETS = [
  { id: 'work',       label: 'WORK',        minutes: 25 },
  { id: 'study',      label: 'STUDY',       minutes: 45 },
  { id: 'read',       label: 'READ',        minutes: 30 },
  { id: 'code',       label: 'CODE',        minutes: 50 },
  { id: 'shortBreak', label: 'SHORT BREAK', minutes: 5,  isBreak: true },
  { id: 'longBreak',  label: 'LONG BREAK',  minutes: 15, isBreak: true },
];

export default function CenterPomodoroCard({ isDarkMode }) {
  // Which mode the user picked (e.g. "work", "study", "shortBreak")
  const [selectedPresetId, setSelectedPresetId] = useState('work');

  // How many minutes the current mode lasts — needed if the user resets
  const [activeMinutes, setActiveMinutes] = useState(25);

  // The countdown itself, stored in seconds so we can tick it down smoothly
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  // Whether the timer is actively running or paused
  const [isRunning, setIsRunning] = useState(false);

  // Let the user silence the start/end chimes if they find them distracting
  const [isMuted, setIsMuted] = useState(false);

  // When the user taps a different focus mode, switch everything over and stop the timer
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setActiveMinutes(preset.minutes);
    setSecondsLeft(preset.minutes * 60);
    setIsRunning(false);
  };

  // The heartbeat — every second, subtract one. When it hits zero, move to the next phase.
  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      // Time's up! Play the completion chime unless the user has muted it
      if (!isMuted) soundFx.playChime('complete');

      // After a focus block, automatically queue up a short break.
      // After a break, bring the user back to a fresh work block.
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

    // Clean up the interval when the component re-renders or unmounts
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedPresetId, isMuted]);

  // Toggle between running and paused. Play a little sound when starting.
  const togglePlay = () => {
    soundFx.initContext();
    if (!isRunning && !isMuted) soundFx.playChime('start');
    setIsRunning(!isRunning);
  };

  // Restart the timer from the top without changing the mode
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(activeMinutes * 60);
  };

  // Jump to the next phase early — useful if focus/break is going long
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

  // Convert raw seconds into a nice MM:SS string for the big display
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Work out what clock time the timer will finish at, so the user knows when to expect a break
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
      {/* Subtle grid in the background — gives the card a focused, structured feel */}
      <div className="analog-blueprint-grid"></div>

      {/* Top bar: shows whether you're focusing, on a break, or just waiting to start */}
      <div className="analog-stage-top-bar">
        <div className="analog-status-pill">
          <span className={`status-indicator-dot ${isRunning ? 'active' : ''}`}></span>
          <span className="status-mono-text">
            {isRunning
              ? currentPreset.isBreak
                ? 'On a break'
                : 'Focusing'
              : 'Ready to focus'}
          </span>
        </div>

        {/* Mute button — tap to toggle the start/end chimes on or off */}
        <button
          className="analog-sound-btn"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute timer chimes' : 'Mute timer chimes'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Mode picker — choose between different types of focus or a break */}
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

      {/* The big timer — takes centre stage with decorative corner brackets */}
      <div className="analog-hero-timer-box">
        <div className="corner-bracket top-left"></div>
        <div className="corner-bracket top-right"></div>

        {/* Large, shiny time digits */}
        <div className="analog-big-digits-display">
          <ShinyText
            text={formattedTime}
            color="var(--text-main)"
            shineColor="var(--primary)"
            speed={4}
            spread={120}
          />
        </div>

        {/* Shows the clock time when this session will end */}
        <div className="analog-estimated-row">
          <span className="estimated-mono-label">Done by {getEstimatedCompletion()}</span>
        </div>

        <div className="corner-bracket bottom-left"></div>
        <div className="corner-bracket bottom-right"></div>
      </div>

      {/* The big Start / Pause button */}
      <div className="analog-primary-action-wrap">
        <button
          className={`analog-start-btn ${isRunning ? 'running' : ''}`}
          onClick={togglePlay}
        >
          <span>{isRunning ? 'P A U S E' : 'S T A R T'}</span>
        </button>
      </div>

      {/* Small secondary controls below the main button */}
      <div className="analog-secondary-controls-row">
        <button className="analog-ghost-control-btn" onClick={handleReset}>
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>
        <button className="analog-ghost-control-btn" onClick={handleSkip}>
          <span>SKIP</span>
          <SkipForward size={13} />
        </button>
      </div>
    </div>
  );
}
