import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Clock } from 'lucide-react';

/**
 * AnalogClock — Pure SVG analog clock face, no dependencies.
 * Renders hour, minute, and second hands with tick marks.
 */
function AnalogClock({ time, size = 160 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const hours   = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Smooth degree calculations
  const secDeg  = seconds * 6;
  const minDeg  = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

  const handEnd = (deg, length) => ({
    x: cx + Math.cos(toRad(deg)) * length,
    y: cy + Math.sin(toRad(deg)) * length,
  });

  const secEnd  = handEnd(secDeg,  r * 0.82);
  const minEnd  = handEnd(minDeg,  r * 0.75);
  const hourEnd = handEnd(hourDeg, r * 0.54);

  // Generate tick marks (12 major, 48 minor)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isMajor = i % 5 === 0;
    const tickR = toRad(i * 6);
    const outer = r;
    const inner = isMajor ? r - 10 : r - 5;
    return {
      x1: cx + Math.cos(tickR) * inner,
      y1: cy + Math.sin(tickR) * inner,
      x2: cx + Math.cos(tickR) * outer,
      y2: cy + Math.sin(tickR) * outer,
      isMajor,
    };
  });

  // Hour number positions
  const hourNums = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = toRad(num * 30);
    const numR = r - 22;
    return {
      num,
      x: cx + Math.cos(angle) * numR,
      y: cy + Math.sin(angle) * numR,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="analog-clock-svg"
      aria-label="Analog clock"
    >
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} className="clock-face" />
      <circle cx={cx} cy={cy} r={r} className="clock-face-ring" fill="none" />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          className={t.isMajor ? 'clock-tick-major' : 'clock-tick-minor'}
        />
      ))}

      {/* Hour numbers */}
      {hourNums.map(({ num, x, y }) => (
        <text key={num} x={x} y={y} className="clock-num" textAnchor="middle" dominantBaseline="central">
          {num}
        </text>
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cy}
        x2={hourEnd.x} y2={hourEnd.y}
        className="clock-hand-hour"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx} y1={cy}
        x2={minEnd.x} y2={minEnd.y}
        className="clock-hand-minute"
        strokeLinecap="round"
      />

      {/* Second hand */}
      <line
        x1={cx} y1={cy}
        x2={secEnd.x} y2={secEnd.y}
        className="clock-hand-second"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={5} className="clock-center-dot" />
      <circle cx={cx} cy={cy} r={2.5} fill="white" />
    </svg>
  );
}

/**
 * DigitalClock Component — Shows analog + digital side by side.
 */
export default function DigitalClock({ is24Hour }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const getFormattedTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let period = '';

    if (!is24Hour) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    return {
      hoursStr: `${String(hours).padStart(2, '0')}:${minutes}`,
      secondsStr: seconds,
      periodStr: period,
    };
  };

  const { hoursStr, secondsStr, periodStr } = getFormattedTime();

  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timezoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const secondsProgress = (time.getSeconds() / 60) * 100;

  return (
    <section className="glass-card clock-hero">
      <div className="clock-content">
        {/* Live Status Badge */}
        <div className="clock-badge">
          <span className="live-dot"></span>
          <span>Local Time</span>
        </div>

        {/* Analog + Digital side-by-side layout */}
        <div className="clock-main-row">
          {/* Analog Clock Face */}
          <div className="analog-clock-wrapper">
            <AnalogClock time={time} size={170} />
          </div>

          {/* Digital Readout */}
          <div className="clock-digital-col">
            <div className="time-display">
              <span>{hoursStr}</span>
              <span className="time-seconds">:{secondsStr}</span>
              {!is24Hour && <span className="time-period">{periodStr}</span>}
            </div>

            <div className="date-display">{dateStr}</div>

            {/* Seconds Progress Bar */}
            <div className="seconds-bar-container" title={`${time.getSeconds()} seconds`}>
              <div className="seconds-bar-fill" style={{ width: `${secondsProgress}%` }}></div>
            </div>

            {/* Metadata chips */}
            <div className="clock-meta-tags">
              <div className="meta-chip">
                <Globe size={13} color="var(--primary)" />
                <span>{timezoneStr}</span>
              </div>
              <div className="meta-chip">
                <Calendar size={13} color="var(--primary)" />
                <span>Day {Math.ceil((time - new Date(time.getFullYear(), 0, 1)) / 86400000)} of {time.getFullYear()}</span>
              </div>
              <div className="meta-chip">
                <Clock size={13} color="var(--primary)" />
                <span>{is24Hour ? '24h Mode' : '12h Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
