import React, { useState, useEffect } from 'react';
import ShinyText from './ShinyText';

export default function LandingScreen({ isDarkMode, onComplete }) {
  const [phase, setPhase] = useState('visible'); // 'visible' | 'dissolving'

  useEffect(() => {
    // Quick auto-dissolve after 1.5s
    const dissolveTimer = setTimeout(() => setPhase('dissolving'), 1400);
    const completeTimer = setTimeout(() => onComplete(), 2000);

    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`timora-landing-screen ${phase === 'dissolving' ? 'dissolving' : ''}`}
      onClick={onComplete}
      role="button"
      tabIndex={0}
      title="Click to enter Timora"
    >
      <div className="landing-content">
        <div className="landing-logo-wrap">
          <img
            src="/Timora_Logo_landing.png"
            alt="Timora Logo"
            className="landing-logo"
          />
          <div className="landing-logo-glow"></div>
        </div>

        <h1 className="landing-brand-text">
          <ShinyText
            text="Timora"
            color={isDarkMode ? '#FAF8F5' : '#1F1D1B'}
            shineColor="var(--primary)"
            speed={2.2}
            spread={120}
          />
        </h1>

        <p className="landing-tagline">FOCUS · FLOW · FINISH</p>

        <div className="landing-progress-track">
          <div className="landing-progress-bar"></div>
        </div>

        <span className="landing-enter-hint">Click anywhere to enter</span>
      </div>
    </div>
  );
}
